const config = require("../helpers/configs");
const loginApi = require("../../rocketChat/api/separated").login
const db = require('ep_etherpad-lite/node/db/DB');

module.exports = {
    login : async (EtherpadUserId) =>{
        try{
            const globalProfileInfo = await db.get(`ep_profile_modal:${EtherpadUserId}`) || {};
            if(globalProfileInfo)
                var username = globalProfileInfo.username.replace(/\s/g, '') || "Anonymous"
            else
                var username = "Anonymous";
        
            let password = `${username}-${EtherpadUserId}@docs.plus${config.userId}` ;
            let usernameUserId = `${username}_${EtherpadUserId}`; 
            let login =await loginApi(config.protocol, config.host, config.port, usernameUserId ,password);
            await this.saveCredential(EtherpadUserId ,login.userId , login.authToken  );
            console.log("login",login)
            return login || false;
        }catch(e){
            console.log(e.message);
            return false;
        }
        
    },
    saveCredential : async(EtherpadUserId,rocketchatUserId , rocketchatAuthToken) =>{
        await db.set(`ep_rocketchat:${EtherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken });

    },
    register : async( EtherpadUserId)=>{
        try{
            const globalProfileInfo = await db.get(`ep_profile_modal:${EtherpadUserId}`) || {};
            if(globalProfileInfo)
                var username = globalProfileInfo.username.replace(/\s/g, '') || "Anonymous"
            else
                var username = "Anonymous";
            
            let email = globalProfileInfo.email ? globalProfileInfo.email : `${username}-${EtherpadUserId}@docs.plus`;
            let password = `${username}-${EtherpadUserId}@docs.plus${config.userId}` ;
            let usernameUserId = `${username}_${EtherpadUserId}`; 
    
            var userToAdd = {
                "name": username, 
                "email": email, 
                "password": password, 
                "username": usernameUserId, 
                "sendWelcomeEmail": false, 
                "joinDefaultChannels": false,
                "verified":true,
                "requirePasswordChange":false,
                "roles":["user"],
            };
    
            var rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
            var newUser = await rocketChatClient.users.create(userToAdd);
            console.log("newUser",newUser)
            this.saveCredential(EtherpadUserId ,newUser.data.data.userId , newUser.data.data.authToken  )
            return { userId :newUser.data.data.userId , authToken :  newUser.data.data.authToken  };
        }catch(e){
            console.log(e.message);
            return false;
        }

    },

    runValidator: async (EtherpadUserId)=>{
        const rocketChatUser = await db.get(`ep_rocketchat:${EtherpadUserId}`) || [];
        console.log("rocketChatUser",rocketChatUser)
        var rocketchatUserId , rocketchatAuthToken;
        if(rocketChatUser.rocketchatUserId){
            rocketchatUserId = rocketChatUser.rocketchatUserId ;
            rocketchatAuthToken = rocketChatUser.rocketchatAuthToken;
        }else{
            let loginResult = await this.login(userId);
            if(loginResult){
                rocketchatUserId = loginResult.userId ;
                rocketchatAuthToken = loginResult.authToken;
            }else{
                let registerResult = await this.register(userId);
                rocketchatUserId = registerResult.userId ;
                rocketchatAuthToken = registerResult.authToken;
            }

        }

        return { rocketchatUserId : rocketchatUserId , rocketchatAuthToken : rocketchatAuthToken  }
    }
}