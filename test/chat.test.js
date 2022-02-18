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
describe('chat', function () {
	let rocketChatClient = null;
	let roomId = null;
	before(function (done) {
		rocketChatClient = new RocketChatClient('https',config.host,config.port,config.userId,config.token, () => {
			return co(function* () {
				let currentRoom = yield rocketChatClient.channels.create('chat-name-' + Date.now());
				roomId = currentRoom.channel._id;
				done();
			}).catch((err) => {
				should(err).be.null();
			});
		});
	});

	describe('remove', function () {
		it('should be able to remove a posted message', function () {
			return co(function* () {
				let message = yield rocketChatClient.chat.postMessage({ roomId, text: 'any message' });
				let msgId = message.message._id;
				let result = yield rocketChatClient.chat.delete({ roomId, msgId });
				should(result).not.be.null();
				should(result.success).be.true();
			}).catch((err) => {
				should(err).be.null();
			});
		});

		it('should be able to update a posted message', function () {
			const updatedText = 'updated';
			return co(function* () {
				let message = yield rocketChatClient.chat.postMessage({ roomId, text: 'any message' });
				let msgId = message.message._id;
				let result = yield rocketChatClient.chat.update({ roomId, msgId, text: updatedText });
				should(result).not.be.null();
				should(result.success).be.true();
				should(result.message).not.be.null();
				should(result.message.msg).be.equal(updatedText);
				should(result.message.editedBy).not.be.null();
				should(result.message.editedBy.username).be.equal(config.user);
			}).catch((err) => {
				should(err).be.null();
			});
		});
	});
});