
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require("../helpers/sharedTransmitter")
const getOnlineUsersApi = require("../../rocketChat/api/separated").getChannelOnlineUsers

const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token,
    baseUrl : settings.ep_rocketchat.baseUrl,
};

exports.updateOnlineUsersList = async (message,socketClient)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
     
    try{
        var rocketChatRoom = await db.get(`${config.host}:ep_rocketchat:rooms:${data.headerId}`) || false ;
        if (rocketChatRoom.channel){
            var onlineUsers = await getOnlineUsersApi(config, rocketChatRoom.channel._id );
            const msg = {
                type: 'COLLABROOM',
                data: {
                type: 'CUSTOM',
                payload: {
                    padId: padId,
                    userId: userId,
                    action: 'updateOnlineUsersList',
                    data: {
                    //room :`${padId}_header_${title}`,
                    room : data.headerId ,
                    rocketChatBaseUrl :  `${config.protocol}://${config.host}`,
                    onlineUsers : onlineUsers
                    },
                },
                },
            };
            sharedTransmitter.sendToUser(msg,socketClient);
        }
    }catch(e){
        console.log(e.message,"updateOnlineUsersList - general")
    }
}