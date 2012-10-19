dojo.provide("content.Configure.Repo");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("components.QForms");
dojo.require("components.Const");
/*
---------------------------------------------------------------------------
---- Content.Configure.Repo -----------------------------------------------
---------------------------------------------------------------------------
--Function: Modify existing repositories in the tree (rename/delete/add arch) --
-- Important 'global' resources: --
-- 'contentConfigureMeat' => The Div containing the feedback of the tree node selected --
-- 'frmRepoEdit' the form used to rename the repository --
-- 'ContentConfigureArch' => select value of the arch
-- 'content.Trees.confStore' the write store for the repositories config tree --
--------------------------------------------------------------------------
*/

(function(){

    var ccr             = content.Configure.Repo;
    var urlRepoEdit     = components.Const.cake+'repositories/edit';
    var urlRepoDelete   = components.Const.cake+'repositories/del/';
    var urlArchAdd      = components.Const.cake+'repoarches/add/';
    var urlArchList     = components.Const.cake+'architectures';

    ccr.meatRepo = function(repoId,repoName){

        //----Prepare the feeback div--
        dojo.byId("contentConfigureMeat").innerHTML = '';

        //Destroy the previous frmRepoEdit form
        if(dijit.byId('frmRepoEdit') != undefined){
            dijit.byId('frmRepoEdit').destroyDescendants(true);
            dijit.byId('frmRepoEdit').destroy(true);
        }

        if(dijit.byId('btnRepoEdit') != undefined){
            dijit.byId('btnRepoEdit').destroyDescendants(true);
            dijit.byId('btnRepoEdit').destroy(true);
        }

        //--End of prepare feedback div--

        //Create a new from element to edit a repository--
        var frmRepoEdit    = new dijit.form.Form({id:"frmRepoEdit",jsId:"frmRepoEdit", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
        dojo.place(frmRepoEdit.domNode,dojo.byId("contentConfigureMeat"));

            var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
            hiddenId.type   = "hidden";
            hiddenId.name   = "repId";
            hiddenId.value  = repoId;
            dojo.place(hiddenId,frmRepoEdit.domNode);

            var divRepo  = document.createElement('div');
            dojo.addClass(divRepo, 'divTabForm');
                var logo = new Image();
                logo.id  = "contentBannerLogo";
                logo.src = "img/actions/repo_48.png";
                logo.align="left";
            dojo.place(logo,divRepo);

                //Add the action stuff
                var divActions = document.createElement("div");
                    dojo.addClass(divActions, "divActions"); 
                    components.QForms.addAction({Name:'Delete Repository',   Type:'delete',  Parent: divActions,Action:ccr.repoDelete,Id:repoId});
                    components.QForms.addAction({Name:'Add Architecture',    Type:'add',     Parent: divActions,Action:ccr.archAdd,Id:repoId});
            dojo.place(divActions,divRepo);

                components.QForms.addHeading({size:2,content:"Edit Repository",divToAdd: divRepo});

                    var lbl =document.createElement('label');
                    var txt=document.createTextNode('Repository Name');
                    lbl.appendChild(txt);
            dojo.place(lbl,divRepo);
                    var inp = new dijit.form.ValidationTextBox({ name:'repName',required:true,intermediateChanges:true,value:repoName},document.createElement("div"));
            dojo.place(inp.domNode,divRepo);

                    var br2=document.createElement('BR');
            dojo.place(br2,divRepo);

                var btnRepoEdit = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Save',iconClass:"saveIcon",id:'btnRepoEdit',disabled:'disabled'},document.createElement("div"));
                dojo.place(btnRepoEdit.domNode,divRepo);

                dojo.connect(inp,'onChange',function(){
                            btnRepoEdit.attr('disabled',false);
                });

                //--------------------------------------------------------------------
                //--Action on button click--
                dojo.connect(btnRepoEdit, 'onClick', function(){

                    console.log("Update the Repo name");
                    if(frmRepoEdit.validate()){
                        console.log("Valid Form, change Repository....");
                        //Add this via a AJAX Call
                        dojo.xhrPost({
                        url: urlRepoEdit,
                        form: dojo.byId('frmRepoEdit'),
                        handleAs: "json",
                        load: function(response){
                                if(response.json.status == 'ok'){
                                    content.Trees.confStore.fetchItemByIdentity({
                                        identity: repoId,
                                        onItem : function(item, request) {
                                                    var newName = response.repository.name;
                                                    var itemEdit = item;;
                                                    content.Trees.confStore.setValue(itemEdit, "name", newName);
                                                    content.Trees.confStore.save();
                                                    btnRepoEdit.attr('disabled',true);
                                                    dijit.byId('componentsMainToaster').setContent('Repository updated','message',components.Const.toasterInfo);
                                        }
                                    });
                                }

                                if(response.json.status == 'error'){
                                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                }
                             }
                            });
                  
                    }else{
                        console.log("Please Enter Valid Values.....");
                    }
                });
                //--END Action on Button Click--
                //--------------------------------------------------------------------------

            dojo.place(divRepo,frmRepoEdit.domNode);
    }

    ccr.repoDelete = function(id){

        components.QForms.deleteConfirm({url:urlRepoDelete,id: id,description:'Repository deleted'});
    }

    ccr.archAdd = function(id){

        console.log('Add Architecture for... ' + id);

        dlgArch = new dijit.Dialog({
            title: "Add Architecture",
            style: "width: 400px"
        });

        var divArch = document.createElement('div');
            var divMessage  = document.createElement('div');
                components.QForms.addComboBox({label:'Architectures',url: urlArchList,divToAdd: divMessage,inpName:'Arch',inpRequired:true,isLast:true,searchAttr: 'name',id:'ContentConfigureArch'});

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

                    //First we nee to verify that a value was selected
                    var dispVal =dijit.byId('ContentConfigureArch').getDisplayedValue();
                    if(dispVal == ''){

                        dijit.byId('componentsMainToaster').setContent('Invalid architecture selection','error',components.Const.toasterError);
                        return;
                    }
                    

                    content.Trees.confStore.fetchItemByIdentity({
                        identity : id,
                        onItem : function(item, request) {
                                    console.log('Add item architecture');
                                    var selArchVal = dijit.byId('ContentConfigureArch').getDisplayedValue();
                                    //First check if it is not already defined
                                    var flagDefined = false;
                                    var itemChildren = content.Trees.confStore.getValues(item, "children");
                                    dojo.forEach(itemChildren, function(x) {
                                        var existing_name = content.Trees.confStore.getValue(x, "name");
                                        if(existing_name == selArchVal){
                                            dijit.byId('componentsMainToaster').setContent('Architecture already defined','error',components.Const.toasterError);
                                            flagDefined = true;
                                            return; //we already have this architecture 
                                        }
                                        console.log('Existing Name'+existing_name+' Sel Value ' + selArchVal);
                                    });
                                    if(flagDefined != true){
                                        //Add a new architecture for this repository
                                        dojo.xhrGet({
                                                        url: urlArchAdd+id+'/'+selArchVal,
                                                        preventCache: true,
                                                        handleAs: "json",
                                                        load: function(response){
                                                                    if(response.json.status == 'ok'){ 
                                                                        console.log('Add architecture to datastore');
                                                                        var archId = response.repoarch.id;
                                                                        var newItem  = content.Trees.confStore.newItem({
                                                                                            id : archId,
                                                                                            name : selArchVal,
                                                                                            type : 'arch'
                                                                                        },{parent: item,attribute:'children'});
                                                                                        content.Trees.confStore.save();
                                                                                        dijit.byId('componentsMainToaster').setContent('Architecture added','message',components.Const.toasterInfo);
                                                                    }
                                                    }
                                        });
                                    }
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