const db = require('ep_etherpad-lite/node/db/DB');
const config = require('../helpers/configs');
const joinChannels = require('../../rocketChat/api/separated').joinChannels;
const rocketchatAuthenticator = require('../helpers/rocketchatAuthenticator');
const sharedTransmitter = require('../helpers/sharedTransmitter');

/**
 *
 * @param {padId} message
 */
exports.joinUserToAllChannels = async (message, socketClient) => {
  try {
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    const channelsMessageCount = [];

    const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);
    const channelsResults = await joinChannels(config, data.headerIds, rocketchatUserAuth.rocketchatAuthToken, rocketchatUserAuth.rocketchatUserId);
    await db.set(`${config.dbRocketchatKey}:ep_rocketchat_canJoin_${padId}_${userId}`, 'Y');

    /**
         * When this action fired, means user passed profile form and we can join him to channels
        */

    const userGotHistoryStatus = await db.get(`${config.dbRocketchatKey}:ep_rocketchat_gotHistory_${padId}_${userId}`);

    if (!channelsResults || !channelsResults.channels.length || userGotHistoryStatus === 'Y') return;

    channelsResults.channels.forEach((element) => {
      channelsMessageCount.push({
        name: element.name,
        fname: element.fname,
        count: element.msgs,
      });
    });

    // it's a flag in db that represent user got history once
    await db.set(`${config.dbRocketchatKey}:ep_rocketchat_gotHistory_${padId}_${userId}`, 'Y');

    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          padId,
          userId,
          action: 'updateChannelsMessageCount',
          data: {
            channelsMessageCount,
          },
        },
      },
    };
    sharedTransmitter.sendToUser(msg, socketClient);
  } catch (e) {
    console.error(e);
  }
};
