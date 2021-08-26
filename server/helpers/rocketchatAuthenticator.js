const config = require("../helpers/configs");
const loginApi = require("../../rocketChat/api/separated").login
const db = require('ep_etherpad-lite/node/db/DB');
const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;


const runValidator = async (EtherpadUserId)=>{
    const rocketChatUser = await db.get(`ep_rocketchat:ep_users_${config.host}:${EtherpadUserId}`) || [];
    console.log("rocketChatUser",rocketChatUser)
    var rocketchatUserId , rocketchatAuthToken;
    if(rocketChatUser.rocketchatUserId){
        rocketchatUserId = rocketChatUser.rocketchatUserId ;
        // regenerate token
        var loginResult = await login(EtherpadUserId,rocketChatUser.info.username,rocketChatUser.info.password);
        console.log(loginResult,"loginResult-regenerate")
        rocketchatAuthToken = loginResult.authToken;
    }else{
        var loginResult = await login(EtherpadUserId);
        if(loginResult){
            console.log(loginResult,"loginResult")

            rocketchatUserId = loginResult.userId ;
            rocketchatAuthToken = loginResult.authToken;
        }else{
            var registerResult = await register(EtherpadUserId) || await register(EtherpadUserId,true);
            console.log(registerResult,"registerResult")
            if(registerResult){
                var loginResult = await login(EtherpadUserId,registerResult.info.username ,registerResult.info.password  );
                rocketchatUserId = loginResult.userId ;
                rocketchatAuthToken = loginResult.authToken;
            }else{
                console.error("registerResult",registerResult)
            }
            
        }

    }

    return { rocketchatUserId : rocketchatUserId , rocketchatAuthToken : rocketchatAuthToken  }
}

const login = async (EtherpadUserId, username , password) =>{
    try{

        if(!username || !password){
            const globalProfileInfo = await db.get(`ep_profile_modal:${EtherpadUserId}`) || {};
            if(globalProfileInfo.username)
                var tempUsername = globalProfileInfo.username.replace(/\s/g, '') || "Anonymous"
            else
                var tempUsername = "Anonymous";
        
            var password = `${tempUsername}-${EtherpadUserId}@docs.plus${config.passwordSalt}` ;
            var username = `${tempUsername}_${EtherpadUserId.replace(/\s/g, '.')}`;
    
        }

        var loginResult =await loginApi(config.protocol, config.host, config.port, username ,password);
        console.log("login result",loginResult)
        if(loginResult){
            await saveCredential(EtherpadUserId ,loginResult.data.userId , loginResult.data.authToken ,  null );
            return { userId : loginResult.data.userId , authToken: loginResult.data.authToken } || false;
        }else{
            return false;
        }
            
    }catch(e){
        console.log("login method : ",e.message);
        return false;
    }
    
}
const saveCredential = async(EtherpadUserId,rocketchatUserId , rocketchatAuthToken , info) =>{
    if(info)
        await db.set(`ep_rocketchat:ep_users_${config.host}:${EtherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken , info:info});
    else
        await db.set(`ep_rocketchat:ep_users_${config.host}:${EtherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken});

}
const register = async( EtherpadUserId,randomUsername)=>{
    try{
        const globalProfileInfo = await db.get(`ep_profile_modal:${EtherpadUserId}`) || {};
        if(globalProfileInfo.username)
            var username = globalProfileInfo.username.replace(/\s/g, '') || "Anonymous"
        else
            var username = "Anonymous";
        
        let password = `${username}-${EtherpadUserId}@docs.plus${config.passwordSalt}` ;
        let usernameUserId = `${username}_${(!randomUsername) ? EtherpadUserId.replace(/\s/g, '.') : EtherpadUserId.replace(/\s/g, '.')+Math.floor(Math.random() * 10000)}`; // if random enabled means something bad happend for users
        console.log("usernameUserId",usernameUserId)
        let email = globalProfileInfo.email ? globalProfileInfo.email : `${usernameUserId}@docs.plus`;

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
        console.log("newUser",newUser);
        saveCredential(EtherpadUserId , newUser.user._id , null , userToAdd )
        return { userId :newUser.user._id , info:userToAdd };
    }catch(e){
        console.log("register method : ",e.message);
        return false;
    }

}



module.exports = {
    runValidator : runValidator
}
