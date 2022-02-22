var restClient = require('./restClient');

function rocketChatClientInstance (protocol, host, port, userId, token, onConnected) {
	let basepath = '';
        
	if (arguments.length === 1) {
		host = arguments[0].host || 'localhost';
		port = arguments[0].port || 3000;
		onConnected = arguments[0].onConnected;
		basepath = (arguments[0].basepath || '').replace(/^\/+|\/+$/g, '');
		protocol = arguments[0].protocol || 'http';
	}
    
	onConnected = onConnected || function() {};
	var restClientObj = new restClient.RestClient(protocol, host, port, basepath + '/api/v1/');
	var wsClient = new restClient.WsClient('ws', host, port, basepath + '/websocket');
	this.authentication = new (require('../api/authentication'))(restClientObj);

	this.miscellaneous = new (require('../api/miscellaneous'))(restClientObj);
	this.chat = new (require('../api/chat'))(restClientObj);
	this.channels = new (require('../api/channels'))(restClientObj);
	this.groups = new (require('../api/groups'))(restClientObj);
	this.settings = new (require('../api/setting'))(restClientObj);
	this.users = new (require('../api/users'))(restClientObj);
	this.integration = new (require('../api/integration'))(restClientObj);
	this.realtime = new (require('../api/realtime'))(wsClient);
	this.notify = new (require('../api/notify'))(wsClient);
	this.im = new (require('../api/im'))(restClientObj);

	this.restClient = restClientObj;
	this.wsClient = wsClient;
	if (userId && token) {
		restClientObj.setHeader('X-Auth-Token', token);
		restClientObj.setHeader('X-User-Id', userId);

		this.authentication.me(function (err) {
			if (err) {
				return onConnected(err, null);
			}
			onConnected(null, { userId });
		});
	} else {
		onConnected(null, null);
	}
}
exports.rocketChatClientInstance = rocketChatClientInstance;
