/* modal */
function toggleModal(){
    document.getElementById('modal').classList.toggle("modal-hidden");
}
function escapeSupport(){
    $(document).keyup(function(e) {
        if(e.which == 27) {
            $("#modal").addClass("modal-hidden");
        }
    });
}
function easyModalClose(){
    $('#modal').click(function() {
        if ($(event.target).is('#modal')) {
            toggleModal();
        }
    });
}
easyModalClose();
escapeSupport();

/* accordion 
$(".accordion-panel").slideUp();

$(".accordion").click(function() {
    if($(this).attr("aria-expanded") == "true"){
        console.log("closing");
        $(this).next(".accordion-panel").slideUp();
        $(this).attr("aria-expanded", "false");
    }
    else{
        console.log("opening");
        $(this).next(".accordion-panel").slideDown();
        $(this).attr("aria-expanded", "true");
    } 
});
*/