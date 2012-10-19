<?
class UpdatesController extends AppController {

    var $name       = 'Updates';
    var $helpers    = array('Javascript');
    var $uses       = array('Repository','Repoarch','Architecture','Distribution','Distrocomponent','Update','Dcpackage','Activity');
    var $scaffold;
    var $components = array('RepreproUpdates', 'Session','Locker');
    //var $components = array('Json');



    function index($type,$id){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a type and an id and return the updates available for it
    //---http://127.0.0.1/c2/repodepo_cake/updates/index/distrocomp/496b31d8-1f70-4017-a149-22e9924009bd--
    //-------------------------------------------------------------------------------------------

        $this->layout = 'ajax';
        $list_of_updates = array();

        $paramsNamed            = array();
        $paramsNamed["$type"]   = $id;  
        $list_of_updates        = $this->_listUpdatesWithoutFilter($paramsNamed);

        $json_return = array();
        $json_return['label']      = 'name';
        $json_return['identifier'] = 'id';
        $json_return['items']      = $list_of_updates;
        $this->set('json_return',$json_return);
    }


    function completed($type,$id){

        $this->layout = 'ajax';

        //Get a list of updates that happened
        $u_r =$this->Update->find( 'all', array('conditions' => array('Update.repoarch_id' => $id),'order'=>'Update.modified DESC'));

        $items = array();

        foreach($u_r as $r){

            array_push($items,array('id' => $r['Update']['id'],'total' => $r['Update']['total'], 'date' =>$r['Update']['modified'],'arch' =>'i386','repo' => 'Dev'));
           // print_r($r);
        }


        $json_return = array();
        $json_return['label']      = 'repo';
        $json_return['identifier'] = 'id';
        $json_return['items']      = $items;
        $this->set('json_return',$json_return);

    }


    function updatesReport(){

        $this->layout = 'txt';

        $arr_ids = array();

        $url_keys = array_keys($this->params['url']);
        foreach($url_keys as $key){
            if(preg_match('/^\d+/',$key)){
    
                array_push($arr_ids,$this->params['url'][$key]);
            }
        }


        $report_array = array();

        //Bind the activity to the Update
        $this->Update->bindModel(
            array('hasMany' => array(
                        'Activity' => array(
                            'className'     => 'Activity',
                            'foreignKey'    => 'update_id'
                        )
                    )
                )
        );

        $u_r =$this->Update->find('all', array('conditions' => array('Update.id' => $arr_ids)));

        $counter = 0;

       // print_r($u_r);

        foreach($u_r as $update){

            $report_array[$counter]['total']    = count($u_r[$counter]['Activity']);
            $report_array[$counter]['date']     = $u_r[$counter]['Update']['modified'];

            //------------------------------------------------------
            //== Get the Repository Name and Architecture ========
            $ra_id = $u_r[$counter]['Update']['repoarch_id'];
            $ra_r = $this->Repoarch->find('first',array('conditions' => array('Repoarch.id' =>$ra_id)));

            $repo_name  = $ra_r['Repository']['name'];
            $arch_name  = $ra_r['Architecture']['name'];
            $report_array[$counter]['repo'] = $repo_name;
            $report_array[$counter]['arch'] = $arch_name;
            //-----------------------------------------------------

            $report_array[$counter]['packages'] = $this->_packageDetail($u_r[$counter]['Activity']);
            $counter++;
        }

        $this->set('report_array',$report_array);
       // print_r($report_array);
    }


