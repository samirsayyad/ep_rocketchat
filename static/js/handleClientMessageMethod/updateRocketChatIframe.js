const notificationHelper =  require("../handleRocketChatNotifications/methods/helper/notificationHelper");

exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    try{
        //$("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
        document.getElementById("ep_rocketchat_iframe").contentWindow.postMessage(
            {  externalCommand: 'go',  path:  `/channel/${payLoad.data.room}?layout=embedded` }, '*')
        let room =payLoad.data.room;
        let padId =payLoad.padId;
        let userId =payLoad.userId;

        room = (room == `${padId}-general-channel` ) ? "general" : room;
        
        
        
        notificationHelper.setUnreadCount(room,0);
        notificationHelper.setNewMessageCount(room,0);
        notificationHelper.setUserUnreadMentionedCount(room,userId,0);
        notificationHelper.setHistoryCount(room,0); 
        notificationHelper.setLastActiveHeader(room); 

        $(`#${room}_notification`).empty()

    }catch(e){
        console.log(e)
    }
    

}
