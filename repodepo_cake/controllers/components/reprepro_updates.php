<?php

class RepreproUpdatesComponent extends Object {

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

   function ListAvailable($compdata){
        //$compdata = array('repo' => 'CSIR','arch' =>'i386','distro' =>'hardy','comptype' => 'main');
        //print_r($compdata);
        return $this->_ListAvailable($compdata);
    }

    function AddTempFilter($filterdata){

        $this->_AddTempFilter($filterdata);

    }

    function DoUpdate($compdata){

        $this->_DoUpdate($compdata);
    }

    function DelTempFilter($filterdata){


        $this->_DelTempFilter($filterdata);

    }

    function Temp(){
        print("Temp Experiment");
    }

    function _AddTempFilter($filterdata){

        //print_r($filterdata);

        $filter_path    = $filterdata['repo'].'/'.$filterdata['arch'];
        $rd_dir         = $this->path;
        $conf_dir       = $this->path.$this->subs['confs'].'/'.$filter_path;
        $filter_dir     = $conf_dir.'/filters';
        $file_name      = $filterdata['distro'].'-'.$filterdata['distrocomp'].'-tmp';

        $filter_file    = $filter_dir.'/'.$file_name;

        $filter_string  = '';
        foreach($filterdata['packages'] as $item){

            $filter_string = $filter_string.$item.' deinstall'."\n";
        }

        //Check if $filter_dir exists / if not add it
        if(!(is_dir($filter_dir))){
            mkdir($filter_dir,'755');
        }

        //
        //Write the new distro file
        if (!$handle = fopen($filter_file, 'w')) {
            echo "Cannot open file ($filter_file)";
            exit;
        }

        // Write $somecontent to our opened file.
        if (fwrite($handle, $filter_string) === FALSE) {
            echo "Cannot write to file ($filter_file)";
            exit;
        }
        fclose($handle);
        $filterdata_no_list = $filterdata;
        unset($filterdata_no_list['packages']);

        $this->_AddFilterEntryToUpdates($filterdata_no_list);

    }

