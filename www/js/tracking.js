define(['jquery', 'commun', 'jqm', 'async!http://maps.google.com/maps/api/js?key=AIzaSyA1BJQptEvuWE3ydErTy-XefyANc362mLo&libraries=places&sensor=false'], function ($, commun) {	
	
	$( document ).on( "pagecontainerbeforehide", function ( event, ui ) {
		console.log('clear interval ' + IntIDC);
	  	if(IntIDC) {
	  		clearInterval(IntIDC);
	  	}
	});

	var tracking = {
        init : function() {
            console.log('calling init tracking.js');
            initF();
        }
    };
    return tracking;
	
	
	function initF() {
		console.log('calling initF in tracking.js');
		window.localStorage.setItem("notifcoursier", 1);
		initVariables();
		initDesign();						
		initActionsButton();
		

	    //Lancement du tracking
	    var numeroCourse = window.localStorage.getItem("numeroCourse");
	    tacking_course(numeroCourse);
	    refreshtracking();
	};

	var trackingMap;
	var coursier_marker;
	var markersBounds;
	var markers;
	var firstcall;
	var IntIDC;
	
	function initVariables() {
		markersBounds = new google.maps.LatLngBounds();
		markers = [];
		firstcall = true;
	};


	function initDesign() {
		var mapheight = commun.getPageHeight() - 70;
		var stringmapheight = "" + mapheight + "px";
		console.log('height = ' + stringmapheight);
		var widthwin = $(window).width();
		var mapwidth = widthwin - 30;
		var mapwidthstring = "" + mapwidth + "px";
		console.log('width = ' + mapwidthstring);
 
		

		$("#map").css("height", stringmapheight);
		$("#map").css("width", mapwidthstring);
		$("#map").css("margin-top", "0px");
		
		var divmap = $("#map");
		var mapOptions = {
			streetViewControl: false,
			zoomControl: true,
			scaleControl: false,
		    zoom: 15
		 };
		trackingMap = new google.maps.Map(divmap[0], mapOptions);
		var position = new google.maps.LatLng(33.570187, -7.592862);
		trackingMap.setCenter(position);
		
	};
	function initActionsButton() {
		
		
		$("#details").click(function(event) {			
        	$.mobile.changePage('detailtracking.html', {transition : 'slide'});
    	});
    	$("#fermermenu").click(function(event) {		
    		console.log('closing menu');	
        	$("#menulistTracking").popup('close');
    	});
    	$("#appelercoursier").click(function(event) {
        	var numcoursier = window.localStorage.getItem("numeroCoursier");
        	if(numcoursier !== 'null') {
        		console.log('numcoursier = ' + numcoursier);
        		window.open('tel:' + numcoursier, '_system');
        	} else {
        		//alert("Vous pouvez appeler le coursier dès qu'il est entrain d'effectuer la course");
        		window.open('tel:0619900009', '_system');
        	}
        	$("#menulistTracking").popup('close');
    	});
    	/*$("#voirmessages").click(function(event) {
    		var iduser = window.localStorage.getItem("iduser");
    		if(iduser != null) {
    			$.mobile.changePage('chat.html', {transition : 'slide'});
    		} else {
    			window.localStorage.setItem("lastaction", "chat");
    			$.mobile.changePage('authentification.html', {transition : 'slide'});
    		}        	
    	});*/
	};
	
	function tacking_course(numeroCourse) {
		
		if(firstcall) {
			firstcall = false;
			commun.askServer('trackingByNumeroCourse',{numeroCourse : numeroCourse}, traitementTracking,null);
		} else {
			commun.askServer('trackingByNumeroCourse',{numeroCourse : numeroCourse}, traitementTracking,null);
		}
	    
	};
	function traitementTracking(data) {
		var numeroCourse = window.localStorage.getItem("numeroCourse");
		
        var data1 = data[2];
        var user = data[3];
        var positionUser = data[4];
        var showUser = data[5];
        console.log('showUser = ' + showUser);
        var courseTermine = data[6];
		show_marker(data1, numeroCourse);
        if (showUser) {
            draw_user(user, positionUser);
        } else {
        	var notifcoursier = window.localStorage.getItem("notifcoursier");
        	if(notifcoursier === "1") {
        		window.localStorage.setItem("notifcoursier", 2);
        		//alert("Le coursier va apparaître sur la carte dès qu'il commence la course!");
        	} 
        	window.localStorage.setItem("numeroCoursier", null);
        }
        
        /*if (courseTermine) {
         alert('Cette course est déja térnimée.');
         }*/
	};

	function clearMarkers() {
		for(var i=0; i < markers.length; i++) {
	        var mk = markers.pop();
	        mk.setMap(null);
	    }
	    //coursier_marker.setMap(null);
	    markersBounds = new google.maps.LatLngBounds();
	};

	function show_marker(data, numeroCourse) {	    
		//clearMarkers();
	    var comptTemp = -1;
	    var nbEndroit = 0;
	    
	    for (var i = 0; i < data.length; i++) {
	        var statusCourse = data[i].status;
	        var origin1 = data[i].latLng.split(',');

	        var templat = parseFloat(origin1[0].trim());
			var templng = parseFloat(origin1[1].trim());
			var latLng = new google.maps.LatLng(templat, templng);
			
			console.log('status = ' + statusCourse + ' -> ' + data[i].description);

	        if (statusCourse === "EN COURS") {
	            comptTemp = i;
	        } else {
	        	
	        	trackingMap.setCenter(latLng);
	        	var marker = new google.maps.Marker({
			      position: latLng,
			      map: trackingMap,
			      animation: google.maps.Animation.DROP,
			      title: data[i].description
			      ,icon : 'images/step_marker.png'
			    });
			    markersBounds.extend(latLng);
			    
                markers.push(marker);
                
	            
	        }
	        nbEndroit++;
	    }
	    if (comptTemp > -1) {
	    	console.log('comptTemp > -1');
	        var origin1 = data[comptTemp].latLng.split(',');
	        var templat = parseFloat(origin1[0].trim());
			var templng = parseFloat(origin1[1].trim());
			var latLng = new google.maps.LatLng(templat, templng);
			
			trackingMap.setCenter(latLng);
			var marker = new google.maps.Marker({
		      position: latLng,
		      map: trackingMap,
		      animation: google.maps.Animation.DROP,
		      title: data[i].description
		      ,icon : 'images/goal_marker.png'
		    });
		    markersBounds.extend(latLng);
		    
            markers.push(marker);
     		
	    }

	    
	    console.log('nb endroid = ' + nbEndroit);
	    if(nbEndroit > 1) {
	    	console.log('fit bounds');
	    	trackingMap.fitBounds(markersBounds);
	    } else {
	    	//
	    }
	};
	function draw_user(user, positionUser) {
		console.log('drawing agent');
		window.localStorage.setItem("numeroCoursier", user.gsm);
	    
	    var origin2 = positionUser.latLng.split(',');

	    var templat = parseFloat(origin2[0].trim());
		var templng = parseFloat(origin2[1].trim());
		var latLng = new google.maps.LatLng(templat, templng);

		if(coursier_marker) {
			coursier_marker.setVisible(false);
			coursier_marker.setPosition(latLng);
		    coursier_marker.setVisible(true);
		} else {
			coursier_marker = new google.maps.Marker({
		      position: latLng,
		      map: trackingMap,
		      animation: google.maps.Animation.DROP,
		      title: user.nom
		      ,icon : 'images/moto_marker.png'
		    });
		}
		
	    markersBounds.extend(latLng);

	    trackingMap.fitBounds(markersBounds);
	    
	};

	function refreshtracking() {
	    IntIDC = setInterval(function() {

	    	console.log('refresh tracking 1');
	        var numeroCourse = window.localStorage.getItem("numeroCourse");
	        if(numeroCourse) {
	        	tacking_course(numeroCourse);
	        }       	
	        
	    }, 30000);
	}
	;


});