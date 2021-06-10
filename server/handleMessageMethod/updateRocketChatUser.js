const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const db = require('ep_etherpad-lite/node/db/DB');
const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token
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
            const userUpdate = await rocketChatClient.users.update(rocketChatUser.data.user._id ,{
                username : `${data.userName.replace(/\s/g, '')}_${userId}`
            });
            if(!data.avatarUrlReset)
                const userAvatar = await rocketChatUser.users.setAvatar(`/static/getUserProfileImage/${context.payload.userId}/${context.payload.padId}?t=${new Date().getTime()}`)
            else
                const userAvatar = await rocketChatUser.users.resetAvatar(rocketChatUser.data.user._id)
        }

        

    }catch(e){
        console.log(e.message,"users.update")
    }
}