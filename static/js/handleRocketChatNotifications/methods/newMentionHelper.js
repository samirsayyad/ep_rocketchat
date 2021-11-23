exports.newMentionHelper = function newMentionHelper(headerId ){
    var rowContainer=$(`#${headerId}_container`) ;
    if(rowContainer.length && headerId != "general"){
        var elementStatus = checkInView(rowContainer, true );
        if (elementStatus.visible == false){
            $("#bottomNewMention").css({"display":"block"})
        }
    }
}

function checkInView(elem){
    var container = $("#toc");
    var docViewTop = container.scrollTop();
    var docViewBottom = docViewTop + container.height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return {visible : ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) }  ;
}