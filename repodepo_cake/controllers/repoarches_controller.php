<?
class RepoarchesController extends AppController {

    var $name       = 'Repoarches';
    var $helpers    = array('Javascript');
    var $uses       =array('Repoarch','Architecture','Repository');
    var $scaffold;
    var $components = array('Reprepro', 'Session');
    //var $components = array('Json');


    function add($repo_id,$arch_name){
        $this->layout = 'ajax';
        //Get the Arch ID for $arch_name
        $arch_ret = $this->Architecture->find('first',array('conditions'=>array('Architecture.name' =>$arch_name),'fields'=>array('Architecture.id')));
        $arch_id  = $arch_ret['Architecture']['id'];

        //Get the name of the repository
        $repo_ret   = $this->Repository->find('first',array('conditions'=>array('Repository.id' =>$repo_id),'fields'=>array('Repository.name')));
        $repo_name  = $repo_ret['Repository']['name'];

        //Build the data structure
        $repoArch = array();
        $repoArch['Repoarch']['id'] = '';
        $repoArch['Repoarch']['repository_id'] = $repo_id;
        $repoArch['Repoarch']['architecture_id'] = $arch_id;

        $this->Repoarch->save($repoArch);
        $repoArch_id = $this->Repoarch->id;

        $this->Reprepro->archAdd($repo_name,$arch_name);

        $json_return['json']['status']      = 'ok';
        $json_return['repoarch']['id']    = $repoArch_id;

        $this->set('json_return',$json_return);
    }

    function del($repoarch_id){

        $this->layout = 'ajax';

        //Get the name of the repository and the arhitecture
        $repoarch_ret   = $this->Repoarch->find('first',array('conditions'=>array('Repoarch.id' =>$repoarch_id),'fields' =>array('Repository.name','Architecture.name')));

        $repo_name = $repoarch_ret['Repository']['name'];
        $arch_name = $repoarch_ret['Architecture']['name'];

        $this->Repoarch->del($repoarch_id);
        $this->Reprepro->archDel($repo_name,$arch_name);

        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);

    }

}
?>
