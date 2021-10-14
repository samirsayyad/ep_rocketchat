const settings = require('ep_etherpad-lite/node/utils/Settings');
const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token,
    baseUrl : settings.ep_rocketchat.baseUrl,
};
/**
 * 
 * @param {*} hook 
 * @param {*} context 
 * @param {*} callback 
 * @returns 
 */
exports.clientVars = (hook, context, callback) => {
    let userId = context.clientVars.userId;
    let padId = context.pad.id;
    return {
        ep_rocketchat:{
            baseUrl : config.baseUrl,
            rocketChatBaseUrl : `${config.protocol}://${config.host}`
            status : (!config.userId || ) 
        },
    };
}   