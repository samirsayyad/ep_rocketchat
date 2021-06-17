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
    baseUrl : settings.ep_rocketchat.baseUrl
};

exports.handleRooms = async (message,socketClient)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    var title =  data.title.replace(/\s+/g, '-')
    try{
        const rocketChatRoom = await db.get(`ep_rocketchat:rooms:${data.headerId}_${title}`) || false ;

        if(!rocketChatRoom){
            const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
            var roomResult = await rocketChatClient.channels.create(`${padId}_header_${title}`)
            console.log("roomResult",roomResult)
            if(roomResult.success){
                await db.set(`ep_rocketchat:rooms:${data.headerId}_${title}`,roomResult);
            }
            
        }

        const msg = {
            type: 'COLLABROOM',
            data: {
              type: 'CUSTOM',
              payload: {
                padId: padId,
                userId: userId,
                action: 'updateRocketChatIframe',
                data: {
                  room :`${padId}_header_${title}`
                },
              },
            },
          };
          sharedTransmitter.sendToUser(msg,socketClient);
    }catch(e){
        console.log(e.message,"channels.create of handleRooms")
    }
}