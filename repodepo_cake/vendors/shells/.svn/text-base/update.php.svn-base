<?php
 /*
==================================================================================
Functional Description:
    This cake php console is called when updates must be done.  It will determine 
    how many disctrocomponents are involved and loop through each one and do the following
        A.) Check the amount of available updates without a filter and note it in the updates table.
        --In Loop
        1.) Determine a 'BannList' for each distrocomp.
        2.) Activate the component in the 'distributions' file
        3.) Add a Log entry that will log output results AND call a script - cake php console script
            (This script is called only at the end of the downloads thus we needed to do a pipe of the command to 
            indicate the progress since the download takes the bulk of time)
        4.) Add a temporary filter to the Filterlist entry specified in the updates file
        5.) Create the BannList specified and added to the Filterlist
        6.) Do an update using reprepro piping the output and filter it to determine the progress on downloads of packages
        7.) Upon each download complete note the progress in the updates table
        8.) Once reprepro is complete - we need to clean up
        9.) Remove the temp filter file
        10.) Remove the Filterlist entry
        11.) Remove the Log entry
        --End Loop

      To be determined - What do we do after the loops is completed
=====================================================================================
*/

class UpdateShell extends Shell {

    //--------------------------------------------------------
    //---PREDEFINED VARIABLES---------------------------------
    //--------------------------------------------------------
    //Models that we will be using
    var $uses       = array('Repository','Repoarch','Architecture','Distribution','Distrocomponent','Update','Componenttype');

    //For debug info
    var $debug_flag = true;

    //=============END OF SECTION ========================


