define(['jquery', 'commun', 'jqm'], function ($, commun) {	
	
	$( document ).on( "pagecontainerbeforehide", function ( event, ui ) {
	  	if(IntIDD) {
	  		clearInterval(IntIDD);
	  	}
	});

	var detailtracking = {
        init : function() {
            console.log('calling init detailtracking.js');
            initF();
        }
    };
    return detailtracking;
	
	
	function initF() {
		//window.localStorage.setItem("notifcoursier", 1);
		initVariables();
		//initDesign();						
		//initActionsButton();
		

	    //Lancement du tracking
	    var numeroCourse = window.localStorage.getItem("numeroCourse");
	    tacking_course(numeroCourse);
	    refreshtracking();
	};

	var firstcall;
	var IntIDD;
	
	function initVariables() {
		firstcall = true;
	};

	
	function initDesign() {
		
		
		/*var iduser = window.localStorage.getItem("iduser");
		if(iduser != null) {
			//$("#buttonchat").css("", "");
		} else {
			$("#buttonchat").css("display", "none");
		}*/
	};
	/*function initActionsButton() {
		console.log('initaction buttons detailtracking.js');

    	$("#fermermenu").click(function(event) {		
    		console.log('closing menu');	
        	$("#menulistTracking").popup('close');
    	});
    	$("#appelercoursier").click(function(event) {
        	var numcoursier = window.localStorage.getItem("numeroCoursier");
        	console.log('numcoursier = ' + numcoursier);
        	if(numcoursier !== 'null') {
        		console.log('numcoursier = ' + numcoursier);
        		window.open('tel:' + numcoursier, '_system');
        	} else {
        		//alert("Vous pouvez appeler le coursier dès qu'il est entrain d'effectuer la course");
        		window.open('tel:0619900009', '_system');
        	}
        	$("#menulistTracking").popup('close');
    	});
    	$("#voirmessages").click(function(event) {
    		var iduser = window.localStorage.getItem("iduser");
    		if(iduser != null) {
    			$.mobile.changePage('chat.html', {transition : 'slide'});
    		} else {
    			window.localStorage.setItem("lastaction", "chat");
    			$.mobile.changePage('authentification.html', {transition : 'slide'});
    		}        	
    	});
	};*/
	
	function tacking_course(numeroCourse) {
		
		if(firstcall) {
			firstcall = false;
			commun.askServer('detailTrackingByNumeroCourse',{numeroCourse : numeroCourse}, traitementTracking,null);
		} else {
			commun.askServer('detailTrackingByNumeroCourse',{numeroCourse : numeroCourse}, traitementTracking,null);
		}
	    
	};

	function traitementTracking(data) {
		var numeroCourse = window.localStorage.getItem("numeroCourse");
		$("#listTracking").html("");
        var data1 = data[2];
        var user = data[3];
        var positionUser = data[4];
        var showUser = data[5];
        var courseTermine = data[6];
		
        
        /*if (courseTermine) {
         alert('Cette course est déja térnimée.');
         }*/
         
       if (data1.length !== 0) {
            for (var i = data1.length - 1; i >= 0; i--) {
                htmlcontent = "";
//                    alert(data1[i].adresse);
                if (i == (data1.length - 1)) {
                    htmlcontent += '<div data-role="collapsible" data-collapsed="false" data-theme="b"><h4>' + data1[i].adresse + '</h4>';
                }
                else {
                    htmlcontent += '<div data-role="collapsible" data-collapsed="true"><h4>' + data1[i].adresse + '</h4>';
                }
                htmlcontent += "<b>Description</b> :" + data1[i].description + "</br>";
                htmlcontent += "1. Date soumission : " + commun.getDate(data1[i].dateCreated) + "</br>";
                htmlcontent += "2. Date début réalisation : " + commun.getDate(data1[i].dateAffectation) + "</br>";
                htmlcontent += "3. Date arrivée : " + commun.getDate(data1[i].dateDebutRealisation) + "</br>";
                htmlcontent += "4. Date achièvement : " + commun.getDate(data1[i].dateFinRealisation) + "</br>";
                htmlcontent += '</div>';
                $("#listTracking").append(htmlcontent);
            }
            $('div[data-role=collapsible]').collapsible({refresh: true});
        }
        else {
            alert("La course est prise en considération par le systéme.");
        }
	};


	function refreshtracking() {
	    IntIDD = setInterval(function() {
	    	console.log('refresh tracking 2');
	        var numeroCourse = window.localStorage.getItem("numeroCourse");
	        if(numeroCourse) {
	        	tacking_course(numeroCourse);
	        }       	
	        
	    }, 30000);
	}
	;

	
});