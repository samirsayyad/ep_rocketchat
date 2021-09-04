const config = require("../helpers/configs");
const loginApi = require("../../rocketChat/api/separated").login
const db = require('ep_etherpad-lite/node/db/DB');
const rocketChatClientInstance = require("../../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;


const runValidator = async (EtherpadUserId)=>{
    const rocketChatUser = await db.get(`ep_rocketchat_users_${config.host}:${EtherpadUserId}`) || [];
    var rocketchatUserId , rocketchatAuthToken;
    console.log(rocketChatUser,"rocketChatUser")
    if(rocketChatUser.rocketchatUserId && rocketChatUser.username){
        console.log(rocketChatUser.rocketchatUserId && rocketChatUser.username,"rocketChatUser.rocketchatUserId && rocketChatUser.username")

        rocketchatUserId = rocketChatUser.rocketchatUserId ;
        // regenerate token
        var loginResult = await login(EtherpadUserId,rocketChatUser.username,rocketChatUser.password);
        rocketchatAuthToken = loginResult.authToken;
    }else{

        console.log("falksde ","rocketChatUser.rocketchatUserId && rocketChatUser.username")

        var loginResult = await login(EtherpadUserId);

        console.log("loginResult ",loginResult)

        if(loginResult){

            rocketchatUserId = loginResult.userId ;
            rocketchatAuthToken = loginResult.authToken;
        }else{
            var registerResult = await register(EtherpadUserId) || await register(EtherpadUserId,true);
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
            //var username = `${tempUsername}_${EtherpadUserId.replace(/\s/g, '.')}`;
            var username = EtherpadUserId;
    
        }

        var loginResult =await loginApi(config.protocol, config.host, config.port, username ,password);
        if(loginResult){
            //await saveCredential(EtherpadUserId ,loginResult.data.userId , loginResult.data.authToken ,  null );
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
    console.log("saveCredential",EtherpadUserId,rocketchatUserId , rocketchatAuthToken , info)
    if(info)
        await db.set(`ep_rocketchat_users_${config.host}:${EtherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken , ...info});
    else
        await db.set(`ep_rocketchat_users_${config.host}:${EtherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken});

}
const register = async( EtherpadUserId,randomUsername)=>{
    try{
        const globalProfileInfo = await db.get(`ep_profile_modal:${EtherpadUserId}`) || {};
        if(globalProfileInfo.username)
            var name = globalProfileInfo.username.replace(/\s/g, '') || "Anonymous"
        else
            var name = "Anonymous";
        
        let password = `${name}-${EtherpadUserId}@docs.plus${config.passwordSalt}` ;
        let usernameUserId = `${(!randomUsername) ? EtherpadUserId : EtherpadUserId + Math.floor(Math.random() * 10000)}`; // if random enabled means something bad happend for users
        let email = globalProfileInfo.email ? globalProfileInfo.email : `${usernameUserId}@docs.plus`;

        var userToAdd = {
            "name": name, 
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
        saveCredential(EtherpadUserId , newUser.user._id , null , {username :userToAdd.username , password :userToAdd.password } )
        return { userId :newUser.user._id , info:userToAdd };
    }catch(e){
        console.log("register method : ",e.message);
        return false;
    }

}



module.exports = {
    runValidator : runValidator
}
