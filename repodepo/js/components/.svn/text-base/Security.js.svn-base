dojo.provide("components.Security");
dojo.require("dijit.form.Button");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.ValidationTextBox");

dojo.require('components.Const');
dojo.require('components.QForms');
//---------------------------------------------------------------------------------
//--This Security component will become the most important component--------------
//--of our application - It will create the main view if already authenticated----
//--or will pop up a login box if not---------------------------------------------
//--------------------------------------------------------------------------------
(function(){

    var cs                  = components.Security;
    var urlUsersLoginCheck  = components.Const.cake+'users/json_login_check';
    var urlUsersLogin       = components.Const.cake+'users/json_login';
    var urlUsersLogout      = components.Const.cake+'users/logout';

    cs.dialog       = function(){
        console.debug("Dialog Creation");
        var dlgLogin = new dijit.Dialog({
                        id: 'componentsSecuritydlgLogin',
                        draggable: false,
                        title: "Authenticate Please",
                        style: "width: 400px"
                    },document.createElement("div"));
                        _populateDialog(dlgLogin);

        //Avoid the ESC response
        dojo.connect(dojo.body(), 'onkeypress', function(evt) {
            key = evt.keyCode;
            if (key == dojo.keys.ESCAPE) {
                if(dijit.byId('componentsSecuritydlgLogin').open){
                    dojo.stopEvent(evt);
                }
            };

            if (key == dojo.keys.ENTER){
                if(dijit.byId('componentsSecuritydlgLogin').open){
                    if(dijit.byId('componentsSecuritydlgLogin').validate()){
                        console.log("Valid input ...try and log in");
                        _authenticate();
                    }
                }
            }
        });
        //Display the dialog
        dlgLogin.show();
    };

    cs.isLoggedin   = function(){

                        console.debug("Check if we are logged in");
                        dojo.xhrGet({
                            handleAs: 'json',
                            preventCache: true,
                            url: urlUsersLoginCheck ,
                            load: function(response){
                                            console.log(response.json.status);
                                            if(response.authenticated == false){
                                                console.log("User in NOT logged in");
                                                cs.dialog();
                                               // dijit.byId('componentsSecuritydlgLogin').show();
                                            }else{
                                                console.log("User is logged in");
                                                dojo.require("components.Main");
                                                dojo.addOnLoad(function(){
                                                    components.Main.startUp();
                                                });
                                            }
                                    },
                            error: function(error){
                                            console.log(error.message);
                                   }
                        });
                   };

    cs.Logout   = function(){
                //console.debug("Log User Out");
                dojo.xhrGet({
                            handleAs: 'json',
                            preventCache: true,
                            url: urlUsersLogout ,
                            load: function(response){
                                            console.log(response.json.status);
                                            cs.UserInfo = response;
                                            dojo.style(dojo.byId("componentsMainNavigator"),'visibility','hidden');
                                            dojo.style(dojo.byId("componentsMainWorkspace"),'visibility','hidden');
                                            cs.dialog();


                                    },
                            error: function(error){
                                            console.log(error.message);
                                   }
                        });
                };

    //Private functions
    function _populateDialog(dialog){

        var divLogIn    = document.createElement("div");
            var divLogInFeedback = document.createElement("div");
            divLogInFeedback.id  = 'componentSecurityFeedback';
        dojo.place(divLogInFeedback,divLogIn);

            components.QForms.addPair({label:'Username',divToAdd: divLogIn,inpName:'Username',inpRequired:true, isLast:false, id:'componentSecurityUsername'});
            components.QForms.addPair({label:'Password',divToAdd: divLogIn,inpName:'Password',inpRequired:true, isLast:true, pw:true, id:'componentSecurityPassword'});

            var btnClear = new dijit.form.Button({style:"margin:10px; margin-left:1px;",label:'Clear',iconClass:"clearIcon"},document.createElement("div"));
            dojo.connect(btnClear,"onClick",function(e){
                console.log('Clear form');
                dijit.byId('componentSecurityUsername').attr('value','');
                dijit.byId('componentSecurityPassword').attr('value','');
                dojo.byId('componentSecurityFeedback').innerHTML = "";
            });

        dojo.place(btnClear.domNode,divLogIn);

            var btnOk = new dijit.form.Button({style:"margin:10px; margin-left:1px;",label:'OK',iconClass:"okIcon"},document.createElement("div"));
            dojo.connect(btnOk,"onClick",function(e){
                if(dijit.byId('componentsSecuritydlgLogin').validate()){
                    console.log("Valid input ...try and log in");
                    _authenticate();
                    
                }
            });

        dojo.place(btnOk.domNode,divLogIn);

        dialog.attr("content", divLogIn);   //Add the div with its content to the dialog
    }

    function _authenticate(){
        var user_info = dijit.byId('componentsSecuritydlgLogin').attr('value');
        //dijit.byId('componentsSecuritydlgLogin').hide();
        dojo.xhrPost({
            url: urlUsersLogin,
            handleAs: 'json',
            content: { Username: user_info.Username,Password: user_info.Password },
            load:   function(response){
                         if(response.json.status == 'error'){
                                                 dojo.byId('componentSecurityFeedback').innerHTML = "Authentication Failed";
                                                 dijit.byId('componentsSecuritydlgLogin').show();
                                             };
                         if(response.json.status == 'ok'){
                                                dijit.byId('componentsSecuritydlgLogin').reset();
                                                if(dijit.byId('componentsSecuritydlgLogin') != undefined){
                                                    dijit.byId('componentsSecuritydlgLogin').destroyRecursive(false);
                                                    dijit.byId('componentSecurityUsername').destroyRecursive(false);
                                                    dijit.byId('componentSecurityPassword').destroyRecursive(false);
                                                }
                                                //dijit.byId('componentsSecuritydlgLogin').destroy();
                                                if(dojo.byId("componentsMainNavigator")==undefined){    //If this is a claen start
                                                    dojo.require("components.Main");
                                                    dojo.addOnLoad(function(){
                                                        components.Main.startUp();
                                                    });
                                                }else{
                                                    dojo.style(dojo.byId("componentsMainNavigator"),'visibility','visible');
                                                    dojo.style(dojo.byId("componentsMainWorkspace"),'visibility','visible');
                                                }
                                             };
                    },
            error:  function(error){
                        console.log(error);
                        dojo.byId('componentSecurityFeedback').innerHTML = "Authentication Failed: "+ error.message;
                    }
        });
    }

})();