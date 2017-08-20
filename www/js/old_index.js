var map;
var result;
var position;
var latlng;
var listTask = [];
var ipserver = "10.10.0.2";
var lastAction = null;
var notificationService;
$(document).ready(function() {
    document.addEventListener("deviceready", onDeviceReady, true);
    //onDeviceReady();
});

function onDeviceReady() {
    loadPage();
    newCourse();
    addTask();
    seConnecter();
    inscription();
    RecupererMotPasseOublie();
    validerCourse();
    validerTrancheHoraire();
    selectTypeService();
    tracking();
    trackerCourse();
    //SupperviseCourse();
    mesCourse();
    detailCourse();
    autoComplete();
    clearInputSearch();
    refreshtracking();
    initTrackingCommunication();
}
;
function lunchNotificationService() {
//    alert('lunchNotificationService');
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("idUser");
    var options = {
        "login" : login,
        "password" : password,
        "ipserver" : ipserver,
        "iduser" : iduser
    };
    chatNotification.setConfig(options, settingConfigSuccess, settingConfigFail);    
    /*var serviceName = 'com.rabbahsoft.commun.backgroundservice.MessageNotificationService';
    var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
    notificationService = factory.create(serviceName);
    getStatus();*/
}
;
function settingConfigSuccess(result) {
//    alert("success set config");
//    alert("result.message = " + result.message);
//    alert("result.package = " + result.package);
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
function loadPage() {
    var iduser = window.localStorage.getItem("idUser");
    if (iduser == null || iduser == "null") {
        $(".menuTitle").html("<strong>Menu</strong>");
        $('#updateCompte').css('display', 'none');
        $('#deconnecter').css('display', 'none');
        $('#seConnecterMenu').css('display', 'block');
        $('#inscriptionMenu').css('display', 'block');
        $('#motPasseOublieMenu').css('display', 'block');
        $('#updateCompteI').css('display', 'none');
        $('#deconnecterI').css('display', 'none');
        $('#seConnecterMenuI').css('display', 'block');
        $('#inscriptionMenuI').css('display', 'block');
        $('#motPasseOublieMenuI').css('display', 'block');
    }
    else {
        var nom = window.localStorage.getItem("nom");
        var prenom = window.localStorage.getItem("idUser");
        var email = window.localStorage.getItem("email");
        $(".menuTitle").html("<strong>" + nom + " " + prenom + "</strong><br/>" + email);
        $('#updateCompte').css('display', 'block');
        $('#deconnecter').css('display', 'block');
        $('#seConnecterMenu').css('display', 'none');
        $('#inscriptionMenu').css('display', 'none');
        $('#motPasseOublieMenu').css('display', 'none');
        $('#updateCompteI').css('display', 'block');
        $('#deconnecterI').css('display', 'block');
        $('#seConnecterMenuI').css('display', 'none');
        $('#inscriptionMenuI').css('display', 'none');
        $('#motPasseOublieMenuI').css('display', 'none');
    }

    var h = $('div[data-role="header"]').outerHeight(true);
    var f = $('div[data-role="footer"]').outerHeight(true);
    var w = $(window).height();
    var c = $('div[data-role="content"]');
    var c_h = c.height();
    var c_oh = c.outerHeight(true);
    var c_new = (w - h - f - c_oh + c_h) * 60 / 100;
    var height = "" + c_new + "px";
    $("#trackingMap").css("height", height);
    $("#fmap_canvas").css("height", height);

    var button = document.getElementById("button");
    var fmap_canvas = document.getElementById("fmap_canvas");
    //map = plugin.google.maps.Map.getMap(fmap_canvas);
    //map.on(plugin.google.maps.event.MAP_READY, onMapInit);
    button.addEventListener("click", lunchmap, false);
    //var div = document.getElementById("map_canvas");
    map = plugin.google.maps.Map.getMap({
     'mapType': plugin.google.maps.MapTypeId.ROADMAP,
     'controls': {
     'compass': true,
     'myLocationButton': true,
     //'indoorPicker': true,
     'zoom': true
     },
     'gestures': {
     'scroll': true,
     'tilt': true,
     'rotate': true,
     'zoom': true
     }
     });/*
     //alert(map);*/
    map.setDiv(fmap_canvas);
    //map.setDebuggable( true );
    //map = plugin.google.maps.Map.getMap(div);
}
;

function onMapInit(map) {
    alert('onMapInit');
    map.setDebuggable(true);
    alert(map);
}
;

function lunchmap() {
    var adresse = $("#adresse").val();
    if (adresse.length == 0) {
        map.clear();
        //map.setMyLocationEnabled(true);
        //var mapCenter = new plugin.google.maps.LatLng(33.584775, -7.618954);
        //map.setCenter(mapCenter);
        map.showDialog();
        map.getMyLocation(function(location) {
            map.addMarker({
                'position': location.latLng,
                'title': "Cliquer sur l'icone durant 2 seconds et changer sa position en la glissant!",
                'icon': 'www/images/office-building.png',
                'draggable': true
            }, function(marker) {
                map.animateCamera({
                    'target': location.latLng,
                    'tilt': 60,
                    'zoom': 18,
                    'bearing': 90
                }, function() {
                    marker.showInfoWindow();
                });

                marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                    marker.getPosition(function(latLng) {
                        reverseGeocoding(map, marker, latLng);
                        //reverseGeocoding(map, marker, latLng);
                    });
                });

            });
            var request = {
                'position': location.latLng
            };
            map.geocode(request, function(results) {
                if (results.length) {
                    result = results[0];
                    $("#latLng").val(location.latLng.lat + "," + location.latLng.lng);
                    $("#adresse").val(result.extra.featureName);
                }
            });
            /*map.animateCamera({
             'target': location.latLng,
             'tilt': 60,
             'zoom': 18,
             'bearing': 90
             });*/
        });
        var evtName = plugin.google.maps.event.MAP_LONG_CLICK;
        map.on(evtName, function(latLng) {
            map.clear();
            //alert(latLng);
            var request = {'position': latLng};
            map.geocode(request, function(results) {
                if (results.length) {
                    result = results[0];
                    position = result.position;
                    //$("#latLng").val(position.lng + "," + position.lat);
                    $("#latLng").val(latLng.lat + "," + latLng.lng);
                    $("#adresse").val(result.extra.featureName);
                    map.addMarker({
                        'position': position,
                        'title': "Cliquer sur l'icone durant 2 seconds et changer sa position en la glissant!\n\nAdresse : " + result.extra.featureName + ".\n Position : " + position.lng + "," + position.lat + ".\n Ville : " + result.locality + ".",
                        'icon': 'www/images/office-building.png',
                        'draggable': true
                    }, function(marker) {

                        map.animateCamera({
                            'target': position,
                            'tilt': 60,
                            'zoom': 18,
                            'bearing': 90
                        }, function() {
                            marker.showInfoWindow();
                        });

                        marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                            marker.getPosition(function(latLng) {
                                reverseGeocoding(map, marker, latLng);
                                //reverseGeocoding(map, marker, latLng);
                            });
                        });

                    });
                    //map.showDialog();
                } else {
                    alert("L'adresse que vous avez saisi n'existe pas");
                }
            });
        });
    }
    else {
        map.clear();
        var request = {'address': adresse};
        map.geocode(request, function(results) {
            if (results.length) {
                result = results[0];
                position = result.position;
                $("#latLng").val(position.lat + "," + position.lng);
                map.addMarker({
                    'position': position,
                    'title': "Cliquer sur l'icone durant 2 seconds et changer sa position en la glissant!\n\nAdresse : " + result.extra.featureName + ".\n Position : " + position.lng + "," + position.lat + ".\n Ville : " + result.locality + ".",
                    'icon': 'www/images/office-building.png',
                    'draggable': true
                }, function(marker) {
                    map.animateCamera({
                        'target': position,
                        'tilt': 60,
                        'zoom': 18,
                        'bearing': 90
                    }, function() {
                        marker.showInfoWindow();
                    });

                    marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                        marker.getPosition(function(latLng) {
                            reverseGeocoding(map, marker, latLng);
                        });
                    });

                });
                map.showDialog();
            } else {
                alert("L'adresse que vous avez saisi n'existe pas");
            }
        });
    }
}
;

