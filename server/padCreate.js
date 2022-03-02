'use strict';

const rocketChatClientInstance = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const db = require('ep_etherpad-lite/node/db/DB');
const config = require('./helpers/configs');


const generalRoomInit = async (padId) => {
  try {
    const rocketChatClient = rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
    // create genral room for initilizing
    const roomResult = await rocketChatClient.channels.create(`${padId}-general-channel`);
    if (roomResult.success) {
      db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`, roomResult);
    }
  } catch (e) {
    console.error(e.message, 'channels.create');
    try {
      const rocketChatClient = rocketChatClientInstance(config.protocol, config.host, config.port, config.userId, config.token, () => {});
      const roomInfoResult = await rocketChatClient.channels.info(`${padId}-general-channel`);
      db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`, roomInfoResult);
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
