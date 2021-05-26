const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const RocketChatClient = require("../rocketChat/clients/rocketChatClient").RocketChatClient;

/**
 * 
 * @param {*} hook 
 * @param {*} context 
 * @param {*} callback 
 * @returns 
 * if user hadn't rocketchat account we create here
 */
exports.clientVars = async (hook, context, callback) => {
    let userId = context.clientVars.userId;
    let padId = context.pad.id;
    var userRocketChatProfile = await db.get(`ep_rocketchat:${userId}_${padId}`) || false;
    return userRocketChatProfile;
}   