dojo.provide("content.Homepage");

(function(){
    var homepage= content.Homepage;
    homepage.create=function(divParent){

        var divContainer     = document.createElement('div');
        dojo.addClass(divContainer, 'divTabForm');
        divContainer.innerHTML = "<h2>Quick Help</h2>"+
                        '<p>'+
                        'A web application to manage .deb repositories.<br>'+
                        'Selecting an action on the left will result on feedback  in this pane.<br>'+
                        'You can always close the feedback tabs to keep things simple.'+
                       '</p>';
        dojo.place(divContainer,divParent);

    }
})();//(function(){