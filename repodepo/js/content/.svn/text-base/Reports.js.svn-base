dojo.provide("content.Reports");

dojo.require("components.Const");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.grid.DataGrid");


(function(){
    var cr = content.Reports;
    //Define url's used here
    var urlUpdatesCompleted     = components.Const.cake+'updates/completed/';
    var urlUpdatesReport        = components.Const.cake+'updates/updatesReport/';

    cr.meat=function(divParent,i){

        setTimeout(function(){

            //Not the root node - so we check the type of node
            if(i.type == 'repo'){
                dijit.byId('componentsMainToaster').setContent('Reports only available on achitectures','error',components.Const.toasterError);
                return;
            }

            var timestamp = Number(new Date());

            if(dojo.byId("contentReportsMeat") == undefined){
                cr.buildLayout(divParent,i);        //If there is no layout yet - create it
            }

             if(i.type == 'arch'){
                content.Reports.type    = 'repoarch';
                content.Reports.what    = 'architecture'
            }

          
            dijit.byId("componentsMainStatus").attr('content','Reports: '+content.Reports.what+' <b>'+ i.name +'</b> selected');  //Create the toaster
            cr.currentURL   = urlUpdatesCompleted+content.Reports.type+'/'+i.id+'/';
            var sel_url     = cr.currentURL+timestamp;                                        //The URL to get the info for the grid
            var jsonStore = new dojo.data.ItemFileReadStore({ url: sel_url });                                                    //Data store for the grid
            dijit.byId('contentReportsViewGrid').setStore(jsonStore,{'repo':'*'},{ignoreCase: true});                              //Add the store to the grid

        },500);

    }

    cr.buildLayout  = function(divParent,i){

        console.log("Building the layout of Reports");
        var contentBox = dojo.contentBox(divParent);    //Get the size of this tab's content div

        console.log(contentBox);

        var new_height = contentBox.h; //Size minus 20px (to be safe)
        dojo.style(divParent,{'height':new_height+'px'});

        //--------------------------------------------------------
        var divTop  = document.createElement("div");
        divTop.id   = "contentReportsMeat";
        dojo.addClass(divTop, "divTop");

            var divActions = document.createElement("div");
            dojo.addClass(divActions, "divActions");
                components.QForms.addAction({Name:'Generate Report',   Type:'reports',  Parent: divActions,Action:cr.updatesReport,Id:null});
            dojo.place(divActions,divTop);
        dojo.place(divTop,divParent);
        //--------------------------------------------------------

        //--------------------------------------------------------
        var divBottom  = document.createElement("div");
        dojo.addClass(divBottom, "divBottom");
        bHeight = new_height - 80;
        dojo.style(divBottom,{'height':bHeight+'px'});

            //----Grid Start----------------
           var layout = [
                { field: "repo", name: "Repository", width: 'auto' },
                { field: "arch", name: "Architecture", width: 'auto' },
                { field: "date", name: "Date", width: 'auto' },
                { field: "total", name: "Count", width: '100px' }
            ];

            var grid = new dojox.grid.DataGrid({
                id: 'contentReportsViewGrid',
                structure: layout,
                rowsPerPage: 40,
                rowSelector: '20px'
            }, document.createElement("div"));


            dojo.addClass(grid.domNode,'divBlG');
            dojo.place(grid.domNode,divBottom);
        dojo.place(divBottom,divParent);

            grid.startup();
            //---- END Grid----------------

        //dojo.place(divBottom,divParent);
        //-------------------------------------------------------
    }


    cr.updatesReport    = function(){

        console.log('Generate Report Clicked!');

        var items = dijit.byId('contentReportsViewGrid').selection.getSelected();

        if(items.length){
            dijit.byId('componentsMainToaster').setContent('Generating Report','message',components.Const.toasterInfo);
            var itemList =[];
            //Build a list of Item ID's
            dojo.forEach(
                            items,
                            function(selectedItem) {
                            if(selectedItem !== null) {
                                var id = dijit.byId('contentReportsViewGrid').store.getValue(selectedItem,'id');
                                itemList.push(id);
                            }
                        });
            // console.log(itemList);
            var list_of_updates ='?';
            dojo.forEach(itemList,function(i,count){
             //   console.log("ITEM "+i);
             //   console.log("Count "+ count);
                list_of_updates = list_of_updates+count+'='+i+'&';
            });

           // console.log(list_of_updates);
            window.open(urlUpdatesReport+list_of_updates);

        }else{

            dijit.byId('componentsMainToaster').setContent('No Selection made','error',components.Const.toasterError);
        }

    }


})();//(function(){