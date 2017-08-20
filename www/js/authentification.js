define(['jquery', 'commun', 'jqm'], function ($, commun) {  
	
	var authentification = {
		init : function() {
			console.log('calling init authentification.js');
			initF();
		}
	};
	return authentification;

	
	
	function initF() {
		initActions();	  
	};

	var passwordAu;

	function initActions() {
	    $(".seConnecter").click(function(event) {
	        var loginAu = $("#loginAu").val();
	        passwordAu = $("#passwordAu").val();
	        console.log('login = ' + loginAu);
	        console.log('pwd = ' + passwordAu);
	        if (loginAu.length == 0) {
	            alert("Merci de saisir votre Login")
	        }
	        else if (passwordAu.length == 0) {
	            alert("Merci de saisir votre mot de passe");
	        }
	        else {
	            commun.askServer('getUser',{login: loginAu, password: passwordAu}, authentificationSuccess,true);
	        }
	    });
	}
	;
	function authentificationSuccess(data) {
		if (data <= 0) {
            alert("Login et/ou mot de passe incorrect(s)");
        } else {
            window.localStorage.setItem("iduser", data.id);
            window.localStorage.setItem("nom", data.nom);
            window.localStorage.setItem("prenom", data.prenom);
            window.localStorage.setItem("login", data.login);
            window.localStorage.setItem("telephone", data.gsm);
            window.localStorage.setItem("email", data.email);
            window.localStorage.setItem("password", passwordAu);
            
            console.log("os type = " + commun.getOsType());
            if(commun.getOsType() !== 'ios') {
                lunchNotificationService();
            }
              
            var lastAction = window.localStorage.getItem("lastaction");
            if (lastAction == null) {
                $.mobile.changePage("index.html", {transition: "slideup"});
            }
            else  {
            	window.localStorage.setItem("lastaction", null);
                $.mobile.changePage(lastAction + ".html", {transition: "slideup"});
            } 
            
        }
	};
	function lunchNotificationService() {
	//    alert('lunchNotificationService');
	    var login = window.localStorage.getItem("login");
	    var password = window.localStorage.getItem("password");
	    var ipserver = commun.ipserver;
	    var iduser = window.localStorage.getItem("iduser");
	    var options = {
	        "login" : login,
	        "password" : password,
	        "ipserver" : ipserver,
	        "iduser" : iduser
	    };
	    chatNotification.setConfig(options, settingConfigSuccess, settingConfigFail);    	    
	}
	;
	function settingConfigSuccess(result) {	
	    chatNotification.startService(displayResult, displayError);
	};
	function settingConfigFail(message) {
	//    alert("fail set config: " + message);
	}

	function displayError(message) {
	//    alert("starting service fail : " + message);
	    //alert("We have an error to service : " + data.ErrorMessage);
	}
	;
	function displayResult(message) {
	//    alert("starting service success : " + message);
	}
	;	
});
