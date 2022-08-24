const rocketChatClientInstance = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const db = require('ep_etherpad-lite/node/db/DB');
const {
  protocol,
  host,
  port,
  userId,
  token,
  dbRocketchatKey,
} = require('./helpers/configs');

const emptyFn = () => {};

const initRocketChatClientInstance = async (padId) => {
  const rocketChatClient = rocketChatClientInstance(protocol, host, port, userId, token, emptyFn);
  // create genral room for initilizing
  const roomResult = await rocketChatClient.channels.create(`${padId}-general-channel`);
  if (roomResult.success) {
    db.set(`${dbRocketchatKey}:ep_rocketchat:rooms:${padId}`, roomResult);
  }
};

const generalRoomInit = async (padId) => {
  try {
    await initRocketChatClientInstance(padId);
  } catch (e) {
    console.error(e.message, 'channels.create');
    try {
      const rocketChatClient = rocketChatClientInstance(protocol, host, port, userId, token, emptyFn);
      const roomInfoResult = await rocketChatClient.channels.info(`${padId}-general-channel`);
      db.set(`${dbRocketchatKey}:ep_rocketchat:rooms:${padId}`, roomInfoResult);
    } catch (e) {
      console.error(e.message, 'channels.create second time');
    }
  }
};

exports.padCreate = (hookName, context) => {
  const padId = context.pad.id;
  generalRoomInit(padId);
  return;
};
