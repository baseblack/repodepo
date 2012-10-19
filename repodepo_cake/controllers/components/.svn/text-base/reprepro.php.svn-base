<?php

class RepreproComponent extends Object {

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

    function repoAdd($name){
    
        $rd_dir = $this->path;
        $subs   = array_keys($this->subs);
        foreach($subs as $sub){
            $dir = $rd_dir.$sub.'/'.$name;
            mkdir($dir);
        }
    }

    function repoDel($name){

        $rd_dir = $this->path;
        $subs   = array_keys($this->subs);
        foreach($subs as $sub){
            $dir = $rd_dir.$sub.'/'.$name;
            exec("rm -r -f $dir");
        }
    }

    function repoRename($oldName,$newName){

        $rd_dir = $this->path;
        $subs   = array_keys($this->subs);
        foreach($subs as $sub){
            $dir_old = $rd_dir.$sub.'/'.$oldName;
            $dir_new = $rd_dir.$sub.'/'.$newName;
            exec("mv $dir_old $dir_new");
        }
    }

    function archAdd($repoName,$arch){

        $rd_dir = $this->path;
        $subs   = array_keys($this->subs);
        foreach($subs as $sub){
            $dir = $rd_dir.$sub.'/'.$repoName.'/'.$arch;
            mkdir($dir);
        }
    }

    function archDel($repoName,$arch){

        $rd_dir = Configure::read('Reprepro.base');
        $subs   = array_keys($this->subs);
        foreach($subs as $sub){
            $dir = $rd_dir.$sub.'/'.$repoName.'/'.$arch;
            exec("rm -r -f $dir");
        }
    }

    #===================================================================================================
    #============ DISTRO FUNCTIONS =====================================================================
    #===================================================================================================

    function distroEdit($distro){

        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file.$distro['repo'].'/'.$distro['arch'].'/distributions';
        $codename               = $distro['items']['Codename'][0];

        $data_structure         = $this->_data_structure_from_config_file($distro_file);

        $wanted_entry;

        //We get the current values
        foreach($data_structure as $entry){
            if(array_key_exists('Codename',$entry)){
                $distro_now         = $entry['Codename'][0];
                if(($distro_now == $codename)){                   //Test to see if the is the distro entry we need info on
                    $wanted_entry = $entry;
                    break;
                }
            }
        }

        //We replace the ones required
        $form_comps = Configure::read('Reprepro.form_edit_components');
        array_push($form_comps, 'SignWith');

        foreach($form_comps as $c){

            //Check if in current $distro
            if(array_key_exists($c,$distro['items'])){

                $wanted_entry[$c]= $distro['items'][$c];
            }

            //Check if we need to remove the current one - if new structure does not contain an entry
            if(array_key_exists($c,$wanted_entry)){
                if(!array_key_exists($c,$distro['items'])){
                    unset($wanted_entry[$c]);
                }
            }
        }

       
        $new_structure['repo']  = $distro['repo'];
        $new_structure['arch']  = $distro['arch'];
        $new_structure['items'] = $wanted_entry;

        //We delete the current entry
        $this->distroDel($new_structure);

        //we add the one with replaced values
        $this->_addToFile($distro_file,$new_structure['items']);

    }

    function distroInfo($distro){


        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file.$distro['repo'].'/'.$distro['arch'].'/distributions';
        $codename               = $distro['items']['Codename'][0];

        $data_structure         = $this->_data_structure_from_config_file($distro_file);

        foreach($data_structure as $entry){
            if(array_key_exists('Codename',$entry)){
                $distro_now         = $entry['Codename'][0];
                if(($distro_now == $codename)){                   //Test to see if the is the distro entry we need info on
                   return $entry;
                }
            }
        }


    }

    function distroAdd($distro){
    //----------------------------------------------------------
    //--------- Add an entry to the 'distributions' file -------
    //----------------------------------------------------------
    //----- $distroStructure -----------------------------------
    //----- $distro['repo'] = 'CSIR'----------------------------
    //----- $distro['arch'] = 'i386'----------------------------
    //----- $distro['itiems']['Codename'] = array('hardy') -----
    //----- ....etc... we will loop through $distro['items'] ---
    //-----and build the entry ---------------------------------
    //----------------------------------------------------------
        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file.$distro['repo'].'/'.$distro['arch'].'/distributions';


        //---CREATE A LOG FILE --------
        //There should always be an item $distro['items']['Log'][0] (a log file -2nd one is a script - create it!)
        $log_file = $distro['items']['Log'][0];
        exec("touch $log_file");
        //-- END LOG FILE CREATION-------

        $this->_addToFile($distro_file,$distro['items']);
    }

