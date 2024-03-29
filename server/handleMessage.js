const updateRocketChatUser = require('./handleMessageMethod/updateRocketChatUser').updateRocketChatUser;
const updateImageRocketChatUser = require('./handleMessageMethod/updateImageRocketChatUser').updateImageRocketChatUser;
const handleRooms = require('./handleMessageMethod/handleRooms').handleRooms;
const sendMessageToChat = require('./handleMessageMethod/sendMessageToChat').sendMessageToChat;
const updateOnlineUsersList = require('./handleMessageMethod/updateOnlineUsersList').updateOnlineUsersList;
const joinUserToAllChannels = require('./handleMessageMethod/joinUserToAllChannels').joinUserToAllChannels;
const transportToFront = require('./handleMessageMethod/transportToFront').transportToFront;

const getHistoryNotification = require('./handleMessageMethod/getHistoryNotification').getHistoryNotification;
const handleAnonymousCondition = require('./handleMessageMethod/handleAnonymousCondition').handleAnonymousCondition;
exports.handleMessage = (hookName, context) => {
  let isRocketChatMessage = false;

  if (context?.message?.type === 'COLLABROOM') {
    const type = context?.message?.data?.type;
    if (type === 'ep_rocketchat' && type === 'ep_profile_modal') {
      isRocketChatMessage = true;
    }
  }

  if (!isRocketChatMessage) return false;

  const message = context.message.data;

  if (message.action === 'ep_rocketchat_updateRocketChatUser') {
    updateRocketChatUser(message);
  }
  if (message.action === 'ep_rocketchat_updateImageRocketChatUser') {
    updateImageRocketChatUser(message);
  }
  if (message.action === 'ep_rocketchat_handleRooms') {
    handleRooms(message, context.client);
    if (message.data.userStatus !== 'login') handleAnonymousCondition(message, context.client);
  }
  if (message.action === 'ep_rocketchat_sendMessageToChat_login') {
    sendMessageToChat(message);
    // join channels flow start here by sending req to frontend for gather up header ids that we use as rooms
    transportToFront(message.userId, message.padId, 'gatherUpHeaderIds', {forwardTo: 'ep_rocketchat_joinToAllChannels'}, context.client);
  }

  if (message.action === 'ep_rocketchat_joinToAllChannels') {
    joinUserToAllChannels(message, context.client);
  }

  if (message.action === 'ep_rocketchat_updateOnlineUsersList') {
    updateOnlineUsersList(message, context.client);
  }
  if (message.action === 'ep_profile_modal_ready') { // sync with ep_profile_modal
    updateRocketChatUser({
      padId: message.padId,
      userId: message.userId,
      data: {
        userName: message.data.userName,
        avatarUrlReset: false,
        messageChatText: false,

      },
    });

    if (message.data.user_status === '1') { // it means user is not logged in
      transportToFront(message.userId, message.padId, 'gatherUpHeaderIds', {forwardTo: 'ep_rocketchat_getHistoryNotification'}, context.client);
    }
  }

  if (message.action === 'ep_rocketchat_getHistoryNotification') {
    getHistoryNotification(message, context.client);
  }
};
