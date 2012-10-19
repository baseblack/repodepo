dojo.provide("content.Trees");
dojo.require("dijit.Tree");
dojo.require("dojo.data.ItemFileWriteStore");

(function(){

    var ct= content.Trees;

    var urlTree    = components.Const.cake+'repositories';
    var urlTreeRA  = components.Const.cake+'repositories/index/true';

    ct.createUpdates   = function(pane){
                            //Kill old element

                            var myStore = new dojo.data.ItemFileWriteStore({url:urlTree,urlPreventCache:true});
                            content.Trees.updateStore = myStore;
                            var myModel = new dijit.tree.ForestStoreModel({
                                                store: myStore,
                                                query: {name:'*'},
                                                childrenAttr: "children"
                            });

                            var tree = new dijit.Tree({
                                    model: myModel,
                                    childrenAttr: "children",
                                    showRoot: false,
                                    getIconClass: function(item){
                                        if(item.errors=='true'){
                                            return "warnIcon";
                                        }else{
                                            return item.type+"Icon";
                                        }
                                    },
                                    onClick: function(item){
                                        console.log("Clicked "+item.name+" type is "+ item.type+" domnode title "+ pane.id);
                                        content.Trees.UpdateSelectItem = item;
                                        dojo.publish("/actions/Updates", [content.Trees.UpdateSelectItem]);
                                    }
              
                            });
                            tree.startup();

                            

                            //Clear the previous one
                            pane.containerNode.innerHTML = "";

                            var divContainer     = document.createElement('div');
                            dojo.addClass(divContainer, 'actionUpdates');
                            dojo.place(tree.domNode,divContainer);
                            pane.containerNode.appendChild(divContainer);
    }

     ct.createPackages   = function(pane){
                            //Kill old element

                            var myStore = new dojo.data.ItemFileWriteStore({url:urlTree,urlPreventCache:true});
                            content.Trees.packageStore = myStore;
                            var myModel = new dijit.tree.ForestStoreModel({
                                                store: myStore,
                                                query: {name:'*'},
                                                childrenAttr: "children"
                            });

                            var tree = new dijit.Tree({
                                    model: myModel,
                                    childrenAttr: "children",
                                    showRoot: false,
                                    getIconClass: function(item){
                                        if(item.errors=='true'){
                                            return "warnIcon";
                                        }else{
                                            return item.type+"Icon";
                                        }
                                    },
                                    onClick: function(item){
                                        console.log("Clicked "+item.name+" type is "+ item.type+" domnode title "+ pane.id);
                                        content.Trees.PackageSelectItem = item;
                                        dojo.publish("/actions/Packages", [content.Trees.PackageSelectItem]);
                                    }
              
                            });
                            tree.startup();
                            //Clear the previous one
                            pane.containerNode.innerHTML = "";
                            var divContainer     = document.createElement('div');
                            dojo.addClass(divContainer, 'actionPackages');
                            dojo.place(tree.domNode,divContainer);
                            pane.containerNode.appendChild(divContainer);
    }

    ct.createReports   = function(pane){

                            var myStore = new dojo.data.ItemFileWriteStore({url:urlTreeRA,urlPreventCache:true});
                            //var myStore = new dojo.data.ItemFileWriteStore({url:'tests/mock2.json',urlPreventCache:true});
                            content.Trees.confStore = myStore;
                            var myModel = new dijit.tree.ForestStoreModel({
                                                store: myStore,
                                                query: {name:'*'},
                                                childrenAttr: "children"
                            });
                            var tree = new dijit.Tree({
                                    model: myModel,
                                    childrenAttr: "children",
                                    showRoot: false,
                                    getIconClass: function(item){
                                        if(item.root){
                                            return 'repoIcon';
                                        }
                                        if(item.errors=='true'){
                                            return "warnIcon";
                                        }else{
                                            return item.type+"Icon";
                                        }
                                    },
                                    onClick: function(item){
                                        //Check if the root node was clicked
                                            dojo.publish("/actions/Reports",[item]);
                                    }
              
                            });
                            tree.startup();
                            content.Trees.conf = tree;
                            //Clear the previous one
                            pane.containerNode.innerHTML = "";
                            pane.containerNode.appendChild(tree.domNode);
    }









    ct.createConf   = function(pane){

                            var myStore = new dojo.data.ItemFileWriteStore({url:urlTree,urlPreventCache:true});
                            //var myStore = new dojo.data.ItemFileWriteStore({url:'tests/mock2.json',urlPreventCache:true});
                            content.Trees.confStore = myStore;
                            var myModel = new dijit.tree.ForestStoreModel({
                                            store: myStore,
                                            query: {type:'*'},
                                            rootId: "root",
                                            rootLabel: "Repositories",
                                            childrenAttrs: ["children"]
                            });
                            var tree = new dijit.Tree({
                                    model: myModel,
                                    childrenAttr: "children",
                                    showRoot: true,
                                    getIconClass: function(item){
                                        if(item.root){
                                            return 'repoIcon';
                                        }
                                        if(item.errors=='true'){
                                            return "warnIcon";
                                        }else{
                                            return item.type+"Icon";
                                        }
                                    },
                                    onClick: function(item){
                                        //Check if the root node was clicked
                                            dojo.publish("/actions/Configure",[item]);
                                    }
              
                            });
                            tree.startup();
                            content.Trees.conf = tree;
                            //Clear the previous one
                            pane.containerNode.innerHTML = "";
                            pane.containerNode.appendChild(tree.domNode);
    }

})();//(function(){