    //--------------------------------------------------------
    //---Load models at the start-----------------------------
    //--------------------------------------------------------
    function initialize()
    {
        $this->_loadModels();

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
    //==============END OF SECTION =======================

    

    function main(){

        //The 'params' property contains all the parameters specified when we called this script eg updateId

        //-----------------------------------
        
        Configure::load('reprepro');
        
	/*
            $filterdata = array('repo' => 'Dev',
                                            'arch' => 'i386',
                                            'distro' => 'hardy',
                                            'distrocomp' => 'main',
                                            'comptype' => 'external',
                                        );

            $this->_do_keyring_check($filterdata);
            return;
	*/
           
        //-----------------------------------

        if(!(array_key_exists('updateId',$this->params))){     //We need the updateId in order to report the progress back to the DB
            print("updateId Not specified, terminating....\n");
            return;
        }

        //---Initialization code------------------------------
        App::import('Core', array('View', 'Controller'));
        App::import('Controller', array('Updates'));
        $this->UpdatesController = new UpdatesController();
        $this->UpdatesController->constructClasses();

        //Initialize the components inside the controller
        $this->UpdatesController->RepreproUpdates->initialize();
        $this->UpdatesController->Locker->initialize();
        //==============END OF SECTION =======================

        //$this->_buildCompdataStructureForDistrocomp('496b31ef-6780-4819-aea4-22e9924009bd');
        //return;

        //**all**
        if($this->params['updatetype'] == 'all'){
            //-------------------------------------------------
            //  -update                     (This is calling this php console app 'update')
            //  -updatetype     all         (This can be all|selected|notselected)
            //  -branch         distrocomp  (This can be repoarch|distro|distrocomp)
            //  -branchId       496b31ef-6780-4819-aea4-22e9924009bd (The ID of the branch)
            //  -updateId       49742e66-5a58-4134-ac93-46c9ff6df9cd (The ID of the update entry in the updates table)
            //  -filterName     name        (If defined: the name of the field which is filtered)
            //  -filterValue    k           (If defined: the letter(s) that the field must start with)
            //-------------------------------------------------
            $this->_updatesDoAll();
        }

        //**selected**
        if($this->params['updatetype'] == 'selected'){
            //-------------------------------------------------
            //  -update                     (This is calling this php console app 'update')
            //  -updatetype     selected    (This can be all|selected|notselected)
            //  -branch         distrocomp  (This can be repoarch|distro|distrocomp)
            //  -branchId       496b31ef-6780-4819-aea4-22e9924009bd (The ID of the branch)
            //  -updateId       49742e66-5a58-4134-ac93-46c9ff6df9cd (The ID of the update entry in the updates table)
            //  -packageList    name        (List of packages separated by ':' characters)
            //-------------------------------------------------
            /*
             /var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update -updateId 4974d617-0490-4590-bc7a-1946ff6df9cd -updatetype selected -branch distrocomp -branchId 496ae9a8-fd04-4b76-b8ed-3f11924009bd -packageList CSIR_i386_hardy-updates_multiverse_dynagen:CSIR_i386_hardy-updates_multiverse_dynamips

            */
            $this->_updatesDoSelected();

        }

        //**notselected**
        if($this->params['updatetype'] == 'notselected'){

            $this->_updatesDoNotSelected();
        }
 
    }

    function _updatesDoAll(){
        
        //----Debug part shows what command line parameters we passed----
        if($this->debug_flag){
            print("Updating All\n");
            print_r($this->params);
        }
        //==============END OF SECTION =======================


        //We need to generate an array of distrocomponentId's which is included in the selected branch
        $list_of_distrocomps = $this->_getIncludedDistrocomps();

        //Get a list of available updates
        $updatesNoFilter = $this->_getAvailableUpdatesWithoutAnyFilter();
        $count_no_filter = count($updatesNoFilter);

        //List which will display the same as on the dojo grid interface (applied filter
        $filteredUpdates = array();

        //-----------------FILTER SECTION----------------------
        //If there was a filter - we need to know what was displayed
        if(array_key_exists('filterName',$this->params)){

            $filter_name    = $this->params['filterName'];  //The field which has the filter
            $filter_value   = $this->params['filterValue']; //The value of the filter

            //We have to run through all of the updates and discover a 'bannList'
            foreach($updatesNoFilter as $item){

                $filter_to_check = $item[$filter_name]; 
                if(preg_match("/^$filter_value/",$filter_to_check)){        //Determine if the specified field produced a match
                    array_push($filteredUpdates,$item);
                }
            }
        }
        //==============END OF SECTION =======================


        //------------UPDATE SECTION -------------------------
        if((count($filteredUpdates)) != (count($updatesNoFilter))){     //If the displayed value is different fron that without a filter

            //----------------------------------
            if(count($filteredUpdates)>0){                              //If there was indeed a list produced whit this filter, we can continue
                                                                        //There is an active filter present we need to get a 'bann' list
                $bann_array = array();
                foreach($updatesNoFilter as $item){                     //Loop throug the list WITHOUT a filter
                    if(!(in_array($item,$filteredUpdates))){            //We get those NOT shown - they should NOT be updated, thus part of our bann list
                        array_push($bann_array,$item);
                    }
                }
                //We have to specify the amount of packages that needs to be updated
                $total = $count_no_filter - count($bann_array);
                $updateId = $this->params['updateId'];
                $this->Update->id = $updateId;
                $this->Update->saveField('total',$total);
                //-------------------------------------------------

                $this->_doUpdatesWithBannList($bann_array);             //_doUpdatesWithBannList needs a list of packages which it will NOT update

            }else{

                //We have to specify the amount of packages that needs to be updated
                $updateId = $this->params['updateId'];
                $this->Update->id = $updateId;
                $this->Update->saveField('total',$count_no_filter);
                //-------------------------------------------------

                //We do a normal update
                $this->_doUpdates($list_of_distrocomps);                //_doUptates takes a list of distrocomps which it will then use to do updates on as it loops it

            }
            //----------------------------------------
        }
        //==============END OF SECTION =======================

    }

    function _updatesDoSelected(){

        if($this->debug_flag){
            print("Updating Selected\n");
            print_r($this->params);
        }


        //Build a list of packages that was selected
        $list_of_packages = array();
        $packages   = split(":", $this->params['packageList']);
        foreach($packages as $package){

            array_push($list_of_packages,$package);
        }

        //Get a list of available updates
        $updatesNoFilter = $this->_getAvailableUpdatesWithoutAnyFilter();
        $count_no_filter = count($updatesNoFilter);
        //Loop through the list and remove those items that is in the $list_of_packages
        //We will then use the remainder as the bann list (we need NOT to update ALL EXCEPT the $list_of_packages)
        $bann_list = array();
        foreach($updatesNoFilter as $item){

            $id = $item['id'];
            if(!(in_array($id,$list_of_packages))){
                array_push($bann_list,$item);
            }
        }

        //Get a list of ALL the updates - NOT filtered
        //loop it remove the 'list_of_packages' items
        //Now we have our bann list the call $this->_doUpdatesWithBannList($bann_array);
       // print_r($list_of_packages);

        //-------------------------------------------------
        //We have to specify the amount of packages that needs to be updated
        $total = $count_no_filter - count($bann_list);
        $updateId = $this->params['updateId'];
        $this->Update->id = $updateId;
        $this->Update->saveField('total',$total);
        //-------------------------------------------------

        $this->_doUpdatesWithBannList($bann_list);        //This is the 'bann list' WITHOUT the selected packages so they can be updated

    }

    function _updatesDoNotSelected(){
        
         if($this->debug_flag){
            print("Updating Not Selected\n");
            print_r($this->params);
        }

        //----------------------------------------------
        //Build a list of packages that was selected
        $list_of_packages = array();
        $packages   = split(":", $this->params['packageList']);
        foreach($packages as $package){

            array_push($list_of_packages,$package);
        }
        //-----------------------------------------

        //----------------------------------------
        $bann_list = array();
        foreach($list_of_packages as $package){

            $elements   = split("_", $package, 5);
            $repo       = $elements[0];
            $arch       = $elements[1];
            $distro     = $elements[2];
            $distrocomp = $elements[3];
            $name       = $elements[4];
            $id         = $package;
            $package_info = array('id' => $id ,'repo' => $repo,'arch' => $arch, 'distro' => $distro,'comp' => $distrocomp,'name' => $name); 
            array_push($bann_list,$package_info);
        }
        //------------------------------------------


        //-----------------FILTER SECTION----------------------
        //If there was a filter - we need to know what was displayed

        //List which will display the same as on the dojo grid interface (applied filter
        $filteredUpdates = array();
        $updatesNoFilter = $this->_getAvailableUpdatesWithoutAnyFilter();
        $count_no_filter = count($updatesNoFilter);

        if(array_key_exists('filterName',$this->params)){

            $filter_name    = $this->params['filterName'];  //The field which has the filter
            $filter_value   = $this->params['filterValue']; //The value of the filter

            //We have to run through all of the updates and discover a 'bannList'
            foreach($updatesNoFilter as $item){

                $filter_to_check = $item[$filter_name]; 
                if(preg_match("/^$filter_value/",$filter_to_check)){        //Determine if the specified field produced a match
                    array_push($filteredUpdates,$item);
                }
            }

            foreach($updatesNoFilter as $item){                     //Loop throug the list WITHOUT a filter
                if(!(in_array($item,$filteredUpdates))){            //We get those NOT shown - they should NOT be updated, thus part of our bann list
                    array_push($bann_list,$item);
                }
            }
        }
        

        //==============END OF SECTION =======================
        //print_r($filteredUpdates);
        //print_r($bann_list);

        //-----------------------------------------
        //We have to specify the amount of packages that needs to be updated
        $total = $count_no_filter - count($bann_list);
        $updateId = $this->params['updateId'];
        $this->Update->id = $updateId;
        $this->Update->saveField('total',$total);
        //------------------------------------------

        $this->_doUpdatesWithBannList($bann_list);        //This is the 'bann list' containing the selected packages 
    }

    function _doUpdatesWithBannList($bann_array){
    
        //With this bann_array we need to get a list of unique distrocomps and then a list of package names particular to that distrocomp
        $bann_structure = array();

        //------------BANN STRUCTURE -------------------------
        foreach($bann_array as $item){

            $repo       = $item['id'];
            $elements   = split('_',$repo);
            $repo       = $elements[0];

            $arch       = $item['arch'];
            $distro     = $item['distro'];
            $comp       = $item['comp'];
            $name       = $item['name'];

            //The repo key does not exist! create the whole chain
            if(!array_key_exists($repo,$bann_structure)){
                $bann_structure[$repo]=array();
                $bann_structure[$repo][$arch]=array();
                $bann_structure[$repo][$arch][$distro]=array();
                $bann_structure[$repo][$arch][$distro][$comp]=array();
                array_push($bann_structure[$repo][$arch][$distro][$comp],$name);
                continue;
            }

            //The repoarch key does not exist!
            if(!array_key_exists($arch,$bann_structure[$repo])){

                $bann_structure[$repo][$arch]=array();
                $bann_structure[$repo][$arch][$distro]=array();
                $bann_structure[$repo][$arch][$distro][$comp]=array();
                array_push($bann_structure[$repo][$arch][$distro][$comp],$name);
                continue;
            }

            //The distribution key does not exist!
            if(!array_key_exists($distro,$bann_structure[$repo][$arch])){
                $bann_structure[$repo][$arch][$distro]=array();
                $bann_structure[$repo][$arch][$distro][$comp]=array();
                array_push($bann_structure[$repo][$arch][$distro][$comp],$name);
                continue;
            }

            //The distrocomponent key does not exist!
            if(!array_key_exists($comp,$bann_structure[$repo][$arch][$distro])){
                $bann_structure[$repo][$arch][$distro][$comp]=array();
                array_push($bann_structure[$repo][$arch][$distro][$comp],$name);
                continue;
            }

            array_push($bann_structure[$repo][$arch][$distro][$comp],$name);
        }
        //print_r($bann_structure);
        //return;
        //==============END OF SECTION =======================

        //Now we can take our bann structure and loop it to do the updates for each entry
        //Get the repo name
        
        //**REPO NAME**
        $repo      = array_keys($bann_structure);
        $repo_name = $repo[0];
            
            //**ARCH NAME**
            $arch_list  = array_keys($bann_structure[$repo_name]);
            foreach($arch_list as $arch){
                
                //**DISTRO NAME**
                $distro_list  = array_keys($bann_structure[$repo_name][$arch]);
                foreach($distro_list as $distro){

                    //**DISTROCOMP** (WORKER!!!!)
                    $distrocomp_list = array_keys($bann_structure[$repo_name][$arch][$distro]);
                    foreach($distrocomp_list as $distrocomp){


                        //----------------------------------------------------------
                        //---- Add a filter / Do the update / Remove the filter-----
                        //----------------------------------------------------------
                        $list_to_ignore = $bann_structure[$repo_name][$arch][$distro][$distrocomp];
                        //First add a temp filter containing the bann list
                        $filterdata = array('repo' => $repo_name,
                                            'arch' => $arch,
                                            'distro' => $distro,
                                            'distrocomp' => $distrocomp,
                                            'comptype' => $distrocomp, 
                                            'packages' => $list_to_ignore
                                        );

                        $compdata   = $filterdata;
                        unset($compdata['packages']);

                        print("Heads Up: We need to deternine what kind of update source this **DISTROCOMP** has\n");
                        $update_type = $this->_getDistrocompUpdateType($compdata);

                        /*
                             /var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update -branch distrocomp -branchId 4978615a-fb38-4983-837e-55efff6df9cd -updatetype all -updateId 497875bc-9a60-464c-859d-19efff6df9cd -filterName name -filterValue c

                        */
                        //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                        if($update_type['update_type'] == 'directory'){
                            print("....................................................................\n");
                            print("Using a pool of files inside directories as an update source\n");
                            print("Directories are COMMON: ".$update_type['dir_common']." and SPECIFIC: ".$update_type['dir_specific']."\n");
                            print("....................................................................\n");

                            ////$this->UpdatesController->RepreproUpdates->AddLogEntry($compdata);          //Add an entry for the script to be called when loggin activity

                            $filterdata['dir_common']      = $update_type['dir_common'];
                            $filterdata['dir_specific']    = $update_type['dir_specific'];
                            $filterdata['distrocomp_id']   = $update_type['distrocomp_id'];
                            $this->_callRepReproAdd($filterdata);

                        }

                        if($update_type['update_type'] == 'external'){
                            print("....................................................................\n");
                            print("Using an external source as update source\n");
                            print("....................................................................\n");
                            $this->UpdatesController->RepreproUpdates->AddTempFilter($filterdata);      //Add a list of packages NOT to update

                            $this->_callRepReproUpdate($compdata);                                      //Do the actual update of the distrocomp
                            $this->_do_keyring_check($compdata);
                            $this->UpdatesController->RepreproUpdates->DelTempFilter($filterdata);
                        }
                        //"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                      
                    }
                    //**END DISTROCOMP**
                }
                //**END DISTRO NAME**
            }
            //**END ARCH NAME**
                //Close our books
                //Get the value of 'total'
                $updateId = $this->params['updateId'];
                $upd_r = $this->Update->find('first',array('conditions'=>array('Update.id' =>$updateId),'fields'=>array('Update.total')));
                $total = $upd_r['Update']['total'];
                $this->Update->id = $updateId;
                $this->Update->saveField('completed',$total);

        //**END REPO NAME**
    }

