const db = require('ep_etherpad-lite/node/db/DB');
const config = require("../helpers/configs");
const joinChannels = require("../../rocketChat/api/separated").joinChannels
const rocketchatAuthenticator = require("../helpers/rocketchatAuthenticator");

/**
 * 
 * @param {padId} message 
 */
 exports.joinUserToAllChannels = async (message)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;

    await db.set(`${config.dbRocketchatKey}:ep_rocketchat_canJoin_${padId}_${userId}`,"Y");

    const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);
    await joinChannels(config, data.headerIds,rocketchatUserAuth.rocketchatAuthToken,rocketchatUserAuth.rocketchatUserId );
    /**
     * When this action fired, means user passed profile form and we can join him to channels
     */



 }