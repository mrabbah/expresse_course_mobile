define(['jquery', 'jqm'], function ($) {
    var commun = {

        //Constantes
        ipserver : "expresscourse.ma",
        protocole : "http://",
        controllername : "/Mobile/",
        base_url : "http://expresscourse.ma/Mobile/",
        angleStart : -360,

        /******* Fonctions communes ******/
        getDate : function (date) {
            if (date !== null) {
                date = new Date(date);
                var dayNumber = date.getDate() + "";
                var month = (date.getMonth() + 1) + "";
                if (dayNumber.length === 1) {
                    dayNumber = "0" + dayNumber;
                }
                if (month.length === 1) {
                    month = "0" + month;
                }
                var dateFormat = dayNumber + '-' + month + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                return dateFormat;
            }
            else {
                return "";
            }
        },
        getPageHeight : function() {
            var h = $('div[data-role="header"]').outerHeight(true);
            var f = $('div[data-role="footer"]').outerHeight(true);
            var w = $(window).height();
            var c = $('div[data-role="content"]');
            var c_h = c.height();
            var c_oh = c.outerHeight(true);
            var c_new = (w - h - f - c_oh + c_h) ;            
            return c_new;
        },
        getPageHeightInPx : function() {
            var h = $('div[data-role="header"]').outerHeight(true);
            var f = $('div[data-role="footer"]').outerHeight(true);
            var w = $(window).height();
            var c = $('div[data-role="content"]');
            var c_h = c.height();
            var c_oh = c.outerHeight(true);
            var c_new = (w - h - f - c_oh + c_h) ;
            var height = "" + c_new + "px";
            return height;
        },
        syntaxHighlight : function (json) {
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        },

        printJson : function (json) {
            alert(this.syntaxHighlight(json));
        },

        askServer : function (action, parametres, successcallback, errorcallback) { 

            var login = window.localStorage.getItem("login");
            var password = window.localStorage.getItem("password");
            //var ipserver = ;
            var iduser = window.localStorage.getItem("iduser");
            var url = this.base_url + action;
            
            console.log('action : ' + url);
            var datas =  {login: login, password: password, iduser: iduser};
            console.log('datas = ' + this.syntaxHighlight(datas));
            if(parametres != null) {
                $.each(parametres, function(key, value) {
                    datas[key] = value;                    
                });
            }             
            $.mobile.loading('show', {
                text: 'Chargement...',
                textVisible: true,
                theme: 'z',
                html: ""
            });
            
            $.ajax({
                type: "POST",
                url: url,
                data: datas,
                dataType: 'json',
                success: function(data) {  
                    $.mobile.loading('hide');  
                    var type = typeof successcallback;
                    if(type === 'function') {
                        successcallback(data);
                    }                                                           
                },
                error: function(xhr, status, error) {           
                    $.mobile.loading('hide'); 
                    var type = typeof errorcallback;  
                    if(type === 'function') {
                        errorcallback(msg);                      
                    } else if(type === 'boolean') {
                        commun.dumperrorcallback(status);
                    }            
                }
            });
        },

        dumperrorcallback : function (msg) {
            alert("Error !: " + "Problème connexion réseaux\n"+msg);
        },

        isValidDate : function (d) {
            if (Object.prototype.toString.call(d) !== "[object Date]")
                return false;
            return !isNaN(d.getTime());
        },

        getOsType : function () {
            var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ios" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "ios" : (navigator.userAgent.match(/Android/i)) == "Android" ? "android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            return deviceType;
        }
    
    };
    return commun;
});

/*
function toast(msg){
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
    .css({ display: "block", 
        opacity: 0.90, 
        position: "fixed",
        padding: "7px",
        "text-align": "center",
        width: "270px",
        left: ($(window).width() - 284)/2,
        top: $(window).height()/2 })
    .appendTo( $.mobile.pageContainer ).delay( 1500 )
    .fadeOut( 400, function(){
        $(this).remove();
    });
};*/