dojo.provide("content.ConfigureRoot");
dojo.require("dijit.form.Form");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");

dojo.require("components.QForms");
dojo.require("components.Const");

dojo.require("dijit.Dialog");



(function(){
    var cc= content.ConfigureRoot;

    var urlRepoAdd          = components.Const.cake+'repositories/add';
    var urlRepoDelete       = components.Const.cake+'repositories/del/';
    var urlRepoArch         = components.Const.cake+'architectures/?';
   
   

    cc.meatRoot = function(){
        dojo.byId("contentConfigureMeat").innerHTML = '';

        if(dijit.byId('frmRepoAdd') != undefined){

            dijit.byId('frmRepoAdd').destroyDescendants(true);
            dijit.byId('frmRepoAdd').destroy(true);
        }

        var frmRepoAdd    = new dijit.form.Form({id:"frmRepoAdd",jsId:"frmRepoAdd", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
        dojo.place(frmRepoAdd.domNode,dojo.byId("contentConfigureMeat"));

            var divRoot  = document.createElement('div');
            dojo.addClass(divRoot, 'divTabForm');

                var logo = new Image();
                            logo.id  = "contentBannerLogo";
                            logo.src = "img/actions/new_48.png";
                            logo.align="left";
                        dojo.place(logo,divRoot);

                components.QForms.addHeading({size:2,content:"New Repository",divToAdd: divRoot});
                components.QForms.addPair({label:'Repository Name',divToAdd: divRoot,inpName:'repoName',inpRequired:true, isLast:true});

                var btnRepoAdd = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon",id:'btnRepoAdd'},document.createElement("div"));
                dojo.place(btnRepoAdd.domNode,divRoot);

                dojo.connect(btnRepoAdd,'onClick',function(){

                    if(frmRepoAdd.validate()){
                        console.log("Valid Form, add Repository....");
                        //Add this via a AJAX Call
                        dojo.xhrPost({
                        url: urlRepoAdd,
                        form: dojo.byId('frmRepoAdd'),
                        handleAs: "json",
                        load: function(response){
                                if(response.json.status == 'ok'){
                                   var repoName = response.repository.name;
                                   var newItem  = content.Trees.confStore.newItem({
                                        id :response.repository.id,
                                        name : response.repository.name,
                                        type : "repo"
                                    });
                                    content.Trees.confStore.save();
                                   // var content = "<div class='divToast'><h1>"+repoName+" Added</h1><img src='img/actions/new_48.png' /></div>";
                                   // dijit.byId('componentsMainToaster').setContent(content,'message',5000); 
                                
                                }

                                if(response.json.status == 'error'){

                                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                }

                                dojo.byId('frmRepoAdd').reset();
                             }
                            });
                  
                    }else{
                        console.log("Please Enter Valid Values.....");
                    }
                });

            dojo.place(divRoot,frmRepoAdd.domNode);
    }


   

    cc.repoDelete = function(id){

       
        dlgConfirm = new dijit.Dialog({
            title: "Confirm Action",
            style: "width: 300px"
        });
        var divConfirm      = document.createElement('div');
            var divMessage  = document.createElement('div');
            divMessage.innerHTML = '<b>Warning!</b><br>Are you sure you want to continue with your action?';
            var divActions  = document.createElement('div');
               
                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,divActions);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,divActions);

                dojo.connect(btnNo,'onClick',function(){

                    dlgConfirm.destroyDescendants();
                    dlgConfirm.destroy();
                })

                dojo.connect(btnYes,'onClick',function(){

                    dojo.xhrGet({
                        url: urlRepoDelete+id,
                        preventCache: true,
                        handleAs: "json",
                        load: function(response){
                            if(response.json.status == 'ok'){ 

                                console.log('Remove the item from the datastore...');
                                content.Trees.confStore.fetchItemByIdentity({
                                    identity : id,
                                    onItem : function(item, request) {
                                        var delRepo = item;
                                        content.Trees.confStore.deleteItem(delRepo);
                                        content.Trees.confStore.save();
                                        //Clear the previous meat
                                        dojo.byId("contentConfigureMeat").innerHTML = '';

                                        //Destroy the previous frmRepoEdit form
                                        if(dijit.byId('frmRepoEdit') != undefined){
                                            dijit.byId('frmRepoEdit').destroyDescendants(true);
                                            dijit.byId('frmRepoEdit').destroy(true);
                                        }
                                    }
                                });

                            }
                        }
                    });

                    
                    dlgConfirm.destroyDescendants();
                    dlgConfirm.destroy();
                })



        dojo.place(divMessage,divConfirm); 
        dojo.place(divActions,divConfirm);

        dlgConfirm.attr("content", divConfirm);
        dlgConfirm.show();
    }

    cc.archAdd = function(id){

        console.log('Add Architecture for... ' + id);

        dlgArch = new dijit.Dialog({
            title: "Add Architecture",
            style: "width: 400px"
        });

        var divArch = document.createElement('div');
            var divMessage  = document.createElement('div');
                var ts = Number(new Date());
                components.QForms.addComboBox({label:'Architectures',url: urlRepoArch+ts,divToAdd: divMessage,inpName:'Arch',inpRequired:true,isLast:true,searchAttr: 'name',id:'ContentConfigureArch'});

            var divActions  = document.createElement('div');
                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,divActions);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,divActions);

                dojo.connect(btnNo,'onClick',function(){

                    dlgArch.destroyDescendants();
                    dlgArch.destroy();
                    dijit.byId('ContentConfigureArch').destroy();
                });

                dojo.connect(btnYes,'onClick',function(){

                    content.Trees.confStore.fetchItemByIdentity({
                        identity : id,
                        onItem : function(item, request) {
                                    console.log('Add item architecture....!!!');
                                    var selArchVal = dijit.byId('ContentConfigureArch').getDisplayedValue();
                                    //First check if it is not already defined
                                    var itemChildren = content.Trees.confStore.getValues(item, "children");
                                    dojo.forEach(itemChildren, function(x) {
                                        var existing_name = content.Trees.confStore.getValue(x, "name");
                                        console.log('Existing Name'+existing_name+' Sel Value ' + selArchVal);
                                    });
                                    var dt = new Date();
                                    var newItem  = content.Trees.confStore.newItem({
                                                    id : dt,
                                                    name : dt,
                                                    type : 'arch'
                                                    },{parent: item,attribute:'children'});
                                                    content.Trees.confStore.save();
                                }
                    });
                    dlgArch.destroyDescendants();
                    dlgArch.destroy();
                    dijit.byId('ContentConfigureArch').destroy();
                });

        dojo.place(divMessage,divArch); 
        dojo.place(divActions,divArch);

        dlgArch.attr("content", divArch);
        dlgArch.show();
    }
})();//(function(){