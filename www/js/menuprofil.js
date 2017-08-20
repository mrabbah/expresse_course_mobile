define(['jquery', 'commun', 'jqm'], function ($, commun) {

    var menuprofil = {
        init : function() {
            console.log('calling init menuprofil.js');
            initF();
        }
    };
    return menuprofil;
    
    function initF() {
        $('#deconnexion').click(function(e) {
            //$('#userpopup').popup("close");
            nettoyerLocalStorage();
            console.log("os type = " + commun.getOsType());
            if(commun.getOsType() !== 'ios') {
                arretServiceNotification();
            }
            
            /*$('imgauth').attr("src", "img/personal-256.png");
            $('imgauth').attr("alt", "Connexion");*/
            alert('Vous êtes déconnecté avec succès!');
            $.mobile.changePage('index.html', {transition : 'slide'});
        });
        $('#modifiercompte').click(function(e) {
            //$('#userpopup').popup("close");
            $.mobile.changePage('inscription.html', {transition : 'slide'});                    
        });
    };
	
	function arretServiceNotification() {            
        chatNotification.clear(function(){}, function(){}); 
    };
        //Nettoyer en cas de deconnexion
    function nettoyerLocalStorage() {
        window.localStorage.clear();
        window.localStorage.setItem("first", "false");
    };

});
