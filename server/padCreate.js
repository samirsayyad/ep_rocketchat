const rocketChatClientInstance = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const db = require('ep_etherpad-lite/node/db/DB');
const config = require('./helpers/configs');

exports.padCreate = (hook_name, context) => {
	const padId = context.pad.id;
	generalRoomInit(padId);
	return;

};

const generalRoomInit = async (padId) =>{
	const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
	// create genral room for initilizing
	try{
		var roomResult = await rocketChatClient.channels.create(`${padId}-general-channel`);
		if(roomResult.success){
			db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`,roomResult);
		}
	}catch(e){
		console.log(e.message , 'channels.create');
		const rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
		var roomInfoResult = await rocketChatClient.channels.info(`${padId}-general-channel`);
		db.set(`${config.dbRocketchatKey}:ep_rocketchat:rooms:${padId}`,roomInfoResult);
	}
};