dojo.provide("content.Banner");

dojo.require("components.Const");
dojo.require("dijit.form.Button");

(function(){

    var cb= content.Banner;    //To save some typing
    var urlStatusReprepro    = components.Const.cake+'updates/statusReprepro/';

    cb.create = function(parent_dom){

                    var divBusy     = document.createElement("div");    //A Div to indicate if it is busy
                        dojo.addClass(divBusy, "divBusy");
                        dojo.style(divBusy, 'visibility', 'hidden');    //Make it hidden first
                        dojo.place(document.createTextNode('Reprepro working.....'),divBusy);
                            var br2=document.createElement('BR');
                            br2.clear = 'all';
                        dojo.place(br2,divBusy);
                            var imgBusy = new Image();
                            imgBusy.src = "img/loading/busy.gif";
                        dojo.place(imgBusy, divBusy);
                        dojo.place(divBusy, parent_dom);

                             var l = new Image();

                            l.src = "img/logo.jpg";
                            l.align="left";
                        dojo.place(l,parent_dom);

                            var logo = new Image();
                            logo.id  = "contentBannerLogo";
                            logo.src = "img/logo.png";
                            logo.align="left";
                            dojo.style(logo,"paddingLeft","90px");
                        dojo.place(logo,parent_dom);

                            var h2Descr =document.createElement('h1');
                            h2Descr.innerHTML = "Repository Manager";
                            h2Descr.id        = "contentBannerHeading";
                            dojo.style(h2Descr,"display",'inline');

                        dojo.place(h2Descr,parent_dom);

                                var btnSingleVoucher = new dijit.form.Button({
                                                            style:"margin:1px; margin-left:350px",
                                                            label:'Exit',
                                                            iconClass:"cancelIcon",
                                                            onClick: function(){ components.LoginLight.logout(); },
                                                            id:'contentBannerLogout'
                                                        },document.createElement("div"));
                        dojo.place(btnSingleVoucher.domNode, parent_dom);

                        //Add a periodic check which will report if reprepro is working
			/*
                        setInterval(function(){

                            console.log("Check reprepro....");
                            dojo.xhrGet({
                                url: urlStatusReprepro,
                                preventCache: true,
                                handleAs: "json",
                                load: function(response){

                                    //console.log(response);
                                    if(response.json.status == 'ok'){
                                        if(response.reprepro.status == 'busy'){
                                            
                                            dojo.style(divBusy, 'visibility', 'visible');
                                        }else{
                                            
                                            dojo.style(divBusy, 'visibility', 'hidden');
                                        }
                                    };
                                    if(response.json.status == 'error'){
                                        dijit.byId('componentsMainToaster').setContent(response.json.detail,'error');
                                    }
                                }
                            });

                        },5000);
			*/
                        
                    };
   

    cb.changeLogo   = function(logo_name){
        dojo.byId("contentBannerLogo").src = "img/"+logo_name;
    };

    cb.changeHeading = function(heading){
        dojo.byId("contentBannerHeading").innerHTML = heading;
    }

})();//(function(){