    function _DoUpdate($compdata){

        $add_path   = $compdata['repo'].'/'.$compdata['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $db_dir     = $this->path.$this->subs['dbs'].'/'.$add_path;
        $dist_dir   = $this->path.$this->subs['dists'].'/'.$add_path;
        $distro     = $compdata['distro'];

        //We first have to activate the correct component (in distributions file)
        $this->_ActivateComponent($compdata);

        //---------------------------------------------------------------------------------
        //----- PART that do the update----------------------------------------------------
        //---------------------------------------------------------------------------------
        $command = "reprepro --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir update $distro";
        CakeLog::write('notice', "REPODEPO: $command");
        //print_r($command);

        $cwd = getcwd();
        chdir($conf_dir);
        $fb = shell_exec($command);
        chdir($cwd);

    }

    function _DelTempFilter($filterdata){

        $filter_path    = $filterdata['repo'].'/'.$filterdata['arch'];
        $rd_dir         = $this->path;
        $conf_dir       = $this->path.$this->subs['confs'].'/'.$filter_path;
        $filter_dir     = $conf_dir.'/filters';
        $file_name      = $filterdata['distro'].'-'.$filterdata['distrocomp'].'-tmp';
        $filter_file    = $filter_dir.'/'.$file_name;

        unlink($filter_file);

        $this->_DelFilterEntryToUpdates($filterdata);

    }

    function _AddFilterEntryToUpdates($filterdata){

        $filter_path    = $filterdata['repo'].'/'.$filterdata['arch'];
        $rd_dir         = $this->path;
        $conf_dir       = $this->path.$this->subs['confs'].'/'.$filter_path;
        $file_name      = 'updates';

        $updates_file   = $conf_dir.'/'.$file_name;
        $name_to_find = $filterdata['distro'].'-'.$filterdata['distrocomp'];

        $temp_name = 'filters/'.$name_to_find.'-tmp';

        //-----------------------
        //Get the value of Filterlist
        $value_of_filterlist = $this->Reprepro->_getConfigValue($updates_file,'Name',$name_to_find,'Filterlist');

        if(count($value_of_filterlist) > 0){
            $items  = preg_split("/\s+/",$value_of_filterlist[0]);
            $existing_filter_file = '';
            foreach($items as $element){
                if($element == 'install'){
                    continue;
                }
                if($element == $temp_name){
                    continue;
                }
                $existing_filter_file = $existing_filter_file.' '.$element;
            }
            $new_filter ='install'.$existing_filter_file.' '.$temp_name;
            $this->Reprepro->_setConfigValue($updates_file,'Name',$name_to_find,'Filterlist',array($new_filter));
        }else{
            $new_filter ='install '.$temp_name;
            $this->Reprepro->_setConfigValue($updates_file,'Name',$name_to_find,'Filterlist',array($new_filter));
        }
        //-----------------------

    }

    function _DelFilterEntryToUpdates($filterdata){

        $filter_path    = $filterdata['repo'].'/'.$filterdata['arch'];
        $rd_dir         = $this->path;
        $conf_dir       = $this->path.$this->subs['confs'].'/'.$filter_path;
        $file_name      = 'updates';

        $updates_file   = $conf_dir.'/'.$file_name;

        $name_to_find = $filterdata['distro'].'-'.$filterdata['distrocomp'];
        $temp_name = 'filters/'.$name_to_find.'-tmp';

        //-----------------------
        //Get the value of Filterlist
        $value_of_filterlist = $this->Reprepro->_getConfigValue($updates_file,'Name',$name_to_find,'Filterlist');
        if(count($value_of_filterlist) > 0){

            $no_temp = preg_replace("'$temp_name'",'',$value_of_filterlist[0]);
            $new_filter = array(); 
            if(strlen($no_temp) > 10){
               $new_filter = array($no_temp);
            }
            $this->Reprepro->_setConfigValue($updates_file,'Name',$name_to_find,'Filterlist',$new_filter);

        }
        //-----------------------
    }


    function _ListAvailable($compdata){

        $add_path   = $compdata['repo'].'/'.$compdata['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $db_dir     = $this->path.$this->subs['dbs'].'/'.$add_path;
        $dist_dir   = $this->path.$this->subs['dists'].'/'.$add_path;
        $distro     = $compdata['distro'];

        $updates = array();

        if(($compdata['dir_common'] != '')&($compdata['dir_specific']!='')){
    
            $updates = $this->_ListAvialableFolderUpdates($compdata);
            return $updates;
        }


        //We first have to activate the correct component (in distributions file)
        $this->_ActivateComponent($compdata);

        //---------------------------------------------------------------------------------
        //----- PART that takes the feedback of reprepro and ------------------------------
        //----- create an array containing the package name and version -------------------
        //---------------------------------------------------------------------------------
        $command = "reprepro --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir checkupdate $distro";
        CakeLog::write('notice', "REPODEPO: $command");
        //print_r($command);

        $cwd = getcwd();
        chdir($conf_dir);
        $fb = shell_exec($command);
        chdir($cwd);

        $pieces = explode("\n", $fb);
        foreach($pieces as $line){


            if(preg_match('/.*\|.*\|.*/',$line)){   //Skip the info about which repo etc
                continue;
            }

            $matches = array();


            if(preg_match("/'.+?'/",$line,$matches)){

                //first get the name
                $name       = preg_replace("/'/",'',$matches[0]);
                $id         = $compdata['repo'].'_'.$compdata['arch'].'_'.$compdata['distro'].'_'.$compdata['comptype'].'_'.$name;

                //Now filter for newly installed
                $v_new;
                if(preg_match("/.+newly installed as\s/",$line)){
                    $v_new      = preg_replace("/.+newly installed as\s/",'',$line);
                }
                
                //Filter for upgrades
                if(preg_match("/.+will be upgraded to\s/",$line)){
                    $v_new      = preg_replace("/.+will be upgraded to\s/",'',$line);
                }

                preg_match("/'.+?'/",$v_new,$matches);
                //$v_new       = preg_replace("/'/",'',$v_new);
                
                $version    = $matches[0];
                $version    = preg_replace("/'/",'',$version);

                array_push($updates,array(
                                'id'        => $id,
                                'arch'      => $compdata['arch'],
                                'distro'    => $compdata['distro'],
                                'comp'      => $compdata['comptype'],
                                'name'      => $name,
                                'version'   => $version
                        ));
                
            }
        }

        return $updates;
        //-----------------------------------------------------------------------------------------
        //------------- END PART that takes the feedback of reprepro ------------------------------
        //-----------------------------------------------------------------------------------------

    }

    function _ListAvialableFolderUpdates($compdata){
        //-----------------------------------------------------------------------------------------
        //--WHAT THIS DOES: It return a list of updates available for a distrocomponent -----------
        //--that has folders where update packages resides in--------------------------------------
        //-----------------------------------------------------------------------------------------
        //--There is a common folder where common packages to various distrocomps can be dumped in-
        //--There is also a specific folder where packages specific to this distrocmp resides in---
        //--Packages in the specific folder will take precendence over the common folder's---------
        //--This is then compared with the current list of packages for this distrocomponent-------
        //--and a list of updates/new packages will be returned------------------------------------
        //-----------------------------------------------------------------------------------------
        //print_r($compdata);
        $updates      = array();

        $dir_common     = $compdata['dir_common'];
        $dir_specific   = $compdata['dir_specific'];
        $locked_packages    = $compdata['locked_packages'];

        //----------------------------------------------------------------------------
        $packages_common    = $this->_packagesInFolder($dir_common);
        $packages_specific  = $this->_packagesInFolder($dir_specific);
        //We loop through the list of packages in common, if the package does not
        //exist in specific, we add it to specific and use this 'new' array as a list of updates.
        foreach(array_keys($packages_common) as $key){

            if(!array_key_exists($key,$packages_specific)){

                $packages_specific[$key] = $packages_common[$key];
            }
        }
        //-----------------------------------------------------------------------------



        //We need to determine which packages are already part of this distrocomp
        $existing_packages = $this->_getExistingListOfPackagesForDistrocomp($compdata);

        //print_r($existing_packages);


        //---------------------------------------------------------------------------------
        //Loop through this new list and see if there is an existing package with this name
        //If so, check the version - if the current version is equal and smaller
        $upates_available_packages = array();
        foreach(array_keys($packages_specific) as $key){

            //If the package is locked - WE SKIP IT
            if(in_array($key,$locked_packages)){
                continue;
            }

            if(array_key_exists($key,$existing_packages)){          //Check if present
                //It is present, now compare the version
                if($packages_specific[$key]['version'] > $existing_packages[$key]['version']){  //Newer version is available

                   $upates_available_packages[$key]=$packages_specific[$key]; 
                }
            }else{

                $upates_available_packages[$key]=$packages_specific[$key];
            }
        }
        //-----------------------------------------------------------------------------------

        foreach(array_keys($upates_available_packages) as $name){

            $id         = $compdata['repo'].'_'.$compdata['arch'].'_'.$compdata['distro'].'_'.$compdata['comptype'].'_'.$name;
            $version    = $packages_specific[$name]['version'];
            $file       = $packages_specific[$name]['file'];
            
            array_push($updates,array(
                                'id'        => $id,
                                'arch'      => $compdata['arch'],
                                'distro'    => $compdata['distro'],
                                'comp'      => $compdata['comptype'],
                                'name'      => $name,
                                'version'   => $version,
                                'file'      => $file
                        ));
        }

        return $updates;
        //print_r($updates);
        //print_r($packages_common);
        //print_r($packages_specific);
    }

    function _getExistingListOfPackagesForDistrocomp($compdata){

        $add_path   = $compdata['repo'].'/'.$compdata['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $db_dir     = $this->path.$this->subs['dbs'].'/'.$add_path;
        $dist_dir   = $this->path.$this->subs['dists'].'/'.$add_path;
        $distro     = $compdata['distro'];
        $comp       = $compdata['comptype'];

        $existing_packages = array();

        $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir -C $comp list $distro";
        CakeLog::write('notice', "REPODEPO: $command");
        exec($command,$fb_arr);


        foreach($fb_arr as $item){

            if(preg_match('/^.+\|.+\|.+:\s+/',$item)){      //Make sure it is an item

                $nv             = preg_replace('/^.+\|.+\|.+:\s+/','',$item);
                $name_version   = split(' ',$nv);

                $name       = $name_version[0];
                $version    = $name_version[1];
                $existing_packages[$name] = array('version' => $version);
            }
        }
        return $existing_packages;
    }

    function _packagesInFolder($folder){
        //Returns an array with packages in specified folder containing the deb package name, the version and filename containing it
        //If there are two of the same package, it will return the one with the highest version
        $file_packages=array();

        if ($handle = opendir("$folder")) {

            /* This is the correct way to loop over the directory. */
            while (false !== ($file = readdir($handle))) {
                if(!(preg_match('/^\./',$file))){ 
                   // echo "File $file\n";
                    $fb_arr = array();

                    //----Get the Package Name----------------
                    exec("dpkg -f $folder/$file Package",$fb_arr);

                    //Valid Package - Now we can get the rest
                    if(count($fb_arr) > 0){
                        $package_name       = $fb_arr[0];
                        $package_version    = '';

                        //------Get the Package Version------------------
                        $version_arr = array();
                        exec("dpkg -f $folder/$file Version",$version_arr);
                        if(count($version_arr) > 0){
                            $package_version = $version_arr[0];
                        }

                        if(!(array_key_exists($package_name,$file_packages))){
                                    $file_packages[$package_name] = array();
                        }

                        if(!(array_key_exists('version',$file_packages[$package_name]))){           //If there is no version declared, we will create one

                            $file_packages[$package_name]['version']    = $package_version;         //We record the version and the file that contains this version
                            $file_packages[$package_name]['file']       = $folder.'/'.$file;
                        }else{

                            if($file_packages[$package_name]['version'] < $package_version){
                                $file_packages[$package_name]['version']    = $package_version;         //Only if the existing version is smaller than te current one we replace it
                                $file_packages[$package_name]['file']       = $folder.'/'.$file;
                            }
                        }
                        //------------------------
                    }
                }
            }
            closedir($handle);
        }

        return $file_packages;
    }

    function _ActivateComponent($compdata){

        $add_path   = $compdata['repo'].'/'.$compdata['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $distro_file= $conf_dir.'/distributions';
        
        $name       = $compdata['distro'];
        $update     = $name.'-'.$compdata['comptype'];

        //We will call the reprepro component for this:
        $value_to_get = $this->Reprepro->_setConfigValue($distro_file,'Codename',$name,'Update',array($update));

    }
}

?>
