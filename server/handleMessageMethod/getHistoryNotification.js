'use strict';

const getChannelsMessageCount = require('../../rocketChat/api/separated').getChannelsMessageCount;
const config = require('../helpers/configs');
const sharedTransmitter = require('../helpers/sharedTransmitter');

exports.getHistoryNotification = async (message, socketClient) => {
  const padId = message.padId;
  const userId = message.userId;
  const data = message.data;
  const channelsMessageCount = [];

  const channelsResults = await getChannelsMessageCount(config, data.headerIds);

  if (!channelsResults || !channelsResults.channels.length) return;

  channelsResults.channels.forEach((element) => {
    channelsMessageCount.push({
      name: element.name,
      fname: element.fname,
      count: element.msgs,
    });
  });

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
};
