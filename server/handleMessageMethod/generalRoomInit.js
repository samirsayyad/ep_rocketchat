const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const sharedTransmitter = require("../helpers/sharedTransmitter")
const config = require("../helpers/configs");
const getOnlineUsersApi = require("../../rocketChat/api/separated").getChannelOnlineUsers

/**
 * 
 * @param {padId} message 
 */
exports.generalRoomInit = async (message,socketClient,initialize)=>{
  const padId = message.padId
  const userId = message.userId ;

  try{
    const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});

    var rocketChatRoom = await db.get(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`) || false ;

    // create room if not exist
    if(!rocketChatRoom){
      try{
        var roomResult = await rocketChatClient.channels.create(`${padId}-general-channel`);
        if(roomResult.success){
          db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`,roomResult);
        }

        rocketChatRoom = roomResult

      }catch(e){
        console.log(e.message , "channels.create")

        const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
        var roomInfoResult = await rocketChatClient.channels.info(`${padId}-general-channel`);
        db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`,roomInfoResult);
        rocketChatRoom = roomInfoResult
      }

    }else{
      var roomInfoResult = await rocketChatClient.channels.info(`${padId}-general-channel`);
      db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`,roomInfoResult);
      rocketChatRoom = roomInfoResult
    }

    var onlineUsers = await getOnlineUsersApi(config, rocketChatRoom.channel._id );
    // join all users
    //var addAllResult = await rocketChatClient.channels.addAll( rocketChatRoom.channel._id );
    // join all users
      
  }catch(e){
    console.log(e.message , "generalRoomInit")
  }

  // join 
  // try{

  //   const userJoined = await db.get(`${config.host}:ep_rocketchat_join_${padId}_${userId}`) || null;

  //   // join current user if not joined
  //   if(!userJoined){
  //     const rocketChatUser = await db.get(`ep_rocketchat:${userId}`) || [];
  //     if(rocketChatUser){
  //       const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
  //       var roomInviteResult = await rocketChatClient.channels.invite({
  //         roomId : roomData.channel._id,
  //         userId : rocketChatUser.data.user._id 
  //       });
  //       if(roomInviteResult.success)
  //         db.get(`ep_rocketchat_join_${padId}_${userId}`,"Y");
  //     }
  //   }
  // }catch(e){
  //   console.log(e.message , "channels.create or channels.invite")
  // }
  // join 


  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: padId,
        userId: message.userId,
        action: (initialize) ? 'clientGeneralRoomInit' : 'updateRocketChatIframe',
        data: {
          room : `${padId}-general-channel`,
          rocketChatBaseUrl : `${config.protocol}://${config.host}`,
          onlineUsers : onlineUsers
        },
      },
    },
  };
  sharedTransmitter.sendToUser(msg, socketClient);
}