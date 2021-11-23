exports.newMessageMethod = function newMessageMethod (data){
    const padId = pad.getPadId();
    const roomId = data.name ;
    const userId = pad.getUserId();
    const headerId = (roomId == `${padId}-general-channel`) ? "general" : roomId ; 
    // var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || 0;
    // if (lastUnreadCount > 0) return; // it means rocketchat is sending new-message + notification together
    
    const lastActiveHeader = localStorage.getItem("lastActiveHeader");
    if (lastActiveHeader.toLowerCase() == headerId )
        return;



    // check mentioned this user
    var unreadMentionedCount = parseInt(localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`)) || 0;
    unreadMentionedCount = parseInt(unreadMentionedCount);
    if ( [`@${userId}`,"@all"].includes(data.msg) ){
        
        unreadMentionedCount++; 
        localStorage.setItem(`${headerId}_unreadMentionedCount_${userId}`,unreadMentionedCount);
        var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount });
            $(`#${headerId}_notification`).html(unreadNotificationTemplate);
    }else{
        var lastNewMessageCount = parseInt(localStorage.getItem(`${headerId}_newMessage`)) || 0;
        lastNewMessageCount++; 
        localStorage.setItem(`${headerId}_newMessage`,lastNewMessageCount);
        var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastNewMessageCount });
            $(`#${headerId}_notification`).html(unreadNotificationTemplate);
          
    }
}
