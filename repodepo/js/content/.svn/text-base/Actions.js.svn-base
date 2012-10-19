dojo.provide("content.Actions");
dojo.require("dijit.layout.AccordionContainer");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("content.Trees");

(function(){

    var ca= content.Actions;
    ca.create  = function(domParent){

        var accordion = new dijit.layout.AccordionContainer({}, document.createElement("div"));
    
            var apUpdates = new dijit.layout.AccordionPane({id:"contentActionsUpdates",title:"Updates",selected:true}, document.createElement("div"));
            apUpdates.onSelected = function(){
                console.log("Updates Pane selected!!");
                dijit.byId("componentsMainStatus").attr('content','Updates Pane selected');
                content.Trees.createUpdates(apUpdates);  //The configure tree
                content.Banner.changeHeading("Manage Updates");
                content.Banner.changeLogo("updates.png");
            }
        accordion.addChild(apUpdates);
        //Prime it
        content.Trees.createUpdates(apUpdates);

    

            var apPackages    = new dijit.layout.AccordionPane({id:"contentActionsPackages",title:"Packages",selected:false}, document.createElement("div"));
            apPackages.onSelected = function(){
                console.log("Packages Pane selected!");
                dijit.byId("componentsMainStatus").attr('content','Packages Pane selected');
                content.Trees.createPackages(apPackages);
                content.Banner.changeHeading("Manage Packages");
                content.Banner.changeLogo("package.png");
            }

        accordion.addChild(apPackages);

            var apReports    = new dijit.layout.AccordionPane({id:"contentActionsReports",title:"Reports",selected:false}, document.createElement("div"));
            apReports.onSelected = function(){
                console.log("Reports Pane selected!");
                dijit.byId("componentsMainStatus").attr('content','Reports Pane selected');
                content.Trees.createReports(apReports);  //The configure tree
                content.Banner.changeHeading("Update Reports");
                content.Banner.changeLogo("reports.png");
            }

        accordion.addChild(apReports);


            var apConfigure    = new dijit.layout.AccordionPane({id:"contentActionsConfigure",title:"Configure",selected:false}, document.createElement("div"));
            apConfigure.onSelected = function(){
                console.log("Configuration Pane selected!");
                dijit.byId("componentsMainStatus").attr('content','Configuration Pane selected');
                content.Trees.createConf(apConfigure);  //The configure tree

                //content.Trees.createConf(apConfigure);  //The configure tree
                content.Banner.changeHeading("Configure Repositories");
                content.Banner.changeLogo("configure.png");
            }

        accordion.addChild(apConfigure);


        dojo.place(accordion.domNode, domParent, "first");
        accordion.startup();
    };


})();//(function(){