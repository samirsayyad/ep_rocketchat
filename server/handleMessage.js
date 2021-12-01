const updateRocketChatUser = require("./handleMessageMethod/updateRocketChatUser").updateRocketChatUser;
const updateImageRocketChatUser = require("./handleMessageMethod/updateImageRocketChatUser").updateImageRocketChatUser;
const handleRooms = require("./handleMessageMethod/handleRooms").handleRooms;
const sendMessageToChat = require("./handleMessageMethod/sendMessageToChat").sendMessageToChat;
const updateOnlineUsersList = require("./handleMessageMethod/updateOnlineUsersList").updateOnlineUsersList;
const joinUserToAllChannels = require("./handleMessageMethod/joinUserToAllChannels").joinUserToAllChannels;
const transportToFront = require("./handleMessageMethod/transportToFront").transportToFront
exports.handleMessage = (hook_name, context, callback) => {
  let isRocketChatMessage = false;
  if (context) {
    if (context.message && context.message) {
      if (context.message.type === 'COLLABROOM') {
        if (context.message.data) {
          if (context.message.data.type) {
            if (context.message.data.type === 'ep_rocketchat' || context.message.data.type === 'ep_profile_modal') {
              isRocketChatMessage = true;
            }
          }
        }
      }
    }
  }
  if (!isRocketChatMessage) {
    return false;
  }


  const message = context.message.data;

  if (message.action === 'ep_rocketchat_updateRocketChatUser') {
    updateRocketChatUser(message)
  }
  if (message.action === 'ep_rocketchat_updateImageRocketChatUser') {
    updateImageRocketChatUser(message)
  }
  if (message.action === 'ep_rocketchat_handleRooms') {
    handleRooms(message,context.client)
  }
  if (message.action === 'ep_rocketchat_sendMessageToChat_login') {
    sendMessageToChat(message);
    //join channels flow start here by sending req to frontend for gather up header ids that we use as rooms
    transportToFront( message.userId , message.padId, "gatherUpHeaderIds"  , null , context.client )

  }

  if (message.action === 'ep_rocketchat_joinToAllChannels') {
    joinUserToAllChannels(message);
  }
  
  if (message.action === 'ep_rocketchat_updateOnlineUsersList') {
    updateOnlineUsersList(message,context.client)
  }
  if (message.action === 'ep_profile_modal_ready'){ // sync with ep_profile_modal
    updateRocketChatUser({
      padId : message.padId,
      userId : message.userId,
      data :{
        userName : message.data.userName,
        avatarUrlReset : false ,
        messageChatText : false

      }
    })

  }

   
  
};
