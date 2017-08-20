define(['jquery', 'commun', 'jqm'], function ($, commun) {

	var inscription = {
        init : function() {
            console.log('calling init inscription.js');
            initF();
        }
    };
    return inscription;

	function initF() {
		initView();
		initActions();	
	};
	
	function initView() {
		var iduser = window.localStorage.getItem("iduser");
		
		if(iduser) {			
	        var nom = window.localStorage.getItem("nom");
	        var prenom = window.localStorage.getItem("prenom");
	        var login = window.localStorage.getItem("login");
	        var telephone = window.localStorage.getItem("telephone");
	        var email = window.localStorage.getItem("email");
	        
	        $("#nom").val(nom);
	        $("#prenom").val(prenom);
	        $("#tel").val(telephone);
	        $("#email").val(email);
	        $("#login").val(login);
	        $("#inscription #passwordDiv").css('display', 'none');
	        $("#inscription #passwordConfirmationDiv").css('display', 'none');
	        $("#divlogin").hide();
	        $("#textmoncompte").html("Modifier mon compte");
		}
	};

	function initActions() {
	    $(".soumettreInscription").click(function(event) {
	        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	        var iduser = window.localStorage.getItem("iduser");
	        var nom = $("#nom").val().trim();
	        var prenom = $("#prenom").val().trim();
	        var tel = $("#tel").val().trim();
	        var email = $("#email").val().trim();
	        var login = $("#login").val().trim();
	        var password = $("#password").val().trim();
	        var passwordConfirmation = $("#passwordConfirmation").val().trim();
	        if (!iduser) {
	            if (nom.length == 0) {
	                alert("Merci de saisir votre Nom")
	            }
	            else if (prenom.length == 0) {
	                alert("Merci de saisir votre Prénom");
	            }
	            else if (tel.length == 0) {
	                alert("Merci de saisir votre numéro de télephone");
	            }
	            else if (email.length == 0) {
	                alert("Merci de saisir votre email");
	            }
	            else if (!pattern.test(email)) {
	                alert("Merci d'entrer un email valide")
	            }
	            else if (!checkEmail(email)) {
	                alert("Cet email est déjà associé à un autre compte")
	            }
	            else if (login.length == 0) {
	                alert("Merci de saisir votre login");
	            }
	            else if (!checkLogin(login)) {
	                alert("Ce login est déjà associé à un autre compte")
	            }
	            else if (password.length == 0 && iduser == "") {
	                alert("Merci de saisir votre mot de passe");
	            }
	            else if (passwordConfirmation.length == 0 && iduser == "") {
	                alert("Merci de retaper le mot de passe saisie");
	            }
	            else if (iduser == "" && passwordConfirmation != password) {
	                alert("Merci de retaper votre mot de passe correctement");
	            }
	            else {
	            	window.localStorage.setItem("nom", nom);
			        window.localStorage.setItem("prenom", prenom);
			        window.localStorage.setItem("login", login);
			        window.localStorage.setItem("telephone", tel);
			        window.localStorage.setItem("email", email);
			        window.localStorage.setItem("password", password);
	            	commun.askServer('inscription',
	            		{nom: nom, prenom: prenom, tel: tel, email: email, login: login, password: password}, 
	            		newUserSuccess,true);	                
	            }
	        }
	        else {
	            if (nom.length == 0) {
	                alert("Merci de saisir votre Nom");
	            }
	            else if (prenom.length == 0) {
	                alert("Merci de saisir votre Prénom");
	            }
	            else if (tel.length == 0) {
	                alert("Merci de saisir votre numéro de télephone");
	            }
	            else if (email.length == 0) {
	                alert("Merci de saisir votre email");
	            }
	            else if (!pattern.test(email)) {
	                alert("Merci d'entrer un email valide")
	            }
	            else if (!checkEmailModifierProfil(iduser, email)) {
	                alert("Cet email est déjà associé à un autre compte");
	            }
	            else if (login.length == 0) {
	                alert("Merci de saisir votre login");
	            }
	            else if (!checkLoginModifierProfil(iduser, login)) {
	                alert("Ce login est déjà associé à un autre compte");
	            }
	            else {
	            	commun.askServer('modifierProfil',
	            		{nom: nom, prenom: prenom, gsm: tel, email: email}, 
	            		updateUserSuccess,true);		                
	            }
	        }
	    });
	};
	function checkLoginModifierProfil(id, login) {
	    var got = "none";
	    var email = email;
	    var url = "http://" + commun.ipserver + "/Mobile/checkloginmodifierprofil";
	    var data = {id: id, login: login};
	    $.ajax({
	        type: 'POST',
	        url: url,
	        data: data,
	        success: function(result) {
	            if (result === "true") {
	                got = false;
	            }
	            else if (result === "false") {
	                got = true;
	            }
	        },
	        dataType: "text",
	        async: false
	    });
	    return got;
	}
	;
	function checkEmailModifierProfil(id, email) {
	    var got = "none";
	    var email = email;
	    var url = "http://" + commun.ipserver +"/Mobile/checkemailmodifierprofil";
	    var data = {id: id, email: email};
	    $.ajax({
	        type: 'POST',
	        url: url,
	        data: data,
	        success: function(result) {
	            if (result === "true") {
	                got = false;
	            }
	            else if (result === "false") {
	                got = true;
	            }
	        },
	        dataType: "text",
	        async: false
	    });
	    return got;
	}
	;
	function checkLogin(login) {
	    var got = "none";
	    var email = email;
	    var url = "http://" + commun.ipserver + "/utilisateur/checklogin";
	    var data = {login: login};
	    $.ajax({
	        type: 'POST',
	        url: url,
	        data: data,
	        success: function(result) {
	            if (result === "true") {
	                got = false;
	            }
	            else if (result === "false") {
	                got = true;
	            }
	        },
	        dataType: "text",
	        async: false
	    });
	    return got;
	}
	;	
	function checkEmail(email) {
	    var got = "none";
	    var email = email;
	    var url = "http://" + commun.ipserver + "/utilisateur/checkemail";
	    var data = {email: email};
	    $.ajax({
	        type: 'POST',
	        url: url,
	        data: data,
	        success: function(result) {
	            if (result === "true") {
	                got = false;
	            }
	            else if (result === "false") {
	                got = true;
	            }
	        },
	        dataType: "text",
	        async: false
	    });
	    return got;
	}
	;
	function updateUserSuccess(data) {
		window.localStorage.setItem("nom", data.nom);		
        window.localStorage.setItem("prenom", data.prenom);
        window.localStorage.setItem("login", data.login);
        window.localStorage.setItem("telephone", data.gsm);
        window.localStorage.setItem("email", data.email);
        alert('Votre compte a été modifié avec succès');
        clear_form_inscription();
        $.mobile.changePage("index.html", {transition: "slideup"});        
	};
	function newUserSuccess(data) {
		if(data < 0) {
			alert('Erreur lors de votre inscription\nVeillez contacter notre support');
		} else {
			window.localStorage.setItem("iduser", data);	
			alert('Vous vous être inscris avec succès');
			clear_form_inscription();
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
	function clear_form_inscription() {
	    $("#nom").val("");
	    $("#prenom").val("");
	    $("#tel").val("");
	    $("#email").val("");
	    $("#login").val("");
	    $("#password").val("");
	    $("#passwordConfirmation").val("");
	}
	;
});