    function _packageDetail($activities){

        $packages   = array();
        $count      = 0;
        foreach($activities as $item){

            //$actId = $item['id']; 
            $a_r = $this->Activity->find('first',array('conditions' => array('Activity.id' => $item['id'])));
                $dcpId  = $a_r['Dcpackage']['id'];
                $d_r    = $this->Dcpackage->find('first',array('conditions' => array('Dcpackage.id' =>$dcpId)));
             //   print "===============================\n";
             //   print_r($d_r);
            //    print "===============================\n";

           // print_r($a_r);
           // print "===============================\n";

            $package_name       = $d_r['Package']['name'];
            $activity           = $a_r['Activitytype']['name'];
            $version            = $a_r['Activity']['version'];

            //---- Some text processing to extract the component -----
            $file               = $a_r['Activity']['file'];
            $file               = preg_replace('"pool/"','',$file);
            $comp               = preg_replace('"/.*"','',$file);
            $file               = preg_replace('".*/"','',$file);


            $packages[$count]   = array('package_name' => $package_name, 'activity' => $activity, 'version' => $version, 'file' => $file,'comp' => $comp);
            $count ++;

        }
        return $packages;

    }


    function updateProgress($updateId){

        $this->layout = 'ajax';

        $update_ret =   $this->Update->find(   'first',
                                                array('conditions' => array('Update.id' => $updateId)
                                                )
                                            );
        $update_ret['Update']['total'];

        $json_return['json']['status']                  = 'ok';
        $json_return['progress']['completed']           = $update_ret['Update']['completed'];
        $json_return['progress']['total']               = $update_ret['Update']['total'];

        $pers_completed  = '0';
        if($json_return['progress']['total'] != '0'){
            $pers_completed = round((($update_ret['Update']['completed'] / $update_ret['Update']['total'])*100));
        }

        $json_return['progress']['pers_completed']      = $pers_completed;
        $this->set('json_return',$json_return);

    }


    function updatesDoAll(){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method is called to update all the displayed info on the grid--------
    //---We check the 'updates' table to make sure there is no update process already running ---
    //---if so we reply and feedback the updatesId, else we create a new updates entry-----------
    //---and feedback THAT NEW updatesId---------------------------------------------------------
    //---we than call the cake php console with various paramaeteds to do the update ------------
    //-------------------------------------------------------------------------------------------

    //Updates can only happen on repoarch level - if a person selected a repo we would have informed them
    //that they can't update a repo - but only a repoarch
        $this->layout   = 'ajax';
        $repoarchId     = $this->_getRepoarchId($this->params['named']);
        $branch_data    = $this->_getBranchData();
        $branch         = $branch_data[0];
        $branchId       = $branch_data[1];
        $json_return    = array();

        //Check if this is a new or existing process
        $updateId = $this->_updateBusyCheck($repoarchId);
        if($updateId){

            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'busy';
            $json_return['update']['id']        = $updateId;

        }else{
            //Create a new update entry and call the update cake php console with various switches
            $d['Update']['id']              = '';
            $d['Update']['repoarch_id']     = $repoarchId;
            $d['Update']['total']           = 0;
            $d['Update']['completed']       = 0;
            $this->Update->save($d);
            $update_id = $this->Update->id;
            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'started';
            $json_return['update']['id']        = $update_id;
            $filter_string                      = '';

            $filterName                         = $this->params['named']['filterName'];
            $filterValue                        = preg_replace('/\*/','',$this->params['named']['filterValue']);
            if($filterValue != ''){
                $filter_string = "-filterName $filterName -filterValue $filterValue";
            }

            $command_string = "/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update -branch $branch -branchId $branchId -updatetype all -updateId $update_id $filter_string  > /dev/null &";

            //print_r($command_string);
            CakeLog::write('notice', "REPODEPO: $command_string");
            exec($command_string);


        }

        $this->set('json_return',$json_return);
    }

