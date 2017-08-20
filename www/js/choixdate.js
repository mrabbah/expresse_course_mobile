define(['jquery', 'commun', 'jqm', 'jqmdatebox'], function ($, commun) {
	
	console.log('in choixdate.js');
	
	var choixdate = {
		init : function() {
			console.log('calling init choixdate');
			initF();
		}
	};
	return choixdate;
	
	function initF() {
		var now = new Date();
		$('#datecourse').datebox({
		    mode: "calbox",
		    afterToday: true,
		    maxDays : 5,
		    useInline: true,
		    calOnlyMonth : true,
		    calHighToday : false,
		    calNoHeader : true,
		    //overrideDateFormat :"%A, %B %-d, %Y"
		    //defaultValue : now,
		    showInitialValue : true,
		    hideInput : true,
		    themeDateToday : 'c',
		    themeDatePick : 'c',
		    themeDayHigh : 'c'
		});
	
		/*  */
		$('#gotochoixtranche').click(function(e) {
			var dateObject = $('#datecourse').datebox('getTheDate'),
    		theDate =  $('#datecourse').datebox('callFormat', '%Y-%m-%d', dateObject);
    		//alert(theDate);
            var date = new Date(theDate);
            if(commun.isValidDate(date)) {
            	var weekday = new Array(7);
	            weekday[0] = "Dimanche";
	            weekday[1] = "Lundi";
	            weekday[2] = "Mardi";
	            weekday[3] = "Mercredi";
	            weekday[4] = "Jeudi";
	            weekday[5] = "Vendredi";
	            weekday[6] = "Samedi";
	            var dayOfWeek = weekday[date.getUTCDay()];
	            window.localStorage.setItem("dayOfWeek", dayOfWeek);
	            window.localStorage.setItem("dateSelected", date);
            	$.mobile.changePage('tranchehoraire.html', 
                    {transition : 'slide'});  
            } else {
            	alert('Merci de choisir une date valide');
            }
            
        });
	};

});
