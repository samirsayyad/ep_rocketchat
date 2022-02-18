const RocketChatClient = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const should = require('should');
const co = require('co');

const config = {
	protocol: process.env.protocol,
	host :  process.env.host,
	port : process.env.port,
	userId :  process.env.userId,
	token : process.env.token
};
describe('integration', function () {
	let rocketChatClient = null;
	before(function (done) {
		rocketChatClient = new RocketChatClient('https',config.host,config.port,config.userId,config.token, done);
	});

	describe('create - list - remove', function () {
		let integrationId = null;

		let testIntegration = { 
			'type': 'webhook-outgoing', 
			'name': 'Testing via REST API', 
			'enabled': false, 
			'username': config.user, 
			'urls': ['http://some-url.example.com'], 
			'scriptEnabled': false,
			'channel' : 'all_public_channels',
			'event' : 'sendMessage' 
		};

		it('should be able to create a new integration', () => {
			return co(function* () {
				let result = yield rocketChatClient.integration.create(testIntegration);
				should(result).not.be.null();
				should(result.success).be.true();
				should(result.integration).not.be.null();
				should(result.integration._id).not.be.null();
				integrationId = result.integration._id;
			}).catch((err) => {
				should(err).be.null();
			});
		});

		it('should be able list the integration, finding the one we created', () => {
			return co(function* () {
				let result = yield rocketChatClient.integration.list({ 
					offset : 0, 
					count : 5, 
					sort : { '_createdAt' : -1 }, 
					fields : { '_id' : 1 }
				});
				should(result).not.be.null();
				should(result.success).be.true();
				should(result.integrations).not.be.null();
				should(result.integrations).not.be.empty();
				should(result.integrations.some(_ => _._id === integrationId)).be.true();
			});
		});

		it('should be able to remove our integration', () => {
			return co(function* () {
				let result = yield rocketChatClient.integration.remove({ 
					type : testIntegration.type, 
					integrationId : integrationId 
				});
				should(result).not.be.null();
				should(result.success).be.true();
				should(result.integration).not.be.null();
				should(result.integration._id).not.be.null();
				should(result.integration._id).be.equal(integrationId);
			});
		});
	});
});