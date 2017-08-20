define(['jquery', 'commun', 'jqm'], function ($, commun) {	

	var help = {
        init : function() {
            console.log('calling init help.js');
            initF();
        }
    };
    return help;

		
	function initF() {
		$('#finishreadhelp').click(function(e) {
	        window.localStorage.setItem("first", "false");
	    });
	};


});
