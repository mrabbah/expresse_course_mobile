define(['jquery', 'commun', 'jqm', 'async!http://maps.google.com/maps/api/js?key=AIzaSyA1BJQptEvuWE3ydErTy-XefyANc362mLo&libraries=places&sensor=false'], function ($, commun) {
	
	var nouvellecourse = {
        init : function() {
            console.log('calling init nouvellecourse.js');
            initF();
        }
    };
    return nouvellecourse;

	function initF() {
		console.log('initF');
		
		initVariables();
		initView();
		initActions();
		
	};

	var dayOfWeek;
	var dateSelected;
	var typeService;
	var trancheHoraire;	
	var map;
	var _marker;
	var step;
	var listTask;
	var taskAchat;
	var idEndroitCarnet;
	var latLngEndroitCarnet;
	var marker;
	var plusieursendroitsachat;
	var lastdescription;
	

	function initVariables() {
		console.log('initVariables');
		dayOfWeek = window.localStorage.getItem("dayOfWeek");
		dateSelected = window.localStorage.getItem("dateSelected");
		typeService = window.localStorage.getItem("typeService");
		trancheHoraire = window.localStorage.getItem("idTrancheHoraire");	
		step = 1;
		listTask = [];
		idEndroitCarnet = null;
		latLngEndroitCarnet = null;
		plusieursendroitsachat = false;
	};

	function initView() {
		console.log('initView');
		afficherDiv('.divboutons');
		//setInfoText();
		var mapheight = commun.getPageHeight() - 70;
		var searchresultheight = mapheight - 55 - 45;
		var carnetresultheight = mapheight - 50;
		var stringmapheight = "" + mapheight + "px";
		var stringsearchresultheight = "" + searchresultheight + "px";
		var stringcarnetresultheight = "" + carnetresultheight + "px";
		$(".divsearchwrapper").css("height", stringmapheight);
		$(".divcarnetwrapper").css("height", stringmapheight);
		$(".divsearchresult").css("height", stringsearchresultheight);
		$(".divcarnetresult").css("height", stringcarnetresultheight);
		$("#map").css("height", stringmapheight);
		$("#map").css("margin-top", "0px");
		var widthwin = $(window).width();
		var searchinputwidth = widthwin - 45;
		var searchinputwidthstring = "" + searchinputwidth + "px";

		$("#pac-input").css("width", searchinputwidthstring);
		var divmap = document.getElementById("map");
		chargerMap();	
	     
	};

	function chargerMap() {
		console.log('chargerMap');
		$.mobile.loading('show', {
                text: 'Chargement de la map...',
                textVisible: true,
                theme: 'z',
                html: ""
        });

		var divmap = $("#map");

		var mapOptions = {
			streetViewControl: false,
			zoomControl: true,
			scaleControl: false,
		    zoom: 15,
		    center: { lat: 33.548915, lng: -7.638760}
		 };
		map = new google.maps.Map(divmap[0], mapOptions);
		google.maps.event.addListenerOnce(map, 'idle', function(){
		    //this part runs when the mapobject is created and rendered
		    console.log('map created and rendered');
		    $.mobile.loading('hide');  
		    setInfoText();
		});
		$('<div/>').addClass('centerMarker').appendTo(map.getDiv());

		var input = /** @type {HTMLInputElement} */(
      	document.getElementById('pac-input'));
      	var buttonSuivant = (document.getElementById('terminerBtn'));
      	var locationBtn = (document.getElementById('locationBtn'));
      	var repertoireBtn = (document.getElementById('repertoireBtn'));

      	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonSuivant);
      	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(locationBtn);
      	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(repertoireBtn);

      	var autocomplete = new google.maps.places.Autocomplete(input);
      	autocomplete.bindTo('bounds', map);

      	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		    
		    var place = autocomplete.getPlace();
		    if (!place.geometry) {
		      alert("Aucun résultat pour la recherche effectuée!");
		      return;
		    }

		    // If the place has a geometry, then present it on a map.
		    if (place.geometry.viewport) {
		      map.fitBounds(place.geometry.viewport);
		    } else {
		      map.setCenter(place.geometry.location);
		      map.setZoom(17);  // Why 17? Because it looks good.
		    }
		    positionnerMarker(place.geometry.location);
		   
		    var address = '';
		    if (place.address_components) {
		      address = [
		        (place.address_components[0] && place.address_components[0].short_name || ''),
		        (place.address_components[1] && place.address_components[1].short_name || ''),
		        (place.address_components[2] && place.address_components[2].short_name || '')
		      ].join(' ');
		    }

		  });
      	google.maps.event.addListener(map, 'center_changed', function() {
             
      		idEndroitCarnet = null;
        });

        if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude,
												 position.coords.longitude);

				map.setCenter(pos);
				positionnerMarker(pos);
			}, function() {
				handleNoGeolocation(true);
			});
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}
      	/*google.maps.event.addListener(map, 'drag', function() {
		    positionnerMarker(map.getCenter());
		});
		google.maps.event.addListener(map, 'dragend', function() {
		    positionnerMarker(map.getCenter());
		});*/
	};

	function positionnerMarker(position) {
		console.log('positionnerMarker');
		if(!marker) {
			marker = new google.maps.Marker({
	          position: position,
		      map: map,
		      animation: google.maps.Animation.DROP
		    });
		    marker.setVisible(false);
		} else {
			marker.setVisible(false);
			marker.setPosition(position);
		    //marker.setVisible(true);
		}
	};

	function handleNoGeolocation(errorFlag) {
		console.log('handleNoGeolocation');
		goToMyLocation();
	 
	};

	function afficherDiv(params) {		
		console.log('afficherDiv');	
		
		if(params !== '.divcarnet') {
			$(".divcarnet").hide();
		} else {
			$(".divcarnet").show();
		}
		
	};

	function initActions() {
		console.log('initActions');
		
		$("#panelSaveEndroit").on({ popupafteropen: function (event, ui) { $("#nomendroit").focus(); } });
		$("#descriptionTache").on({ popupafteropen: function (event, ui) { $("#descriptiontache").focus(); } });
		$("#panelSaveEndroit input").on("focus", function () {
					console.log('panelSaveEndroit input on focus');
		  			$("#panelSaveEndroit").popup("reposition", {
		    			y: 0 /* move it to top */
		  			});
		});
		$("#descriptionTache textarea").on("focus", function () {
					console.log('descriptionTache textarea on focus');
		  			$("#descriptionTache").popup("reposition", {
		    			y: 0 /* move it to top */
		  			});
		});				
		$("#repertoireBtn").click(function(event) {
			console.log('repertoireBtn click');
			
			afficherDiv('.divcarnet');
			
			commun.askServer('getCarnetAdresseUser',null, repertoireCharge,true);	    		
		});
		$("#locationBtn").click(function(event) {
			console.log('locationBtn click');
			goToMyLocation();
		});
		/*$("#infoBtn").click(function(event) {
			//afficherDiv('.divinfo');
			////map.setClickable(false);
		});*/
		$("#terminerBtn").click(function(event) {			
			console.log('terminerBtn click');
			console.log("step = " + step);
			console.log("plusieursendroitsachat = " + plusieursendroitsachat);
			console.log("idEndroitCarnet = " + idEndroitCarnet);

			if(idEndroitCarnet) {
				if(typeService === "Course d'achat") {
					if(step === 2 && !plusieursendroitsachat) {
						ajouterTacheList(lastdescription);
 						$('#recapDiv').popup("open");
						$('#recapDiv').popup( "option", "dismissible", false );
					} else {
						setTextDescriptionTache();
						$('#descriptiontache').val("");
						$('#descriptionTache').popup("open");
						$('#descriptionTache').popup( "option", "dismissible", false );					
						
					}	
				} else {
					setTextDescriptionTache();
					$('#descriptiontache').val("");
					$('#descriptionTache').popup("open");
					$('#descriptionTache').popup( "option", "dismissible", false );					
					
				}
				
				
			} else {
				//if(plusieursendroitsachat) {
					$("#panelQuestionSaveEndroit").popup( "open" );
					$("#panelQuestionSaveEndroit").popup( "option", "dismissible", false );
				//} else {

				//}
				
			}	
		});
		$("#saveEndroitNotOk").click(function(event) {	
			console.log('saveEndroitNotOk click');
			window.localStorage.setItem("lastchoice","saveEndroitNotOk");
			if(typeService === "Course d'achat") {
				if(step === 2 && !plusieursendroitsachat) {
					ajouterTacheList(lastdescription);
				} else {
					setTextDescriptionTache();
				}
			} else {
				setTextDescriptionTache();
			}
			$('#panelQuestionSaveEndroit').on("popupafterclose", function(){
				console.log('panelQuestionSaveEndroit on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoice");
				if(lastchoice === 'saveEndroitNotOk') {
					if(typeService === "Course d'achat") {
						if(step === 2 && !plusieursendroitsachat) {
	 						$('#recapDiv').popup("open");
							$('#recapDiv').popup( "option", "dismissible", false );
						} else {
							//setTextDescriptionTache();
							$('#descriptiontache').val("");
							$('#descriptionTache').popup("open");
							$('#descriptionTache').popup( "option", "dismissible", false );					
							//$('#descriptiontache').focus();	
						}	
					} else {
						//setTextDescriptionTache();
						$('#descriptiontache').val("");
						$('#descriptionTache').popup("open");
						$('#descriptionTache').popup( "option", "dismissible", false );					
						//$('#descriptiontache').focus();
					}
					
				} else {
					$('#panelSaveEndroit').popup("open");
					$('#panelSaveEndroit').popup( "option", "dismissible", false );
				}
				
			}).popup("close");					
		});
		$("#saveEndroitOk").click(function(event) {	
			console.log('saveEndroitOk click');
			window.localStorage.setItem("lastchoice","saveEndroitOk");
			$('#panelQuestionSaveEndroit').on("popupafterclose", function(){
				console.log('panelQuestionSaveEndroit on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoice");
				console.log('lastchoice = ' + lastchoice);
				if(lastchoice === 'saveEndroitNotOk') {
					setTextDescriptionTache();
					$('#descriptiontache').val("");
					$('#descriptionTache').popup("open");
					$('#descriptionTache').popup( "option", "dismissible", false );	
					//$('#descriptiontache').focus();
				} else {
					console.log('we are in the else');
					$('#panelSaveEndroit').popup("open");
					$('#panelSaveEndroit').popup( "option", "dismissible", false );
				}
			}).popup("close");					
		});	
		$("#cancelSaveEndroit").click(function(event) {		
			console.log('cancelSaveEndroit click');	
			$('#panelSaveEndroit').on("popupafterclose", function(){
				console.log('panelSaveEndroit on popupafterclose');
				setTextDescriptionTache();
				$('#descriptiontache').val("");
				$('#descriptionTache').popup("open");
				$('#descriptionTache').popup( "option", "dismissible", false );
				//$('#descriptiontache').focus();
			}).popup("close");			
		});	
		$("#saveNomEndroitOk").click(function(event) {	
			console.log('saveNomEndroitOk click');	
			var nomendroit = $("#nomendroit").val();
			if(nomendroit.length == 0) {
				alert("Merci d'indiquer un nom valide");
			} else {
				var latLng = map.getCenter();
				latLngEndroitCarnet = latLng.lat() + ", " + latLng.lng();
				console.log('latLngEndroitCarnet = ' + latLngEndroitCarnet);
				var adresse = $('#pac-input').val();
				if(adresse.length == 0) {
					adresse = nomendroit;
				}
				console.log('adresse = ' + adresse);
				commun.askServer('saveEndroit',{latLng: latLngEndroitCarnet, adresse: adresse, nom : nomendroit}, traitementApresSauveguardeEndroit,true);
				
			}
			
		});				
		$("#terminerDescriptionTache").click(function(event) {	
			console.log('terminerDescriptionTache click');
			var description = $("#descriptiontache").val();
			if(description.length < 2) {
				alert("Merci d'indique une description valide");
			} else {				
				ajouterTacheList(description);												
			}
			
		});
		$("#cancelDescriptionTache").click(function(event) {
			console.log('cancelDescriptionTache click');
			$('#descriptionTache').on("popupafterclose", function(){
				console.log('descriptionTache on popuafterclose');
				$.mobile.changePage('index.html', 'slideup');
			}).popup("close");	

		});
		
		$("#cancelCarnetBtn").click(function(event) {
			console.log('cancelCarnetBtn click');
			afficherDiv('.divboutons');
			
		});
		
		$("ul").on('click', '.carnetEndroit', function() {
			console.log('ul click .carnetEndroit');
			afficherDiv('.divboutons');
			
			latLngEndroitCarnet = $(this).attr("id"); 
			
			var latLngSelected = latLngEndroitCarnet.split(",");
			var templat = parseFloat(latLngSelected[0].trim());
			var templng = parseFloat(latLngSelected[1].trim());
			var pos = new google.maps.LatLng(templat, templng);
			map.setCenter(pos);	
			positionnerMarker(pos);
			idEndroitCarnet = $(this).attr("idendroit");	
			
		});
		
		//Guide utilisateur à travers les taches
		$("#achatUnSeulEndroitBtn").click(function(event) {
			console.log('achatUnSeulEndroitBtn click');
			window.localStorage.setItem("lastchoiceMultiEndroit","achatUnSeulEndroitBtn");
			$('#popupQuestionAchatMultiEndroit').on("popupafterclose", function(){
				console.log('popupQuestionAchatMultiEndroit on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceMultiEndroit");
				if(lastchoice === 'achatUnSeulEndroitBtn') {
					plusieursendroitsachat = false;
					//setTextDescriptionTache();
					//setInfoText();
					//map.setClickable(true);					
				} else {
					plusieursendroitsachat = true;
					//$('#recapDiv').popup("open");
					//$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});

		$("#achatPlusieursEndroitBtn").click(function(event) {
			console.log('achatPlusieursEndroitBtn click');
			window.localStorage.setItem("lastchoiceMultiEndroit","achatPlusieursEndroitBtn");
			$('#popupQuestionAchatMultiEndroit').on("popupafterclose", function(){
				console.log('popupQuestionAchatMultiEndroit on popupafterclise');
				var lastchoice = window.localStorage.getItem("lastchoiceMultiEndroit");
				if(lastchoice === 'achatUnSeulEndroitBtn') {
					plusieursendroitsachat = false;
									
				} else {
					plusieursendroitsachat = true;
					
				}
			}).popup("close");		
		});

		$("#ouiQuestionAchatEtape1").click(function(event) {
			console.log('ouiQuestionAchatEtape1 click');
			window.localStorage.setItem("lastchoiceAchat","ouiQuestionAchatEtape1");
			$('#questionAchatEtape1').on("popupafterclose", function(){
				console.log('questionAchatEtape1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAchat");
				if(lastchoice === 'ouiQuestionAchatEtape1') {
					setTextDescriptionTache();
					setInfoText();
									
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});
		$("#nonQuestionAchatEtape1").click(function(event) {
			console.log('nonQuestionAchatEtape1 click');	
			window.localStorage.setItem("lastchoiceAchat","nonQuestionAchatEtape1");
			$('#questionAchatEtape1').on("popupafterclose", function(){
				console.log('questionAchatEtape1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAchat");
				if(lastchoice === 'ouiQuestionAchatEtape1') {
					setTextDescriptionTache();
					setInfoText();
										
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});
		$("#ouiQuestionAchatNplus1").click(function(event) {	
			console.log('ouiQuestionAchatNplus1 click');
			window.localStorage.setItem("lastchoiceAchatN1","ouiQuestionAchatNplus1");
			$('#questionAchatEtapeNplus1').on("popupafterclose", function(){
				console.log('queestionActionAchatEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAchatN1");
				if(lastchoice === 'ouiQuestionAchatNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);					
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});
		$("#nonQuestionAchatNplus1").click(function(event) {
			console.log('nonQuestionAchatNplus1 click');	
			window.localStorage.setItem("lastchoiceAchatN1","nonQuestionAchatNplus1");
			$('#questionAchatEtapeNplus1').on("popupafterclose", function(){
				console.log('questionAchatEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAchatN1");
				if(lastchoice === 'ouiQuestionAchatNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);					
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");			
		});
		$("#ouiQuestionMessagerieNplus1").click(function(event) {	
			console.log('ouiQuestionMessagerieNplus1 click');
			window.localStorage.setItem("lastchoiceMess","ouiQuestionMessagerieNplus1");
			$('#questionMessagerieEtapeNplus1').on("popupafterclose", function(){
				console.log('questionMessagerieEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceMess");
				if(lastchoice === 'ouiQuestionMessagerieNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);						
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});
		$("#okInfoMessagerie").click(function(event) {	
			console.log('okInfoMessagerie click');
			$('#popupInfoMessagerie').on("popupafterclose", function(){
				console.log('popupInfoMessagerie on popupafterclose');
				//map.setClickable(true);										
			}).popup("close");	
		});
		$("#nonQuestionMessagerieNplus1").click(function(event) {	
			console.log('nonQuestionMessagerieNplus1 click');
			window.localStorage.setItem("lastchoiceMess","nonQuestionMessagerieNplus1");
			$('#questionMessagerieEtapeNplus1').on("popupafterclose", function(){
				console.log('questionMessagerieEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceMess");
				if(lastchoice === 'ouiQuestionMessagerieNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);						
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");	
		});
		$("#ouiQuestionAdministrationNplus1").click(function(event) {
			console.log('ouiQuestionAdministrationNplus1 click');	
			window.localStorage.setItem("lastchoiceAdm","ouiQuestionAdministrationNplus1");
			$('#questionAdministrationEtapeNplus1').on("popupafterclose", function(){
				console.log('questionAdministrationEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAdm");
				if(lastchoice === 'ouiQuestionAdministrationNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);					
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");		
		});
		$("#nonQuestionAdministrationNplus1").click(function(event) {
			console.log('nonQuestionAdministrationNplus1 click');	
			window.localStorage.setItem("lastchoiceAdm","nonQuestionAdministrationNplus1");
			$('#questionAdministrationEtapeNplus1').on("popupafterclose", function(){
				console.log('questionAdministrationEtapeNplus1 on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceAdm");
				if(lastchoice === 'ouiQuestionAdministrationNplus1') {
					setTextDescriptionTache();
					setInfoText();
					//map.setClickable(true);					
				} else {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				}
			}).popup("close");	
		});
		$("#ouiQuestionRecap").click(function(event) {	
			console.log('ouiQuestionRecap click');
			window.localStorage.setItem("lastchoiceRecap","ouiQuestionRecap");
			$('#recapDiv').on("popupafterclose", function(){
				console.log('recapDiv on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceRecap");
				if(lastchoice === 'ouiQuestionRecap') {
					traitemenetCourse();        			
				} else {
					$.mobile.changePage('index.html', 'slideup');
				}
			}).popup("close");	
		});
		$("#nonQuestionRecap").click(function(event) {	
			console.log('nonQuestionRecap click');
			window.localStorage.setItem("lastchoiceRecap","nonQuestionRecap");
			$('#recapDiv').on("popupafterclose", function(){
				console.log('recapDiv on popupafterclose');
				var lastchoice = window.localStorage.getItem("lastchoiceRecap");
				if(lastchoice === 'ouiQuestionRecap') {					
        			traitemenetCourse();
				} else {
					$.mobile.changePage('index.html', 'slideup');
				}
			}).popup("close");	
		});
	};
	function ajouterTacheList(description) {	
		console.log('ajouterTacheList');
		if(idEndroitCarnet) {
			var task = {adresse: null, description: description, latLng: null, idendroit : idEndroitCarnet};
			addTask(task);
						
		} else {
			addTaskGeocoding(description);
		}	

	};
	
	function addTaskGeocoding(description) {
		console.log('addTaskGeocoding');
		var latLng = map.getCenter();
		var stringlatlng = latLng.lat() + ", " + latLng.lng();
		console.log('latLngEndroitCarnet = ' + latLngEndroitCarnet);
		var adresse = $('#pac-input').val();
		if(adresse.length == 0) {
			adresse = 'VOIR POSITION SUR MAP';
		}
		console.log('adresse = ' + adresse);

		var task = {};                    	
		
		task = {adresse: adresse, description: description, latLng: stringlatlng, idendroit : null};
								
		addTask(task);
	};
	function addTask(task) {
		console.log('calling addtask step : ' + step);
		console.log(commun.syntaxHighlight(listTask));
		lastdescription = task.description;
		
		if(typeService === "Course d'achat") {
			if(step === 1) {
				task.description = "Livez les achats : " + lastdescription;
				taskAchat = task;
			} else {
				task.description = "Merci de m'acheter : " + lastdescription;
				listTask.push(task);				
			}			
		} else if(typeService === "Course administrative") {
			listTask.push(task);
		} else if(typeService === "Messagerie") {

			listTask.push(task);
		}
		console.log('after : ');
		console.log(commun.syntaxHighlight(listTask));
		//step = step + 1;				
		idEndroitCarnet = null;
		latLngEndroitCarnet = null;

		chargerEtapeSuivante();
	};

	function traitemenetCourse() {
		console.log('traitementCourse');
		if(typeService === "Course d'achat") {
			listTask.push(taskAchat);
		} 
			
		commun.askServer('createListTask',{listTask: listTask, taskCount: listTask.length, idTrancheHoraire: trancheHoraire, dateSelected: dateSelected, typeService: typeService}, createCourseDone,null);	    
	};
	function createCourseDone(data) {
		console.log('createCourseDone');
		window.localStorage.setItem("numeroCourse", data);                    
        $("#popupDialog").popup('open');
        $('#popupDialog').popup( "option", "dismissible", false );	
	}
	function chargerEtapeSuivante() {	
		console.log('chargerEtapeSuivante type ' + typeService + ' etpae : ' + step );					
		$('#descriptionTache').on("popupafterclose", function(){
			if(typeService === "Course d'achat") {
				
				if(step === 1) {
					$('#questionAchatEtape1').popup("open");
					$('#questionAchatEtape1').popup( "option", "dismissible", false );
				}else if((step === 2) && (!plusieursendroitsachat)) {
					//on doit rien afficher car l utilisateur veux acheter dun 
					//seul endroit et il a deja preciser l endroit d achat
				} else {
					$('#questionAchatEtapeNplus1').popup("open");
					$('#questionAchatEtapeNplus1').popup( "option", "dismissible", false );	
				}	
				step = step + 1;		
			} else if(typeService === "Course administrative") {
				if(step === 1) {
					step = step + 1;
					setInfoText();
					setTextDescriptionTache();
					//map.setClickable(true);	
				} else {
					step = step + 1;	
					$('#questionAdministrationEtapeNplus1').popup("open");
					$('#questionAdministrationEtapeNplus1').popup( "option", "dismissible", false );
				}
								
			} else if(typeService === "Messagerie") {
				if(step === 1) {
					step = step + 1;
					$('#popupInfoMessagerie').popup("open");
					$('#popupInfoMessagerie').popup( "option", "dismissible", false );					
					setInfoText();
					setTextDescriptionTache();
	//					//map.setClickable(true);	
				} else {
					step = step + 1;
					$('#questionMessagerieEtapeNplus1').popup("open");
					$('#questionMessagerieEtapeNplus1').popup( "option", "dismissible", false );		
				}
				
				
			}
						
		}).popup("close");	
	};
	function setInfoText() {
		console.log('setInfoText step : ' + step);
		//texteinfo
		if(typeService === "Course d'achat") {
			if(step === 1) {
				$("#texteinfo").html("Veuillez indiquez l'endroit de livraison");
				$('#popupQuestionAchatMultiEndroit').popup("open");
				$('#popupQuestionAchatMultiEndroit').popup( "option", "dismissible", false );
				$('#popupQuestionAchatMultiEndroit').popup('reposition', 'positionTo: window');
			}
			/*else if(step === 2) {
				$("#texteinfo").html("Veuillez indiquez l'endroit de livraison");	
			} */else {
				$("#texteinfo").html("Veuillez indiquez l'endroit d'achat");
			}			
		} else if(typeService === "Course administrative") {
			if(step === 1) {
				$("#texteinfo").html("Veuillez indiquez l'endroit de récupération des documents administratifs");
			} else if(step === 10000){
				$("#texteinfo").html("Veuillez indiquez l'endroit où le coursier doit vous rendre les documents");
			} else {
				$("#texteinfo").html("Veuillez indiquez l'endroit de réalisation de la tâche");
			}
			
		} else if(typeService === "Messagerie") {
			if(step === 1) {
				$("#texteinfo").html("Veuillez indiquez l'endroit de collecte : ");
			} else {
				$("#texteinfo").html("Veuillez indiquez l'endroit de livraison : ");
			}
		}
	}
	function setTextDescriptionTache() {
		console.log('setTextDescriptionTache step : ' + step);
		//textQueDoisFaire
		//Que doit faire le coursier à cet endroit?
		if(typeService === "Course d'achat") {
			if(step === 1) {
				$("#textQueDoisFaire").html("Que doit acheter le coursier?");
			} else {
				$("#textQueDoisFaire").html("Que doit acheter le coursier à cet endroit?");
			}			
		} else if(typeService === "Course administrative") {
			$("#textQueDoisFaire").html("Que doit faire le coursier à cet endroit?");			
		} else if(typeService === "Messagerie") {
			if(step === 1) {
				$("#textQueDoisFaire").html("Que doit faire le coursier à cet endroit : ");
			} else {
				$("#textQueDoisFaire").html("Que doit faire le coursier à cet endroit : ");
			}
		}
	}
	function traitementApresSauveguardeEndroit(data) {
		console.log('traitementApresSauveguardeEndroit');
		idEndroitCarnet = data;	

		if(typeService === "Course d'achat") {
			if(step === 2 && !plusieursendroitsachat) {
				ajouterTacheList(lastdescription);
			} 
		}	
		$('#panelSaveEndroit').on("popupafterclose", function(){
			console.log('panelSaveEndroit on popupafterclose');
			if(typeService === "Course d'achat") {
				if(step === 2 && !plusieursendroitsachat) {
					$('#recapDiv').popup("open");
					$('#recapDiv').popup( "option", "dismissible", false );
				} else {
					setTextDescriptionTache();
					$('#descriptiontache').val("");
					$('#descriptionTache').popup("open");
					$('#descriptionTache').popup( "option", "dismissible", false );
					//$('#descriptiontache').focus();
				}
			} else {
				setTextDescriptionTache();
				$('#descriptiontache').val("");
				$('#descriptionTache').popup("open");
				$('#descriptionTache').popup( "option", "dismissible", false );
				//$('#descriptiontache').focus();
			}
			
			
		}).popup("close");	
	};
	function repertoireCharge(data) {
		console.log('repertoireCharge');
		var list = $("#carnet").listview();
        $(list).empty();  
		$.each(data, function(key, value) {
            $(list).append('<li> <a href="javascript:void(0)" id="' + value.latLng + '" idendroit="' + value.id + '" class="carnetEndroit">' + value.nom + '</a></li>');
        });
        $(list).listview('refresh');
	};
	function rechercherAdresse(searcheadresse) {
		console.log('rechercherAdresse');
		//'Maroc, Grand Casablanca, ' + 
		var request = {'address': 'Maroc, Grand Casablanca, ' + searcheadresse };
		plugin.google.maps.Geocoder.geocode(request, function(results) {
				
			var list = $("#suggestions").listview();
            $(list).empty();            
            console.log('result recherche ' + results.length);
			if (results.length) {
				$.each(results, function(key, result) {                	                
	                var position = result.position; 
	                var address = result.extra.featureName;
				    /*var address = [
				      result.subThoroughfare || "",
				      result.thoroughfare || "",
				      result.locality || "",
				      result.adminArea || "",
				      result.postalCode || "",
				      result.country || ""].join(", ");*/
	                
	                //$(list).append('<li> <a href="javascript:void(0)" id="' + position.lat + "," + position.lng + '" class="searchEndroit">' + address + '</a></li>');
	                $(list).append('<li> <a href="javascript:void(0)" id="' + position.lat + ", " + position.lng + '" class="searchEndroit">' + address + '</a></li>');
	            });
			} 
                        
            $(list).listview('refresh');
        });
	};

	function onMapInit(mapc) {	
		console.log('onMapIniti');	
		//Set option
		$.mobile.loading('hide'); 
		map = mapc;				
		goToMyLocation();
	};
	function autoRotate() {
		console.log('autoRotate');
	  // Determine if we're showing aerial imagery
	  if (map.getTilt() != 0) {
	    map.setHeading(180);
	    setTimeout('map.setHeading(270)',3000);
	    setTimeout('map.setHeading(0)',6000);
	    setTimeout('map.setHeading(90)',9000);
	  }
	};
	function goToMyLocation() {
		console.log('goToMyLocation');
		$.mobile.loading('show', {
                text: 'Localisation de votre position GPS',
                textVisible: true,
                theme: 'z',
                html: ""
            });
		var options = {enableHighAccuracy: true, timeout: 10000};
        navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, options);
		
	};
	
	function onSuccessPosition(position) {
		console.log('onSuccessPosition');
		$.mobile.loading('hide'); 
		var pos = new google.maps.LatLng(position.coords.latitude, 
										position.coords.longitude);
		map.setCenter(pos);	
		positionnerMarker(pos);
		
	};
	function onErrorPosition(error) {
		console.log('onErrorPosition');
		$.mobile.loading('hide'); 
		/*if (error.code === PositionError.PERMISSION_DENIED) {
	        alert('Erreur : PERMISSION_DENIED, utilisation de la position en cache');
	    } else if (error.code === PositionError.POSITION_UNAVAILABLE) {
	        alert('Erreur : POSITION_UNAVAILABLE, utilisation de la position en cache');
	    } else if (error.code === PositionError.TIMEOUT) {
	        alert('Erreur : TIMEOUT, utilisation de la position en cache');
	    }*/
		alert('Merci de mettre en marche votre GPS!');
	};

	  
	

});