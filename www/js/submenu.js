$(document).on("pageshow", function(event) {
    initsubmenuaction();    
});

function initsubmenuaction() {
    $(".taches").click(function() {
        $.mobile.changePage('tachesaffectees.html', 'slide-up', false);
    });
    
}
;

