const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require("../helpers/sharedTransmitter")

const config = require("../helpers/configs");

exports.sendMessageToChat = async (message)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
     
    try{
        const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
        await rocketChatClient.chat.postMessage({
            "channel":`${padId}-general-channel`,
            "text": data.messageChatText,
        });
    }catch(e){
        console.log(e.message,"sendMessageToChat - general")
    }
}