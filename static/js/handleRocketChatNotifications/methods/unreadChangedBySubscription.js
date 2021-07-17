exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        const notificationElement = $(`#${data.name}_notification`);
        if(notificationElement.length){
            if(data.unread == 0){
                var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl(data);
                notificationElement.html(unreadNotificationTemplate);
            }
            if(data.unread > 0){
                var mentionNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl(data);
                notificationElement.html(mentionNotificationTemplate);
            }
    
            var rowContainer=$(`#${data.name}_container`) ;
            if(rowContainer.length){
                var elementStatus = checkInView(rowContainer, true );
                if (elementStatus.visible == false){
                    $("#bottomNewMention").css({"display":"block"})
                }
            }
        }
    }else{
        $(`#${data.name}_notification`).empty()
    }
    
}

function checkInView(elem,partial){
    var container = $("#toc");
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight ;

    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();
    var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
    var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

    
    return  { visible : isTotal  || isPart , topLocation:(elemTop < 0 && elemBottom < 0) } ;
  }