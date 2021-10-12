exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        const headerId = (data.name == `${padId}-general-channel`) ? "general" : data.name  ; 
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        if (lastActiveHeader == headerId )
            return;

        const notificationElement = $(`#${headerId}_notification`);
        var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || 1;

        if(notificationElement.length){
            if(data.unread == 0 && lastUnreadCount > 0){
                var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastUnreadCount});
                notificationElement.html(unreadNotificationTemplate);
            }
            if(data.unread > 0){
                var mentionNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl(data);
                notificationElement.html(mentionNotificationTemplate);
            }
    
            var rowContainer=$(`#${headerId}_container`) ;
            if(rowContainer.length && headerId != "general"){
                var elementStatus = checkInView(rowContainer, true );
                if (elementStatus.visible == false){
                    $("#bottomNewMention").css({"display":"block"})
                }
            }
        }
    }
    // else{
    //     $(`#${data.name}_notification`).empty()
    // }
    
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