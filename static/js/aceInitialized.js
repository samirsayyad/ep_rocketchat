const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;
const handleRocketChatNotifications = require('./handleRocketChatNotifications/handleRocketChatNotifications').handleRocketChatNotifications
const handleNewMentionButton = require('./handleRocketChatNotifications/methods/helper/newMentionHelper').handleNewMentionButton

exports.aceInitialized = function aceInitialized(){
        const padId = clientVars.padId;
        const userId = pad.getUserId();
        $('#chaticon').hide();
        $('#options-stickychat').prop('checked', false);
        padcookie.setPref("chatAlwaysVisible", false);
        $('#options-stickychat').parent().hide();
        $('#options-chatandusers').parent().hide();

        //$("#editorcontainer iframe").addClass('fullHeightEditor')


        handleRocketChatNotifications();
        handleNewMentionButton();
        return []
}