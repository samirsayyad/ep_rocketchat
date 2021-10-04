exports.notificationsMethod = function notificationsMethod (data){
    if(!data.fromOpenedRoom){ // must be false in order to notify user
        const padId = pad.getPadId();
        const headerId = (data.notification.payload.name == `${padId}-general-channel`) ? "general" : data.notification.payload.name  ; 
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        if (lastActiveHeader == headerId )
            return;

        var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || 0;
        lastUnreadCount++; 
        localStorage.setItem(`${headerId}_unreadCount`,lastUnreadCount);
        var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastUnreadCount });
            $(`#${headerId}_notification`).html(unreadNotificationTemplate);
    }
    
}
