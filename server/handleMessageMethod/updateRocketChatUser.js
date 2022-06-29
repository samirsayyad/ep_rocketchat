'use strict';

const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const config = require('../helpers/configs');

const rocketchatAuthenticator = require('../helpers/rocketchatAuthenticator');
const sendMessageToChat = require('./sendMessageToChat').sendMessageToChat;

exports.updateRocketChatUser = async (message) => {
  const padId = message.padId;
  const userId = message.userId;
  const data = message.data;
  try {
    const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);
    if (!rocketchatUserAuth.rocketchatAuthToken) throw new Error('updateRocketChatUser: rocketchatAuthToken is not correct');

    const rocketChatClient = rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
    await rocketChatClient.users.update(rocketchatUserAuth.rocketchatUserId, {
      username: `${userId}`,
      name: data.userName,
    });
    if (!data.avatarUrlReset) {
      await rocketChatClient.users.setAvatar(rocketchatUserAuth.rocketchatUserId, `${config.baseUrl}/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`);
    } else {
      await rocketChatClient.users.resetAvatar(rocketchatUserAuth.rocketchatUserId);

      if (data.messageChatText) {
        sendMessageToChat(message);
      }
    }
  } catch (e) {
    console.log(e.message, 'updateRocketChatUser', data);
  }
};