    function _doUpdates($list_of_distrocomps){

        print_r("Doing updates without any filters\n");
        foreach($list_of_distrocomps as $distrocomp){

            print ("Now doing updates for distrocomp $distrocomp\n");
            $distrocomp = $this->_buildCompdataStructureForDistrocomp($distrocomp);

            print("Heads Up: We need to deternine what kind of update source this **DISTROCOMP** has\n");
            $update_type = $this->_getDistrocompUpdateType($distrocomp);

            //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
            if($update_type['update_type'] == 'directory'){
                print("....................................................................\n");
                print("Using a pool of files inside directories as an update source\n");
                print("Directories are COMMON: ".$update_type['dir_common']." and SPECIFIC: ".$update_type['dir_specific']."\n");
                print("....................................................................\n");
                $filterdata                    = $distrocomp;
                $filterdata['packages']        = array();
                $filterdata['dir_common']      = $update_type['dir_common'];
                $filterdata['dir_specific']    = $update_type['dir_specific'];
                $filterdata['distrocomp_id']   = $update_type['distrocomp_id'];

                ////$this->UpdatesController->RepreproUpdates->AddLogEntry($distrocomp);          //Add an entry for the script to be called when loggin activity
                $this->_callRepReproAdd($filterdata);

            }

            if($update_type['update_type'] == 'external'){
                print("....................................................................\n");
                print("Using an external source as update source\n");
                print("....................................................................\n");
                $this->_callRepReproUpdate($distrocomp);
                $this->_do_keyring_check($distrocomp);
            }
            //"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
        }

        //Close our books
        //Get the value of 'total'
        $updateId = $this->params['updateId'];
        $upd_r = $this->Update->find('first',array('conditions'=>array('Update.id' =>$updateId),'fields'=>array('Update.total')));
        $total = $upd_r['Update']['total'];
        $this->Update->id = $updateId;
        $this->Update->saveField('completed',$total);

    }

