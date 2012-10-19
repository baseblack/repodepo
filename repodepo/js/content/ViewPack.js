dojo.provide("content.ViewPack");

(function(){
    var cvp = content.ViewPack;

    var urlPackagesView    = components.Const.cake+'packages/view/';

   
    cvp.create=function(divParent,id){

        console.log("Package Detail comming up...."+id);

        setTimeout(function () {

        //Focus on tab
        dijit.byId("contentWorkspaceTabcontainer").selectChild(dijit.byId('contentWorkspacePackageList'+id));
            
       //----------------
         //Tab Container
        var tc = new dijit.layout.TabContainer({
            tabPosition: "top",
            style : "width:auto;height:100%; padding: 10px; background: #fffed8 url('../img/package_grad.png') repeat-x;"
        },document.createElement("div"));
        dijit.byId('contentWorkspacePackageList'+id).attr('content',tc.domNode);
            //Tab
            var tcDetail    = new dijit.layout.ContentPane({title : "Detail",href: urlPackagesView+'detail/'+id,iconClass:'detailTab'});

            //Tab
            var tcFiles     = new dijit.layout.ContentPane({title : "Files",href:urlPackagesView+'files/'+id,iconClass:'filesTab'});

            //Tab
            var tcActivity  = new dijit.layout.ContentPane({title : "History",href:urlPackagesView+'activity/'+id,iconClass:'historyTab'});
           

        tc.addChild(tcDetail);
        tc.addChild(tcFiles);
        tc.addChild(tcActivity);

        //Att the tabs to the Div FeedBack wrapper
        dojo.place(tc.domNode,cp.domNode,'last');
        //---------------------

        //Initialise the tabs
        tc.startup();

        },1000);

    }

})();//(function(){