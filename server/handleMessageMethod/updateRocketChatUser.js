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

exports.updateRocketChatUser = async (message)=>{
    const padId = message.padId;
    const userId = message.userId;
    const data = message.data;
    try{
        const rocketChatUser = await db.get(`ep_rocketchat:${userId}`) || [];
        console.log("rocketChatUser",rocketChatUser)
        if(rocketChatUser){
            const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
            await rocketChatClient.users.update(rocketChatUser.data.userId || rocketChatUser.data.data.userId  ,{
                username : `${data.userName.replace(/\s/g, '')}_${userId}`
            });
            if(!data.avatarUrlReset){
                await rocketChatClient.users.setAvatar(`${config.baseUrl}/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`)
            }else{
                await rocketChatClient.users.resetAvatar(rocketChatUser.data.userId)
            }
                
        }

        

    }catch(e){
        console.log(e.message,"users.update")
    }
}