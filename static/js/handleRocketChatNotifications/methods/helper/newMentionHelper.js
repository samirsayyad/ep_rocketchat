const __extraHeightOfContainer = 317 ; // 132px shadow bottom conatiner + 185 px padding bottom1
exports.newMentionHelper = function newMentionHelper(headerId ){
    var rowContainer=$(`#${headerId}_container`) ;
    rowContainer.attr("mentioned","true");
    if(rowContainer.length && headerId != "general"){
        var elementStatus = checkInView(rowContainer, true );
        if (elementStatus.visible == false){
            $("#bottomNewMention").css({"display":"block"})
        }
    }
}
exports.removeNewMentionHelper = function removeNewMentionHelper(headerId ){
    var rowContainer=$(`#${headerId}_container`) ;
    if(rowContainer.length && headerId != "general")
        rowContainer.attr("mentioned","false");
}
exports.handleNewMentionButton = function handleNewMentionButton(){

    function debounce(method, delay) {
        clearTimeout(method._tId);
        method._tId= setTimeout(function(){
            method();
        }, delay);
    }
    
    $("#toc").scroll(function() {
        debounce(handleScroll, 100);
    });

    const handleScroll = function handleScroll(){
        var lastScrolledMention = $("#tocItems").find("[mentioned=true]").last() ;
        if(lastScrolledMention){
            if (checkLastElement(lastScrolledMention) == true){
                $('#bottomNewMention').css({"display":"block"})

            }else{
                $('#bottomNewMention').css({"display":"none"})

            }
        }
            

    }



    $('#bottomNewMention').click(() => {
        var lastScrolledMention = $('#bottomNewMention').attr("_lastscrolled");
        if(lastScrolledMention){
            var lastScrolledElement = $(`#${lastScrolledMention}`);
            var targetElement = lastScrolledElement.nextAll("[mentioned=true]").first()
            if(targetElement.length){
                $('#bottomNewMention').attr("_lastscrolled",targetElement.attr('id'));
                // $('#toc').animate({
                //     scrollTop: targetElement.offset().top - __extraHeightOfContainer
                // });
                $(targetElement)[0].scrollIntoView({
                    behavior: 'smooth',
                });
            }else{
                // $('#toc').animate({
                //     scrollTop: lastScrolledElement.offset().top - __extraHeightOfContainer
                // });
                $(lastScrolledElement)[0].scrollIntoView({
                    behavior: 'smooth',
                });
            }
        }else{
            var mentionedItems = $("#tocItems").find("[mentioned=true]");
            mentionedItems.each(function(i) { 
                var elementStatus = checkInView(this);
                if(elementStatus.visible == false ){
                    // $('#toc').animate({
                    //     scrollTop: $(this).offset().top - __extraHeightOfContainer
                    // });

                    // const padContainer = $('iframe[name="ace_outer"]').contents().find('iframe').contents();
                    // console.log("click",padContainer.find(`#${this.id}_container`))
                    // padContainer.find(`#${this.id}_container`)[0].scrollIntoView({
                    //   behavior: 'smooth',
                    // });
                    $(this)[0].scrollIntoView({
                        behavior: 'smooth',
                    });


                    $('#bottomNewMention').attr("_lastscrolled",this.id);
                    if (i == (mentionedItems.length-1)){
                        $('#bottomNewMention').css({"display":"none"})
                    } 
                    return false; 
                }
            });
    
        }
        
        // const n = $('#toc').height();
        // $('#toc').animate({scrollTop: n}, 50);
    });
}

function checkLastElement(containerId){
    if(typeof containerId != String)
        var targetElement = $(containerId)
    else
        var targetElement = $(`#${containerId}`).nextAll("[mentioned=true]").last();
        
    if(targetElement.length){
        var elementStatus = checkInView(targetElement);
        return !elementStatus.visible
    }
    return false;
}

function checkInView(elem){
    var container = $("#toc");
    var docViewTop = container.scrollTop();
    var docViewBottom = docViewTop + (container.height() - __extraHeightOfContainer ); 

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return {visible : ((elemBottom <= docViewBottom)) }  ; // && (elemTop >= docViewTop)
}