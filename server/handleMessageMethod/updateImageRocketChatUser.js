const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token,
    baseUrl : settings.ep_rocketchat.baseUrl
};
const rocketchatAuthenticator = require("../helpers/rocketchatAuthenticator");

exports.updateImageRocketChatUser = async (message)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    try{
        const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);
        if(rocketchatUserAuth){
            const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
            await rocketChatClient.users.setAvatar(rocketchatUserAuth.rocketchatUserId, `${config.baseUrl}/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`)
        }
    }catch(e){
        console.log(e.message,"updateImageRocketChatUser")
    }
}