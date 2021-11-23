exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true && data.unread!=0){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        const headerId = (data.name == `${padId}-general-channel`) ? "general" : data.name  ; 
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        if (lastActiveHeader.toLowerCase() == headerId )
            return;

        var notificationElement = $(`#${headerId}_notification`);
        if (!notificationElement.length)
            notificationElement = $(`#${data.fname}_notification`);
        if (!notificationElement.length)
            notificationElement = $(`#${data.fname.toLowerCase()}_notification`);

        var lastUnreadCount = parseInt(localStorage.getItem(`${headerId}_unreadCount`)) || parseInt(localStorage.getItem(`${headerId}_newMessage`)) || false;
        var unreadMentionedCount = parseInt(localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`)) || 0;

        if(notificationElement.length){
            if(unreadMentionedCount == 0)
                var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastUnreadCount || data.unread});
            else{
                var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount});
            }
            notificationElement.html(unreadNotificationTemplate);
        }
    }
}