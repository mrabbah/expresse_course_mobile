define(['jquery', 'commun', 'jqm'], function ($, commun) {		
	
	var motdepasseoublier = {
        init : function() {
            console.log('calling init motdepasseoublier.js');
            initF();
        }
    };
    return motdepasseoublier;

	function initF() {
		initActions();
	};
	
	function initActions() {
		$(".RecupererMotPasseOublie").click(function(event) {
	        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	        var email = $("#emailMotPasseOublie").val();
	        if (email.length == 0) {
	            alert("Merci de saisir votre email");
	        }
	        else if (!pattern.test(email)) {
	            alert("Merci d'entrer un email valide");
	        }
	        else {
	            motpasseOublie(email);
	        }
	    });
	};

	function motpasseOublie(email) {
	    var url = "http://" + commun.ipserver + "/mobile/motPasseOublie";
	    $.ajax({
	        type: "POST",
	        url: url,
	        data: {emailoublie: email},
	        beforeSend: function() {
	            $.mobile.loading('show', {
	                text: 'En cours...',
	                textVisible: true,
	                theme: 'c',
	                html: ""
	            });
	        },
	        success: function(data) {
	            $.mobile.loading('hide');
	            if (data) {
	                alert("Votre mot de passe a été envoyé à votre boite mail.");
	                $("#emailMotPasseOublie").val();
	            }
	            else {
	                alert("L'adresse que vous avez saisie n'est associé à aucune personne.");
	            }
	        },
	        error: function(xhr, status, error) {
	            $.mobile.loading('hide');
	            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
	        }
	    });
	}
	;

});