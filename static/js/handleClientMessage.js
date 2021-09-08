const clientGeneralRoomInit = require("./handleClientMessageMethod/clientGeneralRoomInit").clientGeneralRoomInit;
const updateRocketChatIframe = require("./handleClientMessageMethod/updateRocketChatIframe").updateRocketChatIframe;
const updateRocketChatIframeOnlineUsers = require("./handleClientMessageMethod/updateRocketChatIframeOnlineUsers").updateRocketChatIframeOnlineUsers;

exports.handleClientMessage_CUSTOM = function handleClientMessage_CUSTOM(hook, context, cb){
    const current_user_id = pad.getUserId();

    if (context.payload.action == 'clientGeneralRoomInit') {
        if(current_user_id == context.payload.userId )
            clientGeneralRoomInit(context.payload)
        updateRocketChatIframeOnlineUsers(context.payload)
    }

    if (context.payload.action == 'updateRocketChatIframe') {
        if(current_user_id == context.payload.userId )
            updateRocketChatIframe(context.payload)
        updateRocketChatIframeOnlineUsers(context.payload)
    }
    if(context.payload.action == 'EP_PROFILE_USER_LOGIN_UPDATE'){ // raised by ep_profile_modal
        if (current_user_id == context.payload.userId) {
            const message = {
                type: 'ep_rocketchat',
                action: 'ep_rocketchat_updateRocketChatUser',
                userId : current_user_id,
                padId: context.payload.padId,
                data: context.payload,
              };
            pad.collabClient.sendMessage(message);
        }
    }
    if(context.payload.action == 'EP_PROFILE_USER_LOGOUT_UPDATE'){ // raised by ep_profile_modal
        if (current_user_id == context.payload.userId) {
            const message = {
                type: 'ep_rocketchat',
                action: 'ep_rocketchat_updateRocketChatUser',
                userId : current_user_id,
                padId: context.payload.padId,
                data: {
                    userName : "Anonymous",
                    avatarUrlReset : true , 
                    messageChatText : context.payload.messageChatText
                },
              };
            pad.collabClient.sendMessage(message);
        }
    }
    if(context.payload.action == 'EP_PROFILE_USER_IMAGE_CHANGE'){ // raised by ep_profile_modal
        if (current_user_id == context.payload.userId) {
            const message = {
                type: 'ep_rocketchat',
                action: 'ep_rocketchat_updateImageRocketChatUser',
                userId : current_user_id,
                padId: context.payload.padId,
              };
            pad.collabClient.sendMessage(message);
        }
    }
    
    
    return[];
}