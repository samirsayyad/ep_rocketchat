'use strict';

const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require('../helpers/sharedTransmitter');
const getOnlineUsersApi = require('../../rocketChat/api/separated').getChannelOnlineUsers;
const joinChannel = require('../../rocketChat/api/separated').joinChannel;
const rocketchatAuthenticator = require('../helpers/rocketchatAuthenticator');

const config = require('../helpers/configs');

exports.handleRooms = async (message, socketClient) => {
  const padId = message.padId;
  const userId = message.userId;
  const data = message.data;
  try {
    const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);

    if (data.headerId == `${padId}-general-channel`) {
      sendToUpdateRocketChatIframe(padId, userId, data.headerId, rocketchatUserAuth, onlineUsers, config, socketClient);
      return;
    }
    const rocketChatClient = new rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
    let rocketChatRoom = await db.get(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${data.headerId}`) || false;
    if (rocketChatRoom == false) {
      try {
        var roomResult = await rocketChatClient.channels.create(data.headerId.toLowerCase());
        if (roomResult.success) {
          await db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${data.headerId}`, roomResult);
        }
        rocketChatRoom = roomResult;
      } catch (e) {
        console.log(e.message, 'channels.create');
        const rocketChatClient = new rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
        var roomInfoResult = await rocketChatClient.channels.info(data.headerId.toLowerCase());
        db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${data.headerId}`, roomInfoResult);
        rocketChatRoom = roomInfoResult;
      }
    } else {
      try {
        await rocketChatClient.channels.info(data.headerId.toLowerCase());
        db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${data.headerId}`, roomInfoResult);
        rocketChatRoom = roomInfoResult;
      } catch (e) {
        console.log(e.message, 'roomInfoResult of handleRooms');

        const rocketChatClient = new rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
        await rocketChatClient.channels.create(data.headerId.toLowerCase());
        if (roomResult.success) {
          await db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${data.headerId}`, roomResult);
        }
        rocketChatRoom = roomResult;
      }
    }


    try {
      var onlineUsers = await getOnlineUsersApi(config, rocketChatRoom.channel._id);
    } catch (e) {
      console.log(e.message, 'onlineUsers of handleRooms');
    }


    // join all users
    // var addAllResult = await rocketChatClient.channels.addAll( rocketChatRoom.channel._id );
    // join all users

    // handle join users
    const userJoined = await db.get(`${config.dbRocketchatKey}:ep_rocketchat_join_${padId}_${userId}_${data.headerId}`) || null;
    if (!userJoined) {
      const canUserJoin = await db.get(`${config.dbRocketchatKey}:ep_rocketchat_canJoin_${padId}_${userId}`);
      if (canUserJoin) {
        if (!rocketchatUserAuth) {
          console.error('rocketchatUserAuth', rocketchatUserAuth);
        } else {
          try {
            await joinChannel(config, rocketChatRoom.channel._id, rocketchatUserAuth.rocketchatAuthToken, rocketchatUserAuth.rocketchatUserId);
            await db.set(`${config.dbRocketchatKey}:ep_rocketchat_join_${padId}_${userId}`, 'Y');
          } catch (e) {
            console.log(e.message, 'joinChannel of handleRooms');
          }
        }
      }
    }
    // handle join users
    sendToUpdateRocketChatIframe(padId, userId, data.headerId, rocketchatUserAuth, onlineUsers, config, socketClient);
  } catch (e) {
    console.log(e.message, 'channels.create of handleRooms - general');
  }
};


const sendToUpdateRocketChatIframe = (padId, userId, headerId, rocketchatUserAuth, onlineUsers, config, socketClient) => {
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId,
        userId,
        action: 'updateRocketChatIframe',
        data: {
          // room :`${padId}_header_${title}`,
          room: headerId.toLowerCase(),
          rocketChatBaseUrl: `${config.protocol}://${config.host}`,
          onlineUsers,
          rcId: rocketchatUserAuth.rocketchatUserId,
          rcToken: rocketchatUserAuth.rocketchatAuthToken,
        },
      },
    },
  };
  sharedTransmitter.sendToUser(msg, socketClient);
};
