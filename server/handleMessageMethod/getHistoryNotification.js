const getChannelsMessageCount = require("../../rocketChat/api/separated").getChannelsMessageCount
const rocketchatAuthenticator = require("../helpers/rocketchatAuthenticator");
const config = require("../helpers/configs");
const sharedTransmitter = require("../helpers/sharedTransmitter")

exports.getHistoryNotification = async function getHistoryNotification(message){
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    var channelsMessageCount=[]

    const channelsResults = await getChannelsMessageCount(config, data.headerIds );

    if(!channelsResults || !channelsResults.channels.length) return ;
        
    channelsResults.channels.forEach(element => {
        channelsMessageCount.push({
            name : element.name,
            fname : element.fname,
            count : element.msgs,
        })
    });

    const msg = {
        type: 'COLLABROOM',
        data: {
            type: 'CUSTOM',
            payload: {
                padId: padId,
                userId: userId,
                action: 'updateChannelsMessageCount',
                data: {
                    channelsMessageCount : channelsMessageCount
                },
            },
        },
    };
    sharedTransmitter.sendToUser(msg,socketClient);
}
