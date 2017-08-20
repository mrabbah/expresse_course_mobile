define(['jquery', 'commun', 'jqm'], function ($, commun) {

	console.log('in tranchehoraire.js');
	
	var tranchehoraire = {
		init : function() {
			console.log('calling init tranchehoraire');
			initF();
		}
	};
	return tranchehoraire;

	
	function initF() {
		initActionsChoixTranche();
		getTrancheHoraire();
	};

	function initActionsChoixTranche() {
	    $("ul").on('click', '.createCourse', function() {
	        var idTrancheHoraire = $(this).attr("id");
	        window.localStorage.setItem("idTrancheHoraire", idTrancheHoraire);
	        $.mobile.changePage('nouvellecourse.html', {transition : 'slide'});
	    });
	}
	;
	function getTrancheHoraire() {

		var dayOfWeek = window.localStorage.getItem("dayOfWeek");
		var dateSelected = window.localStorage.getItem("dateSelected");
		var typeService = window.localStorage.getItem("typeService");
		commun.askServer('getTrancheHoraireByNameDay',{daySelected: dayOfWeek, typeService: typeService}, trancheHoraireLoaded,true);	    

	};
	function trancheHoraireLoaded(data) {		
		var list = $("#trancheHorairej").listview();
        $(list).empty();
        $(list).append('<li data-role="list-divider" >Sélectionner la tranche horaire</li>');
        $.each(data, function(key, value) {
            if (isStartedTimeGreatherEndedTime(value.heureFin)) {
                $(list).append('<li data-theme=""> <a href="javascript:void(0)" id="' + value.id + '" data-transition="slide" class="ui-state-disabled createCourse">' + value.heureDebut + ' - ' + value.heureFin + '<span class="ui-li-count">Complet</span></a></li>');
            }
            else {
                $(list).append('<li data-theme=""> <a href="javascript:void(0)" id="' + value.id + '" data-transition="slide" class="createCourse">' + value.heureDebut + ' - ' + value.heureFin + '<span class="ui-li-count">' + value.valeurPromotion + '</span></a></li>');
            }
        });
        $(list).listview('refresh');
	};
	function isStartedTimeGreatherEndedTime(endTime) {
		var dateSelected = new Date(window.localStorage.getItem("dateSelected"));
	    var curentDateObject = new Date();

	    if(curentDateObject.getDate() != dateSelected.getDate()) {
	    	return false;
	    } else {
	    	var endTimeArray = endTime.split(':');
		    var endTimeObject = new Date();
		    endTimeObject.setHours(endTimeArray[0], endTimeArray[1], 0);
		    if (curentDateObject > endTimeObject) {
		        return true;
		    }
		    else {
		        return false;
		    }
	    }	    
	}
	;
});