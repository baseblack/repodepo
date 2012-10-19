<?
class UsersController extends AppController {
    var $name = 'Users';
    var $scaffold;

    function beforeFilter() {

       $this->Auth->allow('json_login_check','json_login');
       $this->Auth->logoutRedirect = '/users/json_login_check';

    }

    function login(){

        if(!(empty($this->data))) {
            $this->Session->write('dirk',$this->data);
            $this->set('one',$this->data); 
        }
        $this->set('one',$this->data); 

    }

    function json_login(){

        $this->layout = 'ajax'; //To send JSON from the web server
        $json_return = array();

        if(isset($this->params['form']['Username']) & isset($this->params['form']['Password'])){    //Verify we were called the right way
          
            $data['User']['username'] = $this->params['form']['Username'];
            $data['User']['password'] = $this->params['form']['Password'];
            //The hashPasswords method require that $data['User']['username'] AND $data['User']['password'] be defined in the argument
            $hashedPasswords = $this->Auth->hashPasswords($data);
            if($this->Auth->login($hashedPasswords)){   //The way to do Ajax logins
                
                $json_return['json']['status']  = 'ok';
                $json_return['user']            = $this->Auth->user();
                $this->set('json_return',$json_return);
            }else{
                $json_return['json']['status']  = 'error';
                $json_return['json']['detail']  = 'Authentication Failure';
                $this->set('json_return',$json_return);
            }
        }else{
            //Not called the correct way - Inform the user
            $json_return['json']['status']  = 'error';
            $json_return['json']['detail']  = 'HTML Form POST Data Missing';
            $this->set('json_return',$json_return);
        }
    }

    function json_login_check(){

        $this->layout = 'ajax';                     //To send JSON from the web server
        $json_return = array();
        $json_return['json']['status']  = 'ok';     //Not much can go wrong here :)!

        $auth = $this->Auth->user();
        if($auth['User']){
            $json_return['authenticated']   = true;
        }else{
            $json_return['authenticated']   = false;
        }
        $this->set('json_return',$json_return);
    }

     function logout() {

        //This will log the user out and auto-redirect to the json_login_check page
        //$this->Auth->logoutRedirect = '/users/json_login_check';
        $this->Session->del('AuthInfo');
        $this->redirect($this->Auth->logout());
    }

}
?>
