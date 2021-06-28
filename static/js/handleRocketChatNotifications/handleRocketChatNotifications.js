const notificationsMethod = require("./methods/notificationsMethod").notificationsMethod;
exports.handleRocketChatNotifications = function handleRocketChatNotifications (){
    window.addEventListener('message', function(e) {
        const eventName = e.data.eventName;
        const data = e.data.data;
        if(eventName == "notification"){
            notificationsMethod(data)
        }

        
        console.log(e.data.eventName); // event name
        console.log(e.data.data); // event data
    });
}