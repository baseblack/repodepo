<?php

class LockerComponent extends Object {

    var $components = array( "Reprepro" );

    function initialize() {

        //-----------------------------------------------------------
        //--Load configuration variables ----
        Configure::load('reprepro');
        //-----------------------------------------
        $this->path = Configure::read('Reprepro.base');
        $this->subs = array(
                        'confs' =>  Configure::read('Reprepro.confs'),
                        'dbs'   =>  Configure::read('Reprepro.dbs'),
                        'dists' =>  Configure::read('Reprepro.dists'),
                        'logs'  =>  Configure::read('Reprepro.logs')
                );
        $this->filters = 'filters';
        //----------------------------------------
    }

    function addLock($infoData){

        CakeLog::write('notice', "REPODEPO: Locking Package: ".$infoData['package']['name']);
    
        // print_r($infoData);
        $filter_file = $this->_getFilterFileName($infoData);

        //Create the filter directory is it does not exists
        $filter_dir = $this->_getFilterDirectory($infoData);
        if(!is_dir($filter_dir)){

            mkdir($filter_dir);
        }

        //Check if there is a filter file in existance
        if(!file_exists($filter_file)){
            exec("touch $filter_file");
        }

        //Locked packages will be added to a file /filters/<distro>-<distrocomp>
        if(array_key_exists('blacklist',$infoData)){
            $this->_addLockedPackage($filter_file,$infoData['package']['name'],true);
        }else{
            $this->_addLockedPackage($filter_file,$infoData['package']['name']);
        }

        //The filter will be in the form 'Filterlist: install filters/hardy-updates-main'(Filterlist: install filters/<distro>-<distrocomp>)
        $this->_addFilterToUpdatesFile($this->_getUpdatesFileName($infoData),$infoData);

    }


    function indexBlacklist($infoData){

        $filter_file = $this->_getFilterFileName($infoData);

        $blacklist = array();

        $pre_string = $infoData['repo']['name'].'_'.$infoData['arch']['name'].'_'.$infoData['distro']['name'].'_'.$infoData['distrocomp']['name'].'_';
        $lines = array();
        if(file_exists($filter_file)){
            $lines = file($filter_file);
        }

        foreach($lines as $line){

            if(preg_match('/\s+deinstall/',$line)){

                $name = preg_replace('/\s+deinstall/','',$line);
                $name = rtrim($name);
                $name = ltrim($name);
                array_push($blacklist,array('id' => $pre_string.$name,'name' => $name));

            }
        }
       // print_r($blacklist);
        return $blacklist;
    }

    function removeLock($infoData){

        CakeLog::write('notice', "REPODEPO: Removing Locked Package: ".$infoData['package']['name']);

        $filter_file = $this->_getFilterFileName($infoData);

        //Check if there is a filter file in existance
        if(!file_exists($filter_file)){
            exec("touch $filter_file");
        }

        //Locked packages will be added to a file /filters/<distro>-<distrocomp>
        $this->_removeLockedPackage($filter_file,$infoData['package']['name']);

    }

    function _getUpdatesFileName($infoData){
        $updates_file = $this->path.$this->subs['confs'].'/'.$infoData['repo']['name'].'/'.$infoData['arch']['name'].'/updates';
        return $updates_file;
    }


    function _getFilterFileName($infoData){
        //filter file is EG '/var/repodepo/confs/CSIR/i386/filters/hardy-updates-main'
        $filter_file = $this->path.$this->subs['confs'].'/'.$infoData['repo']['name'].'/'.$infoData['arch']['name'].'/'.$this->filters.'/'.$infoData['distro']['name'].'-'.$infoData['distrocomp']['name'];
        return $filter_file;
    }

     function _getFilterDirectory($infoData){
        //filter file is EG '/var/repodepo/confs/CSIR/i386/filters/hardy-updates-main'
        $filter_directory = $this->path.$this->subs['confs'].'/'.$infoData['repo']['name'].'/'.$infoData['arch']['name'].'/'.$this->filters;
        return $filter_directory;
    }

    function _addFilterToUpdatesFile($filename,$infoData){

        $updates_structure = $this->_data_structure_from_updates_file($filename);
        //print_r($updates_structure);

        $name_to_find = $infoData['distro']['name'].'-'.$infoData['distrocomp']['name'];

        //We just set the value - the filter file will already be in existance even if it is empty!
        $filter_value   = 'install filters/'.$infoData['distro']['name'].'-'.$infoData['distrocomp']['name'];
        $new_filter     = array($filter_value);

        $this->Reprepro->_setConfigValue($filename,'Name',$name_to_find,'Filterlist',$new_filter);
    }


    function _addLockedPackage($filename,$package,$blacklist = false){
    //--------------------------------------------------
    //Adds a package to the list of filtered packages---
    //--------------------------------------------------
        $action = ' hold';      //Default is to lock it
        if($blacklist){
            $action = ' deinstall'; //This is for blacklisted
        } 


        $lines = file($filename);
        $counter = 0;
        $found_flag = false;
        //Check if it is there - if there overwrite it with a 'hold'
        foreach($lines as $line){

            if(preg_match("/^$package/",$line)){
                $found_flag = true;
                $lines[$counter] = $package.$action;
            }
            $counter++;
        }

        //Not found? - add it
        if(!$found_flag){
            array_push($lines,$package.$action);
        }

        //Write this new list to the file
        if($file = fopen("$filename", "w")){

            foreach($lines as $line){

                if(!preg_match('/^$/',$line)){

                    fwrite($file, "$line");
                }
            }
            //Last one needs a newline 
            fwrite($file,"\n");
            fclose($file); 
        }
    }

    function _removeLockedPackage($filename,$package){
    //-----------------------------------------------------------
    //Removes a package from to the list of filtered packages----
    //-----------------------------------------------------------

        $new_lines = array();

        $lines = file($filename);
        //Check if it is there - if there overwrite it with a 'hold'
        foreach($lines as $line){

            if(!preg_match("/^$package/",$line)){
                array_push($new_lines,$line);
            }
        }

        //Write this new list to the file
        if($file = fopen("$filename", "w")){

            foreach($new_lines as $line){

                 if(!preg_match('/^$/',$line)){

                    fwrite($file, "$line");
                }
            }
            //Last one needs a newline 
            fwrite($file,"\n");
            fclose($file); 
        }
    }


    function _data_structure_from_updates_file($filename){

        $lines = file($filename);
        $updates_data = array();

        $updates_counter =0;

        foreach($lines as $line){

            if(preg_match('/^\w+/',$line)){
                
                $line       = rtrim($line);
                $key_value  = preg_split('/\s*:\s*/',$line,2);
                $key        = $key_value[0];
                $value      = $key_value[1];
                $value      = ltrim($value);
                $updates_data[$updates_counter][$key]=$value;
            }

            if(preg_match('/^\s+/',$line)){
                $updates_counter++;
                $updates_data[$updates_counter] = array();
            }
        }
        return $updates_data;
    }

}

?>
