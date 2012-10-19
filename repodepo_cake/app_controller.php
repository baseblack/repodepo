<?

class AppController extends Controller {
    /**
     * components
     * 
     * Array of components to load for every controller in the application
     * 
     * @var $components array
     * @access public
     */
    var $components = array('Auth');
    #var $uses = array('Group','User','Realm');
    var $uses = array('User');
    //var $helpers = array('Form','Html', 'Javascript');
    /**
     * beforeFilter
     * 
     * Application hook which runs prior to each controller action
     * 
     * @access public 
     */
    function beforeFilter() {

        $this->Auth->allow('register');
        //$this->Auth->logoutRedirect = '/';  
        //Set the default redirect for users who login  
        //$this->Auth->loginRedirect = '/';
       // $this->Auth->loginAction = '/jan/koos/';
       //  $this->Auth->loginAction = array(
       //         'admin' => false,
       //         'plugin' => null,
        //        'controller' => 'usrs',
       //         'action' => 'lgin'
      //  );

        //-----------------------------------------------------------
        //--Load configuration variables ----
        Configure::load('reprepro');
        //-----------------------------------------------------------

    }

    function beforeRender(){

        if($this->Auth->user()){

            //We are logged in, but is the AuthInfo populated already?
            if(!$this->Session->check('AuthInfo')){
                $this->_populate_authinfo();
            }

        }
    }


    function _populate_authinfo(){

        $auth_info = array();

        //Get the role the user belongs to
        $user       = $this->Auth->user();
        $u                   = $this->Auth->user();
        $auth_info['User']   = $u['User'];
        $this->Session->write('AuthInfo',$auth_info);
    }

}

?>
