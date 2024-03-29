const config = require('../helpers/configs');
const sharedTransmitter = require('../helpers/sharedTransmitter');

exports.handleAnonymousCondition = async (message, socketClient) => {
  const padId = message.padId;
  const userId = message.userId;
  const data = message.data;
  try {
    const headerId = data.headerId.toLowerCase();
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          padId,
          userId,
          action: 'updateRocketChatAnonymousInterface',
          data: {
            // room :`${padId}_header_${title}`,
            room: headerId,
            rocketChatBaseUrl: `${config.protocol}://${config.host}`,
          },
        },
      },
    };
    sharedTransmitter.sendToUser(msg, socketClient);
  } catch (e) {
    console.log(e.message, 'handleAnonymousCondition');
  }
};
