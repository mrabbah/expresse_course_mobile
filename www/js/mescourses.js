define(['jquery', 'commun', 'jqm'], function ($, commun) {

	var mescourses = {
        init : function() {
            console.log('calling init mescourses.js');
            initF();
        }
    };
    return mescourses;

	
	function initF() {
		initActionsMenu();
		commun.askServer('mesCourse',null, coursesChargees,null);
	};
	
	function coursesChargees(data) {
		var list = $("#mesCourse").listview();
        $(list).empty();
        //$(list).append('<li data-role="list-divider" data-theme="b">Historique des courses</li>');
        $.each(data, function(key, value) {
        	$(list).append('<li data-role="list-divider" data-theme="a">'+value.dateDebutPrevue+'<span class="ui-li-count">'+value.horaire+'</span></li><li data-theme="a"><a class="detailCourse" id="'+value.idtache+'" href="javascript:void(0)"><br/><p><strong>'+value.description+'</strong></p><p>'+value.adresse+'</p><p class="ui-li-aside"><strong>N°: '+value.idtache+'</strong></p></a></li>');                
            //$(list).append('<li data-theme=""> <a href="javascript:void(0)" id="' + value.numeroCourse + '" data-transition="slide" class="detailCourse">' + value.description + '<span class="ui-li-count">' + value.numeroCourse + '</span></a></li>');
        });
        $(list).listview('refresh');
	};
	function initActionsMenu() {
	    $("ul").on('click', '.detailCourse', function() {
	        var numeroCourse = $(this).attr("id");
	        $("#popupMenuHistorique").popup('open');
	        window.localStorage.setItem("numeroCourse", numeroCourse);
	    });

	    $(".closepopupMenuHistorique").click(function(event) {
	        $("#popupMenuHistorique").popup('close');
	    });

	    $(".TrackerHistorique").click(function(event) {	        
	        $.mobile.changePage("tracking.html", {transition: "slide"});	        
	    });	    
	};

});
