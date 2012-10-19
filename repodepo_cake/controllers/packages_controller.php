<?
class PackagesController extends AppController {

    var $name       = 'Packages';
    var $helpers    = array('Javascript');
    var $scaffold;
    //var $components = array('Json');

    var $components = array('Session','Locker','Remover');    //Add the locker component

    var $uses       = array('Repoarch','Distribution','Distrocomponent','Dcpackage','Activity');


    function dummy(){



    }

    function index($type,$id){
        $this->layout = 'ajax';

        //------------------------------------------
        $start =0;
        $count;

        if(array_key_exists('start',$this->params['url'])){
            $start = $this->params['url']['start'];
        }

        if(array_key_exists('count',$this->params['url'])){

            $count = $this->params['url']['count'];
        }

        $condition  = $this->params['url']['name'];

        //SQL-aaize it
        $condition  = preg_replace( '/\*/', '%', $condition);

        //---------------------------------------------

        if($start == 0){

            $page = 1;
        }else{

            $page = ($start/$count)+1; 
        }

        //We need to generate an array of distrocomponentId's which is included in the selected branch
        $list_of_distrocomps = $this->_getIncludedDistrocomps($type,$id);

        //print_r($list_of_distrocomps);

        $packages_list  = array();

        //--Build the Clause--
        $clause         = array();

        array_push($clause,array("Package.name LIKE" => "$condition")); //Add This AND filtertjie

        $clause['or']   = array();

        foreach($list_of_distrocomps as $dcId){
            array_push($clause['or'],array('Dcpackage.distrocomponent_id' => $dcId));
        }
        //--End of building the clause---

        $dcp_r = $this->Dcpackage->find('all',array('conditions' => $clause,'order' => array('Package.name'),'limit' => $count,'page'=>$page));

        //We need to get the count of the packages
        $total = $this->Dcpackage->find('count',array('conditions' => $clause,'order' => array('Package.name')));

        foreach($dcp_r as $dcp){

            if($dcp['Package']['id'] != ''){

                $version = $this->_getLastActivity($dcp['Dcpackage']['id']);
               // array_push($packages_list,array('arch'=>'i386', 'distro' => 'hardy-csir', 'comp' => 'universe', 'name' => $dcp['Package']['name'],'id' => $dcp['Package']['id'],'version' => $version));
                array_push($packages_list,array('name' => $dcp['Package']['name'],'id' => $dcp['Dcpackage']['id'],'version' => $version,'state' => $dcp['Dcpackage']['state']));
            }else{

                print_r("GROOOOT PROBLEME!\n");
            }
        }

        $json_return = array();
        $json_return['label']      = 'name';
        $json_return['identifier'] = 'id';
        $json_return['numRows']    = $total;      //Required for the datastore

        $json_return['items']      = $packages_list;
        $this->set('json_return',$json_return);

       // print_r($packages_list);
    }


    function view($what,$who){

        $this->layout = 'ajax';

        //Info for this package
        $pi = $this->_getDcpackageInfo($who);
        //Get the install directory from the Configure::Class
        $base_dir   = Configure::read('Reprepro.base');
        $bd_dists   = $base_dir.Configure::read('Reprepro.dists');
        $dists_dir  = $bd_dists.'/'.$pi['repo']['name'].'/'.$pi['arch']['name'].'/';

        if($what == 'detail'){
            //Get the file location
            $a_r = $this->Activity->find('first',array('conditions' => array('Activity.dcpackage_id' => $who),'order' => array('Activity.modified DESC'), 'recursive' => false));

            $filename       = $dists_dir.$a_r['Activity']['file'];
            $return_array   = array();
            exec("dpkg -f $filename",$return_array);
            // print_r($return_array);
            $this->set('detail_return',$return_array);
        }

        if($what == 'files'){

            $a_r = $this->Activity->find('first',array('conditions' => array('Activity.dcpackage_id' => $who),'order' => array('Activity.modified DESC'), 'recursive' => false));

            $filename       = $dists_dir.$a_r['Activity']['file'];
            $return_array   = array();
            exec("dpkg -c $filename",$return_array);
            // print_r($return_array);
            $this->set('file_return',$return_array);
        }

        if($what == 'activity'){

            $a_r = $this->Activity->find('all',array('conditions' => array('Activity.dcpackage_id' => $who),'order' => array('Activity.modified DESC')));

            $return_array   = array();

            foreach($a_r as $item){

                $type       = $item['Activitytype']['name'];
                $time       = $item['Activity']['modified'];
                $file       = $item['Activity']['file'];
                $version    = $item['Activity']['version'];
                array_push($return_array,array('type' => $type,'time'=> $time,'file' => $file, 'version' => $version));
            }

          //  print_r($return_array);
            $this->set('activity_return',$return_array);
        }
    }

    function lockunlock(){

        $this->layout = 'ajax';
        
        foreach(array_keys($this->params['url']) as $key){
            if(preg_match('/^\d+/',$key)){
               
                $pi    = $this->_getDcpackageInfo($this->params['url'][$key]);

                $dcp_r = $this->Dcpackage->find('first',array('conditions' => array('Dcpackage.id'=>$this->params['url'][$key])));
               // print_r($dcp_r);
                $state = $dcp_r['Dcpackage']['state'];
                $this->Dcpackage->id = $this->params['url'][$key];
                if($state == 'open'){
                    $state = 'locked';
                    //We only add it to a filter file if it is external type
                    if($pi['distrocomp']['update_type'] == 'external'){
                        $this->Locker->addLock($pi);    //Add a lock on this package
                    }
                }else{
                    if($state == 'locked'){
                        $state = 'open';
                        //We only add it to a filter file if it is external type
                        if($pi['distrocomp']['update_type'] == 'external'){
                            $this->Locker->removeLock($pi);  //Remove the lock on this package
                        }
                    }
                }
                $this->Dcpackage->saveField('state',$state);
                //print("ID IS ".$dcpId."\n");
            } 
        }

        $json_return = array();
        $json_return['json']['status']    = 'ok';
        $this->set('json_return',$json_return);
    }


