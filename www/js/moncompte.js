define(['jquery', 'commun', 'jqm'], function ($, commun) {	

    var moncompte = {
        init : function() {
            console.log('calling init moncompte.js');
            initF();
        }
    };
    return moncompte;
    
    function initF() {
        initActions();  
    };

	function initActions() {
		$('.deconnexion').click(function(e) {
			//Se deconnecter
            nettoyerLocalStorage();
            console.log("os type = " + commun.getOsType());
            if(commun.getOsType() !== 'ios') {
                arretServiceNotification();
            }
            
            $('imgauth').attr("src", "img/personal-256.png");
            $('imgauth').attr("alt", "Connexion");
            alert('Vous êtes déconnecté avec succès!');
            $.mobile.changePage('index.html', {transition : 'slide'}); 
		});
	};

	//Nettoyer en cas de deconnexion
    function nettoyerLocalStorage() {
        window.localStorage.clear();
        window.localStorage.setItem("first", "false");
    };

    function arretServiceNotification() {            
        chatNotification.clear(function(){}, function(){}); 
    };
});