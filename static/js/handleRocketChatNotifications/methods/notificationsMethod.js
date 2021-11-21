exports.notificationsMethod = function notificationsMethod (data){
    if(!data.fromOpenedRoom){ // must be false in order to notify user
        const padId = pad.getPadId();
        const userId = pad.getUserId();

        const headerId = (data.notification.payload.name == `${padId}-general-channel`) ? "general" : data.notification.payload.name  ; 
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        if (lastActiveHeader == headerId )
            return;


        // check mentioned this user
        var unreadMentionedCount = localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`) || 0;
        unreadMentionedCount = parseInt(unreadMentionedCount);
        if ( [`@${userId}`,"@all"].includes(data.notification.payload.message.msg) ){
            
            unreadMentionedCount++; 
            localStorage.setItem(`${headerId}_unreadMentionedCount_${userId}`,unreadMentionedCount);
            var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount });
                $(`#${headerId}_notification`).html(unreadNotificationTemplate);
        }else{

            var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || 0;
            lastUnreadCount++; 
            localStorage.setItem(`${headerId}_unreadCount`,lastUnreadCount);
            var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastUnreadCount + unreadMentionedCount});
                $(`#${headerId}_notification`).html(unreadNotificationTemplate);    
        }
        
    }
    
}