function reverseGeocoding(map, marker, latLng) {
    var request = {
        'position': latLng
    };
    map.geocode(request, function(results) {
        if (results.length) {
            result = results[0];
            position = result.position;
            marker.setTitle("Cliquer sur l'icone durant 2 seconds et changer sa position en la glissant!\n\nAdresse : " + result.extra.featureName + ".\n Position : " + latLng.lat + "," + latLng.lng + ".\n Ville : " + result.locality + ".");
            //marker.setPosition(result.position);
            $("#latLng").val(latLng.lat + "," + latLng.lng);
            $("#adresse").val(result.extra.featureName);
            marker.showInfoWindow();
        } else {
            alert("Aucune adresse pour l'endroit sélectionné");
        }
    });
}
;


function newCourse() {
    $('.newCourse').on('click', function() {
        listTask = [];
        var iduser = window.localStorage.getItem("idUser");
        if (iduser == null || iduser == "null") {
            lastAction = "typeService";
            $(".accueil").removeClass("ui-btn-active");
            $.mobile.changePage("#authentification", {transition: "slideup"});
        }
        else {
            $.mobile.changePage("#typeService", {transition: "slideup"});
            $(".newCourse").addClass("ui-btn-active");
            $(".accueil").removeClass("ui-btn-active");
            $(".mesCourse").removeClass("ui-btn-active");
        }
    });

    $('.accueil').on('click', function() {
        $(".accueil").addClass("ui-btn-active");
        $(".newCourse").removeClass("ui-btn-active");
        $(".mesCourse").removeClass("ui-btn-active");
        $.mobile.changePage("#accueil", {transition: "slideup"});
    });

    $('.inscription').on('click', function() {
        $(".mesCourse").removeClass("ui-btn-active");
        clear_form_inscription();
        $("#inscription #passwordDiv").css('display', 'block');
        $("#inscription #passwordConfirmationDiv").css('display', 'block');
        $("#inscription h4").html("Inscription");
        $.mobile.changePage("#inscription", {transition: "slideup"});
    });

}
;

