<?
class DistrocomponentsController extends AppController {

    var $name       = 'Distrocomponents';
    var $helpers    = array('Javascript');
    var $scaffold;
    var $uses       = array('Distrocomponent','Componenttype','Distribution','Repoarch');
    var $components = array('Reprepro', 'Session','Locker');
    //var $components = array('Json');

    function add(){

        $this->layout = 'ajax';
        $comptypeId = $this->params['form']['comptypeId'];
        $distroId   = $this->params['form']['distroId'];

        $updsource  = '';
        $keyring    = '';
        $u_keyring  = '';
        $common     = '';
        $specific   = '';
        

        if(array_key_exists('updateSource',$this->params['form'])){
            $updsource  = $this->params['form']['updateSource'];
            $keyring    = $this->params['form']['updateKeyring'];
            $u_keyring  = $this->params['form']['updateUdebKeyring'];
        }else{  //We assume it is a network type
            $common     = $this->params['form']['updateCommon'];
            $specific   = $this->params['form']['updateSpecific'];
        }

        //Get the name of the component
        $name_q = $this->Componenttype->find('first',array('conditions' => array('Componenttype.id' => $comptypeId),'fields'=>array('Componenttype.name')));
        $name = $name_q['Componenttype']['name'];

        //---------------------------------------------------
        //Add the component
        $d = array();
        $d['Distrocomponent']['id'] = '';
        $d['Distrocomponent']['componenttype_id']   = $comptypeId;
        $d['Distrocomponent']['distribution_id']    = $distroId;
        $d['Distrocomponent']['updsource']          = $updsource;
        $d['Distrocomponent']['dir_common']         = $common;
        $d['Distrocomponent']['dir_specific']       = $specific;
        $d['Distrocomponent']['keyring']            = $keyring;
        $d['Distrocomponent']['u_keyring']          = $u_keyring;

        $this->Distrocomponent->save($d);
        $comp_id = $this->Distrocomponent->id;
        //----------------------------------------------------------


        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));
        $ra_id        = $distro_ret['Repoarches']['id'];
        $distro_name  = $distro_ret['Distribution']['name'];    //Need this

        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));
        $repo_name = $repoarch_ret['Repository']['name'];       //Need this
        $arch_name = $repoarch_ret['Architecture']['name'];     //Need this
        //---------------------------------------------------------


        //------------------------------------------------------
        $udeb = false;
        if(array_key_exists('updateInstaller',$this->params['form'])){

            $udeb = true;
        }

        $compdata = array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comp' => $name,'source' => $updsource,'udeb' =>$udeb);
        $this->Reprepro->compAdd($compdata);
        //-------------------------------------------------------


        //--------------------------------------------
        $json_return = array();
        $json_return['json']['status']    = 'ok'; 
        //$json_return['json']['status']    = 'error';
        //$json_return['json']['detail']    = "UP Source $updsource CD $common_dir SP $specific_dir";
        $json_return['component']['name']   = $name;
        $json_return['component']['id']     = $comp_id;
        $this->set('json_return',$json_return);
        //--------------------------------------------

    }

    

    function del($distrocompId){

        $this->layout = 'ajax';

        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        //Using the distrocomponent's ID we work the hirarchy back to get all the info
        $distrocomp_ret = $this->Distrocomponent->find('first',array('conditions'=>array('Distrocomponent.id' =>$distrocompId),'fields' =>array('Componenttype.name','Distribution.id')));

            $distrocomp_name    = $distrocomp_ret['Componenttype']['name'];
            $distroId           = $distrocomp_ret['Distribution']['id'];

            $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));

                $ra_id        = $distro_ret['Repoarches']['id'];
                $distro_name  = $distro_ret['Distribution']['name'];    //Need this

                $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));

                    $repo_name = $repoarch_ret['Repository']['name'];       //Need this
                    $arch_name = $repoarch_ret['Architecture']['name'];     //Need this

        $compdata = array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comp' => $distrocomp_name);
        //---END Specific for the Reprepro component

        $this->Distrocomponent->del($distrocompId);
        $this->Reprepro->compDel($compdata);

        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);

    }

    function edit(){

        //print_r($this->params['form']);
        $distrocompId   = $this->params['form']['distrocompId'];

        $this->Distrocomponent->id = $distrocompId;
        if(array_key_exists('updateSource',$this->params['form'])){
            //Save the following
            $this->Distrocomponent->saveField('updsource',$this->params['form']['updateSource']);       //NB also change the value of the updates file's field!!
            $this->Distrocomponent->saveField('keyring',$this->params['form']['updateKeyring']);      
            $this->Distrocomponent->saveField('u_keyring',$this->params['form']['updateUdebKeyring']);

            //--------------------------------------------------------------
            //---Update the update source in the updates file --------------
            //-------------------------------------------------------------
            $distrocomp_ret = $this->Distrocomponent->find('first',array('conditions'=>array('Distrocomponent.id' =>$distrocompId)));

                $distrocomp_name    = $distrocomp_ret['Componenttype']['name'];
                $distroId           = $distrocomp_ret['Distribution']['id'];

                $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));

                    $ra_id        = $distro_ret['Repoarches']['id'];
                    $distro_name  = $distro_ret['Distribution']['name'];    //Need this

                        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));

                        $repo_name = $repoarch_ret['Repository']['name'];       //Need this
                        $arch_name = $repoarch_ret['Architecture']['name'];     //Need this

            $rd_dir     = Configure::read('Reprepro.base');
            $conf_dir   = Configure::read('Reprepro.confs');

            $path_to_config_file    = $rd_dir.$conf_dir.'/';
            $updates_file           = $path_to_config_file.$repo_name.'/'.$arch_name.'/updates';
            $distro_file            = $path_to_config_file.$repo_name.'/'.$arch_name.'/distributions';

            $updates_item   = $distro_name.'-'.$distrocomp_name;
            $updates_source = $this->params['form']['updateSource'];
            $this->Reprepro->_setConfigValue($updates_file,'Name',$updates_item,'Method',array($updates_source));


            //================================================================
            if(array_key_exists('updateInstaller',$this->params['form'])){

                //Add it if not there already
                $value_to_get = $this->Reprepro->_getConfigValue($distro_file,'Codename',$distro_name,'UDebComponents');

                //If it contained something
                if(count($value_to_get)> 0){
                    if(!preg_match("/$distrocomp_name/",$value_to_get[0])){
                        $udeb_value = $distrocomp_name.' '.$value_to_get[0];
                        $this->Reprepro->_setConfigValue($distro_file,'Codename',$distro_name,'UDebComponents',array($udeb_value));
                    }
                }else{

                    $this->Reprepro->_setConfigValue($distro_file,'Codename',$distro_name,'UDebComponents',array($distrocomp_name));
                }
            }else{
                //Remove it
                $value_to_get = $this->Reprepro->_getConfigValue($distro_file,'Codename',$distro_name,'UDebComponents');
                if(count($value_to_get) > 0){   //Entry is present 

                    $current_value = $value_to_get[0];  //Get the entry
                    if(preg_match("/$distrocomp_name/",$current_value)){ //present -Filter it out else leave as is
                        $new_value = preg_replace("/\s*$distrocomp_name\s*/",'',$current_value);  //remove it
                        $replacement = array();
                        if(strlen($new_value) > 1){ //Check size
                            $replacement = array($new_value);
                        }
                        $value_to_get = $this->Reprepro->_setConfigValue($distro_file,'Codename',$distro_name,'UDebComponents',$replacement);
                    }
                }
            } 
            //======================================================================

            //-------------------------------------------------------------

        }else{

            $this->Distrocomponent->saveField('dir_common',$this->params['form']['updateCommon']);
            $this->Distrocomponent->saveField('dir_specific',$this->params['form']['updateSpecific']);
        }

        $json_return = array();
        $json_return['json']['status']  = 'ok';
        $this->set('json_return',$json_return);

    }


    function info($distrocompId){

        $this->layout = 'ajax';


         //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        //Using the distrocomponent's ID we work the hirarchy back to get all the info
        $distrocomp_ret = $this->Distrocomponent->find('first',array('conditions'=>array('Distrocomponent.id' =>$distrocompId)));

       // print_r($distrocomp_ret);
        $json_return = array();
        $json_return['comp']['type']        = 'directory';

        if($distrocomp_ret['Distrocomponent']['updsource'] != ''){

            $json_return['comp']['type']    = 'external';
        }

        $json_return['comp']['updateSource']        = $distrocomp_ret['Distrocomponent']['updsource'];
        $json_return['comp']['updateInstaller']     = '';
        $json_return['comp']['updateKeyring']       = $distrocomp_ret['Distrocomponent']['keyring'];
        $json_return['comp']['updateUdebKeyring']   = $distrocomp_ret['Distrocomponent']['u_keyring'];
        $json_return['comp']['updateCommon']        = $distrocomp_ret['Distrocomponent']['dir_common'];
        $json_return['comp']['updateSpecific']      = $distrocomp_ret['Distrocomponent']['dir_specific'];

        $distrocomp_name    = $distrocomp_ret['Componenttype']['name'];
        $distroId           = $distrocomp_ret['Distribution']['id'];

        $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));

            $ra_id        = $distro_ret['Repoarches']['id'];
            $distro_name  = $distro_ret['Distribution']['name'];    //Need this

            $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));

                $repo_name = $repoarch_ret['Repository']['name'];       //Need this
                $arch_name = $repoarch_ret['Architecture']['name'];     //Need this

        //$compdata = array('repo' => $repo_name,'arch' =>$arch_name,'distro' =>$distro_name,'comp' => $distrocomp_name,'udeb' => true,'source' => 'ftp://ubutu.za/koos');

        //---Check if the UdebComponents are marked-----
        $rd_dir     = Configure::read('Reprepro.base');
        $conf_dir   = Configure::read('Reprepro.confs');

        $path_to_config_file    = $rd_dir.$conf_dir.'/';
        $distro_file            = $path_to_config_file.$repo_name.'/'.$arch_name.'/distributions';

        $value_to_get = $this->Reprepro->_getConfigValue($distro_file,'Codename',$distro_name,'UDebComponents');

        if(count($value_to_get) >0){
            if(preg_match("/$distrocomp_name/",$value_to_get[0])){

                $json_return['comp']['updateInstaller']     = 'checked';
            }
        }
        //--------------------------------------------------------
        //---END Specific for the Reprepro component

        //---------------------------------------------------------------
        //Return a list of blacklisted packages (if any)
        $dcp_info['distrocomp']['name']     = $distrocomp_name;
        $dcp_info['distro']['name']         = $distro_name; 
        $dcp_info['arch']['name']           = $arch_name; 
        $dcp_info['repo']['name']           = $repo_name;
        $this->Locker->indexBlacklist($dcp_info);

        $json_return['comp']['bl']['data']['label']          = 'name';
        $json_return['comp']['bl']['data']['identifier']     = 'id';
        $json_return['comp']['bl']['data']['items']          = $this->Locker->indexBlacklist($dcp_info);
        //-----------------------------------------------------------------

        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);

       /*

        $value_to_get = $this->Reprepro->_getConfigValue('/var/repodepo/confs/CSIR-test/i386/distributions','Codename','hardy-updates','Description');
        print_r($value_to_get);

        $this->Reprepro->_setConfigValue('/var/repodepo/confs/CSIR-test/i386/distributions','Codename','hardy-updates','Description',array('Lekker soos hin krekker'));
        
        $value_to_get = $this->Reprepro->_getConfigValue('/var/repodepo/confs/CSIR-test/i386/distributions','Codename','hardy-updates','Description');
        print_r($value_to_get);
        */
    }


    function blDelete(){

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
                $this->Locker->removeLock($dcp_info); 
            } 
        }


        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);

    }

}
?>
