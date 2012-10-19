dojo.provide("content.Configure.Distrocomp");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("components.QForms");
dojo.require("components.Const");

dojo.require("dojox.grid.DataGrid");
dojo.require("dijit.layout.TabContainer");
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

    var ccd= content.Configure.Distrocomp;
    var urlDistrocompDel    = components.Const.cake+'distrocomponents/del/';
    var urlDistrocompEdit   = components.Const.cake+'distrocomponents/edit/';

    var urlDistrocompInfo   = components.Const.cake+'distrocomponents/info/';
    var urlDistrocompBlDelete = components.Const.cake+'distrocomponents/blDelete/';


     ccd.meatDistrocomp = function(compId,compName){

         //----Prepare the DIV --------
        dojo.byId("contentConfigureMeat").innerHTML = '';

        if(dijit.byId('contentConfigureDC') != undefined){

            dijit.byId('contentConfigureDC').destroyDescendants(true);
            dijit.byId('contentConfigureDC').destroy(true);
        }

         if(dijit.byId('contentConfigureDCGeneral') != undefined){

            dijit.byId('contentConfigureDCGeneral').destroyDescendants(true);
            dijit.byId('contentConfigureDCGeneral').destroy(true);
        }

         if(dijit.byId('contentConfigureDCBlacklist') != undefined){

            dijit.byId('contentConfigureDCBlacklist').destroyDescendants(true);
            dijit.byId('contentConfigureDCBlacklist').destroy(true);
        }

        //--DIV READY----------------

        ccd.DistrocompDetail(compId,compName);
       
    }

    ccd.DistrocompDetail = function(distrocompId,distrocompName){

        //------Start of sizing--------------------------------------
        dojo.style(dojo.byId("contentConfigureMeat"),{'height':'100%'});    //To get hte initial size

        var contentBox = dojo.contentBox(dojo.byId("contentConfigureMeat"));    //Get the size of this tab's content div
        var new_height = contentBox.h - 20; //Size minus 20px (to be safe)
        dojo.style(dojo.byId("contentConfigureMeat"),{'height':new_height+'px'});
        //--------END of sizing---------------------------------------

        var cpDc   =   new dijit.layout.ContentPane({
                            id:         'contentConfigureDC',
                            style:      "height: 100% ;background-color: red;"
                        },document.createElement("div"));
        dojo.place(cpDc.domNode,dojo.byId("contentConfigureMeat"));

            //========================================================
            //============Tab Container===============================
            //========================================================

            var tc = new dijit.layout.TabContainer({
                tabPosition: "top",
                style : "width:auto;height:100%; background-color: #d5d5e5;"
            },document.createElement("div"));

            dojo.connect(tc, 'selectChild', 
                function(tabItem){ 

                    if(tabItem.id == 'contentConfigureDCBlacklist'){
                        ccd.detailBlacklist(distrocompId,distrocompName);
                    }
                }
            );
                //Tab
                var tcDc    = new dijit.layout.ContentPane({title : "General",id:'contentConfigureDCGeneral'});

                //Tab
                var tcBl     = new dijit.layout.ContentPane({title : "Blacklist",id:'contentConfigureDCBlacklist'});
                
                tc.addChild(tcDc);
                tc.addChild(tcBl);
            //Att the tabs to the contentpane
            cpDc.attr('content',tc.domNode);

            //Build the General tab
            ccd.detailGeneral(distrocompId,distrocompName);

            //==============================================================
            
    }

    ccd.distrocompDelete = function(id){

        console.log('Deleting Distrocomp ' +id);
        components.QForms.deleteConfirm({url:urlDistrocompDel,id: id,description:'Component deleted'});
    }


    ccd.detailGeneral   = function(distrocompId,distrocompName){

        console.log("Clearing the content of General Tab");
        dijit.byId('contentConfigureDCGeneral').attr('content','');
        

        if(dijit.byId('frmDistrocompEdit') != undefined){

            dijit.byId('frmDistrocompEdit').destroyDescendants(true);
            dijit.byId('frmDistrocompEdit').destroy(true);
        }

        //-----------------------------------------------
        //--Get the current content of the Distro--------
        dojo.xhrGet({
            url: urlDistrocompInfo+distrocompId,
            preventCache: true,
            handleAs: "json",
            load: function(response){
                if(response.json.status == 'ok'){
                    console.log("Gooi Hom!");
                    ccd.MeatGeneral(distrocompId,distrocompName,response.comp);
                };
                if(response.json.status == 'error'){
                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                }
            }
        });
        //-------------------------------------------------


    }

    ccd.detailBlacklist   = function(distrocompId,distrocompName){

        console.log("Clearing the content of Blacklist Tab");
        dijit.byId('contentConfigureDCBlacklist').attr('content','');
        //dijit.byId('contentConfigureDCBlacklist').attr('content',Date()+'');

        if(dijit.byId('contentDistrocompBlacklistGrid') != undefined){

            dijit.byId('contentDistrocompBlacklistGrid').destroyDescendants(true);
            dijit.byId('contentDistrocompBlacklistGrid').destroy(true);
        }



        //----Grid Start----------------
        var divBlacklist     = document.createElement("div");    //The Div must have its own div to fit in
        dojo.addClass(divBlacklist, "divBlacklist");
        dijit.byId('contentConfigureDCBlacklist').attr('content',divBlacklist);

            var divBlacklistAction = document.createElement("div");
            dojo.addClass(divBlacklistAction, "divBlacklistAction");

                var logo = new Image();
                            logo.src = "img/actions/blacklist_over.png";
                            logo.align="left";
                        dojo.place(logo,divBlacklistAction);

              var divActions = document.createElement("div");
                    dojo.addClass(divActions, "divActions");
                    //Add the action stuff
                    components.QForms.addAction({Name:'Delete Selected',   Type:'delete',  Parent: divActions,Action:ccd.DeleteBl,Id:distrocompId});
                    components.QForms.addAction({Name:'Refresh List',   Type:'reload',  Parent: divActions,Action:ccd.PopulateBl,Id:distrocompId});
                    
            dojo.place(divActions,divBlacklistAction);
                
                components.QForms.addHeading({size:2,content:"Manage Blacklist",divToAdd: divBlacklistAction});

        dojo.place(divBlacklistAction,divBlacklist);

        
            var divBlacklistGrid = document.createElement("div");
            dojo.addClass(divBlacklistGrid, "divBlacklistGrid");
            
        dojo.place(divBlacklistGrid,divBlacklist);
        
            var layout = [
                { field: "name", name: "Name", width: 'auto' }
            ];


        //var jsonStore=new dojo.data.ItemFileReadStore(comp.bl);
            var grid = new dojox.grid.DataGrid({
                id: 'contentDistrocompBlacklistGrid',
            //store: jsonStore,
                structure: layout,
                rowsPerPage: 40,
                rowSelector: '20px'
            }, document.createElement("div"));

        dojo.addClass(grid.domNode,'divBlG')

        dojo.place(grid.domNode,divBlacklistGrid);
        grid.startup();
        //---- END Grid----------------

        //Populate the grid
        ccd.PopulateBl(distrocompId);
    }


    ccd.PopulateBl  = function(distrocompId){
        //-----------------------------------------------
        //--Get the current content of the Distro--------
        dojo.xhrGet({
            url: urlDistrocompInfo+distrocompId,
            preventCache: true,
            handleAs: "json",
            load: function(response){
                if(response.json.status == 'ok'){
                    console.log("Blacklist Request");
                    dijit.byId('componentsMainToaster').setContent('Refreshing List','message',components.Const.toasterInfo);
                    var jsonStore=new dojo.data.ItemFileReadStore(response.comp.bl);
                    dijit.byId('contentDistrocompBlacklistGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true});
                };
                if(response.json.status == 'error'){
                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                }
            }
        });
        //-------------------------------------------------
    }


     ccd.DeleteBl  = function(distrocompId){

        console.log('Delete Selected Clicked!');

        var items = dijit.byId('contentDistrocompBlacklistGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent('Delete Selected Items','message',components.Const.toasterInfo);
            var itemList =[];
            //Build a list of Item ID's
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentDistrocompBlacklistGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });

             //-----------------------------------------------
            dojo.xhrGet({
                url: urlDistrocompBlDelete+distrocompId,
                preventCache: true,
                content: itemList,
                handleAs: "json",
                load: function(response){
                    if(response.json.status == 'ok'){
                        console.log("Delete Blacklist");
                        dijit.byId('componentsMainToaster').setContent('Delete Complete','message',components.Const.toasterInfo);
                        ccd.PopulateBl(distrocompId);   //Reload the list
                    };
                    if(response.json.status == 'error'){
                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                    }
                }
            });
            //------------------------------------------------- 

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }
    }


    ccd.MeatGeneral   = function(distrocompId,distrocompName,comp){

        var frmDistrocompEdit    = new dijit.form.Form({id:"frmDistrocompEdit",jsId:"frmDistrocompEdit", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
        dijit.byId('contentConfigureDCGeneral').attr('content',frmDistrocompEdit);

         //-----Hidden element containing the DistrocompID ----
            var hiddenId    = document.createElement("input");  //Hidden element containing the Repository ID
            hiddenId.type   = "hidden";
            hiddenId.name   = "distrocompId";
            hiddenId.value  = distrocompId;
        dojo.place(hiddenId,frmDistrocompEdit.domNode);

            var divComp  = document.createElement('div');
            dojo.addClass(divComp, 'divTabForm');

             var logo = new Image();
                            logo.src = "img/actions/comp_48.png";
                            logo.align="left";
                        dojo.place(logo,divComp);

              var divActions = document.createElement("div");
                    dojo.addClass(divActions, "divActions");
                    //Add the action stuff
                    components.QForms.addAction({Name:'Delete Component',   Type:'delete',  Parent: divActions,Action:ccd.distrocompDelete,Id:distrocompId});
            dojo.place(divActions,divComp);
                
                components.QForms.addHeading({size:2,content:"Edit Component",divToAdd: divComp});
                
                    var lbl =document.createElement('label');
                        var txt=document.createTextNode('Component Name');
                    lbl.appendChild(txt);
                dojo.place(lbl,divComp);

                    var lbl_var =document.createElement('label');
                        var txt_var=document.createTextNode(distrocompName);
                    lbl_var.appendChild(txt_var);
                    dojo.addClass(lbl_var, "lblFeedback");
                dojo.place(lbl_var,divComp);

                if(comp.type == 'external'){

                    components.QForms.addPair({label:'Update source',divToAdd: divComp,inpName:'updateSource',inpRequired:true, isLast:false, value:comp.updateSource});
                    components.QForms.addCheckPair({label:'Include Installer',divToAdd: divComp,inpName:'updateInstaller',inpRequired:false,isLast: false,checked: comp.updateInstaller});
                    components.QForms.addPair({label:'New Keyring',divToAdd: divComp,inpName:'updateKeyring',inpRequired:false, isLast:false, value:comp.updateKeyring});
                    components.QForms.addPair({label:'New Udeb Keyring',divToAdd: divComp,inpName:'updateUdebKeyring',inpRequired:false, isLast:true,value:comp.updateUdebKeyring});
                }

                if(comp.type == 'directory'){

                    components.QForms.addPair({label:'Common Folder',divToAdd: divComp,inpName:'updateCommon',inpRequired:true, isLast:false,value:comp.updateCommon});
                    components.QForms.addPair({label:'Specific Folder',divToAdd: divComp,inpName:'updateSpecific',inpRequired:true, isLast:false, value:comp.updateSpecific});
                }
                //components.QForms.addPair({label:'Component Name',divToAdd: divComp,inpName:'compName',inpRequired:true, isLast:true});

                var btnCompEdit = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Save',iconClass:"saveIcon"},document.createElement("div"));
                dojo.place(btnCompEdit.domNode,divComp);
                
            dojo.place(divComp,frmDistrocompEdit.domNode);

                dojo.connect(btnCompEdit,'onClick',function(){

                    if(frmDistrocompEdit.validate()){
                        console.log('Form is valid...');
                        dojo.xhrPost({
                            url: urlDistrocompEdit,
                            form: dojo.byId('frmDistrocompEdit'),
                            handleAs: "json",
                            load: function(response){
                                    if(response.json.status == 'ok'){
                                       dijit.byId('componentsMainToaster').setContent('Component updated','message',components.Const.toasterInfo);
                                    }

                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                        });
                    }
                });
    }

})();//(function(){