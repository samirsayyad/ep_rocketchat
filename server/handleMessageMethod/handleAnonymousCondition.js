const getChannelMessages = require("../../rocketChat/api/separated").getChannelMessages;
const config = require("../helpers/configs");
const sharedTransmitter = require("../helpers/sharedTransmitter")

exports.handleAnonymousCondition = async function handleAnonymousCondition(message,socketClient){

    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    try{
        const headerId = data.headerId.toLowerCase()
        // const channelMessages = await getChannelMessages(config,headerId)
        // console.log(JSON.stringify(channelMessages));

        const msg = {
            type: 'COLLABROOM',
            data: {
              type: 'CUSTOM',
              payload: {
                padId: padId,
                userId: userId,
                action: 'updateRocketChatAnonymousInterface',
                data: {
                  //room :`${padId}_header_${title}`,
                  room : headerId ,
                  rocketChatBaseUrl :  `${config.protocol}://${config.host}`,
                },
              },
            },
          };
          sharedTransmitter.sendToUser(msg,socketClient);
        
    }catch(e){
        console.log(e.message,"handleAnonymousCondition")

    }
}