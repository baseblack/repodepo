dojo.provide("content.Configure.Arch");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("components.QForms");
dojo.require("components.Const");
/*
---------------------------------------------------------------------------
---- Content.Configure.Arch -----------------------------------------------
---------------------------------------------------------------------------
--Function: Add a Distribution / Delete an Architecture --
-- Important 'global' resources: --
-- 'contentConfigureMeat' => The Div containing the feedback of the tree node selected --
-- 'content.Trees.confStore' the write store for the repositories tree --
--------------------------------------------------------------------------
*/

(function(){

    var cca= content.Configure.Arch;
    var urlArchDel      = components.Const.cake+'repoarches/del/';
    var urlDistroAdd    = components.Const.cake+'distributions/add';

    cca.meatArchitecture = function(archId,archName){

        dojo.byId("contentConfigureMeat").innerHTML = 'Gooi Hom!';

            var divArch  = document.createElement('div');
            dojo.addClass(divArch, 'divTabForm');

                 var logo = new Image();
                            logo.id  = "contentBannerLogo";
                            logo.src = "img/actions/arch_48.png";
                            logo.align="left";
                        dojo.place(logo,divArch);

                var divActions = document.createElement("div");
                dojo.addClass(divActions, "divActions");
                    //Add the action stuff
                    components.QForms.addAction({Name:'Delete Architecture',   Type:'delete',  Parent: divActions,Action:cca.archDelete,Id:archId});
                    components.QForms.addAction({Name:'Add Distribution',     Type:'add',     Parent: divActions,Action:cca.distroAdd,Id:archId});
            dojo.place(divActions,divArch);
            components.QForms.addHeading({size:2,content:"Edit Architecture",divToAdd: divArch});
            dojo.place(divArch,dojo.byId("contentConfigureMeat"));

        
    }

     cca.archDelete = function(id){

        console.log('Deleting repoarch ' +id);
        components.QForms.deleteConfirm({url:urlArchDel,id: id,description:'Architecture deleted'});
    }

    cca.distroAdd = function(id){

        //console.log('Adding a Distribution to id '+id);
         dlgDistro = new dijit.Dialog({
            title: "Add Distribution",
            style: "width: 400px"
        });

        //----IE Clean-up---------------
        if(dijit.byId('inpDistroAdd') != undefined){
            dijit.byId('inpDistroAdd').destroyDescendants(true);
            dijit.byId('inpDistroAdd').destroy(true);
        }
        //----------------------------

        var divDistro = document.createElement('div');

            var frmDistroAdd    = new dijit.form.Form({id:"frmDistroAdd",jsId:"frmDistroAdd", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
            dojo.place(frmDistroAdd.domNode,divDistro);

                var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
                hiddenId.type   = "hidden";
                hiddenId.name   = "repoarchId";
                hiddenId.value  = id;
                dojo.place(hiddenId,frmDistroAdd.domNode);

                components.QForms.addPair({label:'Name',divToAdd: frmDistroAdd.domNode,inpName:'distroName',inpRequired:true,id:'inpDistroAdd',isLast:false});

                //--------------------------------------------
                //This is added optional extras---------------
                //--------------------------------------------
                components.QForms.addPair({label:'Origin',divToAdd: frmDistroAdd.domNode,inpName:'distroOrigin',inpRequired:false,isLast:false});
                components.QForms.addPair({label:'Label',divToAdd: frmDistroAdd.domNode,inpName:'distroLabel',inpRequired:false,isLast:false});
                components.QForms.addPair({label:'Suite',divToAdd: frmDistroAdd.domNode,inpName:'distroSuite',inpRequired:false,isLast:false});
                components.QForms.addPair({label:'Version',divToAdd: frmDistroAdd.domNode,inpName:'distroVersion',inpRequired:false,isLast:false});
                components.QForms.addPair({label:'Description',divToAdd: frmDistroAdd.domNode,inpName:'distroDescription',inpRequired:false,isLast:false});
                components.QForms.addCheckPair({label:'Sign with GPG',divToAdd: frmDistroAdd.domNode,inpName:'distroSign',inpRequired:false,isLast: true});
                //-------------------------
                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,frmDistroAdd.domNode);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,frmDistroAdd.domNode);

                dojo.connect(btnNo,'onClick',function(){

                    dlgDistro.destroyDescendants();
                    dlgDistro.destroy();
                    //Destroy the previous frmDistroEdit form
                    if(dijit.byId('frmDistroAdd') != undefined){
                        dijit.byId('frmDistroAdd').destroyDescendants(true);
                        dijit.byId('frmDistroAdd').destroy(true);
                    }
                });

                dojo.connect(btnYes,'onClick',function(){

                    //Duplicate check
                    var newValue = dijit.byId('inpDistroAdd').getDisplayedValue();
                    var flagDefined = false;
                    content.Trees.confStore.fetchItemByIdentity({
                        identity : id,
                        onItem :    function(item, request) {
                                        dojo.forEach(content.Trees.confStore.getValues(item, "children"), function(childItem){
                                                var thisName = content.Trees.confStore.getValue(childItem, "name");
                                                console.log("Hiersy "+thisName+' Daarsy '+newValue);
                                                if(thisName==newValue){
                                                    flagDefined = true;
                                                }
                                        });
                                    }
                        });

                    if(flagDefined == true){
                        dijit.byId('componentsMainToaster').setContent('Value already defined','error',components.Const.toasterError);
                        return;
                    }
                    //End Duplicate Check

                    if(frmDistroAdd.validate()){
                        console.log('Form is valid...');
                        dojo.xhrPost({
                            url: urlDistroAdd,
                            form: dojo.byId('frmDistroAdd'),
                            handleAs: "json",
                            load: function(response){
                                    if(response.json.status == 'ok'){
                                        content.Trees.confStore.fetchItemByIdentity({
                                            identity: id,
                                            onItem : function(item, request) {
                                                        console.log('Found item...');
                                                        var distroId    = response.distribution.id;
                                                        var distroName  = response.distribution.name;
                                                        var newItem  = content.Trees.confStore.newItem({
                                                                                            id : distroId,
                                                                                            name : distroName,
                                                                                            type : 'release'
                                                                                        },{parent: item,attribute:'children'});
                                                        content.Trees.confStore.save();
                                                        dijit.byId('componentsMainToaster').setContent('Distribution added','message',components.Const.toasterInfo);
                                                    }
                                        });
                                    }

                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                        });
                        dlgDistro.destroyDescendants();
                        dlgDistro.destroy();
                        //Destroy the previous frmDistroEdit form
                        if(dijit.byId('frmDistroAdd') != undefined){
                            dijit.byId('frmDistroAdd').destroyDescendants(true);
                            dijit.byId('frmDistroAdd').destroy(true);
                        }
                    }
                });

        dlgDistro.attr("content", divDistro);
        dlgDistro.show();

    }



})();//(function(){