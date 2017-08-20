define(['jquery', 'commun', 'jqm'], function ($, commun) {	
	console.log('in typeservices.js');
	
	var typeservices = {
		init : function() {
			initF();
		}
	};
	return typeservices;

	function initF() {
		console.log('calling init');
		selectTypeService();
	};
	
	function selectTypeService() {
	    $("ul").on('click', '.tcac', function() {
	        var typeService = "Course d'achat";
	        window.localStorage.setItem("typeService", typeService);
	        lunchDatePicker(typeService);
	    });

	    $("ul").on('click', '.tcad', function() {
	        var typeService = "Course administrative";
	        window.localStorage.setItem("typeService", typeService);
	        lunchDatePicker(typeService);
	    });

	    $("ul").on('click', '.tcme', function() {
	        var typeService = "Messagerie";
	        window.localStorage.setItem("typeService", typeService);
	        lunchDatePicker(typeService);
	    });
	}
	;


	function lunchDatePicker(typeService) {
		window.localStorage.setItem("typeService", typeService);
		$.mobile.changePage('choixdate.html', 
                        {transition : 'slide'});  
	    
	};
	
});