function addTask() {
    $(".ajouterTache").click(function(event) {
        if ($("#adresse").val().length == 0) {
            alert("Merci de saisir l'adresse");
        }
        else if ($("#latLng").val().length == 0) {
            alert("Merci de valider la recherche de l'adresse sur la carte");
        }
        else if ($("#description").val().length == 0) {
            alert("Merci de saisir description");
        }
        else {
            var adresse = $("#adresse").val();
            var latLng = $("#latLng").val();
            var description = $("#description").val();
            create_task(adresse, latLng, description);
        }
    });
}
;

function create_task(adresse, latLng, description) {
    var task = {adresse: adresse, description: description, latLng: latLng};
    listTask.push(task);
    var clone = $("#collapsibleSet").clone();
    clone.attr('class', "");
    htmlcontent = '<div id="" data-role="collapsible" data-collapsed="false"><h4>' + adresse + '</h4>';
    htmlcontent += description;
    htmlcontent += '</div>';
    clone.find('#taskExemple').replaceWith(htmlcontent);
    clone.find('div[data-role=collapsible]').collapsible({refresh: true});
    $("#listTask").append(clone);
    clear_form();

}
;

function clear_form() {
    $("#adresse").val("");
    $("#latLng").val("");
    $("#description").val("");
}
;

function seConnecter() {
    $(".seConnecter").click(function(event) {
        var loginAu = $("#loginAu").val();
        var passwordAu = $("#passwordAu").val();
        if (loginAu.length == 0) {
            alert("Merci de saisir votre Login")
        }
        else if (passwordAu.length == 0) {
            alert("Merci de saisir votre mot de passe");
        }
        else {
            authentification(loginAu, passwordAu);
        }
    });
}
;

function validerCourse() {
    $(".validerCourse").click(function(event) {
        if (listTask.length > 0) {
            var url = "http://10.10.0.2/mobile/createListTask";
            var idTrancheHoraire = window.localStorage.getItem("idTrancheHoraire");
            var dateSelected = window.localStorage.getItem("dateSelected");
            var idUser = window.localStorage.getItem("idUser");
            var typeService = window.localStorage.getItem("typeService");
            $.ajax({
                type: "POST",
                url: url,
                data: {idUser: idUser, listTask: listTask, taskCount: listTask.length, idTrancheHoraire: idTrancheHoraire, dateSelected: dateSelected, typeService: typeService},
                beforeSend: function() {
                    $.mobile.loading('show', {
                        text: 'En cours...',
                        textVisible: true,
                        theme: 'b',
                        html: ""
                    });
                },
                success: function(data) {
                    $.mobile.loading('hide');
                    $("#listTask").html("");
                    clear_form();
                    //$('#datepi').datepicker('setDate', new Date());
                    window.localStorage.setItem("numeroCourse", data);
                    listTask = [];
                    $("#popupDialog").popup('open');
                },
                error: function(xhr, status, error) {
                    $.mobile.loading('hide');
                    alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
                }
            });
        }
        else {
            alert("La liste des tâhes est vide.Merci de saisir au moins une seule tâche");
        }
    });
}
;

function validerTrancheHoraire() {
    $("ul").on('click', '.createCourse', function() {
        var idTrancheHoraire = $(this).attr("id");
        window.localStorage.setItem("idTrancheHoraire", idTrancheHoraire);
        clear_form();
    });
}
;

function tracking() {
    $('.tracking').on('click', function() {

    });
}
;

function trackerCourse() {
    $('.trackerCourse').on('click', function() {
        var numeroCourse = $("#numeroCourse").val();
        if (numeroCourse.length == 0) {
            alert("Merci de saisir le numéro de la course");
        }
        else {
            tacking_course(numeroCourse);
            //show_marker(numeroCourse);
        }
    });
}
;

function selectTypeService() {
    $("ul").on('click', '.tcac', function() {
        var typeService = "Course d'achat";
        window.localStorage.setItem("typeService", typeService);
        lunchDatePicker(typeService);
    });

    $("ul").on('click', '.tcad', function() {
        var typeService = "Course administrative";
        window.localStorage.setItem("typeService", typeService);
        lunchDatePicker(typeService);
    });

    $("ul").on('click', '.tcme', function() {
        var typeService = "Messagerie";
        window.localStorage.setItem("typeService", typeService);
        lunchDatePicker(typeService);
    });
}
;


function lunchDatePicker(typeService) {
    var options = {
        date: new Date(),
        mode: 'date',
        minDate: new Date().getTime()
    };
    //var datePicker = new DatePicker();
    datePicker.show(options, function(date) {
        if (isValidDate(date)) {
            var weekday = new Array(7);
            weekday[0] = "Dimanche";
            weekday[1] = "Lundi";
            weekday[2] = "Mardi";
            weekday[3] = "Mercredi";
            weekday[4] = "Jeudi";
            weekday[5] = "Vendredi";
            weekday[6] = "Samedi";
            var dayOfWeek = weekday[date.getUTCDay()];
            if (isJoursferie(date)) {
                alert("jours férie");
                lunchDatePicker(typeService);
            }
            else if (isTrancheSaturee(date)) {
                alert("Tranche saturée");
                lunchDatePicker(typeService);
            }
            else {
                getTrancheHoraire(dayOfWeek, date, typeService);
            }
        }
    });
}
;

