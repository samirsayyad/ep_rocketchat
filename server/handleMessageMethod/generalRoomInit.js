const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require("../helpers/sharedTransmitter")
const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token
};

/**
 * 
 * @param {padId} message 
 */
exports.generalRoomInit = async (message,socketClient)=>{
    const padId = message.padId
    const userId = message.userId ;
    const roomData = await db.get(`ep_rocketchat_${padId}`) || null;
    const userJoined = await db.get(`ep_rocketchat_join_${padId}_${userId}`) || null;
    // create room if not exist
    if(!roomData){
      const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
      var roomResult = await rocketChatClient.channels.create(`${padId}-general-room`);
      console.log(roomResult,"roomResult")
      if(roomResult.success)
        db.set(`ep_rocketchat_${padId}`,roomResult);
    }
    // join current user if not joined
    if(!userJoined){
      const rocketChatUser = await db.get(`ep_rocketchat:${userId}`) || [];
      if(rocketChatUser){
        const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
        var roomInviteResult = await rocketChatClient.channels.invite({
          roomId : roomData.channel._id,
          userId : rocketChatUser.data.user._id
        });
        if(roomInviteResult.success)
          db.get(`ep_rocketchat_join_${padId}_${userId}`,"Y");
      }
    }
    const msg = {
      type: 'COLLABROOM',
      data: {
        type: 'CUSTOM',
        payload: {
          padId: padId,
          userId: message.userId,
          action: 'clientGeneralRoomInit',
          data: {
            room : `${padId}-general-room`
          },
        },
      },
    };
    sharedTransmitter.sendToUser(msg, socketClient);
}