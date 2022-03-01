'use strict';

const sharedTransmitter = require('../helpers/sharedTransmitter');


exports.transportToFront = async (userId, padId, action, data, socketClient) => {
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId,
        userId,
        action,
        data,
      },
    },
  };
  sharedTransmitter.sendToUser(msg, socketClient);
};