function isJoursferie(date) {
    var got = "none";
    var url = "http://10.10.0.2/Mobile/isJoursFerie";
    $.ajax({
        type: "POST",
        url: url,
        data: {date: date},
        async: false,
        success: function(result) {
            if (result === "true") {
                got = true;
            }
            else if (result === "false") {
                got = false;
            }
        },
        error: function(xhr, status, error) {
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
    return got;
}
;

function isTrancheSaturee(date) {
    var got = "none";
    var url = "http://10.10.0.2/Mobile/isTrancheSaturee";
    $.ajax({
        type: "POST",
        url: url,
        data: {date: date},
        async: false,
        success: function(result) {
            if (result === "true") {
                got = true;
            }
            else if (result === "false") {
                got = false;
            }
        },
        error: function(xhr, status, error) {
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
    return got;
}
;

function getTrancheHoraire(dayOfWeek, dateSelected, typeService) {
    var url = "http://10.10.0.2/mobile/getTrancheHoraireByNameDay";
    $.ajax({
        type: "POST",
        url: url,
        data: {daySelected: dayOfWeek, typeService: typeService},
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            window.localStorage.setItem("dayOfWeek", dayOfWeek);
            window.localStorage.setItem("dateSelected", dateSelected);
            var list = $("#trancheHorairej").listview();
            $(list).empty();
            $(list).append('<li data-role="list-divider" data-theme="c">Sélectionner la tranche horaire</li>');
            $.each(data, function(key, value) {
                if (isStartedTimeGreatherEndedTime(value.heureFin)) {
                    $(list).append('<li data-theme=""> <a href="#course" id="' + value.id + '" data-transition="slide" class="ui-state-disabled createCourse">' + value.heureDebut + ' - ' + value.heureFin + '<span class="ui-li-count">Complet</span></a></li>');
                }
                else {
                    $(list).append('<li data-theme=""> <a href="#course" id="' + value.id + '" data-transition="slide" class="createCourse">' + value.heureDebut + ' - ' + value.heureFin + '<span class="ui-li-count">' + value.valeurPromotion + '</span></a></li>');
                }
            });
            $(list).listview('refresh');
            $.mobile.changePage("#trancheHorairek", {transition: "slideup"});
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
}
;

function isStartedTimeGreatherEndedTime(endTime) {
    var curentDateObject = new Date();

    var endTimeArray = endTime.split(':');
    var endTimeObject = new Date();
    endTimeObject.setHours(endTimeArray[0], endTimeArray[1], 0);
    if (curentDateObject > endTimeObject) {
        return true;
    }
    else {
        return false;
    }
}
;
function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]")
        return false;
    return !isNaN(d.getTime());
}
;

function detailCourse() {
    $("ul").on('click', '.detailCourse', function() {
        var numeroCourse = $(this).attr("id");
        $("#popupMenuHistorique").popup('open');
        window.localStorage.setItem("numeroCourse", numeroCourse);
    });

    $(".closepopupMenuHistorique").click(function(event) {
        $("#popupMenuHistorique").popup('close');
    });

    $(".TrackerHistorique").click(function(event) {
        var numeroCourse = window.localStorage.getItem("numeroCourse");
        $.mobile.changePage("#tracking", {transition: "slideup"});
        show_details(numeroCourse);
        //show_marker(numeroCourse);
    });

    $(".detailCourseHistorique").click(function(event) {
        var numeroCourse = window.localStorage.getItem("numeroCourse"); 
        $("#listDetailCourse").html("");
        show_details_course(numeroCourse);

    });
}
;

function inscription() {
    $(".soumettreInscription").click(function(event) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var iduser = $("#iduser").val();
        var nom = $("#nom").val();
        var prenom = $("#prenom").val();
        var tel = $("#tel").val();
        var email = $("#email").val();
        var login = $("#login").val();
        var password = $("#password").val();
        var passwordConfirmation = $("#passwordConfirmation").val();
        if (iduser.length == 0) {
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
                validerInscription(nom, prenom, tel, email, login, password);
            }
        }
        else {
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
            else if (!checkEmailModifierProfil(iduser, email)) {
                alert("Cet email est déjà associé à un autre compte")
            }
            else if (login.length == 0) {
                alert("Merci de saisir votre login");
            }
            else if (!checkLoginModifierProfil(iduser, login)) {
                alert("Ce login est déjà associé à un autre compte")
            }
            else {
                var url = "http://10.10.0.2/Mobile/modifierProfil";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {id: iduser, nom: nom, prenom: prenom, gsm: tel, email: email, login: login},
                    dataType: "text",
                    beforeSend: function() {
                        $.mobile.loading('show', {
                            text: 'En cours...',
                            textVisible: true,
                            theme: 'b',
                            html: ""
                        });
                    },
                    success: function(data) {
                        $.mobile.loading('hide');
                        window.localStorage.setItem("idUser", data.id);
                        window.localStorage.setItem("nom", data.nom);
                        window.localStorage.setItem("prenom", data.prenom);
                        window.localStorage.setItem("login", data.login);
                        window.localStorage.setItem("telephone", data.gsm);
                        window.localStorage.setItem("email", data.email);
                        alert('votre compte a été modifié avec succés')
                    },
                    error: function(xhr, status, error) {
                        $.mobile.loading('hide');
                        alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
                    }
                });
            }
        }
    });
}
;



function RecupererMotPasseOublie() {
    $(".motPasseOublie").click(function(event) {
        $.mobile.changePage("#motPasseOublie", {transition: "slideup"});
    });

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

    $(".deconnecter").click(function(event) {
        window.localStorage.setItem("idUser", null);
        $('#updateCompte').css('display', 'none');
        $('#deconnecter').css('display', 'none');
        $('#seConnecterMenu').css('display', 'block');
        $('#inscriptionMenu').css('display', 'block');
        $('#motPasseOublieMenu').css('display', 'block');
        $('#updateCompteI').css('display', 'none');
        $('#deconnecterI').css('display', 'none');
        $('#seConnecterMenuI').css('display', 'block');
        $('#inscriptionMenuI').css('display', 'block');
        $('#motPasseOublieMenuI').css('display', 'block');
        $(".menuTitle").html("<strong>Menu</strong>");
        $.mobile.changePage("#accueil", {transition: "slideup"});
    });

    $(".updateCompte").on('click', function() {
        var iduser = window.localStorage.getItem("idUser");
        var nom = window.localStorage.getItem("nom");
        var prenom = window.localStorage.getItem("prenom");
        var login = window.localStorage.getItem("login");
        var telephone = window.localStorage.getItem("telephone");
        var email = window.localStorage.getItem("email");
        $("#iduser").val(iduser);
        $("#nom").val(nom);
        $("#prenom").val(prenom);
        $("#tel").val(telephone);
        $("#email").val(email);
        $("#login").val(login);
        $("#inscription #passwordDiv").css('display', 'none');
        $("#inscription #passwordConfirmationDiv").css('display', 'none');
        $("#inscription h4").html("Modifier mon compte");
        $.mobile.changePage("#inscription", {transition: "slideup"});
    });

}
;

function motpasseOublie(email) {
    var url = "http://10.10.0.2/mobile/motPasseOublie";
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

function SupperviseCourse() {
    $(".SupperviseCourse").click(function(event) {
        /*var numeroCourse=$("#numeroCourse").val();*/
        var numeroCourse = window.localStorage.getItem("numeroCourse");
        //show_marker(numeroCourse);
    });
}
;

function clearInputSearch() {
    $("#clearInputSearch").click(function(event) {
        $("#adresse").val("");
    });
}
;

function mesCourse() {
    $(".mesCourse").click(function(event) {
        var iduser = window.localStorage.getItem("idUser");
        if (iduser == null || iduser == "null") {
            $(".accueil").removeClass("ui-btn-active");
            $.mobile.changePage("#authentification", {transition: "slideup"});
        }
        else {
            var url = "http://10.10.0.2/mobile/mesCourse";
            var idUser = window.localStorage.getItem("idUser");
            $.ajax({
                type: "POST",
                url: url,
                data: {idUser: idUser},
                beforeSend: function() {
                    $.mobile.loading('show', {
                        text: 'En cours...',
                        textVisible: true,
                        theme: 'b',
                        html: ""
                    });
                },
                success: function(data) {
                    $.mobile.loading('hide');
                    var list = $("#mesCourse").listview();
                    $(list).empty();
                    $(list).append('<li data-role="list-divider" data-theme="b">Historique des courses</li>');
                    $.each(data, function(key, value) {
                        $(list).append('<li data-theme=""> <a href="javascript:void(0)" id="' + value.numeroCourse + '" data-transition="slide" class="detailCourse">' + value.description + '<span class="ui-li-count">' + value.numeroCourse + '</span></a></li>');
                    });
                    $(list).listview('refresh');
                    $(".mesCourse").addClass("ui-btn-active");
                    $(".newCourse").removeClass("ui-btn-active");
                    $(".accueil").removeClass("ui-btn-active");
                    $.mobile.changePage("#historique", {transition: "slideup"});
                },
                error: function(xhr, status, error) {
                    $.mobile.loading('hide');
                }
            });
        }
    });
}
;

function authentification(loginAu, passwordAu) {
    var url = "http://10.10.0.2/mobile/getUser";
    $.ajax({
        type: "POST",
        url: url,
        data: {login: loginAu, password: passwordAu},
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            if (data <= 0) {
                alert("Login et/ou mot de passe incorrect(s)");
            } else {
                window.localStorage.setItem("idUser", data.id);
                window.localStorage.setItem("nom", data.nom);
                window.localStorage.setItem("prenom", data.prenom);
                window.localStorage.setItem("login", data.login);
                window.localStorage.setItem("telephone", data.gsm);
                window.localStorage.setItem("email", data.email);
                window.localStorage.setItem("password", passwordAu);
                window.localStorage.setItem("ipserver", "10.10.0.2");
                lunchNotificationService();
                $('#updateCompte').css('display', 'block');
                $('#deconnecter').css('display', 'block');
                $('#seConnecterMenu').css('display', 'none');
                $('#inscriptionMenu').css('display', 'none');
                $('#motPasseOublieMenu').css('display', 'none');
                $('#updateCompteI').css('display', 'block');
                $('#deconnecterI').css('display', 'block');
                $('#seConnecterMenuI').css('display', 'none');
                $('#inscriptionMenuI').css('display', 'none');
                $('#motPasseOublieMenuI').css('display', 'none');
                $(".menuTitle").html("<strong>" + data.nom + " " + data.prenom + "</strong><br/>" + data.email);
                clear_form_authentification();
                if (lastAction == null) {
                    $.mobile.changePage("#accueil", {transition: "slideup"});
                }
                else {
                    $.mobile.changePage("#" + lastAction, {transition: "slideup"});
                }
                $('#toto').css('display', 'block');
            }
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
}
;


function tacking_course(numeroCourse) {
    var url = "http://10.10.0.2/Tracker/listTacheByNumeroCourse";
    var data = {numeroCourse: numeroCourse};
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            if (data.length > 0) {
                $.mobile.changePage("#tracking", {transition: "slideup"});
                show_details(numeroCourse);
//                show_marker(numeroCourse);
            }
            else {
                $.mobile.loading('hide');
                alert("Le Numéro de la course que vous avez saisie ne figure pas dans notre base de donnée.");
            }
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
}
;
/**
 * Tracher la course en temps réel
 * @param {type} numeroCourse numéro course à tracker
 * @returns {undefined}
 */
function show_details(numeroCourse) {
    var url = "http://10.10.0.2/Mobile/trackingByNumeroCourse";
    var data = {numeroCourse: numeroCourse};
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            $("#listTracking").html("");
            var data1 = data[2];
            var user = data[3];
            var positionUser = data[4];
            var showUser = data[5];
            var courseTermine = data[6];
            show_marker(data1, numeroCourse);
            if (showUser) {
                draw_user(user, positionUser);
            }

            /*if (courseTermine) {
             alert('Cette course est déja térnimée.');
             }*/
            if (data1.length !== 0) {
                for (var i = data1.length - 1; i >= 0; i--) {
                    htmlcontent = "";
//                    alert(data1[i].adresse);
                    if (i == (data1.length - 1)) {
                        htmlcontent += '<div data-role="collapsible" data-collapsed="false"><h4>' + data1[i].adresse + '</h4>';
                    }
                    else {
                        htmlcontent += '<div data-role="collapsible" data-collapsed="true"><h4>' + data1[i].adresse + '</h4>';
                    }
                    htmlcontent += "<b>Description</b> :" + data1[i].description + "</br>";
                    htmlcontent += "1. Date soumission : " + getDate(data1[i].dateCreated) + "</br>";
                    htmlcontent += "2. Date début réalisation : " + getDate(data1[i].dateAffectation) + "</br>";
                    htmlcontent += "3. Date arrivée : " + getDate(data1[i].dateDebutRealisation) + "</br>";
                    htmlcontent += "4. Date achièvement : " + getDate(data1[i].dateFinRealisation) + "</br>";
                    htmlcontent += '</div>';
                    $("#listTracking").append(htmlcontent);
                }
                $('div[data-role=collapsible]').collapsible({refresh: true});
            }
            else {
                alert("La course est prise en considération par le systéme.");
            }
        },
        async: false
    });
}
;

function getDate(date) {
    if (date !== null) {
        date = new Date(date);
        var dayNumber = date.getDate() + "";
        var month = (date.getMonth() + 1) + "";
        var minute = date.getMinutes() + "";
        var hour = date.getHours() + "";
        if (dayNumber.length === 1) {
            dayNumber = "0" + dayNumber;
        }
        if (month.length === 1) {
            month = "0" + month;
        }
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        if (hour.length === 1) {
            hour = "0" + hour;
        }
        var dateFormat = dayNumber + '/' + month + '/' + date.getFullYear() + ' ' + hour + ':' + minute;
        return dateFormat;
    }
    else {
        return "";
    }
}
;

function show_marker(data, numeroCourse) {
    var trackingMap = document.getElementById("trackingMap");
    trackingMap = plugin.google.maps.Map.getMap(trackingMap);
    trackingMap.clear();
    var comptTemp = -1;
    for (var i = 0; i < data.length; i++) {
        var statusCourse = data[i].status;
        var origin1 = data[i].latLng.split(',');
        var latLng = new plugin.google.maps.LatLng(origin1[0], origin1[1]);
        if (statusCourse === "EN COURS") {
            comptTemp = i;
        } else {
            trackingMap.addMarker({
                'position': latLng,
                'title': " Adresse : " + data[i].adresse + ".\n Position : " + origin1[0] + "," + origin1[1] + ".",
                'icon': 'www/images/office-building.png'
            }, function(marker) {
                trackingMap.animateCamera({
                    'target': latLng,
                    'zoom': 14
                }, function() {
                    marker.showInfoWindow();
                });
            });
        }
    }
    if (comptTemp > -1) {
        var origin1 = data[comptTemp].latLng.split(',');
        var latLng = new plugin.google.maps.LatLng(origin1[0], origin1[1]);
        trackingMap.addMarker({
            'position': latLng,
            'title': " Adresse : " + data[comptTemp].adresse + ".\n Position : " + origin1[0] + "," + origin1[1] + ".",
            'icon': 'www/images/Arrive.png'
        }, function(marker) {
            trackingMap.animateCamera({
                'target': latLng,
                'zoom': 14
            }, function() {
                marker.showInfoWindow();
            });
        });
    }
}
;

function draw_user(user, positionUser) {
    var trackingMap = document.getElementById("trackingMap");
    trackingMap = plugin.google.maps.Map.getMap(trackingMap);
    var origin2 = positionUser.latLng.split(',');
    var latLng = new plugin.google.maps.LatLng(origin2[0], origin2[1]);

    trackingMap.addMarker({
        'position': latLng,
        'title': " Coursier : " + user.nom + ' ' + user.prenom,
        'icon': 'www/images/ducati-diavel-green.png'
    }, function(marker) {
        trackingMap.animateCamera({
            'target': latLng,
            'zoom': 12
        }, function() {
            marker.showInfoWindow();
        });
    });
}
;


function show_details_course(numeroCourse) {
    var url = "http://10.10.0.2/Mobile/listTacheByNumeroCourse";
    var data = {numeroCourse: numeroCourse};
    var fmap_canvas = document.getElementById("fmap_canvas");
    fmap_canvas = plugin.google.maps.Map.getMap(fmap_canvas);
    fmap_canvas.clear();
    fmap_canvas.clear();

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            $.each(data, function(key, value) {
                htmlcontent = "";
                if (key == 0) {
                    htmlcontent += '<div id="" data-role="collapsible" data-collapsed="false"><h4>' + value.endroit.adresse + '</h4>Description :' + value.description + '</div>';
                }
                else {
                    htmlcontent += '<div id="" data-role="collapsible" data-collapsed="true"><h4>' + value.endroit.adresse + '</h4>Description :' + value.description + '</div>';
                }                
                $("#listDetailCourse").append(htmlcontent);
                var latLng = new plugin.google.maps.LatLng(value.endroit.latLng.split(",")[0], value.endroit.latLng.split(",")[1]);
                var request = {'position': latLng};
                fmap_canvas.geocode(request, function(results) {
                    result = results[0];
                    position = result.position;
                    fmap_canvas.addMarker({
                        'position': position,
                        'title': " Adresse : " + value.endroit.adresse + ".\n Position : " + position.lng + "," + position.lat + ".\n Ville : " + result.locality + ".\n Pays : " + result.country + ".",
                        'icon': 'www/images/office-building.png'
                    }, function(marker) {
                        map.animateCamera({
                            'target': position,
                            'zoom': 12
                        }, function() {
                        });
                    });
                });
            });

        },
        async: false
    });
}
;

