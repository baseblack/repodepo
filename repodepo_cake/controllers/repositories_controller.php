<?
class RepositoriesController extends AppController {

    var $name       = 'Repositories';
    var $helpers    = array('Javascript');
    var $uses       = array('Repository','Repoarch','Architecture','Distribution','Distrocomponent');
    var $scaffold;
    var $components = array('Reprepro', 'Session');

    //var $components = array('Json');

    function index($ra_only = false){
        $this->layout = 'ajax';
        $repositories_db = $this->Repository->find('all',array('fields'=>array('Repository.id','Repository.name')));
        //Check if there is a folder for each repository
        $repositories   = $this->_check_dir_for_repo($repositories_db,$ra_only);

        $json_return = array();
        $json_return['label']      = 'name';
        $json_return['identifier'] = 'id';
        $json_return['items']      = $repositories;

        $this->set('json_return',$json_return);
    }

    function add(){
        $this->layout = 'ajax';
        $json_return = array();

        $repository_name   = $this->params['form']['repoName'];

        $r = array();
        $r['Repository']['id']           = '';
        $r['Repository']['name']         = $repository_name;

        $this->Repository->save($r);
        $repo_id = $this->Repository->id;
        $this->Reprepro->repoAdd($repository_name);

        $json_return['json']['status']      = 'ok';
        $json_return['repository']['id']    = $repo_id;
        $json_return['repository']['name']  = $repository_name;

        $this->set('json_return',$json_return);
    }

    /*
    function index(){

        $this->layout = 'ajax';
        $repositories = $this->_list_repositories();
        print_r($repositories);
    }
    

    function add($name){
        $this->layout = 'ajax';
        $this->_add_repository($name);
    }
    */

    function del($id){
        $this->layout = 'ajax';

        //Get the name for this id
        $name_q = $this->Repository->find('first',array('conditions' => array('Repository.id' => $id),'fields'=>array('Repository.name')));
    
        $this->Repository->del($id);
        $name = $name_q['Repository']['name'];
        $this->Reprepro->repoDel($name);

        $json_return['json']['status']      = 'ok';
        $this->set('json_return',$json_return);
    }

    function edit(){

        $this->layout = 'ajax';
        $id     = $this->params['form']['repId'];
        $repository_name   = $this->params['form']['repName'];

        //We first need to get the old name of the repository
        $name_q     = $this->Repository->find('first',array('conditions' => array('Repository.id' => $id),'fields'=>array('Repository.name')));
        $oldName    = $name_q['Repository']['name'];
        

        $r = array();
        $r['Repository']['id']           = $id;
        $r['Repository']['name']         = $repository_name;
        $this->Repository->save($r);
        $this->Reprepro->repoRename($oldName,$repository_name);

        $json_return['json']['status']      = 'ok';
        $json_return['repository']['id']    = $id;
        $json_return['repository']['name']  = $repository_name;
        $this->set('json_return',$json_return);

    }

    function _check_dir_for_repo($repositories_db,$only_ra = false){
        $repositories = array();
        $repo_dir   = '/var/repodepo/confs/';
        foreach($repositories_db as $repo){
            $id     = $repo['Repository']['id'];
            $name   = $repo['Repository']['name'];
           // if(file_exists($repo_dir.$name)){
                //Get the children for this repository
                $children =$this->_get_arches($id,$only_ra);
                array_push($repositories, array('id'=>$id,'name'=>$name,'type'=>'repo','children' => $children));
           // }
        }
        return $repositories;
    }

    function _get_arches($id,$only_ra = false){

        $returnArray = array();
        $repoArch   = $this->Repoarch->find('all',array('conditions' =>array('Repoarch.repository_id' =>$id),'fields'=>array('Repoarch.id','Architecture.name')));
        foreach($repoArch as $line){

            $repoArchId = $line['Repoarch']['id'];
            $archName   = $line['Architecture']['name'];
            $children = array();
            if(!$only_ra){
                $children   = $this->_get_distros_for_repoarch($repoArchId);
            }
            array_push($returnArray,array('id' => $repoArchId,'name' => $archName,'type'=> 'arch','children' => $children));
        }

        return $returnArray;
       // print_r($repoArch);

    }

    function _get_distros_for_repoarch($repoArchId){

        $returnArray = array();
        $distros = $this->Distribution->find('all',array('fields' =>array('Distribution.id','Distribution.name'),'conditions' => array('Distribution.repoarch_id' => $repoArchId)));
        foreach($distros as $line){

            $distroId   = $line['Distribution']['id'];
            $distroName = $line['Distribution']['name'];
            $children   = $this->_get_distrocomponents_for_distro($distroId);
            array_push($returnArray,array('id' => $distroId, 'name' => $distroName, 'type' => 'release', 'children' => $children));

        }

        return $returnArray;
    }

    function _get_distrocomponents_for_distro($distroId){

        $returnArray = array();
        $distrocomps = $this->Distrocomponent->find('all',array('fields' =>array('Distrocomponent.id','Componenttype.name'),'conditions' => array('Distrocomponent.distribution_id' => $distroId)));
       // print_r($distroId);
        foreach($distrocomps as $line){

            $distrocompId   = $line['Distrocomponent']['id'];
            $componentName  = $line['Componenttype']['name'];
            array_push($returnArray,array('id' => $distrocompId, 'name' => $componentName, 'type' => 'comp'));

        }
       // print_r($returnArray);
        return $returnArray;

    }

    function _list_repositories(){

        $pp_dir     = '/var/repodepo/';
        $confs_dir  = $pp_dir.'confs';
        $dbs_dir    = $pp_dir.'dbs';
        $dists_dir  = $pp_dir.'dists';

        // open this directory 
        $myDirectory = opendir($confs_dir);

        // get each entry
        while($entryName = readdir($myDirectory)) {
            if(!preg_match('/^\./',$entryName)){ 
                $dirArray[] = $entryName;
            }
        }
        // close directory
        closedir($myDirectory);
        return $dirArray;
    }
}
?>