    function _buildCompdataStructureForDistrocomp($distrocompId){
    /*
    //-------------------------------------------------------------
        RETURN a data structure like this:
        $distrocomp = array('repo' => $repo_name,
                                            'arch' => $arch,
                                            'distro' => $distro,
                                            'distrocomp' => $distrocomp,
                                            'comptype' => $distrocomp,
                                        );


    //-------------------------------------------------------------
    */

        $distrocomp_r = $this->Distrocomponent->find('first',array('conditions' => array('Distrocomponent.id' => $distrocompId)));
        //print_r($distrocomp_r);
        $dcomp      = $distrocomp_r['Componenttype']['name'];
        $distro     = $distrocomp_r['Distribution']['name'];
        $distro_id  = $distrocomp_r['Distribution']['id'];

            $distro_r = $this->Distribution->find('first',array('conditions' => array('Distribution.id' => $distro_id)));
            //print_r($distro_r);
                $repoarch_id    = $distro_r['Repoarches']['id'];
                $repoarch_r     = $this->Repoarch->find('first',array('conditions' => array('Repoarch.id' => $repoarch_id)));
                $arch           = $repoarch_r['Architecture']['name'];
                $repo_name      = $repoarch_r['Repository']['name'];
        $distrocomp             = array(
                                    'repo'      => $repo_name,
                                    'arch'      => $arch,
                                    'distro'    => $distro,
                                    'distrocomp'    => $dcomp,
                                    'comptype'      => $dcomp
                                    );
        //print_r($distrocomp);
        return $distrocomp;

    }