function autoComplete() {
    $("#adresse").keyup(function(event) {
        var request;
        if ($("#adresse").val() == "") {
            request = {'address': $("#adresse").val()};
        } else {
            request = {'address': $("#adresse").val() + 'maroc'};
        }
        plugin.google.maps.Geocoder.geocode(request, function(results) {
            var list = $("#suggestions").listview();
            $(list).empty();
            $(list).append('<li data-role="list-divider">Resultats de la recherche</li>');
            $.each(results, function(key, value) {
                result = value;
                position = result.position;
                $(list).append('<li data-theme=""> <a href="javascript:void(0)" id="' + position.lng + "," + position.lat + '" data-transition="slide" class="resultSelectedAutoComplete">' + result.extra.featureName + '<span class="ui-li-count">' + result.country + '</span></a></li>');
            });
            $(list).listview('refresh');
        });
    });

    $("ul").on('click', '.resultSelectedAutoComplete', function() {
        var latLngSelected = $(this).attr("id");
        map.clear();
        var latLng = new plugin.google.maps.LatLng(latLngSelected.split(",")[1], latLngSelected.split(",")[0]);
        var request = {
            'position': latLng
        };
        map.geocode(request, function(results) {
            result = results[0];
            position = result.position;
            $("#latLng").val(position.lat + "," + position.lng);
            $("#adresse").val(result.extra.featureName);
            map.addMarker({
                'position': position,
                'title': "Cliquer sur l'icone durant 2 seconds et changer sa position en la glissant!\n\nAdresse : " + result.extra.featureName + ".\n Position : " + position.lng + "," + position.lat + ".\n Ville : " + result.locality + ".",
                'icon': 'www/images/office-building.png',
                'draggable': true
            }, function(marker) {

                map.animateCamera({
                    'target': position,
                    'zoom': 18
                }, function() {
                    marker.showInfoWindow();
                });

                marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
                    marker.getPosition(function(latLng) {
                        reverseGeocoding(map, marker, latLng);
                    });
                });

            });
            //map.showDialog();
        });
        var list = $("#suggestions").listview();
        $(list).empty();
        $(list).listview('refresh');
    });

}
;