    function updatesDoSelected(){
        $this->layout = 'ajax';
        $repoarchId = $this->_getRepoarchId($this->params['named']);
        $json_return    = array();


        $repoarchId     = $this->_getRepoarchId($this->params['named']);
        $branch_data    = $this->_getBranchData();
        $branch         = $branch_data[0];
        $branchId       = $branch_data[1];

        //Check if this is a new or existing process
        $updateId = $this->_updateBusyCheck($repoarchId);
        if($updateId){

            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'busy';
            $json_return['update']['id']        = $updateId;

        }else{
            //Create a new update entry and call the update cake php console with various switches
            $d['Update']['id']              = '';
            $d['Update']['repoarch_id']     = $repoarchId;
            $d['Update']['total']           = 0;
            $d['Update']['completed']       = 0;
            $this->Update->save($d);
            $update_id = $this->Update->id;
            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'started';
            $json_return['update']['id']        = $update_id;

            $filter_string                      = '';
            $get_list                           = $this->_buildSelectForConsole();

            $command_string = "/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update  -branch $branch -branchId $branchId -updatetype selected  -updateId $update_id -packageList $get_list  > /dev/null &";

            //print_r($command_string);
            CakeLog::write('notice', "REPODEPO: $command_string");
            exec($command_string);

        }
        $this->set('json_return',$json_return);
    }

    function updatesDoNotSelected(){
        $this->layout = 'ajax';
        $repoarchId = $this->_getRepoarchId($this->params['named']);
        $json_return    = array();

        $branch_data    = $this->_getBranchData();
        $branch         = $branch_data[0];
        $branchId       = $branch_data[1];

        //Check if this is a new or existing process
        $updateId = $this->_updateBusyCheck($repoarchId);
        if($updateId){

            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'busy';
            $json_return['update']['id']        = $updateId;

        }else{
            //Create a new update entry and call the update cake php console with various switches
            $d['Update']['id']              = '';
            $d['Update']['repoarch_id']     = $repoarchId;
            $d['Update']['total']           = 0;
            $d['Update']['completed']       = 0;
            $this->Update->save($d);
            $update_id = $this->Update->id;
            $json_return['json']['status']      = 'ok';
            $json_return['update']['status']    = 'started';
            $json_return['update']['id']        = $update_id;

            $filter_string                      = '';
            $get_list                           = $this->_buildSelectForConsole();

            $filterName                         = $this->params['named']['filterName'];
            $filterValue                        = preg_replace('/\*/','',$this->params['named']['filterValue']);
            if($filterValue != ''){
                $filter_string = "-filterName $filterName -filterValue $filterValue";
            }

            $command_string = "/var/www/c2/cake/console/cake -app /var/www/c2/repodepo_cake update -branch $branch -branchId $branchId -updatetype notselected -updateId $update_id -packageList $get_list $filter_string > /dev/null &";
            //print_r($command_string);
            CakeLog::write('notice', "REPODEPO: $command_string");
            exec($command_string);

        }
        $this->set('json_return',$json_return);
    }


    function statusReprepro(){
    //--Used to give feedback for a dynamic show / hide when reprepro is working on not
        $this->layout = 'ajax';
        $json_return['json']['status']      = 'ok';
        
        $return_array = array();
        exec('/bin/pidof reprepro',$return_array); //Get the pidof reprepro
        if(count($return_array)>0){
            $json_return['reprepro']['status']  = 'busy';   //or free
        }else{
            $json_return['reprepro']['status']  = 'free';   //or free
        }
        $this->set('json_return',$json_return);
    }

