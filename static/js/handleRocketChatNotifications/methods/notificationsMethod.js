exports.notificationsMethod = function notificationsMethod (data){
    if(!data.fromOpenedRoom){ // must be false in order to notify user
        const headerId = data.notification.payload.name ; 
        var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl(data);
            $(`#${headerId}_notification`).html(unreadNotificationTemplate);
    }
    
}
