dojo.provide("content.Configure.Distro");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");

dojo.require("components.QForms");
dojo.require("components.Const");


(function(){

    var ccd= content.Configure.Distro;
    var urlDistroDel        = components.Const.cake+'distributions/del/';

    var urlCompAdd          = components.Const.cake+'distrocomponents/add';
    var urlComponentTypes   = components.Const.cake+'componenttypes/?';
    var urlDistroInfo       = components.Const.cake+'distributions/info/';
    var urlDistroEdit       = components.Const.cake+'distributions/edit/';

    ccd.meatDistribution = function(distroId,distroName){

        //----Prepare the DIV --------
        dojo.byId("contentConfigureMeat").innerHTML = '';

        if(dijit.byId('frmDistributionEdit') != undefined){

            dijit.byId('frmDistributionEdit').destroyDescendants(true);
            dijit.byId('frmDistributionEdit').destroy(true);
        }
        //--DIV READY----------------


        //-----------------------------------------------
        //--Get the current content of the Distro--------
        dojo.xhrGet({
            url: urlDistroInfo+distroId,
            preventCache: true,
            handleAs: "json",
            load: function(response){

                //console.log(response);
                if(response.json.status == 'ok'){

                    ccd.DistroDetail(distroId,distroName,response.distro);

                };
                if(response.json.status == 'error'){
                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                }
            }
        });
        //-------------------------------------------------

    }


    ccd.DistroDetail    = function(distroId,distroName,distro){

        var frmDistributionEdit    = new dijit.form.Form({id:"frmDistributionEdit",jsId:"frmDistributionEdit", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
        dojo.place(frmDistributionEdit.domNode,dojo.byId("contentConfigureMeat"));

            //-----Hidden element containing the DistroID ----
            var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
            hiddenId.type   = "hidden";
            hiddenId.name   = "distroId";
            hiddenId.value  = distroId;
        dojo.place(hiddenId,frmDistributionEdit.domNode);

            var divDistro  = document.createElement('div');
            dojo.addClass(divDistro, 'divTabForm');
                var logo = new Image();
                            logo.id  = "contentBannerLogo";
                            logo.src = "img/actions/release_48.png";
                            logo.align="left";
                        dojo.place(logo,divDistro);

                var divActions = document.createElement("div");
                    dojo.addClass(divActions, "divActions");
                    //Add the action stuff
                    components.QForms.addAction({Name:'Delete Distribution',   Type:'delete',  Parent: divActions,Action:ccd.distroDelete,Id:distroId});
                    components.QForms.addAction({Name:'Add Folder Component',     Type:'add_folder',     Parent: divActions,Action:ccd.compFolderAdd,Id:distroId});
                    components.QForms.addAction({Name:'Add Network Component',     Type:'add_network',     Parent: divActions,Action:ccd.compAdd,Id:distroId});
            dojo.place(divActions,divDistro);

                components.QForms.addHeading({size:2,content:"Edit Distribution",divToAdd: divDistro});

                    var lbl =document.createElement('label');
                        var txt=document.createTextNode('Distribution Name');
                    lbl.appendChild(txt);
                dojo.place(lbl,divDistro);

                    var lbl_var =document.createElement('label');
                        var txt_var=document.createTextNode(distroName);
                    lbl_var.appendChild(txt_var);
                    dojo.addClass(lbl_var, "lblFeedback");
                dojo.place(lbl_var,divDistro);

          
                var br2=document.createElement('BR');
                br2.clear = 'all';
                dojo.place(br2,divDistro);

                //--------------------------------------------
                //This is added optional extras---------------
                //--------------------------------------------
                
                components.QForms.addPair({label:'Origin',divToAdd: divDistro,inpName:'distroOrigin',inpRequired:false,isLast:false, value:distro.Origin});
                components.QForms.addPair({label:'Label',divToAdd: divDistro,inpName:'distroLabel',inpRequired:false,isLast:false, value: distro.Label});
                components.QForms.addPair({label:'Suite',divToAdd: divDistro,inpName:'distroSuite',inpRequired:false,isLast:false, value: distro.Suite});
                components.QForms.addPair({label:'Version',divToAdd: divDistro,inpName:'distroVersion',inpRequired:false,isLast:false, value: distro.Version});
                components.QForms.addPair({label:'Description',divToAdd: divDistro,inpName:'distroDescription',inpRequired:false,isLast:false, value: distro.Description});
                components.QForms.addCheckPair({label:'Sign with GPG',divToAdd: divDistro,inpName:'distroSign',inpRequired:false,checked: distro.SignWith,value: 'on',isLast: true});
                //-------------------------
                var btnDistroEdit = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Save',iconClass:"saveIcon"},document.createElement("div"));
                dojo.place(btnDistroEdit.domNode,divDistro);

            dojo.place(divDistro,frmDistributionEdit.domNode);

                dojo.connect(btnDistroEdit,'onClick',function(){

                    if(frmDistributionEdit.validate()){
                        console.log('Form is valid...');
                        dojo.xhrPost({
                            url: urlDistroEdit,
                            form: dojo.byId('frmDistributionEdit'),
                            handleAs: "json",
                            load: function(response){
                                    if(response.json.status == 'ok'){
                                       dijit.byId('componentsMainToaster').setContent('Distribution updated','message',components.Const.toasterInfo);
                                    }

                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                        });
                    }
                });
    }


    ccd.distroDelete = function(id){

        console.log('Deleting repoarch ' +id);
        components.QForms.deleteConfirm({url:urlDistroDel,id: id,description:'Distribution deleted'});
    }

     ccd.compAdd = function(id){

         dlgComp = new dijit.Dialog({
            title: "Add Network Component",
            style: "width: 420px"
        });

         //----IE Clean-up---------------
        if(dijit.byId('frmCompAdd') != undefined){
            dijit.byId('frmCompAdd').destroyDescendants(true);
            dijit.byId('frmCompAdd').destroy(true);
        }
        if(dijit.byId('ContentConfigureComp') != undefined){
            dijit.byId('ContentConfigureComp').destroyDescendants(true);
            dijit.byId('ContentConfigureComp').destroy(true);
        }

        //----------------------------


        var divComp = document.createElement('div');

            var frmCompAdd    = new dijit.form.Form({id:"frmCompAdd",jsId:"frmCompAdd", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
            dojo.place(frmCompAdd.domNode,divComp);

                var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
                hiddenId.type   = "hidden";
                hiddenId.name   = "distroId";
                hiddenId.value  = id;
                dojo.place(hiddenId,frmCompAdd.domNode);
                var ts = Number(new Date());
                components.QForms.addComboBox({label:'Components',url: urlComponentTypes+ts,divToAdd: frmCompAdd.domNode,inpName:'comptypeId',inpRequired:true,isLast:false,searchAttr: 'name',id:'ContentConfigureComp'});
                components.QForms.addPair({label:'Update source',divToAdd: frmCompAdd.domNode,inpName:'updateSource',inpRequired:true, isLast:false});
                components.QForms.addCheckPair({label:'Include Installer',divToAdd: frmCompAdd.domNode,inpName:'updateInstaller',inpRequired:false,isLast: false});
                components.QForms.addPair({label:'New Keyring',divToAdd: frmCompAdd.domNode,inpName:'updateKeyring',inpRequired:false, isLast:false});
                components.QForms.addPair({label:'New Udeb Keyring',divToAdd: frmCompAdd.domNode,inpName:'updateUdebKeyring',inpRequired:false, isLast:true});

                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,frmCompAdd.domNode);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,frmCompAdd.domNode);

                dojo.connect(btnNo,'onClick',function(){

                    dlgComp.destroyDescendants();
                    dlgComp.destroy();
                    //Destroy the previous frmCompAdd form
                    if(dijit.byId('frmCompAdd') != undefined){
                        dijit.byId('frmCompAdd').destroyDescendants(true);
                        dijit.byId('frmCompAdd').destroy(true);
                    }
                });

                dojo.connect(btnYes,'onClick',function(){

                    //First we nee to verify that a value was selected
                    var dispVal =dijit.byId('ContentConfigureComp').getDisplayedValue();
                    if(dispVal == ''){

                        dijit.byId('componentsMainToaster').setContent('Invalid component selection','error',components.Const.toasterError);
                        return;
                    }

                    //Duplicate check
                    var flagDefined = false;
                    content.Trees.confStore.fetchItemByIdentity({
                        identity : id,
                        onItem :    function(item, request) {
                                        dojo.forEach(content.Trees.confStore.getValues(item, "children"), function(childItem){
                                                var thisName = content.Trees.confStore.getValue(childItem, "name");
                                                console.log("Hiersy "+thisName+' Daarsy '+dispVal);
                                                if(thisName==dispVal){
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

                    if(frmCompAdd.validate()){
                        console.log('Form is valid...');
                        dojo.xhrPost({
                            url: urlCompAdd,
                            form: dojo.byId('frmCompAdd'),
                            handleAs: "json",
                            load: function(response){
                                    if(response.json.status == 'ok'){
                                        content.Trees.confStore.fetchItemByIdentity({
                                            identity: id,
                                            onItem : function(item, request) {
                                                        console.log('Found item...');
                                                        var compId    = response.component.id;
                                                        var compName  = response.component.name;
                                                        var newItem  = content.Trees.confStore.newItem({
                                                                                            id : compId,
                                                                                            name : compName,
                                                                                            type : 'comp'
                                                                                        },{parent: item,attribute:'children'});
                                                        content.Trees.confStore.save();
                                                        dijit.byId('componentsMainToaster').setContent('Component added','message',components.Const.toasterInfo);
                                                    }
                                        });
                                    }

                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                        });
                        dlgComp.destroyDescendants();
                        dlgComp.destroy();
                        //Destroy the previous frmCompAdd form
                        if(dijit.byId('frmCompAdd') != undefined){
                            dijit.byId('frmCompAdd').destroyDescendants(true);
                            dijit.byId('frmCompAdd').destroy(true);
                        }
                    }
                });

        dlgComp.attr("content", divComp);
        dlgComp.show();

    }

    ccd.compFolderAdd = function(id){

         dlgComp = new dijit.Dialog({
            title: "Add Folder Component",
            style: "width: 420px"
        });

         //----IE Clean-up---------------
        if(dijit.byId('frmCompAdd') != undefined){
            dijit.byId('frmCompAdd').destroyDescendants(true);
            dijit.byId('frmCompAdd').destroy(true);
        }
        if(dijit.byId('ContentConfigureComp') != undefined){
            dijit.byId('ContentConfigureComp').destroyDescendants(true);
            dijit.byId('ContentConfigureComp').destroy(true);
        }

        //----------------------------

        var divComp = document.createElement('div');

            var frmCompAdd    = new dijit.form.Form({id:"frmCompAdd",jsId:"frmCompAdd", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
            dojo.place(frmCompAdd.domNode,divComp);

                var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
                hiddenId.type   = "hidden";
                hiddenId.name   = "distroId";
                hiddenId.value  = id;
                dojo.place(hiddenId,frmCompAdd.domNode);
                var ts = Number(new Date());
                components.QForms.addComboBox({label:'Components',url: urlComponentTypes+ts,divToAdd: frmCompAdd.domNode,inpName:'comptypeId',inpRequired:true,isLast:false,searchAttr: 'name',id:'ContentConfigureComp'});
                components.QForms.addPair({label:'Common Folder',divToAdd: frmCompAdd.domNode,inpName:'updateCommon',inpRequired:true, isLast:false});
                components.QForms.addPair({label:'Specific Folder',divToAdd: frmCompAdd.domNode,inpName:'updateSpecific',inpRequired:true, isLast:false});

                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,frmCompAdd.domNode);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,frmCompAdd.domNode);

                dojo.connect(btnNo,'onClick',function(){

                    dlgComp.destroyDescendants();
                    dlgComp.destroy();
                    //Destroy the previous frmCompAdd form
                    if(dijit.byId('frmCompAdd') != undefined){
                        dijit.byId('frmCompAdd').destroyDescendants(true);
                        dijit.byId('frmCompAdd').destroy(true);
                    }
                });

                dojo.connect(btnYes,'onClick',function(){

                    //First we nee to verify that a value was selected
                    var dispVal =dijit.byId('ContentConfigureComp').getDisplayedValue();
                    if(dispVal == ''){

                        dijit.byId('componentsMainToaster').setContent('Invalid component selection','error',components.Const.toasterError);
                        return;
                    }

                    //Duplicate check
                    var flagDefined = false;
                    content.Trees.confStore.fetchItemByIdentity({
                        identity : id,
                        onItem :    function(item, request) {
                                        dojo.forEach(content.Trees.confStore.getValues(item, "children"), function(childItem){
                                                var thisName = content.Trees.confStore.getValue(childItem, "name");
                                                console.log("Hiersy "+thisName+' Daarsy '+dispVal);
                                                if(thisName==dispVal){
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

                    if(frmCompAdd.validate()){
                        console.log('Form is valid...');
                        dojo.xhrPost({
                            url: urlCompAdd,
                            form: dojo.byId('frmCompAdd'),
                            handleAs: "json",
                            load: function(response){
                                    if(response.json.status == 'ok'){
                                        content.Trees.confStore.fetchItemByIdentity({
                                            identity: id,
                                            onItem : function(item, request) {
                                                        console.log('Found item...');
                                                        var compId    = response.component.id;
                                                        var compName  = response.component.name;
                                                        var newItem  = content.Trees.confStore.newItem({
                                                                                            id : compId,
                                                                                            name : compName,
                                                                                            type : 'comp'
                                                                                        },{parent: item,attribute:'children'});
                                                        content.Trees.confStore.save();
                                                        dijit.byId('componentsMainToaster').setContent('Component added','message',components.Const.toasterInfo);
                                                    }
                                        });
                                    }

                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                        });
                        dlgComp.destroyDescendants();
                        dlgComp.destroy();
                        //Destroy the previous frmCompAdd form
                        if(dijit.byId('frmCompAdd') != undefined){
                            dijit.byId('frmCompAdd').destroyDescendants(true);
                            dijit.byId('frmCompAdd').destroy(true);
                        }
                    }
                });

        dlgComp.attr("content", divComp);
        dlgComp.show();

    }



})();//(function(){