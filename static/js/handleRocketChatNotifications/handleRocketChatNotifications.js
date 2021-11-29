const notificationsMethod = require("./methods/notificationsMethod").notificationsMethod;
const unreadChangedBySubscription = require("./methods/unreadChangedBySubscription").unreadChangedBySubscription;
const newMessageMethod = require("./methods/newMessageMethod").newMessageMethod;
exports.handleRocketChatNotifications = function handleRocketChatNotifications (){
    window.addEventListener('message', function(e) {
        const eventName = e.data.eventName;
        const data = e.data.data;
        //console.log(eventName,data)
        if(eventName == "notification"){
            notificationsMethod(data)
        }
        if(eventName == "new-message"){
            newMessageMethod(data)
        }
        if(eventName=="unread-changed-by-subscription"){
            unreadChangedBySubscription(data)
        }
    });
}