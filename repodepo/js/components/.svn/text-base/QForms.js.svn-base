dojo.provide("components.QForms");

dojo.require("dijit.form.Button");
dojo.require("dijit.Dialog");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CheckBox");


(function(){

    var cqf              = components.QForms;

    //-----------------------------------------
    //--SampleCall :components.QForms.addPair({label:'Phone Home',divToAdd: divRealmAdd,inpName:'PhoneHome',inpRequired:false});
    //----------------------------------------
  
      cqf.addPair  = function(pairData){

        /* pairData contents 
            label       -> the lable of the pair
            divToAdd    -> the div where the lable will be added
            inpRequired -> true/false style accordingly + dojo specific
            inpName     -> name of from element
            value       -> if a value must be displayed
            id          -> dijit id
            pw          -> true/false if it must be of type "password"
        */

         var lbl =document.createElement('label');
                var txt=document.createTextNode(pairData.label);
            lbl.appendChild(txt);
        dojo.place(lbl,pairData.divToAdd);

        //Change the label class if not required
        if(pairData.inpRequired){
            dojo.addClass(lbl, "frmRequired");
        }else{
            dojo.addClass(lbl, "frmOptional");
        }

        //type = text if
        var t = 'text';
        if(pairData.pw){
            t = 'password';
        }

            var inp = new dijit.form.ValidationTextBox({ name:pairData.inpName,required:pairData.inpRequired, value: pairData.value,id: pairData.id,type:t},document.createElement("div"));
        dojo.place(inp.domNode,pairData.divToAdd);

             var br2=document.createElement('BR');
        if(pairData.isLast){
            //Skip the clear all
        }else{
                br2.clear = 'all';
        }

        dojo.place(br2,pairData.divToAdd);
    }


    //-----------------------------------------
    //--SampleCall :components.QForms.addCheckPair({label:'Phone Home',divToAdd: divRealmAdd,inpName:'PhoneHome',inpRequired:false,checked: 'checked',value: 'on'});
    //----------------------------------------
  
     cqf.addCheckPair  = function(pairData){

         var lbl =document.createElement('label');
                var txt=document.createTextNode(pairData.label);
            lbl.appendChild(txt);
        dojo.place(lbl,pairData.divToAdd);

        //Change the label class if not required
        if(pairData.inpRequired){
            dojo.addClass(lbl, "frmRequired");
        }else{
            dojo.addClass(lbl, "frmOptional");
        }
        if(pairData.checked == undefined ){
                var chk = new dijit.form.CheckBox({name:pairData.inpName, value:'on', type:'checkbox',id: pairData.id},document.createElement("div"));
            dojo.place(chk.domNode,pairData.divToAdd);
        }else{
                 var chk = new dijit.form.CheckBox({name:pairData.inpName, checked:pairData.checked, value:'on', type:'checkbox',id: pairData.id},document.createElement("div"));
            dojo.place(chk.domNode,pairData.divToAdd);
        }

             var br2=document.createElement('BR');
        if(pairData.isLast){
            //Skip the clear all
        }else{
                br2.clear = 'all';
        }

        dojo.place(br2,pairData.divToAdd);
    }


    //-----------------------------------------
    //--SampleCall :components.QForms.addLabelPair({label:'Total Packages',divToAdd: divRealmAdd,labelVarId:'contentUpdatesProgressTotal'});
    //----------------------------------------

     cqf.addLabelPair  = function(pairData){

         var lbl =document.createElement('label');
                var txt=document.createTextNode(pairData.label);
            lbl.appendChild(txt);
        dojo.place(lbl,pairData.divToAdd);

         var lbl_var =document.createElement('label');
            lbl_var.id = pairData.labelVarId;
            dojo.addClass(lbl_var, "lblFeedback");
           // dojo.style(logo,"paddingLeft","90px");
        dojo.place(lbl_var,pairData.divToAdd);

          
             var br2=document.createElement('BR');
        if(pairData.isLast){
            //Skip the clear all
        }else{
                br2.clear = 'all';
        }

        dojo.place(br2,pairData.divToAdd);
    }



    cqf.addAction = function(actionData){

        var l   = document.createElement('a');
        l.href  ='#';
        l.title = actionData.Name;
        dojo.addClass(l, 'FancyIcon');
        //l.appendChild(document.createTextNode('Create Single'+actionData.Type));
        var i   = document.createElement('div');
        dojo.addClass(i, actionData.Type);
        dojo.place(i,l);
        dojo.place(l,actionData.Parent);

        dojo.connect(l,'onclick',function(){

            actionData.Action(actionData.Id);
            //Component:'content.Realms',Action:'createPDF'

        });
    }

    cqf.addComboBox = function(comboData){
     //-----------------------------------------
    //--SampleCall :components.QForms.addComboBox({label:'Realms',url: "/realms/json_index",divToAdd: divContainer,inpName:'Realm',inpRequired:true,isLast:false,searchAttr: 'name',id: 'CcID5'});
    //----------------------------------------
        var s = comboData.searchAttr;
        var v = String(comboData.DisplayedValue);
        var lbl = document.createElement('label');
            var txt = document.createTextNode(comboData.label);
        lbl.appendChild(txt);
        dojo.place(lbl,comboData.divToAdd);

            var store           = new dojo.data.ItemFileReadStore({url: comboData.url});
            console.log(store);

            var inpCombo        = new dijit.form.FilteringSelect({ name: comboData.inpName, store: store, searchAttr: s,required: comboData.inpRequired,id: comboData.id}, 
                                    document.createElement("div"));

            
            if(comboData.DisplayedValue != undefined){
                inpCombo.setDisplayedValue(v);
            }

        dojo.place(inpCombo.domNode,comboData.divToAdd);

        var br1=document.createElement('br');
        if(comboData.isLast){
            //Skip the clear all
        }else{
                br1.clear = 'all';
        }
        dojo.place(br1,comboData.divToAdd);
    }

    cqf.addNumberSpinner = function(numberData){
    //-----------------------------------------
    //--SampleCall :components.QForms.addNumberSpinner({label:'Batch Size',valShow:'2',min:2,max:100,divToAdd: divContainer,inpName:'Size',inpRequired:true,isLast:false});
    //----------------------------------------

        var lbl = document.createElement('label');
            var txt = document.createTextNode(numberData.label);
        lbl.appendChild(txt);
        dojo.place(lbl,numberData.divToAdd);

            var inpNumber = new dijit.form.NumberSpinner({
                                    name: numberData.inpName,
                                    value: numberData.valShow,
                                    id: numberData.id,
                                    smallDelta: 1,
                                    intermediateChanges: true,
                                    constraints: { min:numberData.min, max:numberData.max, places:0 }
                            }, document.createElement("div") );
        dojo.place(inpNumber.domNode,numberData.divToAdd);
        

        var br1=document.createElement('br');
        if(numberData.isLast){
            //Skip the clear all
        }else{
                br1.clear = 'all';
        }
        dojo.place(br1,numberData.divToAdd);

    }

    cqf.addDateTextBox = function(dateData){
    //-----------------------------------------
    //--SampleCall :components.QForms.addDateTextBox({label:'Batch Size',divToAdd: divContainer,inpName:'ExpireOn',inpRequired:true,isLast:false});
    //----------------------------------------


        var lbl = document.createElement('label');
            var txt = document.createTextNode(dateData.label);
        lbl.appendChild(txt);
        dojo.place(lbl,dateData.divToAdd);

        var inpDate = new dijit.form.DateTextBox({required:dateData.inpRequired,name:dateData.inpName},document.createElement("div"));
        dojo.place(inpDate.domNode,dateData.divToAdd);

        var br1=document.createElement('br');
        if(dateData.isLast){
            //Skip the clear all
        }else{
                br1.clear = 'all';
        }
        dojo.place(br1,dateData.divToAdd);

    }

    cqf.addHeading = function(headingData){
     //-----------------------------------------
    //--SampleCall :components.QForms.addHeading({size:2,content:"Create Voucher",divToAdd: divContainer});
    //----------------------------------------
            var h =document.createElement("h"+headingData.size);
            h.innerHTML = headingData.content;

        dojo.place(h,headingData.divToAdd);
    }

    cqf.formatStatus = function(value){
            
        if(value == this.value){
                return value;
        }
        switch(value){
        case 'new':
            return "<div style='widgth:100%; height:100%; background-color:#5af93b;'><b>"+value+"</b></div>";
        case 'used':
            return "<div style='widgth:100%; height:100%; background-color:#effd05;'><b>"+value+"</b></div>";
        case 'depleted':
            return "<div style='widgth:100%; height:100%; background-color:#f91308;'><b>"+value+"</b></div>";
        }
    }

    cqf.deleteConfirm = function(confirmData){
        //-----------------------------------------------------------------
        //--- Delete Dialog specific to the Configuration of Repositories--
        //--SampleCall :components.QForms.deleteConfirm({url:'/c2/repo/repisitories/del/,id: '8908908rfr'});
        //-----------------------------------------------------------------
        dlgConfirm = new dijit.Dialog({
            title: "Confirm Action",
            style: "width: 300px"
        });
        var divConfirm      = document.createElement('div');
            var divMessage  = document.createElement('div');
            divMessage.innerHTML = '<b>Warning!</b><br>Are you sure you want to continue with your action?';
            var divActions  = document.createElement('div');
               
                var btnNo = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'Cancel',iconClass:"cancelIcon"},document.createElement("div"));
                dojo.place(btnNo.domNode,divActions);
                var btnYes = new dijit.form.Button({style:"margin:10px; margin-left:1px",label:'OK',iconClass:"okIcon"},document.createElement("div"));
                dojo.place(btnYes.domNode,divActions);

                dojo.connect(btnNo,'onClick',function(){

                    dlgConfirm.destroyDescendants();
                    dlgConfirm.destroy();
                })

                dojo.connect(btnYes,'onClick',function(){

                    dojo.xhrGet({
                        url: confirmData.url+confirmData.id,
                        preventCache: true,
                        handleAs: "json",
                        load: function(response){
                            if(response.json.status == 'ok'){ 

                                console.log('Remove the item from the datastore...');
                                content.Trees.confStore.fetchItemByIdentity({
                                    identity : confirmData.id,
                                    onItem : function(item, request) {
                                        var delRepo = item;
                                        content.Trees.confStore.deleteItem(delRepo);
                                        content.Trees.confStore.save();
                                        //Clear the previous meat
                                        dojo.byId("contentConfigureMeat").innerHTML = '';

                                        //Destroy the previous frmRepoEdit form
                                        if(dijit.byId('frmRepoEdit') != undefined){
                                            dijit.byId('frmRepoEdit').destroyDescendants(true);
                                            dijit.byId('frmRepoEdit').destroy(true);
                                        }
                                        if(confirmData.description != undefined){

                                            dijit.byId('componentsMainToaster').setContent(confirmData.description,'message',components.Const.toasterInfo);
                                        }
                                    }
                                });

                            }
                        }
                    });
                    dlgConfirm.destroyDescendants();
                    dlgConfirm.destroy();
                })

        dojo.place(divMessage,divConfirm); 
        dojo.place(divActions,divConfirm);

        dlgConfirm.attr("content", divConfirm);
        dlgConfirm.show();


    }

})();