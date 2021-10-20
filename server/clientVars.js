const settings = require('ep_etherpad-lite/node/utils/Settings');
const config = require("./helpers/configs");
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
            rocketChatBaseUrl : `${config.protocol}://${config.host}`,
            status : (!config.userId || !config.host || !config.token ) ? false : true
        },
    };
}   