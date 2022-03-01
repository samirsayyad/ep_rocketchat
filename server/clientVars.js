'use strict';

const config = require('./helpers/configs');
const rocketchatAuthenticator = require('./helpers/rocketchatAuthenticator');

/**
 *
 * @param {*} hook
 * @param {*} context
 * @param {*} callback
 * @returns
 */
exports.clientVars = async (hook, context) => {
  const userId = context.clientVars.userId;
  const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);

  return {
    ep_rocketchat: {
      baseUrl: config.baseUrl,
      rocketChatBaseUrl: `${config.protocol}://${config.host}`,
      status: (!config.userId || !config.host || !config.token) ? false : true,
      loginToken: rocketchatUserAuth.rocketchatAuthToken,
    },
  };
};
