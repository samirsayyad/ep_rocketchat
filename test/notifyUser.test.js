'use strict';

const RocketChatClient = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const should = require('should');

const config = {
  protocol: process.env.protocol,
  host: process.env.host,
  port: process.env.port,
  userId: process.env.userId,
  token: process.env.token,
};

describe('notifyUser', () => {
  const userToAdd = {
    name: `sender${Date.now()}`,
    email: `email${Date.now()}@example.com`,
    password: 'anypassyouwant',
    username: `uniqueusername${Date.now()}`,
  };
  let userId;
  let client, secondClient;

  before(function (done) {
    this.timeout(5000);
    client = new RocketChatClient('https', config.host, config.port, config.userId, config.token, (err, body) => {
      should(err).be.null();
      should(body).not.be.null();
      userId = body.userId;
      client.users.create(userToAdd, () => { });
      setTimeout(() => {
        secondClient = new RocketChatClient('https', config.host, config.port, userToAdd.username, userToAdd.password, () => {
          done();
        });
      }, 500);
    });
  });

  describe('of a subscription change', () => {
    xit('should notify user when user with an active private chat logs in', (done) => {
      secondClient.authentication.login(userToAdd.username, userToAdd.password, () => {
        done();
      });
    });
  });

  describe('of a new message', () => {
    let roomId, roomName;

    before((done) => {
      roomName = `notify-user-${Date.now()}`;
      secondClient.authentication.login(userToAdd.username, userToAdd.password, () => {
        client.channels.create(roomName, (err, body) => {
          should(err).be.null();
          should(body.success).be.true();
          roomId = body.channel._id;
          done();
        });
      });
    });

    it('should notify the user when a message for him was sent', function (done) {
      const message = `@${config.user} hello world!`;
      this.timeout(5000);
      client.notify.user.onNotification(userId, (err, body) => {
        should(err).be.null();
        should(body).not.be.null();
        should(body.fields.args[0].text).be.equal(message);
        done();
      });

      secondClient.chat.postMessage({roomId, text: message}, (err, body) => {
        should(err).be.null();
        should(body).not.be.null();
      });
    });

    it('should notify the user when a room\'s status has changed', function (done) {
      const message = 'hello world!';
      this.timeout(5000);

      client.notify.room.onChanged(roomId, (err, body) => {
        should(err).be.null();
        should(body).not.be.null();
        should(body.msg).be.equal('changed');
        should(body.fields.eventName).be.equal(roomId);
        done();
      });

      secondClient.chat.postMessage({roomId, text: message}, (err, body) => {
        should(err).be.null();
        should(body).not.be.null();
      });
    });
  });
});
