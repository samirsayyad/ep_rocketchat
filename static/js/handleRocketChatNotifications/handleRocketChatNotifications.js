const notificationsMethod = require("./methods/notificationsMethod").notificationsMethod;
const unreadChangedBySubscription = require("./methods/unreadChangedBySubscription").unreadChangedBySubscription;

exports.handleRocketChatNotifications = function handleRocketChatNotifications (){
    window.addEventListener('message', function(e) {
        const eventName = e.data.eventName;
        const data = e.data.data;
        // if(eventName == "notification"){
        //     notificationsMethod(data)
        // }
        if(eventName=="unread-changed-by-subscription"){
            unreadChangedBySubscription(data)
        }

    });
}