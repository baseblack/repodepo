<?php

class ActivityShell extends Shell {

    //--------------------------------------------------------
    //---PREDEFINED VARIABLES---------------------------------
    //--------------------------------------------------------
    //Models that we will be using
    var $uses       = array('Repository','Repoarch','Architecture','Distribution','Distrocomponent','Update','Componenttype','Package', 'Dcpackage','Activity', 'Activitytype');

    //For debug info
    var $debug_flag = true;

    var $infoArray = array();
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

        //---Initialization code------------------------------
        App::import('Core', array('View', 'Controller'));
        App::import('Controller', array('Updates'));
        $this->UpdatesController = new UpdatesController();
        $this->UpdatesController->constructClasses();

        //Initialize the components inside the controller
        $this->UpdatesController->RepreproUpdates->initialize();
        $this->UpdatesController->Locker->initialize();
        //==============END OF SECTION =======================

        if($this->params['action'] == 'add'){

            $this->infoArray = $this->_determineVariousIds();
            $this->_actionAdd();
            print_r($this->infoArray);

        }

        if($this->params['action'] == 'replace'){

            $this->infoArray = $this->_determineVariousIds();
            $this->_actionNew('update');
            print_r($this->infoArray);

        }

    }

    function _actionNew($type){


        //------Activty type 'add' ID-------------------------------------
        $att_r = $this->Activitytype->find('first',array('conditions' =>array('Activitytype.name' => $type)));

        $attId = $att_r['Activitytype']['id'];

        print("The Activity Type ID is: $attId\n");

        //------END Activty type 'add' ID----------------------------------

        //-------PACKAGE ID-----------------------------------------------
        //Check if the package with this name exists and if not, add it
        $pack_r = $this->Package->find('first',array('conditions' =>array('Package.name' => $this->params['name'])));

        $packageId;

        if($pack_r == ''){

            $d['Package']['id']     = '';
            $d['Package']['name']   = $this->params['name'];
            $this->Package->save($d);
            $packageId  = $this->Package->id;

        }else{

            $packageId = $pack_r['Package']['id'];
        }
        print("The package ID is: $packageId\n");

        //-------END PACKAGE ID--------------------------------------------

        //-----DC PACKAGES-------------------------------------------------
        //Check if the dcpackage with this name id exists and if not, add it
        $dcpack_r = $this->Dcpackage->find('first',array('conditions' =>array('Dcpackage.distrocomponent_id' => $this->infoArray['distrocomp']['id'],'Dcpackage.package_id' => $packageId)));
        $dcpackageId;

        if($dcpack_r == ''){

            $d['Dcpackage']['id']     = '';
            $d['Dcpackage']['distrocomponent_id']   = $this->infoArray['distrocomp']['id'];
            $d['Dcpackage']['package_id']   = $packageId;
            $this->Dcpackage->save($d);
            $dcpackageId  = $this->Dcpackage->id;

        }else{

            $dcpackageId = $dcpack_r['Dcpackage']['id'];

        }
        print("The DC Package ID is: $dcpackageId\n");
        //----------------------------------------------------------------


        //----ACTIVITY---------------------------------------------------
        $d['Activity']['id'] = '';
        $d['Activity']['activitytype_id']   = $attId;
        $d['Activity']['dcpackage_id']      = $dcpackageId;
        $d['Activity']['update_id']         = $this->infoArray['update']['id'];
        $d['Activity']['version']           = $this->params['version'];
        $d['Activity']['file']              = $this->params['file'];

        $this->Activity->save($d);
        //----END ACTIVITY------------------------------------------------


        //-------------------END ADD--------------------------------------

    }





    function _actionAdd(){


        //------Activty type 'add' ID-------------------------------------
        $att_r = $this->Activitytype->find('first',array('conditions' =>array('Activitytype.name' => 'new')));

        $attId = $att_r['Activitytype']['id'];

        print("The Activity Type ID is: $attId\n");

        //------END Activty type 'add' ID----------------------------------

        //-------PACKAGE ID-----------------------------------------------
        //Check if the package with this name exists and if not, add it
        $pack_r = $this->Package->find('first',array('conditions' =>array('Package.name' => $this->params['name'])));

        $packageId;

        if($pack_r == ''){

            $d['Package']['id']     = '';
            $d['Package']['name']   = $this->params['name'];
            $this->Package->save($d);
            $packageId  = $this->Package->id;

        }else{

            $packageId = $pack_r['Package']['id'];
        }
        print("The package ID is: $packageId\n");

        //-------END PACKAGE ID--------------------------------------------

        //-----DC PACKAGES-------------------------------------------------
        //Check if the dcpackage with this name id exists and if not, add it
        $dcpack_r = $this->Dcpackage->find('first',array('conditions' =>array('Dcpackage.distrocomponent_id' => $this->infoArray['distrocomp']['id'],'Dcpackage.package_id' => $packageId)));
        $dcpackageId;

        if($dcpack_r == ''){

            $d['Dcpackage']['id']     = '';
            $d['Dcpackage']['distrocomponent_id']   = $this->infoArray['distrocomp']['id'];
            $d['Dcpackage']['package_id']   = $packageId;
            $this->Dcpackage->save($d);
            $dcpackageId  = $this->Dcpackage->id;

        }else{

            $dcpackageId = $dcpack_r['Dcpackage']['id'];

        }
        print("The DC Package ID is: $dcpackageId\n");
        //----------------------------------------------------------------


        //----ACTIVITY---------------------------------------------------
        $d['Activity']['id'] = '';
        $d['Activity']['activitytype_id']   = $attId;
        $d['Activity']['dcpackage_id']      = $dcpackageId;
        $d['Activity']['update_id']         = $this->infoArray['update']['id'];
        $d['Activity']['version']           = $this->params['version'];
        $d['Activity']['file']              = $this->params['file'];

        $this->Activity->save($d);
        //----END ACTIVITY------------------------------------------------


        //-------------------END ADD--------------------------------------

    }


    function _determineVariousIds(){

        $infoData = array();
        //First we need to determine the repo name
        $repo_name      = $this->params['conf'];
        $arch           = $this->params['arch'];

        $lead_path      = $this->path.$this->subs['confs'].'/';
        print("$lead_path\n");
        print("$repo_name\n");

        $repo_name      = preg_replace("'($lead_path)'",'',$repo_name);
        $repo_name      = preg_replace("'(/$arch)'",'',$repo_name);

        //Get the repoId for this repo name
        $repo_r = $this->Repository->find('first',array('conditions' =>array('Repository.name' => $repo_name),'fields'=>array('Repository.id'),'recursive' => 0));
        $repoId = $repo_r['Repository']['id'];
        $infoData['repo'] = array('name' => $repo_name, 'id' => $repoId);

        //Get the architecture id
        $arch_r = $this->Architecture->find('first',array('conditions' =>array('Architecture.name' => $arch),'fields'=>array('Architecture.id'),'recursive' => 0));
        $archId = $arch_r['Architecture']['id'];
        $infoData['arch'] = array('name' => $arch, 'id' => $repoId);

        //Get the repoarch for this one
        $repoarch_r = $this->Repoarch->find('first',array('conditions' =>array('Repoarch.repository_id' => $repoId,'Repoarch.architecture_id' => $archId),'fields'=>array('Repoarch.id'),'recursive' => 0));
        $repoarchId = $repoarch_r['Repoarch']['id'];
        $infoData['repoarch'] = array('name' => '', 'id' => $repoarchId);


        //Get the distributions for this repoarch
        $distro_r = $this->Distribution->find('first',
                                                array('conditions' =>array('Distribution.repoarch_id' => $repoarchId,'Distribution.name' =>$this->params['distro']),
                                                'fields'=>array('Distribution.id'),'recursive' => 0));
        $distroId   = $distro_r['Distribution']['id'];
        $infoData['distro'] = array('name' => $this->params['distro'], 'id' => $distroId);

        //Get the distrocomp
        $distrocomp_r = $this->Distrocomponent->find('first',array('conditions' =>array('Distrocomponent.distribution_id' => $distroId,'Componenttype.name' =>$this->params['comp'])));
        $distrocompId = $distrocomp_r['Distrocomponent']['id'];
        $infoData['distrocomp'] = array('name' => $this->params['comp'], 'id' => $distrocompId);

        //Get the updateID
        $update_r   = $this->Update->find('first',array('conditions' => array('Update.repoarch_id' => $repoarchId),'order' => "Update.modified DESC"));
        $updateId   = $update_r['Update']['id'];
        $infoData['update'] = array('name' => '', 'id' => $updateId);

        return $infoData;

    }

}

?>