    function distroDel($distro){

        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $repoName   = $distro['repo'];
        $arch       = $distro['arch'];
        $codename   = $distro['items']['Codename'][0];


        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file."$repoName/$arch/distributions";

        //Create a data structure of the distribution file
        $data_structure         = $this->_data_structure_from_config_file($distro_file);

        //Clear the distro file
        $this->_clearFile($distro_file);

        //Loop through the data structure of the distributions file
        foreach($data_structure as $entry){
            if(array_key_exists('Codename',$entry)){
                $distro_now         = $entry['Codename'][0];
                if(($distro_now != $codename)){                   //Test to see if the is the distro entry to delete
                    //Add this to the distributions file if we do not have to delete it
                    $this->_addToFile($distro_file,$entry);
                }
            }
        }
    }

    #===================================================================================================
    #============ END DISTRO FUNCTIONS =================================================================
    #===================================================================================================

    #===================================================================================================
    #============ COMP FUNCTIONS =======================================================================
    #===================================================================================================


    function compInfo($comp){

        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');



    }


    function compAdd($comp){

        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $repoName   = $comp['repo'];
        $arch       = $comp['arch'];
        $distro     = $comp['distro'];
        $comp_name  = $comp['comp'];
        $udeb       = $comp['udeb'];
        $source     = $comp['source'];

        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file."$repoName/$arch/distributions";
        $updates_file           = $path_to_config_file."$repoName/$arch/updates";

        if($udeb == true){
            //Add  UDebComponent - if required
            //Get the current value 
            $value_to_get = $this->_getConfigValue($distro_file,'Codename',$distro,'UDebComponents');
            if(count($value_to_get) > 0){
                    //Already present => gently add it
                    $current_value = $value_to_get[0];
                    if(!preg_match("/$comp_name/",$current_value)){ //Not present
                        $new_value = $current_value.' '.$comp_name;
                        $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'UDebComponents',array($new_value));
                    } 
            }else{  //Empty we can just add it

                $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'UDebComponents',array($comp_name));
            }
        }

        //Add the component
        $value_to_get = $this->_getConfigValue($distro_file,'Codename',$distro,'Components');
        if(count($value_to_get) > 0){
            //Already present => gently add it
            $current_value = $value_to_get[0];
            if(!preg_match("/$comp_name/",$current_value)){ //Not present
                $new_value = $current_value.' '.$comp_name;
                $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'Components',array($new_value));
            } 
        }else{  //Empty we can just add it

            $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'Components',array($comp_name));
        }

        //-----------------------------------
        //add this to the Updates file - if specified
        if($source != ''){
            $updates_items = array();
            $upd_name = $distro.'-'.$comp_name;
            $updates_items['Name']          = array($upd_name);
            $updates_items['Method']        = array($source);
            $updates_items['Components']    = array($comp_name);
            $this->_addToFile($updates_file,$updates_items);
        }
        //---------------------------------------

    }

    function compDel($comp){

        $rd_dir     = $this->path;
        $conf_dir   = Configure::read('Reprepro.confs');

        $repoName   = $comp['repo'];
        $arch       = $comp['arch'];
        $distro     = $comp['distro'];
        $comp_name  = $comp['comp'];


        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file."$repoName/$arch/distributions";
        $updates_file           = $path_to_config_file."$repoName/$arch/updates";

        //Remove the component
        $value_to_get = $this->_getConfigValue($distro_file,'Codename',$distro,'Components');
        if(count($value_to_get) > 0){
            //Already present => gently add it
            $current_value = $value_to_get[0];
            if(preg_match("/$comp_name/",$current_value)){ //present -Filter it out
                $new_value = preg_replace("/\s*$comp_name\s*/",'',$current_value);
                $replacement = array();
                if(strlen($new_value) > 1){ 
                    $replacement = array($new_value);
                }
                $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'Components',$replacement);
            } 
        }

        //Remove the UDebComponent
        $value_to_get = $this->_getConfigValue($distro_file,'Codename',$distro,'UDebComponents');
        if(count($value_to_get) > 0){
            //Already present => gently add it
            $current_value = $value_to_get[0];
            if(preg_match("/$comp_name/",$current_value)){ //present -Filter it out
                $new_value = preg_replace("/\s*$comp_name\s*/",'',$current_value);
                $replacement = array();
                if(strlen($new_value) > 1){ 
                    $replacement = array($new_value);
                }
                $value_to_get = $this->_setConfigValue($distro_file,'Codename',$distro,'UDebComponents',$replacement);
            } 
        }

        //Create a data structure of the distribution file
        $data_structure         = $this->_data_structure_from_config_file($updates_file);

        //REMOVE Entry form updates file
        //Clear the updates file
        $this->_clearFile($updates_file);

        $upd_name = $distro.'-'.$comp_name;
        //Loop through the data structure of the distributions file
        foreach($data_structure as $entry){
            if(array_key_exists('Name',$entry)){
                $name_now         = $entry['Name'][0];
                if(($name_now != $upd_name)){                   //Test to see if the is the distro entry to delete
                    //Add this to the distributions file if we do not have to delete it
                    $this->_addToFile($updates_file,$entry);
                }
            }
        }
    }


    #===================================================================================================
    #============ ENDCOMP FUNCTIONS ====================================================================
    #===================================================================================================

    #++++++++++++++++++++++++++++++WORKERS++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    #==========================================NEW FUNCTIONS======================================

    function _getConfigValue($filename,$unique_attribute,$unique_value,$wanted_attribute){
    //$this->Reprepro->_getConfigValue('/var/repodepo/confs/CSIR-test/i386/distributions','Codename','heavy','Description');
        $return_value = array();
        //Get the data structure for this config file
        $data_structure = $this->_data_structure_from_config_file($filename);

        foreach($data_structure as $entry){

            if(array_key_exists($unique_attribute,$entry)){
                if($entry[$unique_attribute][0] == $unique_value){ //We found our canidate

                    if(array_key_exists($wanted_attribute, $entry)){
                        $return_value =  $entry[$wanted_attribute];
                    }
                }
            }
        }
        return $return_value;
    }


     function _setConfigValue($filename,$unique_attribute,$unique_value,$set_attribute,$new_value){

        //Get the data structure for this config file
        $data_structure = $this->_data_structure_from_config_file($filename);

        $counter = 0;

        foreach($data_structure as $entry){

            if(array_key_exists($unique_attribute,$entry)){

                if($entry[$unique_attribute][0] == $unique_value){ //We found our canidate
                    //Just set the value - we don't care about old ones
                    if(count($new_value) == 0){
                        unset($data_structure[$counter][$set_attribute]);    //Remove the entry
                    }else{
                        $data_structure[$counter][$set_attribute] = $new_value;
                    }

                }
            }
            $counter++;
        }

         //Clear the distro file
        $this->_clearFile($filename);

        //Loop through the data structure of the distributions file
        foreach($data_structure as $entry){
            if(array_key_exists($unique_attribute,$entry)){
                $this->_addToFile($filename,$entry);
            }
        }
    }



     function _addToFile($filename,$items){

        $distro_string          = "#=======Generated by Repo Depo==========\n";

        foreach(array_keys($items) as $key){
            $distro_string = $distro_string."$key:";
            $entries = $items[$key];
            foreach($entries as $entry){

                $distro_string= $distro_string." $entry\n";
            }
        }

        $distro_string      = $distro_string."#=======END Generated by Repo Depo======\n\n";
        //CakeLog::write('notice', "REPODEPO: $distro_string");

        if (!$handle = fopen($filename, 'a')) {
            echo "Cannot open file ($filename)";
            exit;
        }

        // Write $somecontent to our opened file.
        if (fwrite($handle, $distro_string) === FALSE) {
            echo "Cannot write to file ($filename)";
            exit;
        }
        fclose($handle);
    }

    function _clearFile($filename){

        if (!$handle = fopen($filename, 'w')) {
            echo "Cannot open file ($filename)";
            exit;
        }
        fclose($handle);
    }

    function _data_structure_from_config_file($filename){


        $lines          = file($filename);
        $config_data    = array();

        $items_counter = 0;
        $line_counter = 0;

        foreach($lines as $line){

            
             if(preg_match('/^\w+/',$line)){
                
                $line       = rtrim($line);
                $key_value  = preg_split('/\s*:\s*/',$line,2);
                $key        = $key_value[0];
                $value      = $key_value[1];
                $value      = ltrim($value);
                //Check ahead to see if there is perhaps a second line
                $next_counter = $line_counter+1;
                $next_line   = $lines[$next_counter];
                if(!preg_match('/\s*:\s*/',$next_line)){
                    //We may have a canidate
                    if((!preg_match('/\s*:\s*/',$next_line))&&(!preg_match('/^\s*#/',$next_line))){
                        //This should be out 2nd line canidate !!!!
                        $next_line       = rtrim($next_line);
                        $next_line       = ltrim($next_line);
                        $config_data[$items_counter][$key]=array($value,$next_line);
                    }else{
                        $config_data[$items_counter][$key]=array($value);      //Only a one line canidate
                    }
                }else{

                    $config_data[$items_counter][$key]=array($value);      //Only a one line canidate
                }
            }

            if(preg_match('/^\s*$/',$line)){
                $items_counter++;
                $config_data[$items_counter] = array();
            }

            $line_counter++;
        }
        return $config_data;
    }

    #======================================END NEW FUNCTIONS======================================
}

?>
