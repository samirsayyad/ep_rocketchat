'use strict';

const updateRocketChatIframe = require('./handleClientMessageMethod/updateRocketChatIframe').updateRocketChatIframe;
const updateRocketChatIframeOnlineUsers = require('./handleClientMessageMethod/updateRocketChatIframeOnlineUsers').updateRocketChatIframeOnlineUsers;
const gatherUpHeaderIds = require('./handleClientMessageMethod/gatherUpHeaderIds').gatherUpHeaderIds;
const updateChannelsMessageCount = require('./handleClientMessageMethod/updateChannelsMessageCount').updateChannelsMessageCount;
const updateRocketChatAnonymousInterface = require('./handleClientMessageMethod/updateRocketChatAnonymousInterface').updateRocketChatAnonymousInterface;

exports.handleClientMessage_CUSTOM = (_hook, context) => {
  const currentUserId = pad.getUserId();

  if (context.payload.action === 'updateRocketChatAnonymousInterface') {
    if (currentUserId === context.payload.userId) updateRocketChatAnonymousInterface(context.payload);
  }
  if (context.payload.action === 'updateRocketChatIframe') {
    if (currentUserId === context.payload.userId) updateRocketChatIframe(context.payload);
    updateRocketChatIframeOnlineUsers(context.payload);
  }
  if (context.payload.action === 'updateChannelsMessageCount') {
    if (currentUserId === context.payload.userId) updateChannelsMessageCount(context.payload);
  }


  if (context.payload.action === 'updateOnlineUsersList') {
    // const lastActiveHeader = localStorage.getItem("lastActiveHeader");
    // if (lastActiveHeader === context.payload.data.room )
    updateRocketChatIframeOnlineUsers(context.payload);
  }

  if (context.payload.action === 'gatherUpHeaderIds') {
    if (currentUserId === context.payload.userId) gatherUpHeaderIds(context.payload);
  }


  if (context.payload.action === 'EP_PROFILE_USER_LOGIN_UPDATE') { // raised by ep_profile_modal
    if (currentUserId === context.payload.userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateRocketChatUser',
        userId: currentUserId,
        padId: context.payload.padId,
        data: context.payload,
      };
      pad.collabClient.sendMessage(message);
      updateRocketChatAnonymousInterface(context.payload);
    }
  }

  if (context.payload.action === 'EP_PROFILE_USER_LOGOUT_UPDATE') { // raised by ep_profile_modal
    if (currentUserId === context.payload.userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateRocketChatUser',
        userId: currentUserId,
        padId: context.payload.padId,
        data: {
          userName: 'Anonymous',
          avatarUrlReset: true,
          messageChatText: context.payload.messageChatText,
        },
      };
      pad.collabClient.sendMessage(message);
      updateRocketChatAnonymousInterface(context.payload);
    }
  }

  if (context.payload.action === 'EP_PROFILE_USER_IMAGE_CHANGE') { // raised by ep_profile_modal
    if (currentUserId === context.payload.userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateImageRocketChatUser',
        userId: currentUserId,
        padId: context.payload.padId,
      };
      pad.collabClient.sendMessage(message);
    }
  }

  if (context.payload.action === 'recieveTitleMessage') {
    const message = context.payload.message;
    const padTitle = message ? message : pad.getPadId();
    if (padTitle) $('#parent_header_chat_room').text(padTitle);
  }

  return [];
};

exports.handleClientMessage_USER_NEWINFO = () => {
  const currentUserId = pad.getUserId();
  const lastActiveHeader = localStorage.getItem('lastActiveHeader');

  const message = {
    type: 'ep_rocketchat',
    action: 'ep_rocketchat_updateOnlineUsersList',
    userId: currentUserId,
    padId: pad.getPadId(),
    data: {
      headerId: lastActiveHeader,
    },
  };
  pad.collabClient.sendMessage(message);
  return [];
};


exports.handleClientMessage_USER_LEAVE = () => {
  const currentUserId = pad.getUserId();
  const lastActiveHeader = localStorage.getItem('lastActiveHeader');

  const message = {
    type: 'ep_rocketchat',
    action: 'ep_rocketchat_updateOnlineUsersList',
    userId: currentUserId,
    padId: pad.getPadId(),
    data: {
      headerId: lastActiveHeader,
    },
  };
  pad.collabClient.sendMessage(message);
  return [];
};
