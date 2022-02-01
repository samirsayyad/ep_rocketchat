const notificationsMethod = require("./methods/notificationsMethod").notificationsMethod;
const unreadChangedBySubscription = require("./methods/unreadChangedBySubscription").unreadChangedBySubscription;
const newMessageMethod = require("./methods/newMessageMethod").newMessageMethod;
const chatLoading = require('./methods/chatLoading').chatLoading;
exports.handleRocketChatNotifications = function handleRocketChatNotifications (){
    bindEvent(window,'message',function(e) {
        const eventName = e.data.eventName;
        const data = e.data.data;
        console.log(e)
        if(eventName == "notification"){
            notificationsMethod(data)
        }
        if(eventName == "new-message"){
            newMessageMethod(data)
        }
        if(eventName=="unread-changed-by-subscription"){
            unreadChangedBySubscription(data)
        }
        if(eventName=="chatLoading"){
            chatLoading()
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