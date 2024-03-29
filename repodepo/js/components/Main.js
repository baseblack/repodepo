dojo.provide("components.Main");

dojo.require("dijit.layout.ContentPane");       //NOTE NOT REQUIRED SINCE ITS ALREADY LOADED BY  SECURITY COMPONENT
dojo.require("dojox.widget.Toaster" );
dojo.require("dijit.layout.BorderContainer");

dojo.require("content.Banner");
dojo.require("content.Actions");

(function(){

    var cm      = components.Main;
    cm.startUp  = function(){

       

        //Create a toaster
        var tstrToaster = new dojox.widget.Toaster({id: "componentsMainToaster", positionDirection: "tl-right", duration: "0", style:"display:hide"},document.createElement("div"));
        //-----------------------------------------------------------
        //---- BANNER------------------------------------------------
        //-----------------------------------------------------------
        //Create a div which will host the banner's ContentPane's div
        var cpBanner    =   new dijit.layout.ContentPane({
                            id:         "componentsMainBanner",
                            region:     "top",
                            style:      "height: 50px; color:#114354; border: 1px solid #2287a8;"
                        },document.createElement("div"));
        content.Banner.create(cpBanner.domNode);

        //-----------------------------------------------------------
        //---- WORK AREA---------------------------------------------
        //-----------------------------------------------------------
        var cpWorkspace     = new dijit.layout.ContentPane({
                            id: "componentsMainWorkspace",
                            region: "center"
                          },document.createElement("div"));
        //********** END WORK AREA *************************************


        //-----------------------------------------------------------
        //---- NAVIGATOR---------------------------------------------
        //-----------------------------------------------------------
        var cpNavigator     =   new dijit.layout.ContentPane({
                                id:         "componentsMainNavigator",
                                region:     "leading",
                                style:      "width: 200px;",
                                splitter:   true
                            },document.createElement("div"));

        content.Actions.create(cpNavigator.domNode);
        //************ END NAVIGATOR ********************************

        //-----------------------------------------------------------
        //---- STATUS BAR--------------------------------------------
        //-----------------------------------------------------------
        var cpStatus= new dijit.layout.ContentPane({
                id: "componentsMainStatus",
                region: "bottom",
                //height must be given for top/bottom panes...
                style: "height: 1em;"
        });

        //create the main application container
        var bcMainContainer     = new dijit.layout.BorderContainer({
                                id: 'componentsMainBorderContainer',
                                style: "width: 100%; height: 100%;",
                                design: "headline"
                              },document.createElement("div"));

        //Destroy the loading message (on index page)
        dojo._destroyElement(dojo.byId("divLoadingMessage"));

        dojo.place(bcMainContainer.domNode, dojo.body());
        bcMainContainer.addChild(cpBanner);
        bcMainContainer.addChild(cpWorkspace);
        bcMainContainer.addChild(cpNavigator);
        bcMainContainer.addChild(cpStatus);
    
        //tell the container to recalculate its layout...
        bcMainContainer.startup();
        bcMainContainer.layout();


        dojo.require("content.Workspace");
        dojo.addOnLoad(function(){

            content.Workspace.create(cpWorkspace);
        });

        window.onresize= function(){

            bcMainContainer.layout(); 
        };
    }; 

})();