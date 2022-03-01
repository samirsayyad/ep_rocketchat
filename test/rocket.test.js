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
describe('Test the rest api and rocketchat version version', () => {
  it('rest api version should not be below 0.1 and rocketchat should not be beblow 0.5', (done) => {
    const rocketChatApi = new RocketChatClient('https', config.host, config.port, config.userId, config.token, ((err) => {
      if (err) throw err;
      rocketChatApi.version((err, body) => {
        should(err).be.null();
        should(body).not.be.undefined;
        should(body).not.be.null;
        body.versions.api.should.not.be.below(0.1);
        body.versions.rocketchat.should.not.be.below(0.5);
        done();
      });
    }));
  });
});

describe('test create, join, leave rooms, and get list of public rooms', () => {
  let rocketChatApi = null;

  beforeEach((done) => {
    rocketChatApi = new RocketChatClient('https', config.host, config.port, config.userId, config.token, done);
  });

  it('create a new room with a test user, find the room, join it, and set the topic', function (done) {
    this.timeout(15000);
    const roomName = `testuser_testRoom_${Date.now()}`;// create a room has unique name
    rocketChatApi.createRoom(roomName, (err, body) => {
      should(err).be.null();
      should(body).not.be.null();
      should(body).not.be.undefined();
      body.channel.name.should.equal(roomName);
      const roomId = body.channel._id;
      // find the room
      rocketChatApi.getPublicRooms((err, body) => {
        should(err).be.null();
        should(body).not.be.null();
        should(body).not.be.undefined();
        body.channels.should.matchAny((room) => {
          room._id.should.equal(roomId);
        });

        // join the room
        rocketChatApi.joinRoom(roomId, (err) => {
          should(err).be.null();

          // set the topic
          rocketChatApi.setTopic(roomId, 'mytopic', (err) => {
            should(err).be.null();
            done();
            /* cannot leave, only one user
                        rocketChatApi.leaveRoom(roomId, function (err, body) {
                            should(err).be.null();
                            done();;*/
          });
        });
      });
    });
  });

  afterEach(() => {
    rocketChatApi = null;
  });
});


describe('test sending a message and get all messages in a room', () => {
  let rocketChatApi = null;
  beforeEach((done) => {
    rocketChatApi = new RocketChatClient('https', config.host, config.port, config.userId, config.token, done);
  });

  it('sending a message', (done) => {
    const roomName = `createdRoom_${Date.now()}`;// create a room has unique name
    const message = 'Hello World';
    rocketChatApi.createRoom(roomName, (err, body) => {
      should(err).be.null();
      const roomId = body.channel._id;
      rocketChatApi.sendMsg(roomId, message, (err, body) => {
        should(err).be.null();
        should(body).not.be.null();
        done();
      });
    });
  });

  // get latest message not supported in newer api versions (yet)
  xit('sending a meesage, and get lastest messages', (done) => {
    const roomName = `createdRoom_${Date.now()}`;// create a room has unique name
    const message = 'Hello World';
    rocketChatApi.createRoom(roomName, (err, body) => {
      (!err).should.be.ok();
      const roomId = body.channel._id;
      rocketChatApi.joinRoom(roomId, (err) => {
        (!err).should.be.ok();
        rocketChatApi.sendMsg(roomId, message, (err) => {
          (!err).should.be.ok();
          rocketChatApi.getUnreadMsg(roomId, (err, body) => {
            (!err).should.be.ok();
            body.messages[0].msg.should.equal(message);
            done();
          });
        });
      });
    });
  });

  afterEach(() => {
    rocketChatApi = null;
  });
});
