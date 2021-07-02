exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true){
        const padId = clientVars.padId;
        const userId = pad.getUserId();

        if(data.unread == 0){
            var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl(data);
            $(`#${data.name}_notification`).html(unreadNotificationTemplate);
        }
        if(data.unread > 0){
            var mentionNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl(data);
            $(`#${data.name}_notification`).html(mentionNotificationTemplate);
        }
    }
}
