const rocketChatClientInstance = require('../../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const config = require('../helpers/configs');

exports.sendMessageToChat = async (message)=>{
	const padId = message.padId;
	const data = message.data;
     
	try{
		const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
		await rocketChatClient.chat.postMessage({
			'channel':`${padId}-general-channel`,
			'text': data.messageChatText,
		});
	}catch(e){
		console.log(e.message,'sendMessageToChat - general');
	}
};
