<?
class DistributionsController extends AppController {

    var $name       = 'Distributions';
    var $helpers    = array('Javascript');
    var $uses       =array('Distribution','Repoarch','Componenttype','Distrocomponent');
    var $scaffold;
    //var $components = array('Json');
    var $components = array('Reprepro', 'Session');


    function add(){
        $this->layout = 'ajax';
        //Get the Arch ID for $arch_name
       // print_r($this->params['form']);

        /*
                   [repoarchId] => 49814d77-fae8-42f4-bf24-2811ff6df9cd
                [distroName] => mm
                [distroOrigin] => 
                [distroLabel] => 
                [distroSuite] => 
                [distroVersion] => 
                [distroDescription] => 
                [distroSign] => on
        */
        CakeLog::write('notice', "REPODEPO: Gooi hom PAPPIE!!!");
        
        //Build the data structure
        $distro = array();
        $distro['Distribution']['id'] = '';
        $distro['Distribution']['name'] = $this->params['form']['distroName'];
        $distro['Distribution']['repoarch_id'] = $this->params['form']['repoarchId'];

        $this->Distribution->save($distro);
        $distro_id = $this->Distribution->id;

        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$this->params['form']['repoarchId']),'fields' =>array('Repository.name','Architecture.name')));
        $repo_name = $repoarch_ret['Repository']['name'];
        $arch_name = $repoarch_ret['Architecture']['name'];


        $distro = array();
        $distro['repo'] = $repo_name;
        $distro['arch'] = $arch_name;
        $distro['items']['Codename']            = array($this->params['form']['distroName']);
        $distro['items']['Architectures']       = array($arch_name);


        //---These are optionals - only list them if specified-----
        if($this->params['form']['distroOrigin'] != ''){
            $distro['items']['Origin']      = array($this->params['form']['distroOrigin']);
        }

        if($this->params['form']['distroLabel'] != ''){
            $distro['items']['Label']      = array($this->params['form']['distroLabel']);
        }

        if($this->params['form']['distroSuite'] !=''){
            $distro['items']['Suite']       = array($this->params['form']['distroSuite']);
        }

        if($this->params['form']['distroVersion'] !=''){
            $distro['items']['Version']     = array($this->params['form']['distroVersion']);
        }

        if($this->params['form']['distroDescription'] !=''){
            $distro['items']['Description'] = array($this->params['form']['distroDescription']);
        }

        if(array_key_exists('distroSign',$this->params['form'])){
            $distro['items']['SignWith'] = array('yes');
        }
        //---END OPTIONALS-----


        $base_dir   = Configure::read('Reprepro.base');
        $log        = $base_dir.Configure::read('Reprepro.logs');

            $log_file   = $log.'/'.$distro['repo'].'_'.$distro['arch'].'_'.$this->params['form']['distroName'].'.log';
            $log_script = $log.'/logs_wrapper.pl';

        $distro['items']['Log'] = array($log_file,$log_script);


        $this->Reprepro->distroAdd($distro);
        //---END Specific for the Reprepro component

        $json_return = array();
        $json_return['json']['status']    = 'ok';
        $json_return['distribution']['id']    = $distro_id;
        $json_return['distribution']['name']  = $this->params['form']['distroName'];
        $this->set('json_return',$json_return);
       
    }

    function info($distroId){

        $this->layout = 'ajax';

        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distroId),'fields'=>array('Repoarches.id','Distribution.name')));
        $ra_id        = $distro_ret['Repoarches']['id'];
        $distro_name  = $distro_ret['Distribution']['name'];
        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));
        $repo_name = $repoarch_ret['Repository']['name'];
        $arch_name = $repoarch_ret['Architecture']['name'];

        $distro = array();
        $distro['repo'] = $repo_name;
        $distro['arch'] = $arch_name;
        $distro['items']['Codename']    = array($distro_name);

        $di = $this->Reprepro->distroInfo($distro);

        $form_comps = Configure::read('Reprepro.form_edit_components');

        $json_return = array();
        $json_return['json']['status']    = 'ok';

        foreach($form_comps as $c){

            if(array_key_exists("$c",$di)){
                $json_return['distro']["$c"]    = $di["$c"][0];
            }else{
                $json_return['distro']["$c"]    = '';
            }
        }

        if(array_key_exists("SignWith",$di)){
            $json_return['distro']['SignWith']    = 'checked';
        }else{
            $json_return['distro']['SignWith']    = '';
        }

        $this->set('json_return',$json_return);
    }

    function del($distro_id){

        $this->layout = 'ajax';
        

        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distro_id),'fields'=>array('Repoarches.id','Distribution.name')));
        $ra_id        = $distro_ret['Repoarches']['id'];
        $distro_name  = $distro_ret['Distribution']['name'];
        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));
        $repo_name = $repoarch_ret['Repository']['name'];
        $arch_name = $repoarch_ret['Architecture']['name'];
        
        //---END Specific for the Reprepro component

        $this->Distribution->del($distro_id);

        $distro = array();
        $distro['repo'] = $repo_name;
        $distro['arch'] = $arch_name;
        $distro['items']['Codename']    = array($distro_name);

        $this->Reprepro->distroDel($distro);

        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);

    }

    function edit(){

        $this->layout = 'ajax';

        $distro_id = $this->params['form']['distroId'];

        //----Specific for the Reprepro component---
        //Get the repository name + arch of the repoarch
        $distro_ret   = $this->Distribution->find('first',array('conditions'=>array('Distribution.id' =>$distro_id),'fields'=>array('Repoarches.id','Distribution.name')));
        $ra_id        = $distro_ret['Repoarches']['id'];
        $distro_name  = $distro_ret['Distribution']['name'];
        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$ra_id),'fields' =>array('Repository.name','Architecture.name')));
        $repo_name = $repoarch_ret['Repository']['name'];
        $arch_name = $repoarch_ret['Architecture']['name'];

        $distro = array();
        $distro['repo'] = $repo_name;
        $distro['arch'] = $arch_name;
        $distro['items']['Codename']    = array($distro_name);

        //---These are optionals - only list them if specified-----
        if($this->params['form']['distroOrigin'] != ''){
            $distro['items']['Origin']      = array($this->params['form']['distroOrigin']);
        }

        if($this->params['form']['distroLabel'] != ''){
            $distro['items']['Label']      = array($this->params['form']['distroLabel']);
        }

        if($this->params['form']['distroSuite'] !=''){
            $distro['items']['Suite']       = array($this->params['form']['distroSuite']);
        }

        if($this->params['form']['distroVersion'] !=''){
            $distro['items']['Version']     = array($this->params['form']['distroVersion']);
        }

        if($this->params['form']['distroDescription'] !=''){
            $distro['items']['Description'] = array($this->params['form']['distroDescription']);
        }

        if(array_key_exists('distroSign',$this->params['form'])){
            $distro['items']['SignWith'] = array('yes');
        }
        //---END OPTIONALS-----

        $this->Reprepro->distroEdit($distro);
        //print_r($distro);

        //---END Specific for the Reprepro component

        $json_return = array();
        $json_return['json']['status']    = 'ok';
        $this->set('json_return',$json_return);
    }


}
?>
