import updateRocketChatIframe from './handleClientMessageMethod/updateRocketChatIframe';
import updateRocketChatIframeOnlineUsers from './handleClientMessageMethod/updateRocketChatIframeOnlineUsers';
import gatherUpHeaderIds from './handleClientMessageMethod/gatherUpHeaderIds';
import updateChannelsMessageCount from './handleClientMessageMethod/updateChannelsMessageCount';
import updateRocketChatAnonymousInterface from './handleClientMessageMethod/updateRocketChatAnonymousInterface';

export const handleClientMessage_CUSTOM = (_hook, context) => {
  const currentUserId = pad.getUserId();
  const {action, userId, padId, messageChatText} = context.payload;

  console.log(context.payload);

  if (action === 'updateRocketChatAnonymousInterface') {
    if (currentUserId === userId) updateRocketChatAnonymousInterface();
  }

  if (action === 'updateRocketChatIframe') {
    if (currentUserId === userId) updateRocketChatIframe(context.payload);
    updateRocketChatIframeOnlineUsers(context.payload);
  }

  if (action === 'updateChannelsMessageCount') {
    if (currentUserId === userId) updateChannelsMessageCount(context.payload);
  }

  if (action === 'updateOnlineUsersList') {
    // const lastActiveHeader = localStorage.getItem("lastActiveHeader");
    // if (lastActiveHeader === context.payload.data.room )
    updateRocketChatIframeOnlineUsers(context.payload);
  }

  if (action === 'gatherUpHeaderIds') {
    if (currentUserId === userId) gatherUpHeaderIds(context.payload);
  }

  // raised by ep_profile_modal
  if (action === 'EP_PROFILE_USER_LOGIN_UPDATE') {
    if (currentUserId === userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateRocketChatUser',
        userId: currentUserId,
        padId,
        data: context.payload,
      };
      pad.collabClient.sendMessage(message);
      updateRocketChatAnonymousInterface();
    }
  }

  // raised by ep_profile_modal
  if (action === 'EP_PROFILE_USER_LOGOUT_UPDATE') {
    if (currentUserId === userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateRocketChatUser',
        userId: currentUserId,
        padId,
        data: {
          userName: 'Anonymous',
          avatarUrlReset: true,
          messageChatText,
        },
      };
      pad.collabClient.sendMessage(message);
      updateRocketChatAnonymousInterface();
    }
  }

  // raised by ep_profile_modal
  if (action === 'EP_PROFILE_USER_IMAGE_CHANGE') {
    if (currentUserId === userId) {
      const message = {
        type: 'ep_rocketchat',
        action: 'ep_rocketchat_updateImageRocketChatUser',
        userId: currentUserId,
        padId,
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

export const handleClientMessage_USER_NEWINFO = () => {
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

export const handleClientMessage_USER_LEAVE = () => {
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
