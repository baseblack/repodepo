dojo.provide("content.Pack");
dojo.require("dijit.form.Form");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");

dojo.require("components.QForms");
dojo.require("components.Const");

dojo.require("dijit.Dialog");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.data.QueryReadStore");
dojo.require("dojox.grid.DataGrid");
dojo.require("dijit.ProgressBar");

(function(){
    var cp = content.Pack;
    //Define url's used here
    var urlPackagesIndex    = components.Const.cake+'packages/index/';
    var urlLockUnlock       = components.Const.cake+'packages/lockunlock/';
    var urlDelete           = components.Const.cake+'packages/delete/';

    var query               = {'name' : '*'}

   
    cp.meat=function(divParent,i){

        console.log('Packages Tab!');
         //If the GUI already exists, we just need to reload the grid's data and return
        if(dijit.byId('contentPackViewGrid') != undefined){
            cp.reload(i);
            return;
        }

        
        var divGridAction= document.createElement('div');
        dojo.addClass(divGridAction, 'divGridAction');
            
            //--------------------Action Part --------------------
            var divActions = document.createElement("div");
            dojo.addClass(divActions, "divActions");
                //Add the action stuff
                components.QForms.addAction({Name:'View selected',Type:'view',Parent: divActions,Action:cp.actionView,Id:null});
                components.QForms.addAction({Name:'Lock/Unlock selected',Type:'key',Parent: divActions,Action:cp.actionLockUnlock,Id:null});
                components.QForms.addAction({Name:'Delete selected',Type:'delete',Parent: divActions,Action:cp.actionDelete,Id:null});
        dojo.place(divActions,divGridAction);


            //-------------------Filter + Refresh------------------------
            var filter = document.createElement('span');
            filter.innerHTML ='<b>'+"Filter "+'</b>';
            dojo.place(filter, divGridAction);
            var filter_val = new dijit.form.TextBox({name: 'Filter', trim: true, style: "width: 140px;"},document.createElement("div"));


            dojo.connect(filter_val,'onKeyUp',function(e){
                var filterOn = filter_on.attr('value');
                console.log("The value to filter..."+ filterOn);
                var val = filter_val.attr('value');
                query = {'name' : val+'*'};
                dijit.byId('contentPackViewGrid').setQuery(query);
            });

            dojo.place(filter_val.domNode, divGridAction);
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
            console.log(contentBox);

            var hight = (contentBox.h-92)+'';
            var s = "height: "+hight+"px ; padding: 20px;";
            console.log(s);

             var cpExp   =   new dijit.layout.ContentPane({
                                style:      s
                            },document.createElement("div"));
            dojo.place(cpExp.domNode,divParent);


                //----Grid Start----------------

                    var layout = [
                        { field: "name", name: "Name", width: 'auto' },
                        { field: "version", name: "Version", width: 'auto' },
                        { field: "state", name: "State", width: '100px', formatter: formatState, sortDesc: true }
                    ];

                    var grid = new dojox.grid.DataGrid({
                        id: 'contentPackViewGrid',
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

            dojo.style(divParent,"backgroundColor","#fffed8");
            dojo.addClass(divParent, "divPackUpdates");

            cp.reload(i);

            //=================================
            //Formatter to display values
            function formatState(value){
                if(value == this.value){
                    return value;
                }
                switch(value){
                    case 'open':
                        return "<div style='widgth:100%; height:100%; background-color:#5af93b;'><b>"+value+"</b></div>";
                    case 'locked':
                        return "<div style='widgth:100%; height:100%; background-color:#effd05;'><b>"+value+"</b></div>";
                }
            }
            //===============================

        },100);


        /*

        setTimeout(function(){

            var timestamp = Number(new Date());
            if(dojo.byId("contentPackMeat") == undefined){
                cp.buildLayout(divParent,i);        //If there is no layout yet - create it
            }

            //Not the root node - so we check the type of node
            if(i.type == 'repo'){
                content.Pack.type    = 'repo';
                content.Pack.what    = 'repository'
            }

             if(i.type == 'arch'){
                content.Pack.type    = 'repoarch';
                content.Pack.what    = 'architecture'
            }

            if(i.type == 'release'){
                content.Pack.type    = 'distro';
                content.Pack.what    = 'distribution'
            }

            if(i.type == 'comp'){
                content.Pack.type    = 'distrocomp';
                content.Pack.what    = 'component'
            }

            dijit.byId("componentsMainStatus").attr('content','Packages: '+content.Pack.what+' <b>'+ i.name +'</b> selected');  //Create the toaster
            cp.currentURL   = urlPackagesIndex+content.Pack.type+'/'+i.id+'/';
            var sel_url     = cp.currentURL+timestamp;                                        //The URL to get the info for the grid
            var jsonStore = new dojox.data.QueryReadStore({ url: sel_url });                                                    //Data store for the grid
            dijit.byId('contentPackViewGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true});                              //Add the store to the grid

        },500);

        */

    }

    cp.buildLayout  = function(divParent,i){

        var divContainer        = document.createElement("div");
        divContainer.id         = "contentPackMeat";
        dojo.addClass(divContainer, "tabGridOutside");

            var divWrapper  = document.createElement('div');
            dojo.addClass(divWrapper, "tabGridPackages");

                var divActions = document.createElement("div");
                dojo.addClass(divActions, "divActions");
            
                    //Add the action stuff
                    components.QForms.addAction({Name:'View selected',Type:'view',Parent: divActions,Action:cp.actionView,Id:null});
                    components.QForms.addAction({Name:'Lock/Unlock selected',Type:'key',Parent: divActions,Action:cp.actionLockUnlock,Id:null});
                    components.QForms.addAction({Name:'Delete selected',Type:'delete',Parent: divActions,Action:cp.actionDelete,Id:null});

                dojo.place(divActions,divWrapper);
            dojo.place(document.createTextNode('Name filter '),divWrapper);
 
                //Search entry
                var t = new dijit.form.TextBox({id:'contentPackViewFilter',name: 'Filter', trim: true, style: "width: 140px;"},document.createElement("div"));
                dojo.connect(t,'onKeyUp',function(e){

                    var val = t.attr('value');
                    var query = {'name' : val+'*'};
                    dijit.byId('contentPackViewGrid').setQuery(query);
                });
            dojo.place(t.domNode,divWrapper);
            
                //Feedback on searches        
                var divResults      = document.createElement("div");
                divResults.id       = 'contentPackViewRes';
                dojo.addClass(divResults, "tabGridResults");
            dojo.place(divResults,divWrapper);

                //----Grid Start----------------
                var divGrid     = document.createElement("div");    //The Div must have its own div to fit in
                dojo.addClass(divGrid, "divG");

                var layout = [
                                { field: "name", name: "Name", width: 'auto' },
                                { field: "version", name: "Version", width: 'auto' },
                                { field: "state", name: "State", width: '100px', formatter: formatState, sortDesc: true }
                            ];

                    var grid = new dojox.grid.DataGrid({
                                id: 'contentPackViewGrid',
                                structure: layout,
                                rowsPerPage: 40,
                                rowSelector: '20px'
                                }, document.createElement("div"));

                    dojo.connect(grid,'updateRowCount', function(){

                        dojo.byId('contentPackViewRes').innerHTML = "<b>Result count: </b>"+ dijit.byId('contentPackViewGrid').rowCount;
                    });
                 
                dojo.place(grid.domNode,divGrid,'first');
                    grid.startup();
                //---- END Grid----------------
            
            dojo.place(divGrid,divWrapper);
        dojo.place(divWrapper,divContainer);
        dojo.place(divContainer,divParent);

        //=================================
        //Formatter to display values
        function formatState(value){
                if(value == this.value){
                    return value;
                }
                switch(value){
                    case 'open':
                        return "<div style='widgth:100%; height:100%; background-color:#5af93b;'><b>"+value+"</b></div>";
                    case 'locked':
                        return "<div style='widgth:100%; height:100%; background-color:#effd05;'><b>"+value+"</b></div>";
                }
        }
        //===============================
    //--END FUNCTION--
    }

    cp.reload       = function(i){


        var timestamp = Number(new Date());
        //Not the root node - so we check the type of node
        if(i.type == 'repo'){
            content.Pack.type    = 'repo';
            content.Pack.what    = 'repository';
        }

        if(i.type == 'arch'){
            content.Pack.type    = 'repoarch';
            content.Pack.what    = 'architecture';
        }

        if(i.type == 'release'){
            content.Pack.type    = 'distro';
            content.Pack.what    = 'distribution';
        }

        if(i.type == 'comp'){
            content.Pack.type    = 'distrocomp';
            content.Pack.what    = 'component';
        }

        dijit.byId("componentsMainStatus").attr('content','Packages: '+content.Pack.what+' <b>'+ i.name +'</b> selected');  //Create the toaster
        cp.currentURL   = urlPackagesIndex+content.Pack.type+'/'+i.id+'/';
        var sel_url     = cp.currentURL+timestamp;                                        //The URL to get the info for the grid
        var jsonStore = new dojox.data.QueryReadStore({ url: sel_url });                                                    //Data store for the grid
        dijit.byId('contentPackViewGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true});                              //Add the store to the grid

    }

    cp.actionView   = function(){

        console.log("View action clicked");
        var items = dijit.byId('contentPackViewGrid').selection.getSelected();
        if(items.length){
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id      = dijit.byId('contentPackViewGrid').store.getValue(selectedItem,'id');
                                var p_name  = dijit.byId('contentPackViewGrid').store.getValue(selectedItem,'name');
                                dijit.byId('componentsMainToaster').setContent('Opening package detail for '+p_name,'message',components.Const.toasterInfo);
                                dojo.publish("/actions/VievPackage", [id,p_name]);
                                console.log("Package with id "+id+" selected");
                            }
                        });
        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }
    }

    cp.actionLockUnlock   = function(){
        console.log("Lock / Unlock action clicked");
        cp.selectionWorker('Lock / Unlock Packages',urlLockUnlock);
    }

    cp.actionDelete   = function(){
        console.log("Delete action clicked");
        cp.selectionWorker('Deleting Packages',urlDelete);
    }

    cp.selectionWorker     = function(message,url){            //Takes a toaster message + an url to call with the list of selected packages

        var items = dijit.byId('contentPackViewGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent(message,'message',components.Const.toasterInfo);
            var itemList =[];
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentPackViewGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });
            cp.doSelection(message,url,itemList);

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }
    }

    cp.doSelection    = function(message,urlToCall,itemList){

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
                            var jsonStore = new dojox.data.QueryReadStore({ url: cp.currentURL+ts });
                            dijit.byId('contentPackViewGrid').setStore(jsonStore,{'name':'*'},{ignoreCase: true});
                            
                        },500);
                    };
                    if(response.json.status == 'error'){
                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                    }
                }
        });

    }

})();//(function(){