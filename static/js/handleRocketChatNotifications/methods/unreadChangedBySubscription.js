exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        const headerId = (data.name == `${padId}-general-channel`) ? "general" : data.name  ; 
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        if (lastActiveHeader == headerId )
            return;

        const notificationElement = $(`#${headerId}_notification`);
        var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || localStorage.getItem(`${headerId}_newMessage`) || 1;
        var unreadMentionedCount = localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`) || 0;

        if(notificationElement.length){
            

            if(unreadMentionedCount == 0)
                var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastUnreadCount || data.unread});
            else{
                var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount});
                let realHeaderId = notificationElement.attr("data-headerId") 
                var rowContainer=$(`#${realHeaderId}_container`) ;
                if(rowContainer.length && headerId != "general"){
                    var elementStatus = checkInView(rowContainer, true );
                    if (elementStatus.visible == false){
                        $("#bottomNewMention").css({"display":"block"})
                    }
                }
            }

            notificationElement.html(unreadNotificationTemplate);

            

            

        }
    }
    // else{
    //     $(`#${data.name}_notification`).empty()
    // }
    
}

function checkInView(elem){
    var container = $("#toc");
    var docViewTop = container.scrollTop();
    var docViewBottom = docViewTop + container.height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return {visible : ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) }  ;
}