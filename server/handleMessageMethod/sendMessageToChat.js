const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require("../helpers/sharedTransmitter")

const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token,
    baseUrl : settings.ep_rocketchat.baseUrl,
};

exports.sendMessageToChat = async (message)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
     
    try{
        console.log(message)

        const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
        await rocketChatClient.chat.postMessage({
            "channel":`${padId}-general-channel`,
            "text": data.messageChatText,
        });
    }catch(e){
        console.log(e.message,"sendMessageToChat - general")
    }
}