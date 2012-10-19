dojo.provide("content.Configure.Root");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("components.QForms");
dojo.require("components.Const");
/*
---------------------------------------------------------------------------
---- Content.Configure.Root -----------------------------------------------
---------------------------------------------------------------------------
--Function: Add a repository to the root of the repositories tree --
-- Important 'global' resources: --
-- 'contentConfigureMeat' => The Div containing the feedback of the tree node selected --
-- 'frmRepoAdd' the form used to add a repo to the root of the repositories tree --
-- 'content.Trees.confStore' the write store for the repositories tree --
--------------------------------------------------------------------------
*/

(function(){

    var ccr= content.Configure.Root;
    var urlRepoAdd          = components.Const.cake+'repositories/add';

    ccr.meatRoot = function(){

        //----Prepare the feeback div--
        dojo.byId("contentConfigureMeat").innerHTML = '';   //Clear the feedback div

        if(dijit.byId('frmRepoAdd') != undefined){ //If there exist such a node destroy it

            dijit.byId('frmRepoAdd').destroyDescendants(true); 
            dijit.byId('frmRepoAdd').destroy(true);
        }

        if(dijit.byId('inpRepoAdd') != undefined){ //If there exist such a node destroy it

            dijit.byId('inpRepoAdd').destroyDescendants(true); 
            dijit.byId('inpRepoAdd').destroy(true);
        }

         if(dijit.byId('btnRepoAdd') != undefined){ //If there exist such a node destroy it

            dijit.byId('btnRepoAdd').destroyDescendants(true); 
            dijit.byId('btnRepoAdd').destroy(true);
        }


        //--End of prepare feedback div--

        //--Create a form to add a repository--
        var frmRepoAdd    = new dijit.form.Form({id:"frmRepoAdd",jsId:"frmRepoAdd", encType:"multipart/form-data",action:"",method:"POST"},document.createElement("div"));
        dojo.place(frmRepoAdd.domNode,dojo.byId("contentConfigureMeat")); //Add the form to the feedback div

            var divRoot  = document.createElement('div');
            dojo.addClass(divRoot, 'divTabForm');

                var logo = new Image();
                            logo.id  = "contentBannerLogo";
                            logo.src = "img/actions/new_48.png";
                            logo.align="left";
            dojo.place(logo,divRoot);

                components.QForms.addHeading({size:2,content:"New Repository",divToAdd: divRoot});
                components.QForms.addPair({label:'Repository Name',divToAdd: divRoot,inpName:'repoName',inpRequired:true, isLast:true,id:'inpRepoAdd'});
                var btnRepoAdd = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Save',iconClass:"saveIcon",id:'btnRepoAdd'},document.createElement("div"));

            dojo.place(btnRepoAdd.domNode,divRoot);

                //--------------------------------------------------------------------
                //--Action on button click--
                dojo.connect(btnRepoAdd,'onClick',function(){

                    //Duplicate check
                    var newValue = dijit.byId('inpRepoAdd').getDisplayedValue();
                    var flagDefined = false;
                    content.Trees.confStore.fetch({
                        query: {type : "repo"},
                        onItem : function(item, request) {
                                    var thisName = content.Trees.confStore.getValue(item, "name");
                                    if(thisName==newValue){
                                        flagDefined = true;
                                    }
                                }
                        });
                    if(flagDefined == true){
                        dijit.byId('componentsMainToaster').setContent('Value already defined','error',components.Const.toasterError);
                        return;
                    }
                    //End Duplicate Check

                    if(frmRepoAdd.validate()){
                        console.log("Valid Form, add Repository....");
                        //Add this via a AJAX Call
                        dojo.xhrPost({
                        url: urlRepoAdd,
                        form: dojo.byId('frmRepoAdd'),
                        handleAs: "json",
                        load: function(response){
                                if(response.json.status == 'ok'){
                                   var repoName = response.repository.name;
                                   var newItem  = content.Trees.confStore.newItem({
                                        id :response.repository.id,
                                        name : response.repository.name,
                                        type : "repo"
                                    });
                                    content.Trees.confStore.save();
                                    dijit.byId('componentsMainToaster').setContent('New Repository added','message',components.Const.toasterInfo);
                                    //----Prepare the feeback div--
                                    dojo.byId("contentConfigureMeat").innerHTML = '';   //Clear the feedback div

                                    if(dijit.byId('frmRepoAdd') != undefined){ //If there exist such a node destroy it

                                        dijit.byId('frmRepoAdd').destroyDescendants(true); 
                                        dijit.byId('frmRepoAdd').destroy(true);
                                    }
                                    //--End of prepare feedback div--
                                }

                                if(response.json.status == 'error'){

                                    dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                }
                             }
                            });
                            
                  
                    }else{
                        console.log("Please Enter Valid.....");
                        dijit.byId('componentsMainToaster').setContent('Please Enter Valid Values.....','error',components.Const.toasterError);
                    }
                });
                //--END Action on Button Click--
                //--------------------------------------------------------------------------

            dojo.place(divRoot,frmRepoAdd.domNode);
    }

})();//(function(){