const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const config = require('../helpers/configs');

const rocketchatAuthenticator = require('../helpers/rocketchatAuthenticator');

exports.updateImageRocketChatUser = async (message)=>{
	const padId = message.padId;
	const userId = message.userId;
	try{
		const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(userId);
		if(rocketchatUserAuth){
			const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
			await rocketChatClient.users.setAvatar(rocketchatUserAuth.rocketchatUserId, `${config.baseUrl}/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`);
		}
	}catch(e){
		console.log(e.message,'updateImageRocketChatUser');
	}
};
