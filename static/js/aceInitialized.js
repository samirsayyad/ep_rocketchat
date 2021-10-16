const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;
const handleRocketChatNotifications = require('./handleRocketChatNotifications/handleRocketChatNotifications').handleRocketChatNotifications

exports.aceInitialized = function aceInitialized(){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        $('#chaticon').hide();
        $('#options-stickychat').prop('checked', false);
        padcookie.setPref("chatAlwaysVisible", false);
        $('#options-stickychat').parent().hide();
        $('#options-chatandusers').parent().hide();
        const message = {
                type: 'ep_rocketchat',
                action: 'ep_rocketchat_generalRoomInit',
                userId,
                padId: padId,
                data: {
                        rocketChatBaseUrl: clientVars.ep_rocketchat.rocketChatBaseUrl    
                },
              };
        pad.collabClient.sendMessage(message);

        $("#editorcontainer iframe").addClass('fullHeightEditor')


        handleRocketChatNotifications();

 
  
        return []
}
