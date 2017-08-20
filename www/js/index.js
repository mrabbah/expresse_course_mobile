define(['jquery', 'commun', 'jqm'], function ($, commun) {
    var index = {
        //Tester si c la premire connexion de l utilisateur
        //si oui afficher le help
        testFirstConnect : function() {
            var first = window.localStorage.getItem("first");
            if (first == null || first == "null") {
                $.mobile.changePage( "help.html", { role: "dialog" } );
            } else {
                this.testUserExist();
            }
        },
        //Tester si l utilisateur est connecté
        testUserExist : function() {
            var iduser = window.localStorage.getItem("iduser");

            if (iduser == null || iduser == "null") {        
                //TODO   
            } else {
                $('imgauth').attr("src", "img/logout.png");
                $('imgauth').attr("alt", "Déconnexion");
            }
        },
        //Initialisation des actions du menu principale
        initmainmenu : function() {
            $('.nouvellecourse').click(function(e) {
                var iduser = window.localStorage.getItem("iduser");
                if (iduser == null || iduser == "null") {   
                    //Rediriger vers authentification
                    window.localStorage.setItem("lastaction", "typeservices");
                    $.mobile.changePage('authentification.html', {transition : 'slide'});
                } else {
                    $.mobile.changePage('typeservices.html', {transition : 'slide'});        
                }                
            });
            /*$('.tracking').click(function(e) {
               //$.mobile.changePage('tracking.html', 'slide-up', false);
               //$('#numerocourse').trigger('click');
            });*/
            $('.historique').click(function(e) {
                var iduser = window.localStorage.getItem("iduser");
                if (iduser == null || iduser == "null") {   
                    //Rediriger vers authentification
                    window.localStorage.setItem("lastaction", "mescourses");
                    $.mobile.changePage('authentification.html', {transition : 'slide'});
                } else {
                    $.mobile.changePage('mescourses.html', {transition : 'slide'});        
                }
            });
            /*$('.help').click(function(e) {
                window.location.href = "help.html";   
            });*/
            $('.call').click(function(e) {
                window.open('tel:+212619900009', '_system');
            });
            $('.connexion').click(function(e) {
                var iduser = window.localStorage.getItem("iduser");
                if (iduser == null || iduser == "null") {   
                    //Rediriger vers authentification
                    window.localStorage.setItem("lastaction", "index");
                    $.mobile.changePage('authentification.html', {transition : 'slide'});
                } else {       
                     $.mobile.changePage('menuprofil.html', 
                        {transition : 'flip', role : 'dialog'});             
                   /* $('#userpopup').popup("open");
                    $('#userpopup').popup( "option", "dismissible", false );   */            
                }
            });
            
        },//Fin init main menu
        //animation du menu principal 
        initanimations : function () {
            $('.selector button').click(function(e) {
                index.toggleOptions($(this).parent());
            });    
            setTimeout(
                function() { 
                    index.toggleOptions('.selector'); 
                }, 
                100
            );//@ sourceURL=pen.js
        }, 
        //Rotation du menu principal
        rotate : function(li,d) {
            $({d:commun.angleStart}).animate({d:d}, {
                step: function(now) {
                    $(li)
                       .css({ transform: 'rotate('+now+'deg)' })
                       .find('img')
                          .css({ transform: 'rotate('+(-now)+'deg)' });
                }, duration: 0
            });
        },
        //lier a l animation du menu principal
        toggleOptions : function(s) {
            $(s).toggleClass('open');
            var li = $(s).find('li');
            var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
            for(var i=0; i<li.length; i++) {
                var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
                $(s).hasClass('open') ? this.rotate(li[i],d) : this.rotate(li[i],commun.angleStart);
            }
        }

    };
    return index;
});
