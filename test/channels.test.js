'use strict';

const RocketChatClient = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const should = require('should');
const async = require('async');
const co = require('co');

const config = {
  protocol: process.env.protocol,
  host: process.env.host,
  port: process.env.port,
  userId: process.env.userId,
  token: process.env.token,
};

describe('channels', () => {
  let rocketChatClient = null;
  before((done) => {
    rocketChatClient = new RocketChatClient('https', config.host, config.port, config.userId, config.token, done);
  });

  const userToAdd = {
    name: 'test-channel-user',
    email: 'email@example.com',
    password: 'anypassyouwant',
    username: 'uniqueusername',
    sendWelcomeEmail: false,
    joinDefaultChannels: false,
    verified: false,
    requirePasswordChange: false,
    roles: ['user'],
  };

  describe('creating channels', () => {
    it('should be successful', function (done) {
      this.timeout(10000);
      const creates = [];
      for (let i = 0; i < 10; i++) {
        creates.push((callback) => {
          rocketChatClient.channels.create(`channel-name-${Date.now()}`, (err, body) => {
            should(err).be.null();
            should(body.success).be.true();
            callback();
          });
        });
      }
      async.series(creates, () => {
        done();
      });
    });

    describe('querying channels', () => {
      it('should be listable', (done) => {
        rocketChatClient.channels.list({}, (err, result) => {
          should(err).be.null();
          should(result.success).be.true();
          should(result.channels.length).be.greaterThan(5);
          done();
        });
      });
      it('should be pageable', (done) => {
        rocketChatClient.channels.list({offset: 1, count: 5}, (err, result) => {
          should(err).be.null();
          should(result.success).be.true();
          should(result.channels.length).be.equal(5);
          done();
        });
      });
      it('should be queryable', (done) => {
        rocketChatClient.channels.list({query: {name: {$regex: 'thisreallydoesnotexist'}}}, (err, result) => {
          should(err).be.null();
          should(result.success).be.true();
          should(result.channels.length).be.equal(0);
          done();
        });
      });
      it('should be fieldable', (done) => {
        rocketChatClient.channels.list({fields: {name: 1}}, (err, result) => {
          should(err).be.null();
          should(result.success).be.true();
          should(result.channels.length).be.greaterThan(0);
          should(result.channels[0].name).be.ok();
          should(result.channels[0].msgs === undefined).be.true();
          done();
        });
      });
      it('should be sortable', (done) => {
        rocketChatClient.channels.list({sort: {_updatedAt: 1}}, (err, result) => {
          should(err).be.null();
          should(result.success).be.true();
          should(result.channels.length).be.greaterThan(0);
          const firstResult = result.channels[0];
          rocketChatClient.channels.list({sort: {_updatedAt: -1}}, (err, result) => {
            should(err).be.null();
            should(result.success).be.true();
            should(result.channels.length).be.greaterThan(0);
            should(result.channels[0]).be.not.equal(firstResult);
            done();
          });
        });
      });
    });
  });

  describe('add user to the channel', () => {
    let addedUserId = null;
    let addedRoomId = null;

    beforeEach(() => {
      userToAdd.name += Date.now();
      userToAdd.username += Date.now();
      userToAdd.email = `email${Date.now()}@example.com`;

      return co(function *() {
        // create temp user
        const addedUser = yield rocketChatClient.users.create(userToAdd);
        addedUserId = addedUser.user._id;
        should(addedUserId).not.be.null();

        // create test channel
        const addedChannel = yield rocketChatClient.channels.create(`channel-name-${Date.now()}`);
        addedRoomId = addedChannel.channel._id;
        should(addedRoomId).be.ok();
      }).catch((err) => {
        should(err).be.null();
      });
    });

    afterEach(() => co(function *() {
      // remove added channel
      if (addedRoomId != null) {
        const removeChannelResult = yield rocketChatClient.channels.close(addedRoomId);
        removeChannelResult.success.should.be.ok();
      }

      // remove added user
      if (addedUserId != null) {
        const removeUserResult = yield rocketChatClient.users.delete(addedUserId);
        removeUserResult.success.should.be.ok();
      }

      addedUserId = null;
      addedRoomId = null;
    }).catch((err) => {
      should(err).be.null();
    }));

    it('Adds all of the users of the Rocket.Chat server to the channel. test username should in the "username" list', () => co(function *() {
      // add all user into the added channel
      const addedResult = yield rocketChatClient.channels.addAll(addedRoomId);
      addedResult.channel.usernames.should.containEql(userToAdd.username);
    }).catch((err) => {
      should(err).be.null();
    }));

    it('Gives the role of moderator for a user in the currrent channel,' +
            ' then Removes the role of moderator from a user in the currrent channel. ' +
            'result should be successful', () => co(function *() {
      // add user into the room
      const addedResult = yield rocketChatClient.channels.invite(addedRoomId, addedUserId);
      addedResult.success.should.equal(true);

      // and set the user as moderator
      const setModeratorResult = yield rocketChatClient.channels.addModerator(addedRoomId, addedUserId);
      setModeratorResult.success.should.equal(true);

      // then remove role
      const removeMederatorResult = yield rocketChatClient.channels.removeModerator(addedRoomId, addedUserId);
      removeMederatorResult.success.should.equal(true);
    }).catch((err) => {
      should(err).be.null();
    }));

    it('Gives the role of owner for a user in the current channel, ' +
            'removes the role of owner from a user in the current channel. ' +
            'result should be successful', () => co(function *() {
      // add user into the room
      const addedResult = yield rocketChatClient.channels.invite(addedRoomId, addedUserId);
      addedResult.success.should.equal(true);

      // add the user as owner
      const addOwnerResult = yield rocketChatClient.channels.addOwner(addedRoomId, addedUserId);
      addOwnerResult.success.should.equal(true);

      const removeOwnerResult = yield rocketChatClient.channels.removeOwner(addedRoomId, addedUserId);
      removeOwnerResult.success.should.equal(true);
    }));

    it('Adds a user to the channel. new added username should in the username list', () => co(function *() {
      // invite user into the room
      const invitedResult = yield rocketChatClient.channels.invite(addedRoomId, addedUserId);
      invitedResult.success.should.equal(true);
      invitedResult.channel.usernames.should.containEql(userToAdd.username);
    }));

    it('Removes a user from the channel. the user should not in the username list', () => co(function *() {
      // invite user into the room
      const invitedResult = yield rocketChatClient.channels.invite(addedRoomId, addedUserId);
      invitedResult.success.should.equal(true);
      invitedResult.channel.usernames.should.containEql(userToAdd.username);

      // kick the user out
      const kickedResult = yield rocketChatClient.channels.kick(addedRoomId, addedUserId);
      kickedResult.success.should.equal(true);
      kickedResult.channel.usernames.should.not.containEql(userToAdd.username);
    }));

    it('Causes the callee to be removed from the channel. the callee should not in the username list', () => co(function *() {
      // qeesung is the only owner of the channel, so need to set new owner before leaving the room
      // add user into the room
      const addedResult = yield rocketChatClient.channels.invite(addedRoomId, addedUserId);
      addedResult.success.should.equal(true);

      // add the user as owner
      const addOwnerResult = yield rocketChatClient.channels.addOwner(addedRoomId, addedUserId);
      addOwnerResult.success.should.equal(true);

      const leaveResult = yield rocketChatClient.channels.leave(addedRoomId);
      leaveResult.success.should.equal(true);
      leaveResult.channel.usernames.should.not.containEql(config.user);

      // qeesung have already leave the room, can not remove the user and room
      addedUserId = null;
      addedRoomId = null;
    }));
  });

  describe('config and get properties from channel', () => {
    let addedRoomId = null;

    beforeEach(() => {
      userToAdd.name += Date.now();
      userToAdd.username += Date.now();
      userToAdd.email = `email${Date.now()}@example.com`;

      return co(function *() {
        const addedChannel = yield rocketChatClient.channels.create(`channel-name-${Date.now()}`);
        addedRoomId = addedChannel.channel._id;
      });
    });

    afterEach(() => co(function *() {
      if (addedRoomId != null) yield rocketChatClient.channels.close(addedRoomId);
    }));

    it('Archives a channel, then unarchives a channel. result should be successful', () => co(function *() {
      const archiveResult = yield rocketChatClient.channels.archive(addedRoomId);
      archiveResult.success.should.equal(true);

      const unarchiveResult = yield rocketChatClient.channels.unarchive(addedRoomId);
      unarchiveResult.success.should.equal(true);
    }));

    it('Removes the channel from the user’s list of channels ' +
            'then adds the channel back to the user’s list of channels.' +
            ' result should be successful', () => co(function *() {
      const closeResult = yield rocketChatClient.channels.close(addedRoomId);
      closeResult.success.should.equal(true);

      const openResult = yield rocketChatClient.channels.open(addedRoomId);
      openResult.success.should.equal(true);
    }));

    it('Retrieves the messages from a channel. the latest message should be \'hello world\'', () => co(function *() {
      const textMessage = `hello world at ${Date.now()}`;
      // send message
      const postMessageResult = yield rocketChatClient.chat.postMessage({roomId: addedRoomId, text: textMessage});
      postMessageResult.success.should.equal(true);

      // get the messages from channel
      const history = yield rocketChatClient.channels.history({roomId: addedRoomId});
      history.messages.should.matchEach((value) => {
        value.msg.should.match(/^hello world at/);
      });
    }));

    it('Cleans up a channel, removing messages from the provided time range. the messages should be empty', () => co(function *() {
      // send 10 messages
      const postMessageTasks = [...Array(10)].map((_, i) => {
        const messageText = `hello world#${i} at${Date.now()}`;
        return rocketChatClient.chat.postMessage({
          roomId: addedRoomId,
          text: messageText,
        });
      });
      yield postMessageTasks;

      // get the messages from the channel
      let history = yield rocketChatClient.channels.history({roomId: addedRoomId});
      history.messages.should.matchEach((value) => {
        value.msg.should.match(/^hello world/);
      });

      // clean the messages
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 1);
      const cleanResult = yield rocketChatClient.channels.cleanHistory(addedRoomId, Date.now(), lastDate);
      cleanResult.success.should.equal(true);

      // get the messages from the channel
      history = yield rocketChatClient.channels.history({roomId: addedRoomId});
      history.messages.length.should.equal(0);
    }));

    it('Retrieves the integrations which the channel has, the result should be successful', () => co(function *() {
      const integrations = yield rocketChatClient.channels.getIntegrations(addedRoomId);
      integrations.success.should.equal(true);
    }));

    it('Retrieves the information about the channel. the result should be successful', () => co(function *() {
      const channelInfo = yield rocketChatClient.channels.info(addedRoomId);
      channelInfo.success.should.equal(true);
      channelInfo.channel.should.not.be.null();
    }));

    it('List all channels and list all channels joined', () => co(function *() {
      const joinedChannelList = yield rocketChatClient.channels.listJoined({});
      joinedChannelList.success.should.equal(true);
      joinedChannelList.channels.should.matchAny((channel) => {
        channel._id.should.match(addedRoomId);
      });

      const serverChannelList = yield rocketChatClient.channels.list({});
      serverChannelList.success.should.equal(true);
      serverChannelList.channels.should.matchAny((channel) => {
        channel._id.should.match(addedRoomId);
      });
    }));

    it('Changes the name of the channel. the name should equal to new-name', () => {
      const newName = `new-name-${Date.now()}`;
      return co(function *() {
        const renamedChannel = yield rocketChatClient.channels.rename(addedRoomId, newName);
        renamedChannel.success.should.equal(true);
        renamedChannel.channel.name.should.equal(newName);
      });
    });

    it('Sets the description for the channel. the result should be successful', () => co(function *() {
      const description = 'hello world';
      const setedChannel = yield rocketChatClient.channels.setDescription(addedRoomId, description);
      setedChannel.success.should.equal(true);
      setedChannel.description.should.equal(description);
    }));

    it('Sets the code required to join the channel. the result should be successful', () => co(function *() {
      const newJoinCode = 'my-join-code';
      const changedJoinedCodeChannel = yield rocketChatClient.channels.setJoinCode(addedRoomId, newJoinCode);
      changedJoinedCodeChannel.success.should.equal(true);
    }));

    it('Sets the description for the channel. the result should be successful', () => {
      const newPurpose = 'Testing out everything';
      return co(function *() {
        const updatedChannel = yield rocketChatClient.channels.setPurpose(addedRoomId, newPurpose);
        updatedChannel.success.should.equal(true);
        updatedChannel.purpose.should.equal(newPurpose);
      });
    });

    it('Sets whether the channel is read only or not. the channel ro should be true', () => co(function *() {
      const readonlyChannel = yield rocketChatClient.channels.setReadOnly(addedRoomId, true);
      readonlyChannel.success.should.equal(true);
      readonlyChannel.channel.ro.should.equal(true);
    }));
  });
});
