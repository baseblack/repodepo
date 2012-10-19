dojo.provide("content.Configure");
dojo.require("dijit.form.Form");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");

dojo.require("components.QForms");
dojo.require("components.Const");

dojo.require("dijit.Dialog");



(function(){
    var cc= content.Configure;

   
    cc.meat=function(divParent,i){

        //Feedback block
        if(dojo.byId("contentConfigureMeat") == undefined){         //If the DIV 'contentConfigureMeat' does not exists - create it
            divConfig       = document.createElement("div");
            divConfig.id    = "contentConfigureMeat";
            dojo.place(divConfig,divParent);
        }

        if(i.root == true){

            dojo.require("content.Configure.Root");
            dojo.addOnLoad(function(){
                dijit.byId("componentsMainStatus").attr('content','Configure: root node selected');
                content.Configure.Root.meatRoot();
            });
        }else{

            //Not the root node - so we check the type of node
            if(i.type == 'repo'){
                dojo.require("content.Configure.Repo");
                dojo.addOnLoad(function(){
                    var repoName    = i.name;
                    var repoId      = i.id;
                    dijit.byId("componentsMainStatus").attr('content','Configure: repository <b>'+ repoName +'</b> selected');
                    content.Configure.Repo.meatRepo(repoId,repoName);
                });
            }
            if(i.type == 'arch'){
                dojo.require("content.Configure.Arch");
                dojo.addOnLoad(function(){
                    var archName    = i.name;
                    var archId      = i.id;
                    dijit.byId("componentsMainStatus").attr('content','Configure: architecture <b>'+ archName +'</b> selected');
                    content.Configure.Arch.meatArchitecture(archId,archName);
                });
            }

            if(i.type == 'release'){
                dojo.require("content.Configure.Distro");
                dojo.addOnLoad(function(){
                    var distroName    = i.name;
                    var distroId      = i.id;
                    dijit.byId("componentsMainStatus").attr('content','Configure: distribution <b>'+ distroName +'</b> selected');
                    content.Configure.Distro.meatDistribution(distroId,distroName);
                });
            }

            if(i.type == 'comp'){
                dojo.require("content.Configure.Distrocomp");
                dojo.addOnLoad(function(){
                    var compName    = i.name;
                    var compId      = i.id;
                    dijit.byId("componentsMainStatus").attr('content','Configure: component <b>'+ compName +'</b> selected');
                    content.Configure.Distrocomp.meatDistrocomp(compId,compName);
                });
            }
        }
    }

})();//(function(){