<?

class NasOrdersController extends NasAppController {
    var $name = 'NasOrders';
    var $uses = array('Nas.NasOrder');



       function beforeFilter() {

       // $this->Auth->allow('register');
        //$this->Auth->logoutRedirect = '/';  
        //Set the default redirect for users who login  
        //$this->Auth->loginRedirect = '/';
        //$this->Auth->loginAction = '/jan/koos/';
         $this->Auth->loginAction = array(
                'admin' => false,
                'plugin' => null,
                'controller' => 'users',
                'action' => 'login'
        );


    }



    function index() {

    }
}

?>
