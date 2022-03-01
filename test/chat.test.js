'use strict';
const RocketChatClient = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const should = require('should');
const co = require('co');

const config = {
  protocol: process.env.protocol,
  host: process.env.host,
  port: process.env.port,
  userId: process.env.userId,
  token: process.env.token,
};
describe('chat', () => {
  let rocketChatClient = null;
  let roomId = null;
  before((done) => {
    rocketChatClient = new RocketChatClient('https', config.host, config.port, config.userId, config.token, () => co(function* () {
      const currentRoom = yield rocketChatClient.channels.create(`chat-name-${Date.now()}`);
      roomId = currentRoom.channel._id;
      done();
    }).catch((err) => {
      should(err).be.null();
    }));
  });

  describe('remove', () => {
    it('should be able to remove a posted message', () => co(function* () {
      const message = yield rocketChatClient.chat.postMessage({roomId, text: 'any message'});
      const msgId = message.message._id;
      const result = yield rocketChatClient.chat.delete({roomId, msgId});
      should(result).not.be.null();
      should(result.success).be.true();
    }).catch((err) => {
      should(err).be.null();
    }));

    it('should be able to update a posted message', () => {
      const updatedText = 'updated';
      return co(function* () {
        const message = yield rocketChatClient.chat.postMessage({roomId, text: 'any message'});
        const msgId = message.message._id;
        const result = yield rocketChatClient.chat.update({roomId, msgId, text: updatedText});
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