    function delete(){

        $this->layout = 'ajax';

        foreach(array_keys($this->params['url']) as $key){
            if(preg_match('/^\d+/',$key)){
               
                $pi    = $this->_getDcpackageInfo($this->params['url'][$key]);

                //----------------------------------------------
                //If the package was locked - we need to remove the lock before we delete it
                $dcp_r = $this->Dcpackage->find('first',array('conditions' => array('Dcpackage.id'=>$this->params['url'][$key])));
                $state = $dcp_r['Dcpackage']['state'];
                if($state == 'locked'){
                    if($pi['distrocomp']['update_type'] == 'external'){
                            $this->Locker->removeLock($pi);  //Remove the lock on this package
                        }
                }
                //-----------------------------------------------

                //----- Call the remove method of the Remover component --
                $this->Remover->remove($pi);
                
                //----Remove all traces out of the DB ---
                $this->Dcpackage->del($this->params['url'][$key],true);
                $dcpId = $this->params['url'][$key];
                $this->Activity->deleteAll("Activity.dcpackage_id='$dcpId'",false);
            }
        }

        $json_return = array();
        $json_return['json']['status']    = 'ok';
        $this->set('json_return',$json_return);
    }


    function _getDcpackageInfo($dcpId){
        //----------------------------------------------------------------------
        //This method returns an array with all the repo detail on a package----
        //----------------------------------------------------------------------

        $dcp_info = array();
        $dcp_r = $this->Dcpackage->find('first',array('conditions' => array('Dcpackage.id' => $dcpId)));

        //Package
        $dcp_info['package']['name'] = $dcp_r['Package']['name']; 
        $dcp_info['package']['id']   = $dcp_r['Package']['id'];

        //Distrocomp
        $dcp_info['distrocomp']['id']   = $dcp_r['Distrocomponent']['id'];
        if($dcp_r['Distrocomponent']['updsource'] != ''){         //Specify what type of distrocomp this is

            $dcp_info['distrocomp']['update_type'] = 'external';

        }else{

            $dcp_info['distrocomp']['update_type'] = 'directory';
        }


        $dc_r = $this->Distrocomponent->find('first', array('conditions' => array('Distrocomponent.id' => $dcp_r['Distrocomponent']['id'])));

        $dcp_info['distrocomp']['name']   = $dc_r['Componenttype']['name'];

        //Distro
        $dcp_info['distro']['name'] = $dc_r['Distribution']['name']; 
        $dcp_info['distro']['id']   = $dc_r['Distribution']['id'];

        //Arch
        $repoach_r = $this->Repoarch->find('first', array('conditions' => array('Repoarch.id' =>$dc_r['Distribution']['repoarch_id'])));
        $dcp_info['arch']['name']   = $repoach_r['Architecture']['name']; 
        $dcp_info['arch']['id']     = $repoach_r['Architecture']['id'];

        //Repo
        $dcp_info['repo']['name']   = $repoach_r['Repository']['name']; 
        $dcp_info['repo']['id']     = $repoach_r['Repository']['id'];

        return($dcp_info);

    }


    function _getLastActivity($dcp_id){

        $act_r      =$this->Activity->find('first',array('conditions' => array('Activity.dcpackage_id'=> $dcp_id),'recursive' =>false,'order' => array('Activity.modified DESC')));
        $version    = $act_r['Activity']['version'];
        return $version;
    }

    function _getIncludedDistrocomps($type,$id){

        $list_of_distrocomps    = array();

        //---Distrocomps -----
        if($type == 'distrocomp'){

            //This is the easiest
            array_push($list_of_distrocomps,$id);
        }

        //---Distro's distrocomps ----
        if($type == 'distro'){

            $distro_r = $this->Distrocomponent->find('all',array('conditions' =>array('Distrocomponent.distribution_id' => $id)));
            foreach($distro_r as $item){

                array_push($list_of_distrocomps,$item['Distrocomponent']['id']);
            }
        }

        //---Repoarche's distro's and then distro's distrocomps
        if($type == 'repoarch'){

            $ra_r = $this->Distribution->find('all',array('conditions' => array('Distribution.repoarch_id' => $id)));
            foreach($ra_r as $item){
                $distroId = $item['Distribution']['id'];
                $distro_r = $this->Distrocomponent->find('all',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId)));
                foreach($distro_r as $i){

                    array_push($list_of_distrocomps,$i['Distrocomponent']['id']);
                }
            }
        }
        //---Repo's -> Repoarche's; Repoarche's-> distro's and then distro's ->distrocomps
        if($type == 'repo'){

            $r_r = $this->Repoarch->find('all',array('conditions' => array('Repoarch.repository_id' => $id)));
            //print_r($r_r);

            foreach($r_r as $ra){

                $d_id = $ra['Repoarch']['id'];
                $ra_r = $this->Distribution->find('all',array('conditions' => array('Distribution.repoarch_id' => $d_id)));
                foreach($ra_r as $item){
                    $distroId = $item['Distribution']['id'];
                    $distro_r = $this->Distrocomponent->find('all',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId)));
                    foreach($distro_r as $i){

                        array_push($list_of_distrocomps,$i['Distrocomponent']['id']);
                    }
                }
            }
        }
        return $list_of_distrocomps;
    }

}
?>
