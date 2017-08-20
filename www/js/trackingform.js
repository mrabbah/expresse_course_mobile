define(['jquery', 'commun', 'jqm'], function ($, commun) {
	
	var trackingform = {
        init : function() {
            console.log('calling init trackingform.js');
            initF();
        }
    };
    return trackingform;

	function initF() {
		$('#gototracking').click(function(e) {		
	        //$.mobile.changePage('tracking.html', 'slide-up', false);
	        var numerocourse = $('#numerocourse').val();
	        if(numerocourse.length === 0) {
	        	alert('Merci de saisir un numéro dans le champs text!');
	        	$('#numerocourse').focus();
	        } else {
	        	commun.askServer('existeCourse',{numcourse : numerocourse}, traintementauth,true);        	        
	        }
	    });
	    //$('#numerocourse').focus();

	    //$('#numerocourse').click(function(e){ $(this).focus(); });
	};
	
	function traintementauth(data) {
		if(data === 0) {
			alert("Ce numéro de course n'existe pas!");
			$('#numerocourse').focus();
		} else {
			window.localStorage.setItem("numeroCourse", data);
			$.mobile.changePage('tracking.html', {transition : 'slide'});
		}
	};
});