    function addBlacklist(){

        $this->layout = 'ajax';

        //------------------------------------------------------------
        //---Get a list of the packages that must be blacklisted------
        //------------------------------------------------------------
        $url_keys = array_keys($this->params['url']);
        foreach($url_keys as $key){
            if(preg_match('/^\d+/',$key)){

                $package = $this->params['url'][$key];
                $elements   = split("_", $package, 5);
                $repo       = $elements[0];
                $arch       = $elements[1];
                $distro     = $elements[2];
                $distrocomp = $elements[3];
                $name       = $elements[4];

                //Package
                $dcp_info['package']['name']        = $name; 
                $dcp_info['distrocomp']['name']     = $distrocomp;
                $dcp_info['distro']['name']         = $distro; 
                $dcp_info['arch']['name']           = $arch; 
                $dcp_info['repo']['name']           = $repo;
                //Show it must be blacklisted
                $dcp_info['blacklist']              = true;
                CakeLog::write('notice', "REPODEPO: Blacklist Item Repo: $repo, arch: $arch, distro: $distro, distrocomp: $distrocomp, name: $name");
                $this->Locker->addLock($dcp_info); 
            } 
        }
        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);
    }

    function _getBranchData(){
        //Thakes $this->params['named'] and determine which branch was selected eg 'repoarch|distro|distrocomp' and return the id of it
        $branch_data = array();

        if(array_key_exists('repoarch',$this->params['named'])){
            $branch_data[0] = 'repoach';
            $branch_data[1] = $this->params['named']['repoarch'];
        }

        if(array_key_exists('distro',$this->params['named'])){
            $branch_data[0] = 'distro';
            $branch_data[1] = $this->params['named']['distro'];
        }
        if(array_key_exists('distrocomp',$this->params['named'])){
            $branch_data[0] = 'distrocomp';
            $branch_data[1] = $this->params['named']['distrocomp'];
        }
        return $branch_data;
    }

    function _buildSelectForConsole(){
        //Takes the $this->params['url'] value and return a string seperated by ':' characters to be passed to the cake php console which will be
        //called to initialise the update process
        $url_keys = array_keys($this->params['url']);
        $return_string = '';

        $counter = 0;
        foreach($url_keys as $key){
            if(preg_match('/^\d+/',$key)){
                //First one will not start with ':'
                if($counter == 0){
                    $return_string = $this->params['url'][$key];
                }else{

                    $return_string = $return_string.':'.$this->params['url'][$key];
                }
                $counter++;
            } 
        }
        return $return_string;
    }
    

    function _updateBusyCheck($repoarchId){
        $update_ret =$this->Update->find(   'first',
                                                array('conditions' => array('Update.repoarch_id' => $repoarchId),
                                                'fields'=>array('Update.id','Update.total','Update.completed'),
                                                'order'=>'Update.modified DESC')
                                        );
        if($update_ret != ''){

            //Check if the values are not '' and not equal;
            $total  = $update_ret['Update']['total'];
            $done   = $update_ret['Update']['completed'];

            if($update_ret['Update']['total'] != $update_ret['Update']['completed']){
                return $update_ret['Update']['id'];

            }

            if($update_ret['Update']['total'] == '0'){
                return $update_ret['Update']['id']; 
            }
        }
        return false;
    }

    function _getRepoarchId($infoData){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: Takes a asssociative array that must contain a key and value pair----------
    //---this key must be one of the following 'repoarch|distro|distrocomp' (NOT 'repo')----------
    //---it will then return the repoarchId for that key -----------------------------------------
    //---EG $infoData['distro'] = 496703f5-4a70-42d3-997d-1965ff6df9cd ---------------------------
    //--------------------------------------------------------------------------------------------

        $repoarch ='';

        if(array_key_exists('repoarch',$infoData)){
            //This is the easy one ;)
            $repoarch =$infoData['repoarch'];
        }

        if(array_key_exists('distro',$infoData)){
            $distroId       = $infoData['distro'];
            $distro_ret     = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Distribution.repoarch_id')));
            $repoarch       = $distro_ret['Distribution']['repoarch_id'];
        }
        if(array_key_exists('distrocomp',$infoData)){
            $distrocompId       = $infoData['distrocomp'];
            $distrocomp_ret     = $this->Distrocomponent->find('first',array('conditions'=>array('Distrocomponent.id' =>$distrocompId),'fields'=>array('Distribution.id')));
            $distroId           = $distrocomp_ret['Distribution']['id'];
            $distro_ret     = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Distribution.repoarch_id')));
            $repoarch       = $distro_ret['Distribution']['repoarch_id'];
        }
        return $repoarch;
    }



    function _listUpdatesWithoutFilter($paramsNamed){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a associative array as input and depending in its keys--
    //--it will call <part>ListUpdates to get an array of updates to return ---------------------
    //-- $paramsNamed need to have one of the following keys 'repo|repoarch|distro|distrocomp----
    //---The value of this key will have to be a valid id for the specified part------------------
    //--EG $paramsNamed['repo'] = 496703f5-4a70-42d3-997d-1965ff6df9cd
    //-------------------------------------------------------------------------------------------
        $updates_no_filter = array();

        if(array_key_exists('repo',$paramsNamed)){
            $updates_no_filter = $this->_repoListUpdates($paramsNamed['repo']);
        }
        if(array_key_exists('repoarch',$paramsNamed)){
            $updates_no_filter = $this->_repoarchListUpdates($paramsNamed['repoarch']);
        }

        if(array_key_exists('distro',$paramsNamed)){
            $updates_no_filter = $this->_distroListUpdates($paramsNamed['distro']);
        }
        if(array_key_exists('distrocomp',$paramsNamed)){
            $updates_no_filter = $this->_distroCompListUpdates($paramsNamed['distrocomp']);
        }

       // print_r($updates_no_filter);
        return $updates_no_filter;
    }


    function _distroCompListUpdates($distrocompId){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a Distrocomponent id and list all the updates for it----
    //--It does this by creating the required data structure needed buy the ReprepoUpdates-------
    //-- component and calls its 'ListAvailable' method -----------------------------------------
    //----$compdata look like this:--------------------------------------------------------------
    //--array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comptype' => $distrocomp_name)
    //-------------------------------------------------------------------------------------------

        //----Specific for the RepreproUpdates component---
        //Get the repository name + arch of the repoarch
        //Using the distrocomponent's ID we work the hirarchy back to get all the info
        $distrocomp_ret = $this->Distrocomponent->find('first',array('conditions'=>array('Distrocomponent.id' =>$distrocompId),'fields' =>array('Componenttype.name','Distribution.id','Distrocomponent.dir_common','Distrocomponent.dir_specific')));

            $distrocomp_name    = $distrocomp_ret['Componenttype']['name'];
            $distroId           = $distrocomp_ret['Distribution']['id'];

            $dir_common         = $distrocomp_ret['Distrocomponent']['dir_common'];
            $dir_specific       = $distrocomp_ret['Distrocomponent']['dir_specific'];

            $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));

                $ra_id        = $distro_ret['Repoarches']['id'];
                $distro_name  = $distro_ret['Distribution']['name'];    //Need this

                $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));

                    $repo_name = $repoarch_ret['Repository']['name'];       //Need this
                    $arch_name = $repoarch_ret['Architecture']['name'];     //Need this

                    //Get a list of locked packages
                    $locked_packages = $this->_lockedPackagesForDistrocomp($distrocompId);

        $compdata = array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comptype' => $distrocomp_name,'dir_common'=> $dir_common,'dir_specific' =>$dir_specific,'locked_packages' => $locked_packages );
        //---END Specific for the Reprepro component

        //Because this is on the lowest level you can go we only have to query once and not have to concatenate query results
        $list_of_updates = $this->RepreproUpdates->ListAvailable($compdata);
        return $list_of_updates;

    }

    function _lockedPackagesForDistrocomp($distrocompId){

        $locked_packages = array();
        $dcp_r = $this->Dcpackage->find('all', array('conditions' =>array('Dcpackage.state' => 'locked','Dcpackage.distrocomponent_id' => $distrocompId)));

        foreach($dcp_r as $item){
            array_push($locked_packages,$item['Package']['name']);
        }
        return $locked_packages;
    }


    function _distroListUpdates($distroId){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a Distribution id and list all the updates for it-------
    //--It does this by checking the Distrocomponents specified for each Distribution------------
    //--Loops through it and call the method which returns a list of updates for a distribution--
    //--$this->RepreproUpdates->ListAvailable($compdata)-- This is using the RepreproUpdates-----
    //--component to get it. -----------------------------------$compdata look like this:--------
    //--array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comptype' => $distrocomp_name)
    //-------------------------------------------------------------------------------------------

        //--We need to determine info Up and down
        $distro_ret = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name','Distribution.id')));

            $ra_id        = $distro_ret['Repoarches']['id'];
            $distro_name  = $distro_ret['Distribution']['name'];    //Need this
            $distro_id    = $distro_ret['Distribution']['id'];

            $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));

                 $repo_name = $repoarch_ret['Repository']['name'];       //Need this
                 $arch_name = $repoarch_ret['Architecture']['name'];     //Need this

        //NOW we find all the $distrocomps for this distro
        $distrocomp_ret = $this->Distrocomponent->find('all',array('conditions'=>array('Distrocomponent.distribution_id' =>$distro_id),'fields' =>array('Componenttype.name','Distrocomponent.dir_common','Distrocomponent.dir_specific','Distrocomponent.id')));

        //Now we take this list and loop it - and fetching updates for each distrocomp and pool it together
        $list_of_updates    = array();
        $merged_array       = array();

        foreach($distrocomp_ret as $entry){

            $distrocomp_name = $entry['Componenttype']['name'];

            $dir_common         = $entry['Distrocomponent']['dir_common'];
            $dir_specific       = $entry['Distrocomponent']['dir_specific'];
            $distrocompId       = $entry['Distrocomponent']['id'];
            //Get a list of locked packages
            $locked_packages = $this->_lockedPackagesForDistrocomp($distrocompId);

            $compdata = array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comptype' => $distrocomp_name,'dir_common'=> $dir_common,'dir_specific' =>$dir_specific,'locked_packages' => $locked_packages);
            //print_r($compdata);

            $list_of_updates_comp = $this->RepreproUpdates->ListAvailable($compdata);
            $merged_array = array_merge($list_of_updates,$list_of_updates_comp);
            $list_of_updates = $merged_array;
        }

        return $list_of_updates;
    }

    function _repoarchListUpdates($repoarchId){
    //-------------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a Repoarch id and list all the updates for it-----------
    //--It does this by checking the Distributions specified for each Repoarch-------------------
    //--Loops through it and call the method which returns a list of updates for a distribution--
    //--(_distoListUpdates)-----------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------

        //-- We need to determin info Up and down
       $distro_ret = $this->Distribution->find('all',array('conditions'=>array('Distribution.repoarch_id' =>$repoarchId),'fields' =>array('Distribution.id')));

       $list_of_updates    = array();
       $merged_array       = array();


       foreach($distro_ret as $entry){

            $distroId =$entry['Distribution']['id'];
            $list_of_updates_comp = $this->_distroListUpdates($distroId);
            $merged_array = array_merge($list_of_updates,$list_of_updates_comp);
            $list_of_updates = $merged_array;

        }

        return $list_of_updates;
    }


    function _repoListUpdates($repoId){
    //---------------------------------------------------------------------------------------
    //---WHAT IT DOES: This method takes a Repository id and list all the updates for it-----
    //--It does this by checking the Repoarches specified for each Repository----------------
    //--Loops through it and call the method which returns a list of updates for a repoarch--
    //--(_repoarchListUpdates)---------------------------------------------------------------
    //---------------------------------------------------------------------------------------

        $repo_ret = $this->Repoarch->find('all',array('conditions'=>array('Repoarch.repository_id' =>$repoId),'fields' =>array('Repoarch.id')));
        $list_of_updates    = array();
        $merged_array       = array();

        foreach($repo_ret as $entry){

            $repoarchId =$entry['Repoarch']['id'];
            $list_of_updates_comp = $this->_repoarchListUpdates($repoarchId);
            $merged_array = array_merge($list_of_updates,$list_of_updates_comp);
            $list_of_updates = $merged_array;
        }
        return $list_of_updates;
    }
}
?>
