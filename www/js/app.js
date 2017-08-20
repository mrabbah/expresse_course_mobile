
define(['jquery', 'commun', 'index', 'jqm'], function ($, commun, index) {	
    var app = {
 
        initialize: function() {
            this.bindEvents();
        },
 
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
 
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
        },
 
        receivedEvent: function(id) {
        	$(document).ready(function() {
                index.testFirstConnect();	
	    		index.initmainmenu();
	    		index.initanimations();
    		});

            //Main initialisation of object
            $(document).on("pagecontainerbeforeshow", function (e, ui) {
                var toPage = ui.toPage[0].id;
                console.log("toPage: " + toPage);
                var prevPage = ui.prevPage[0].id;
                console.log("Prev Page: " + prevPage);
                
                if(toPage) {
                    require([toPage],function(objet) {
                        objet.init();
                    });
                    //require([toPage]);
                    //window[toPage].init();
                }
                
                
            });
        }
    };
    return app;
});