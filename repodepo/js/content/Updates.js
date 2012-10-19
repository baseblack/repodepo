dojo.provide("content.Updates");
dojo.require("dijit.form.Form");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");

dojo.require("components.QForms");
dojo.require("components.Const");

dojo.require("dijit.Dialog");

dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("dojox.grid.DataGrid");

dojo.require("dijit.ProgressBar");

(function(){
    var cu= content.Updates;

    var urlVouchersIndex    = components.Const.cake+'vouchers/json_index';
    var urlRepoAdd          = components.Const.cake+'repositories/add';
    var urlRepoEdit         = components.Const.cake+'repositories/edit';
    var urlRepoDelete       = components.Const.cake+'repositories/del/';
    var urlUpdateAll        = components.Const.cake+'updates/updatesDoAll/';
    var urlUpdateSelected   = components.Const.cake+'updates/updatesDoSelected/';
    var urlUpdateNotSelected = components.Const.cake+'updates/updatesDoNotSelected/';
    var urlUpdateProgress   = components.Const.cake+'updates/updateProgress/';
    
    var urlAddBlacklist     = components.Const.cake+'updates/addBlacklist/';

    var urlUpdatesIndex     = components.Const.cake+'updates/index/';

    var query               = {'name' : '*'};

    var divActions;
   
    cu.meat=function(divParent,i){

        //If the GUI already exists, we just need to reload the grid's data and return
        if(dijit.byId('contentUpdatesViewGrid') != undefined){
            cu.reload(i);
            return;
        }

        var divGridAction= document.createElement('div');
        dojo.addClass(divGridAction, 'divGridAction');
            
            //--------------------Action Part --------------------
            divActions = document.createElement("div");
            dojo.addClass(divActions, "divActions");
                //Add the action stuff
                components.QForms.addAction({Name:'Blacklist Selected', Type:'blacklist',   Parent: divActions,     Action:cu.blacklist,        Id:null});
                components.QForms.addAction({Name:'Update all',         Type:'update',      Parent: divActions,     Action:cu.updateAll,        Id:null});
                components.QForms.addAction({Name:'Update selected',    Type:'update_select',Parent: divActions,    Action:cu.updateSelected,   Id:null});
                components.QForms.addAction({Name:'Do not update selected',Type:'update_notselect',Parent: divActions,Action:cu.updateNotSelected,Id:null});
        dojo.place(divActions,divGridAction);


            //-------------------Filter + Refresh------------------------
            var filter = document.createElement('span');
            filter.innerHTML ='<b>'+"Filter "+'</b>';
            dojo.place(filter, divGridAction);
            var filter_val = new dijit.form.TextBox({id:'contentUpdatesViewFilter', name: 'Filter', trim: true, style: "width: 140px;"},document.createElement("div"));

            dojo.connect(filter_val,'onKeyUp',function(e){
                    var filterOn = filter_on.attr('value');
                    console.log("The value to filter..."+ filterOn);
                    var val = filter_val.attr('value');

                    if(filterOn == 'arch'){
                        query = {'arch' : val+'*'};
                    }   
                    if(filterOn == 'distro'){
                        query = {'distro' : val+'*'};
                    }
                    if(filterOn == 'comp'){
                        query = {'comp' : val+'*'};
                    }
                    if(filterOn == 'name'){
                        query = {'name' : val+'*'};
                    }
                    if(filterOn == 'version'){
                        query = {'version' : val+'*'};
                    }
                    dijit.byId('contentUpdatesViewGrid').setQuery(query);
            });


            dojo.place(filter_val.domNode, divGridAction);

            var spanField  = document.createElement('span');
            spanField.innerHTML = '<b>'+"Field "+'</b>';
            dojo.place(spanField,divGridAction);

                var data = {data: {
                        identifier : 'id',
                        label: 'label',
                        items : [
                                    { id : 'arch',      label: "Architecture" },
                                    { id : 'distro',    label: "Distribution" },
                                    { id : 'comp',      label: "Component" },
                                    { id : 'name',      label: "Name" },
                                    { id : 'version',   label: "Version" }
                                ]}};
            var myNewStore=new dojo.data.ItemFileReadStore(data);
            var filter_on = new dijit.form.FilteringSelect({
                                                                    value   :"name",
                                                                    name    :"Name", 
                                                                    searchAttr: "name",
                                                                    store   :myNewStore,
                                                                    searchAttr  :"label",
                                                                    style: "width: 140px;"}, document.createElement("div"));

            dojo.place(filter_on.domNode,divGridAction);
            //-----------------------------------------------------------


            //---Result Feedback----
             var divResults      = document.createElement("div");
                dojo.addClass(divResults, "divGridResults");
            dojo.place(divResults,divGridAction);
            //---------------------------------

        dojo.place(divGridAction,divParent);
        //-----------------------------------------------------------


        setTimeout(function () {

            var contentBox = dojo.contentBox(divParent);


            var hight = (contentBox.h-92)+'';
            var s = "height: "+hight+"px ; padding: 20px;";


             var cpExp   =   new dijit.layout.ContentPane({
                                style:      s
                            },document.createElement("div"));
            dojo.place(cpExp.domNode,divParent);


                //----Grid Start----------------

                    var layout = [
                        { field: "arch", name: "Architecture", width: 'auto' },
                        { field: "distro", name: "Distribution", width: 'auto' },
                        { field: "comp", name: "Component", width: 'auto' },
                        { field: "name", name: "Name", width: 'auto' },
                        { field: "version", name: "Version", width: 'auto' }
                    ];

                    var grid = new dojox.grid.DataGrid({
                        id: 'contentUpdatesViewGrid',
                        structure: layout,
                        rowsPerPage: 40,
                        rowSelector: '20px'
                        }, document.createElement("div"));

                    dojo.connect(grid,'_onFetchComplete', function(){
                              divResults.innerHTML = "<b>Result count: </b>"+ grid.rowCount;
                    })

                 
                dojo.addClass(grid.domNode,'divGrid');
                dojo.place(grid.domNode,cpExp.domNode);
                grid.startup();
                //---- END Grid----------------

            dojo.style(divParent,"backgroundColor","#dbeddc");
            dojo.addClass(divParent, "divBgUpdates");

            cu.reload(i);

        },100);
    }


    cu.reload           = function(i){

        var timestamp = Number(new Date());
        //Not the root node - so we check the type of node
        if(i.type == 'repo'){
            content.Updates.type    = 'repo';
            content.Updates.what    = 'repository'
        }

        if(i.type == 'arch'){
            content.Updates.type    = 'repoarch';
            content.Updates.what    = 'architecture'
        }

        if(i.type == 'release'){
            content.Updates.type    = 'distro';
            content.Updates.what    = 'distribution'
        }

        if(i.type == 'comp'){
            content.Updates.type    = 'distrocomp';
            content.Updates.what    = 'component'
        }
        content.Updates.id          = i.id;

        dijit.byId("componentsMainStatus").attr('content','Updates: '+content.Updates.what+' <b>'+ i.name +'</b> selected');  //Create the toaster
        cu.currentURL   = urlUpdatesIndex+content.Updates.type+'/'+i.id+'/';
        var sel_url     = cu.currentURL+timestamp;                                                 //The URL to get the info for the grid
        var jsonStore   = new dojo.data.ItemFileWriteStore({ url: sel_url });
        dijit.byId('contentUpdatesViewGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true}); //Add the store to the grid

    }

    cu.updateSelected    = function(){

        var itemList =[];

        console.log('Need to update Selected!');

        if(content.Updates.type != 'distrocomp'){
            dijit.byId('componentsMainToaster').setContent('<h2>Updates must be done on component level</h2>','error',components.Const.toasterError);
            return;
        }

        var items = dijit.byId('contentUpdatesViewGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent('Update Selected Items','message',components.Const.toasterInfo);
            var itemList =[];
            //Build a list of Item ID's
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentUpdatesViewGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });

            cu.doUpdate(urlUpdateSelected,itemList);

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }

    }

     cu.updateNotSelected    = function(){

        console.log('Need to update Unselected!');

        if(content.Updates.type != 'distrocomp'){
            dijit.byId('componentsMainToaster').setContent('<h2>Updates must be done on component level</h2>','error',components.Const.toasterError);
            return;
        }

        var itemList =[];

        var items = dijit.byId('contentUpdatesViewGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent('Update NOT Selected Items','message',components.Const.toasterInfo);
            var itemList =[];
            //Build a list of Item ID's
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentUpdatesViewGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });
            cu.doUpdate(urlUpdateNotSelected,itemList);

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }

    }

     cu.blacklist    = function(){


        console.log('Need to add a blacklist!');
        var itemList =[];

        var items = dijit.byId('contentUpdatesViewGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent('Blacklist Items','message',components.Const.toasterInfo);
            var itemList =[];
            //Build a list of Item ID's
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentUpdatesViewGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });
            cu.doSelection('Blacklisting Complete',urlAddBlacklist,itemList);

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }

    }

    cu.updateAll    = function(){

        if(content.Updates.type != 'distrocomp'){
            dijit.byId('componentsMainToaster').setContent('<h2>Updates must be done on component level</h2>','error',components.Const.toasterError);
            return;
        }
        cu.doUpdate(urlUpdateAll);
    }

    cu.doUpdate     = function(urlToCall,itemList){

         dojo.xhrGet({
                url: urlToCall+cu._queryString(),
                preventCache: true,
                content: itemList,
                handleAs: "json",
                load: function(response){

                    console.log(response);
                    if(response.json.status == 'ok'){

                        if(response.update.status == 'busy'){
                            //console.log("Lekker Lekker");
                            dijit.byId('componentsMainToaster').setContent('<h2>Update in Progress, please wait</h2>','message',components.Const.toasterInfo);
                            cu._progressDialog(response.update.id);
                        }

                        if(response.update.status == 'started'){
                            //console.log("Lekker Lekker");
                            dijit.byId('componentsMainToaster').setContent('<h2>Update Started</h2>','message',components.Const.toasterInfo);
                            cu._progressDialog(response.update.id);
                        }
                    };
                    if(response.json.status == 'error'){
                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                    }
                }
            });
    }


    cu._progressDialog  = function(updateId){

        var dlgProgress     = new dijit.Dialog({
                                id: 'contentUpdatesProgress',
                                draggable: false,
                                title: "Update Progress",
                                style: "width: 520px; height: 210px;"
                            },document.createElement("div"));

            var divProgress    = document.createElement("div");
            

                var divProgressFeedback = document.createElement("div");
                divProgressFeedback.id  = 'contentUpdatesProgressFeedback';
                components.QForms.addLabelPair({label:'Total Packages',divToAdd: divProgress,labelVarId:'contentUpdatesProgressTotal'});
                components.QForms.addLabelPair({label:'Completed',divToAdd: divProgress,labelVarId:'contentUpdatesProgressCompleted'});
            dojo.place(divProgressFeedback,divProgress);
                    var pb = new dijit.ProgressBar({
                            style:"width:480px",
                            id: "contentUpdateProgress"
                        });
                dojo.place(pb.domNode,divProgress);
                    var btnOk = new dijit.form.Button({style:"margin:10px; margin-left:1px;",label:'OK',iconClass:"okIcon",disabled:true,id:'contentUpdatesProgressOk'},document.createElement("div"));
                    dojo.connect(btnOk,"onClick",function(e){
                        dijit.byId('contentUpdatesProgressOk').destroy(false);
                        dijit.byId('contentUpdateProgress').destroy(false);
                        dijit.byId('contentUpdatesProgress').destroyDescendants(false);
                        dijit.byId('contentUpdatesProgress').destroy(false);
                        //Reload the node that was selected's meat
                        dojo.publish("/actions/Updates", [content.Trees.UpdateSelectItem]);
                        dijit.byId('contentUpdatesViewFilter').setDisplayedValue('');

                    });
                dojo.place(btnOk.domNode,divProgress);
                //Avoid the ESC response
                dojo.connect(dojo.body(), 'onkeypress', function(evt) {
                    key = evt.keyCode;
                    if (key == dojo.keys.ESCAPE) {
                        if(dijit.byId('contentUpdatesProgress').open){
                            dojo.stopEvent(evt);
                        }
                    };
                });

        dlgProgress.attr("content", divProgress);
        dlgProgress.show();

        //-----------------------------------------------------------------
        //-----Poll it until finish ---------------------------------------
        //-----------------------------------------------------------------
        content.Updates.progressInterval = setInterval(function(  ) {
            dojo.xhrGet({
                url : urlUpdateProgress+updateId,
                handleAs: "json",
                preventCache: true,
                load : function(response, ioArgs) {

                    var complete_flag = false;
                    if(response.json.status == 'ok'){
                        dojo.byId('contentUpdatesProgressTotal').innerHTML      = response.progress.total;
                        dojo.byId('contentUpdatesProgressCompleted').innerHTML  = response.progress.completed;
                        if(parseInt(response.progress.pers_completed) == 100){
                            complete_flag = true;
                            clearInterval(content.Updates.progressInterval);
                            console.log("Update Complete!");
                            dojo.byId('contentUpdatesProgressCompleted').innerHTML  = response.progress.total;  //Show that all the packages are also downloaded
                            dijit.byId("contentUpdateProgress").update({progress : 100});
                            dojo.byId('contentUpdatesProgressFeedback').innerHTML = "Update Complete!";
                            dijit.byId('contentUpdatesProgressOk').attr('disabled',false);
                        }else{
                             if(complete_flag == false){
                                dijit.byId("contentUpdateProgress").update({progress : parseInt(response.progress.pers_completed)});
                            }
                        }
                    }
                }
            });
        }, 700);
        //----------------------------------------------------------
    }

     cu._queryString     = function(){

        /*
            { field: "arch", name: "Architecture", width: 'auto' },
            { field: "distro", name: "Distribution", width: 'auto' },
            { field: "comp", name: "Component", width: 'auto' },
            { field: "name", name: "Name", width: 'auto' },
            { field: "version", name: "Version", width: 'auto' }
        */


        var q_obj       = dijit.byId('contentUpdatesViewGrid').query;
        var q_string    = '';

        if(q_obj.name != undefined){
            q_string = 'filterName:name/filterValue:'+q_obj.name; 
        }

        if(q_obj.arch != undefined){
            q_string = 'filterName:arch/filterValue:'+q_obj.arch; 
        }

        if(q_obj.comp != undefined){
            q_string = 'filterName:comp/filterValue:'+q_obj.comp; 
        }

        if(q_obj.distro != undefined){
            q_string = 'filterName:distro/filterValue:'+q_obj.distro; 
        }
        
        if(q_obj.comp != undefined){
            q_string = 'filterName:comp/filterValue:'+q_obj.comp; 
        }

        q_string = content.Updates.type + ':' + content.Updates.id +'/'+q_string;


        return q_string;

    }

    cu.doSelection    = function(message,urlToCall,itemList){

         dojo.xhrGet({
                url: urlToCall,
                preventCache: true,
                content: itemList,
                handleAs: "json",
                load: function(response){

                    console.log(response);
                    if(response.json.status == 'ok'){
                       
                        setTimeout(function () {
                            dijit.byId('componentsMainToaster').setContent(message+' Complete','message',components.Const.toasterInfo);
                            var ts = Number(new Date());
                            var jsonStore = new dojo.data.ItemFileWriteStore({ url: cu.currentURL+ts });
                            dijit.byId('contentUpdatesViewGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true});
                            
                        },500);
                    };
                    if(response.json.status == 'error'){
                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                    }
                }
        });
    }

})();//(function(){