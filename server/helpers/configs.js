const settings = require('ep_etherpad-lite/node/utils/Settings');
module.exports = {
	protocol: settings.ep_rocketchat.protocol,
	host :  settings.ep_rocketchat.host,
	port : settings.ep_rocketchat.port,
	userId :  settings.ep_rocketchat.userId,
	token : settings.ep_rocketchat.token,
	baseUrl : settings.ep_rocketchat.baseUrl,
	passwordSalt : settings.ep_rocketchat.passwordSalt,
	dbRocketchatKey : settings.ep_rocketchat.rocketChatDbKey
};