function checkEmail(email) {
    var got = "none";
    var email = email;
    var url = "http://10.10.0.2/utilisateur/checkemail";
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

function checkEmailModifierProfil(id, email) {
    var got = "none";
    var email = email;
    var url = "http://10.10.0.2/Mobile/checkemailmodifierprofil";
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

function checkLoginModifierProfil(id, login) {
    var got = "none";
    var email = email;
    var url = "http://10.10.0.2/Mobile/checkloginmodifierprofil";
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

function checkLogin(login) {
    var got = "none";
    var email = email;
    var url = "http://10.10.0.2/utilisateur/checklogin";
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

function validerInscription(nom, prenom, tel, email, login, password) {
    var url = "http://10.10.0.2/Mobile/inscription";
    $.ajax({
        type: "POST",
        url: url,
        data: {nom: nom, prenom: prenom, tel: tel, email: email, login: login, password: password},
        dataType: "text",
        beforeSend: function() {
            $.mobile.loading('show', {
                text: 'En cours...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },
        success: function(data) {
            $.mobile.loading('hide');
            $("#popupDialogInscriptionConfirmé").popup('open');
            clear_form_inscription();
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
        }
    });
}
;

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

function clear_form_authentification() {
    $("#loginAu").val("");
    $("#passwordAu").val("");
}
;

function refreshtracking() {
    setInterval(function() {
        if ($.mobile.activePage.attr('id') === "tracking") {
            var numeroCourse = window.localStorage.getItem("numeroCourse");
            show_details(numeroCourse);
        }
    }, 10000);
}
;

/**
 * Messages texte, audio, Video , appel
 */
function initTrackingCommunication() {
    $("#voirmessages").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("idUser");
        var idtache = window.localStorage.getItem("numeroCourse");
        var url = "http://10.10.0.2/mobile/getMessagesTache";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache},
            dataType: 'json',
            success: function(data) {
                var list = $("#listMessages").listview();
                $(list).empty();
                $.each(data, function(key, value) {
                    if (value.type == 'TEXT') {
                        $(list).append('<li data-theme="">' + value.texte + ' ' + value.dateMessage + '</li>');
                    } else if (value.type == 'VIDEO') {
                        $(list).append('<li data-theme=""><video width="320" height="240" controls><source src="http://' + ipserver + '/mobile/download?idMessage=' + value.id + '"></video></li>');
                    } else if (value.type == 'AUDIO') {
                        $(list).append('<li data-theme=""><audio controls><source src="http://' + ipserver + '/mobile/download?idMessage=' + value.id + '">Votre navigateur ne supporte pas la lecture d\'audio veillez utilisez Chrome Browser</audio></li>');
                    }
                });
                $(list).listview("refresh");
                $.mobile.loading('hide');
                $.mobile.changePage("#chat", {transition: "slideup"});
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du contact du serveur");
            }
        });
    });
    $("#envoyeraudio").click(function() {
        navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});

    });
    $("#envoyervideo").click(function() {
        navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});

    });
    $("#envoyerimage").click(function() {
        navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    });

    $("#envoyermessagetext").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("idUser");
        var idtache = window.localStorage.getItem("numeroCourse");
        var url = "http://10.10.0.2/mobile/envoyerMessage";
        var message = $("#messagetext").val();
        /*var d = new Date();
         var curr_date = d.getDate();
         var curr_month = d.getMonth() + 1; //Months are zero based
         var curr_year = d.getFullYear();
         var curr_heure = d.getHours();
         var curr_minute = d.getMinutes();
         var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;*/
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, message: message},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                var msg = 'Votre message est bien envoyé: ';
                $("#ecriremessage").hide();
                navigator.notification.alert(msg, null, 'Sucèes!');
            },
            error: function(msg) {
                $.mobile.loading('hide');
                var message = 'Problème lors du contact du serveur :' + msg;
                $("#ecriremessage").hide();
                navigator.notification.alert(message, null, 'Problème!');
            }
        });
    });

}
;


// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}
;

// Called if something bad happens.
//
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Problème!');
}
;

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name,
            type = mediaFile.type;

    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("idUser");
    var idtache = window.localStorage.getItem("numeroCourse");
    var url = "http://10.10.0.2/mobile/upload?iduser=" + iduser + "&idtache=" + idtache + "&login=" + login + "&idtache=" + password;
    ft.upload(path,
            url,
            function(result) {
                var msg = 'Message envoyé avec succès: ';
                navigator.notification.alert(msg, null, 'Sucèes!');
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                var msg = 'Erreur lors de l\'upload du ficiher: ' + error.code;
                navigator.notification.alert(msg, null, 'Problème!');
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            {fileKey: 'file', fileName: name, mimeType: type});
}
;