    function _callRepReproUpdate($compdata){

        $add_path   = $compdata['repo'].'/'.$compdata['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $db_dir     = $this->path.$this->subs['dbs'].'/'.$add_path;
        $dist_dir   = $this->path.$this->subs['dists'].'/'.$add_path;
        $distro     = $compdata['distro'];

        $updateId = $this->params['updateId'];
        $this->Update->id = $updateId;

        //We first have to activate the correct component (in distributions file)
        $this->UpdatesController->RepreproUpdates->_ActivateComponent($compdata);

        ////$this->UpdatesController->RepreproUpdates->AddLogEntry($compdata);          //Add an entry for the script to be called when loggin activity

        //---------------------------------------------------------------------------------
        //----- PART that do the update----------------------------------------------------
        //---------------------------------------------------------------------------------
        $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir update $distro 2>&1";
        print("=============Update Pappie=============\n");
        print_r($command);
        print("\n+++++++++++++End Update+++++++++++++++++\n");

        //TEMP ENTRY!!!
        #/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update -branch distrocomp -branchId 4978615a-fb38-4983-837e-55efff6df9cd -updatetype all -updateId 497875bc-9a60-464c-859d-19efff6df9cd -filterName name -filterValue c
        //return;

        //We need to get the current value of 'completed'
        $updateId   = $this->params['updateId'];
        $update_r   = $this->Update->find('first',array('conditions'=>array('Update.id' => $updateId),'fields' => array('Update.completed')));
        $completed  = $update_r['Update']['completed'];

        $cwd = getcwd();
        chdir($conf_dir);
        $fh = popen("$command",'r');

        $counter = 0;
        while(!feof($fh)){

            $buffer = fgets($fh, 1024);
            
            if(preg_match('/aptmethod.*\.[deb|udeb]/',$buffer)){
                
                $package =  preg_replace('/.*aptmethod.*\//','',$buffer);
                $package =  preg_replace('/\'/','',$package);
                $package =  rtrim($package);
                print("$counter .) Package $package fetched\n");

                //We have to specify the amount of packages that needs to be updated
                $updateId = $this->params['updateId'];
                $this->Update->id = $updateId;
                $this->Update->saveField('completed',$completed);
                //-------------------------------------------------

                $completed++; //Keep this one below so when it is finished we can make it equal
            }
            flush();
        }

        fclose($fh);
        chdir($cwd);
       
        
        

        //$cwd = getcwd();
        //chdir($conf_dir);
       // $fb = shell_exec($command);
       // chdir($cwd);

    }

    function _callRepReproAdd($filter_data){

        print_r($filter_data);
        $add_path   = $filter_data['repo'].'/'.$filter_data['arch'];
        $rd_dir     = $this->path;
        $conf_dir   = $this->path.$this->subs['confs'].'/'.$add_path;
        $db_dir     = $this->path.$this->subs['dbs'].'/'.$add_path;
        $dist_dir   = $this->path.$this->subs['dists'].'/'.$add_path;
        $distro     = $filter_data['distro'];
        $comp       = $filter_data['distrocomp'];

        //Get the available updates
        $paramsNamed            = array('distrocomp' => $filter_data['distrocomp_id']);
        $available              = $this->UpdatesController->_listUpdatesWithoutFilter($paramsNamed);
        $not_to_install         = $filter_data['packages'];

        //We need to get the current value of 'completed'
        $updateId   = $this->params['updateId'];
        $update_r   = $this->Update->find('first',array('conditions'=>array('Update.id' => $updateId),'fields' => array('Update.completed')));
        $completed  = $update_r['Update']['completed'];

        foreach($available as $package){

            $name = $package['name'];
            if(in_array($name,$not_to_install)){
    
                print_r("Skipping $name\n");
            }else{
                
                print_r("Installing $name\n");
                print_r($package);
                $filename = $package['file'];
                $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir -C $comp includedeb $distro $filename";
                print("$command\n");
                exec($command);

                $this->Update->id = $updateId;
                $this->Update->saveField('completed',$completed);
                $completed++;
            }
        }
       // print_r($available);
    }

    function _getAvailableUpdatesWithoutAnyFilter(){

        $paramsNamed            = array();
        $type                   = $this->params['branch'];
        $type_id                = $this->params['branchId'];
        $paramsNamed["$type"]   = $type_id;  
        return $this->UpdatesController->_listUpdatesWithoutFilter($paramsNamed);

    }

    function _getIncludedDistrocomps(){

        $list_of_distrocomps    = array();
        $branchId               = $this->params['branchId'];

        //---Distrocomps -----
        if($this->params['branch'] == 'distrocomp'){

            //This is the easiest
            array_push($list_of_distrocomps,$this->params['branchId']);
        }

        //---Distro's distrocomps ----
        if($this->params['branch'] == 'distro'){

            $distro_r = $this->Distrocomponent->find('all',array('conditions' =>array('Distrocomponent.distribution_id' => $branchId)));
            foreach($distro_r as $item){

                array_push($list_of_distrocomps,$item['Distrocomponent']['id']);
            }
        }

        //---Repoarche's distro's and then distro's distrocomps
        if($this->params['branch']== 'repoarch'){

            $ra_r = $this->Distribution->find('all',array('conditions' => array('Distribution.repoarch_id' => $branchId)));
            foreach($ra_r as $item){
                $distroId = $item['Distribution']['id'];
                $distro_r = $this->Distrocomponent->find('all',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId)));
                foreach($distro_r as $i){

                    array_push($list_of_distrocomps,$i['Distrocomponent']['id']);
                }
            }
        }
        return $list_of_distrocomps;
    }

    function _getDistrocompUpdateType($compdata){
        //----------------------------------------------------------------------------------------------------------------
        //This function is used to determine the source type of the updates - it can be 'directory' or 'external'
        // EG return array('update_type' => 'directory','dir_common' => $dir_common, 'dir_specific' => $dir_specific );
        // OR return array('update_type' => 'external');
        //-----------------------------------------------------------------------------------------------------------------

        //print_r($compdata);
        //Get the repoId of the Repository
        $repo_r = $this->Repository->find('first',array('conditions' =>array('Repository.name' => $compdata['repo']),'fields'=>array('Repository.id'),'recursive' => 0));
        $repoId = $repo_r['Repository']['id'];

        //Get the architecture id
        $arch_r = $this->Architecture->find('first',array('conditions' =>array('Architecture.name' => $compdata['arch']),'fields'=>array('Architecture.id'),'recursive' => 0));
        $archId = $arch_r['Architecture']['id'];

        //Get the repoarch for this one
        $repoarch_r = $this->Repoarch->find('first',array('conditions' =>array('Repoarch.repository_id' => $repoId,'Repoarch.architecture_id' => $archId),'fields'=>array('Repoarch.id'),'recursive' => 0));
        $repoarchId = $repoarch_r['Repoarch']['id'];

        //Get the distributions for this repoarch
        $distro_r = $this->Distribution->find('first',
                                                array('conditions' =>array('Distribution.repoarch_id' => $repoarchId,'Distribution.name' =>$compdata['distro']),
                                                'fields'=>array('Distribution.id'),'recursive' => 0));
        $distroId   = $distro_r['Distribution']['id'];

        //Get the distrocomp
        $distrocomp_r = $this->Distrocomponent->find('first',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId,'Componenttype.name' =>$compdata['distrocomp'])));

        //The is actually what we want
        $updsource      = $distrocomp_r['Distrocomponent']['updsource'];
        $dir_common     = $distrocomp_r['Distrocomponent']['dir_common'];
        $dir_specific   = $distrocomp_r['Distrocomponent']['dir_specific'];
        $distrocomp_id  = $distrocomp_r['Distrocomponent']['id'];

        if(($updsource == '')&($dir_common != '')&($dir_specific != '')){

            return array('update_type' => 'directory','dir_common' => $dir_common, 'dir_specific' => $dir_specific,'distrocomp_id' => $distrocomp_id);
        }else{
            return array('update_type' => 'external');
        }
    }

    //=========================================================================================
    //=============KEYRING ADD ON==============================================================
    //=========================================================================================

    function _do_keyring_check($compdata){


        //Check if there is any keyrings defiend

        //Get the repoId of the Repository
        $repo_r = $this->Repository->find('first',array('conditions' =>array('Repository.name' => $compdata['repo']),'fields'=>array('Repository.id'),'recursive' => 0));
        $repoId = $repo_r['Repository']['id'];

            //Get the architecture id
            $arch_r = $this->Architecture->find('first',array('conditions' =>array('Architecture.name' => $compdata['arch']),'fields'=>array('Architecture.id'),'recursive' => 0));
            $archId = $arch_r['Architecture']['id'];

                //Get the repoarch for this one
                $repoarch_r = $this->Repoarch->find('first',array('conditions' =>array(
                                                                        'Repoarch.repository_id' => $repoId,
                                                                        'Repoarch.architecture_id' => $archId),
                                                                        'fields'=>array('Repoarch.id'),
                                                                        'recursive' => 0
                                                    ));
                $repoarchId = $repoarch_r['Repoarch']['id'];

                    //Get the distributions for this repoarch
                    $distro_r = $this->Distribution->find('first',
                                                array('conditions' =>array('Distribution.repoarch_id' => $repoarchId,'Distribution.name' =>$compdata['distro']),
                                                'fields'=>array('Distribution.id'),'recursive' => 0));
                    $distroId   = $distro_r['Distribution']['id'];

                    //Get the distrocomp
                    $distrocomp_r = $this->Distrocomponent->find('first',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId,'Componenttype.name' =>$compdata['distrocomp'])));
			print_r($distrocomp_r);
                    //----------------------NORMAL KEYRING ----------------------------------
                    if($distrocomp_r['Distrocomponent']['keyring'] != ''){

			    print("Keyring Defined..Check it\n");

                            //---------------------------------------------------------------------
                            //Check te version of the specified keyring
                            $rd_dir         = Configure::read('Reprepro.base');
                            $keyrings       = Configure::read('Reprepro.keyrings');
                            $keyring = $rd_dir.$keyrings.'/'.$distrocomp_r['Distrocomponent']['keyring'];
                            $new_version = array();
                            exec("dpkg -f $keyring Version",$new_version);
                            $new_version = $new_version[0];
                            //---------------------------------------------------------------------------


                            //---------------------------------------------------------------------------
                            //---- Check if present - if so get the version
                            //--------------------------------------------------------------------------
                            $add_path   = $compdata['repo'].'/'.$compdata['arch'];

                            $conf_dir   = $rd_dir.Configure::read('Reprepro.confs').'/'.$add_path;
                            $db_dir     = $rd_dir.Configure::read('Reprepro.dbs').'/'.$add_path;
                            $dist_dir   = $rd_dir.Configure::read('Reprepro.dists').'/'.$add_path;
                            $distro     = $compdata['distro'];

                            $current_version = array();
                            $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir list $distro ubuntu-keyring";
			    CakeLog::write('notice', "REPODEPO: $command");
		            print("$command\n");		
                            exec($command,$current_version);
                            if(count($current_version) > 0){    //assume a hit
                                //Get the current version
                                $current_version    = $current_version[0];
                                $current_version     = preg_replace("/.*ubuntu-keyring\s+/",'',$current_version);
                                print("CURRENT VERSION $current_version FILE VERSION $new_version\n");
                                if($new_version > $current_version){

                                    $comp = $compdata['distrocomp'];
                                    print("Need to add newer version of Keyring Version Now $current_version Specified version $new_version\n");
                                    $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir -C $comp includedeb $distro $keyring";
                                    print("$command\n");
                                    exec($command);
                                }

                            }
                    }
                    //-----------END NORMAL KEYRING-----------------------------------

                    //----------------------Udeb KEYRING ----------------------------------
                    if($distrocomp_r['Distrocomponent']['u_keyring'] != ''){

                            //---------------------------------------------------------------------
                            //Check te version of the specified keyring
                            $rd_dir         = Configure::read('Reprepro.base');
                            $keyrings       = Configure::read('Reprepro.keyrings');
                            $keyring = $rd_dir.$keyrings.'/'.$distrocomp_r['Distrocomponent']['u_keyring'];
                            $new_version = array();
                            exec("dpkg -f $keyring Version",$new_version);
                            $new_version = $new_version[0];
                            //---------------------------------------------------------------------------


                            //---------------------------------------------------------------------------
                            //---- Check if present - if so get the version
                            //--------------------------------------------------------------------------
                            $add_path   = $compdata['repo'].'/'.$compdata['arch'];

                            $conf_dir   = $rd_dir.Configure::read('Reprepro.confs').'/'.$add_path;
                            $db_dir     = $rd_dir.Configure::read('Reprepro.dbs').'/'.$add_path;
                            $dist_dir   = $rd_dir.Configure::read('Reprepro.dists').'/'.$add_path;
                            $distro     = $compdata['distro'];

                            $current_version = array();
                            $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir list $distro ubuntu-keyring-udeb";
                            exec($command,$current_version);
                            if(count($current_version) > 0){    //assume a hit
                                //Get the current version
                                $current_version    = $current_version[0];
                                $current_version     = preg_replace("/.*ubuntu-keyring-udeb\s+/",'',$current_version);
                                if($new_version > $current_version){

                                    $comp = $compdata['distrocomp'];
                                    print("Need to add newer version of Keyring Version Now $current_version Specified version $new_version\n");
                                    $command = "/usr/bin/reprepro -V --ignore=undefinedtarget --noskipold --silent --confdir $conf_dir --dbdir $db_dir --outdir $dist_dir -C $comp includeudeb $distro $keyring";
                                    print("$command\n");
                                    exec($command);
                                }

                            }
                    }
                    //-----------END udeb KEYRING-----------------------------------

    }

    //==========================================================================================




}

?>
