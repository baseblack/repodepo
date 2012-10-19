<?
class ArchitecturesController extends AppController {

    var $name       = 'Architectures';
    var $helpers    = array('Javascript');
    var $scaffold;
    //var $components = array('Json');

    function index(){

        $this->layout = 'ajax';

        $json_return = array();

        $r = $this->Architecture->find('all',array('fields'=>array('Architecture.name','Architecture.id')));
        $json_return['json']['status']    = 'ok'; 
        $json_return['label']             = 'name';
        $json_return['identifier']        = 'id';
        $json_return['items']             = array();

        foreach($r as $entry){
            array_push($json_return['items'],$entry['Architecture']);
        }
        $this->set('json_return',$json_return);

    }

}
?>
