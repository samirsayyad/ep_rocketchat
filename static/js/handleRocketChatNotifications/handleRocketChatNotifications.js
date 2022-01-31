const notificationsMethod = require("./methods/notificationsMethod").notificationsMethod;
const unreadChangedBySubscription = require("./methods/unreadChangedBySubscription").unreadChangedBySubscription;
const newMessageMethod = require("./methods/newMessageMethod").newMessageMethod;
exports.handleRocketChatNotifications = function handleRocketChatNotifications (){
    bindEvent(window,'message',function(e) {
        const eventName = e.data.eventName;
        const data = e.data.data;
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

function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}