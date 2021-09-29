const generalRoomInit = require("./handleMessageMethod/generalRoomInit").generalRoomInit;
const updateRocketChatUser = require("./handleMessageMethod/updateRocketChatUser").updateRocketChatUser;
const updateImageRocketChatUser = require("./handleMessageMethod/updateImageRocketChatUser").updateImageRocketChatUser;
const handleRooms = require("./handleMessageMethod/handleRooms").handleRooms;
const sendMessageToChat = require("./handleMessageMethod/sendMessageToChat").sendMessageToChat;
const updateOnlineUsersList = require("./handleMessageMethod/updateOnlineUsersList").updateOnlineUsersList;
exports.handleMessage = (hook_name, context, callback) => {
  let isRocketChatMessage = false;
  if (context) {
    if (context.message && context.message) {
      if (context.message.type === 'COLLABROOM') {
        if (context.message.data) {
          if (context.message.data.type) {
            if (context.message.data.type === 'ep_rocketchat') {
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
  if (message.action === 'ep_rocketchat_generalRoomInit') {
    generalRoomInit(message,context.client,true)
  }
  if (message.action === 'ep_rocketchat_updateImageRocketChatUser') {
    updateImageRocketChatUser(message)
  }
  if (message.action === 'ep_rocketchat_handleRooms') {
    handleRooms(message,context.client)
  }
  if (message.action === 'ep_rocketchat_sendMessageToChat') {
    sendMessageToChat(message)
  }
  if (message.action === 'ep_rocketchat_updateOnlineUsersList') {
    updateOnlineUsersList(message,context.client)
  }

   
  
};
