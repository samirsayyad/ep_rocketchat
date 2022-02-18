const config = require('../helpers/configs');
const loginApi = require('../../rocketChat/api/separated').login;
const db = require('ep_etherpad-lite/node/db/DB');
const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;

const getUserByEtherUserId = async(etherpadUserId)=>{
	return await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`);
};

const getByRocketChatUserId = async(rocketChatUserId)=>{
	return await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketChatUserId}`);
};

const runValidator = async (etherpadUserId)=>{
	const rocketChatUser = await db.get(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`) || [];
	var rocketchatUserId , rocketchatAuthToken;
	if(rocketChatUser.rocketchatUserId && rocketChatUser.username){
		rocketchatUserId = rocketChatUser.rocketchatUserId ;
		// regenerate token
		let loginResult = await login(etherpadUserId,rocketChatUser.username,rocketChatUser.password);
		rocketchatAuthToken = loginResult.authToken;
	}else{

		let loginResult = await login(etherpadUserId);
		if(loginResult){

			rocketchatUserId = loginResult.userId ;
			rocketchatAuthToken = loginResult.authToken;
		}else{
			var registerResult = await register(etherpadUserId) ;  //|| await register(etherpadUserId,true);
			if(registerResult){
				let loginResult = await login(etherpadUserId,registerResult.info.username ,registerResult.info.password  );
				rocketchatUserId = loginResult.userId ;
				rocketchatAuthToken = loginResult.authToken;
			}else{
				console.error('registerResult',registerResult);
			}
            
		}

	}

	return { rocketchatUserId : rocketchatUserId , rocketchatAuthToken : rocketchatAuthToken  };
};

const login = async (etherpadUserId, username , password) =>{
	try{

		if(!username || !password){
			const globalProfileInfo = await db.get(`ep_profile_modal:${etherpadUserId}`) || {};
			var tempUsername;
			if(globalProfileInfo.username)
				tempUsername = globalProfileInfo.username.replace(/\s/g, '') || 'Anonymous';
			else
				tempUsername = 'Anonymous';
        
			password = `${tempUsername}-${etherpadUserId}@docs.plus${config.passwordSalt}` ;
			//var username = `${tempUsername}_${etherpadUserId.replace(/\s/g, '.')}`;
			username = etherpadUserId;
    
		}

		var loginResult =await loginApi(config.protocol, config.host, config.port, username ,password);
		if(loginResult){
			//await saveCredential(etherpadUserId ,loginResult.data.userId , loginResult.data.authToken ,  null );
			return { userId : loginResult.data.userId , authToken: loginResult.data.authToken } || false;
		}else{
			return false;
		}
            
	}catch(e){
		console.log('login method : ',e.message);
		return false;
	}
    
};
const saveCredential = async(etherpadUserId,rocketchatUserId , rocketchatAuthToken , info) =>{
	if(info){
		await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken , ...info});
		await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketchatUserId}`,{etherpadUserId : etherpadUserId , rocketchatAuthToken:rocketchatAuthToken , ...info});
	}else{
		await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${etherpadUserId}`,{rocketchatUserId : rocketchatUserId , rocketchatAuthToken:rocketchatAuthToken});
		await db.set(`ep_rocketchat_users_${config.dbRocketchatKey}:${rocketchatUserId}`,{etherpadUserId : etherpadUserId , rocketchatAuthToken:rocketchatAuthToken});
	}

};
const register = async( etherpadUserId,randomUsername)=>{
	try{
		const globalProfileInfo = await db.get(`ep_profile_modal:${etherpadUserId}`) || {};
		var name;
		if(globalProfileInfo.username)
			name = globalProfileInfo.username.replace(/\s/g, '') || 'Anonymous';
		else
			name = 'Anonymous';
        
		let password = `${name}-${etherpadUserId}@docs.plus${config.passwordSalt}` ;
		let usernameUserId = `${(!randomUsername) ? etherpadUserId : etherpadUserId +'_'+ Math.floor(Math.random() * 10000)}`; // if random enabled means something bad happend for users
		let email = globalProfileInfo.email ? globalProfileInfo.email : `${usernameUserId}@docs.plus`;

		var userToAdd = {
			'name': name, 
			'email': email, 
			'password': password, 
			'username': usernameUserId, 
			'sendWelcomeEmail': false, 
			'joinDefaultChannels': false,
			'verified':true,
			'requirePasswordChange':false,
			'roles':['user'],
		};

		var rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
		var newUser = await rocketChatClient.users.create(userToAdd);
		saveCredential(etherpadUserId , newUser.user._id , null , {username :userToAdd.username , password :userToAdd.password } );
		return { userId :newUser.user._id , info:userToAdd };
	}catch(e){
		console.log('register method : ',e.message);
		return false;
	}

};



module.exports = {
	runValidator : runValidator,
	getUserByEtherUserId : getUserByEtherUserId ,
	getByRocketChatUserId: getByRocketChatUserId
};
