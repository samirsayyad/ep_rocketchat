exports.newMessageMethod = function newMessageMethod (data){
    const padId = pad.getPadId();
    const headerId = (data.name == `${padId}-general-channel`) ? "general" : data.name  ; 
    var lastUnreadCount = localStorage.getItem(`${headerId}_unreadCount`) || 0;
    if (lastUnreadCount > 0) return; // it means rocketchat is sending new-message + notification together
    
    const lastActiveHeader = localStorage.getItem("lastActiveHeader");
    if (lastActiveHeader == headerId )
        return;
    var lastNewMessageCount = localStorage.getItem(`${headerId}_newMessage`) || 0;
    lastNewMessageCount++; 
    localStorage.setItem(`${headerId}_newMessage`,lastNewMessageCount);
    var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : lastNewMessageCount });
        $(`#${headerId}_notification`).html(unreadNotificationTemplate);
    
}
