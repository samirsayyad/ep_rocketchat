const settings = require('ep_etherpad-lite/node/utils/Settings');
const config = require("./helpers/configs");
const rocketchatAuthenticator = require("./helpers/rocketchatAuthenticator");

/**
 * 
 * @param {*} hook 
 * @param {*} context 
 * @param {*} callback 
 * @returns 
 */
exports.clientVars = async (hook, context, callback) => {
    let userId = context.clientVars.userId;
    let padId = context.pad.id;
    const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);

    return {
        ep_rocketchat:{
            baseUrl : config.baseUrl,
            rocketChatBaseUrl : `${config.protocol}://${config.host}`,
            status : (!config.userId || !config.host || !config.token ) ? false : true,
            loginToken: rocketchatUserAuth.rocketchatAuthToken,
        },
    };
}   