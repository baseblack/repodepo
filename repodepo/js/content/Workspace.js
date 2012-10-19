dojo.provide("content.Workspace");

dojo.require("dijit.layout.TabContainer");
dojo.require("content.Homepage");
dojo.require("content.ViewPack");
//dojo.require("content.Configure");

(function(){

    var cw= content.Workspace;
    cw.create=function(cpWorkspace){


        var tcWorkarea      = new dijit.layout.TabContainer({
            id:             'contentWorkspaceTabcontainer',
            tabPosition:    'top',
            style :         'width:100%;height:100%; background-color: #2287a8;'
        },document.createElement("div"));
        cpWorkspace.attr('content',tcWorkarea.domNode);
     
             var divMain     = document.createElement("div");
             var tabMain     = new dijit.layout.ContentPane({title : "Home",iconClass:'homeTab'},divMain);
                 
             content.Homepage.create(divMain);
             tcWorkarea.addChild(tabMain);
             tcWorkarea.startup();
             tcWorkarea.layout();


            dojo.subscribe("/actions/Configure",function(item){

                var ttc = 'contentWorkspaceConfigure';
                var tTitle = 'Configure';
                //Check if tab is in existance....
                if(dijit.byId(ttc)){

                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }else{

                    var tabCreated  = new dijit.layout.ContentPane({id:ttc, title: tTitle, closable: true, selected: "true",iconClass:'configureTab'}, document.createElement("div"));
                    dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    //ao.contentFunc(tabCreated.domNode);
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }

                //Meat (content) of the tab depends on the node selected.....
                dojo.require("content.Configure");
                dojo.addOnLoad(function(){

                    content.Configure.meat(dijit.byId(ttc).domNode,item);   //The Confugure Module works / displays all the meat
                });
            });


            dojo.subscribe("/actions/Updates",function(item){

                var ttc = 'contentWorkspaceUpdates';
                var tTitle = 'Updates';
                //Check if tab is in existance....
                if(dijit.byId(ttc)){

                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }else{

                    var tabCreated  = new dijit.layout.ContentPane({id:ttc, title: tTitle, closable: true, selected: "true",iconClass:'updatesTab'}, document.createElement("div"));
                    dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    //ao.contentFunc(tabCreated.domNode);
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }

                //Meat (content) of the tab depends on the node selected.....

                dojo.require("content.Updates");
                dojo.addOnLoad(function(){

                    content.Updates.meat(dijit.byId(ttc).domNode,item); 
                });

            });


          


            dojo.subscribe("/actions/Packages",function(item){

                var ttc = 'contentWorkspacePackages';
                var tTitle = 'Packages';
                //Check if tab is in existance....
                if(dijit.byId(ttc)){

                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }else{

                    var tabCreated  = new dijit.layout.ContentPane({id:ttc, title: tTitle, closable: true, selected: "true",iconClass:'packagesTab'}, document.createElement("div"));
                    dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    //ao.contentFunc(tabCreated.domNode);
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
                }

                //Meat (content) of the tab depends on the node selected.....
                
                dojo.require("content.Pack");
                dojo.addOnLoad(function(){

                    content.Pack.meat(dijit.byId(ttc).domNode,item); 
                });

            });


    dojo.subscribe("/actions/Reports",function(item){

        var ttc = 'contentWorkspaceReports';
        var tTitle = 'Reports';
        //Check if tab is in existance....
        if(dijit.byId(ttc)){

            dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
        }else{

            var tabCreated  = new dijit.layout.ContentPane({id:ttc, title: tTitle, closable: true, selected: "true",iconClass:'reportsTab'}, document.createElement("div"));
            dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    //ao.contentFunc(tabCreated.domNode);
            dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ttc));
        }

            //Meat (content) of the tab depends on the node selected.....

            dojo.require("content.Reports");
            dojo.addOnLoad(function(){

                content.Reports.meat(dijit.byId(ttc).domNode,item); 
            });

    });

    cw.makeTab({ 
                    eventToSubscribe : "/actions/VievPackage",
                    tabToCreate: 'contentWorkspacePackageList',
                    tabTitle : 'Package',
                    contentFunc : content.ViewPack.create,
                    iconClass : 'packagesTab'
    });


};

    //In JS Size is everythin --- Here we shorten the tabcreation process with this slick function
    cw.makeTab = function(ao){

        dojo.subscribe(ao.eventToSubscribe,function(id,tabName){

            if(id == undefined){
                if(dijit.byId(ao.tabToCreate)){
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ao.tabToCreate));
                }else{
                    var tabCreated  = new dijit.layout.ContentPane({id:ao.tabToCreate, title: ao.tabTitle, closable: true, selected: "true",iconClass: ao.iconClass}, document.createElement("div"));
                    dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    ao.contentFunc(tabCreated.domNode);
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ao.tabToCreate));
                }
            }else{
                if(dijit.byId(ao.tabToCreate+id)){
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ao.tabToCreate+id));
                }else{
                    var tabCreated  = new dijit.layout.ContentPane({id:ao.tabToCreate+id, title: tabName, closable: true, selected: "true",iconClass: ao.iconClass }, document.createElement("div"));
                    dijit.byId("contentWorkspaceTabcontainer").addChild(tabCreated);
                    ao.contentFunc(tabCreated.domNode,id);
                    dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId(ao.tabToCreate+id));
                }
            }
        });

    };
})();//(function(){