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

const userToAdd = {
  name: 'test-group-user',
  email: 'email@example.com',
  password: 'anypassyouwant',
  username: 'uniqueusername-group',
  sendWelcomeEmail: false,
  joinDefaultChannels: false,
  verified: false,
  requirePasswordChange: false,
  roles: ['user'],
};

describe('groups', () => {
  let rocketChatClient = null;
  before((done) => {
    rocketChatClient = new RocketChatClient('https', config.host, config.port, config.userId, config.token, done);
  });

  describe('create group and remove group', () => {
    it('create result should be success and should have group id property', () => co(function *() {
      const createdGroup = yield rocketChatClient.groups.create(`test-group-${Date.now()}`);
      createdGroup.success.should.equal(true);
      createdGroup.group._id.should.be.ok();
    }));

    it('close result success result should be success', () => co(function *() {
      const createdGroup = yield rocketChatClient.groups.create(`test-group-${Date.now()}`);
      createdGroup.success.should.equal(true);
      createdGroup.group._id.should.be.ok();

      const createdGroupId = createdGroup.group._id;

      const closeResult = yield rocketChatClient.groups.close(createdGroupId);
      closeResult.success.should.equal(true);
    }));
  });

  describe('add user to the group', () => {
    let createdUserId = null;
    let createGroupId = null;

    beforeEach(() => {
      userToAdd.name += Date.now();
      userToAdd.username += Date.now();
      userToAdd.email = `email${Date.now()}@example.com`;
      return co(function *() {
        const createdUser = yield rocketChatClient.users.create(userToAdd);
        createdUserId = createdUser.user._id;

        const createdGroup = yield rocketChatClient.groups.create(`test-group-${Date.now()}`);
        createGroupId = createdGroup.group._id;
      });
    });

    afterEach(() => co(function *() {
      if (createdUserId != null) yield rocketChatClient.users.delete(createdUserId);
      if (createGroupId != null) yield rocketChatClient.groups.archive(createGroupId);
      createGroupId = null;
      createdUserId = null;
    }));

    // addAll only provide in 0.55 version
    // but now rocket chat docker image version is 0.54
    xit('Adds all of the users of the Rocket.Chat server to the group. ' +
            'result should be success, and username list should contain the created user', () => co(function *() {
      const addAllResult = yield rocketChatClient.groups.addAll(createGroupId);
      addAllResult.success.should.equal(true);
      addAllResult.group.usernames.should.matchAny(new RegExp(`^${userToAdd.username}.*`));
    }));

    it('Gives the role of owner for a user in the current group. result should be success', () => co(function *() {
      // invite user
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      // add the user as owner
      const addOwnerResult = yield rocketChatClient.groups.addOwner(createGroupId, createdUserId);
      addOwnerResult.success.should.equal(true);
    }));

    it('Removes the role of owner from a user in the current Group. result should be success', () => co(function *() {
      // invite user
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      // add the user as owner
      const addOwnerResult = yield rocketChatClient.groups.addOwner(createGroupId, createdUserId);
      addOwnerResult.success.should.equal(true);

      // remove the owner
      const removeOwnerResult = yield rocketChatClient.groups.removeOwner(createGroupId, createdUserId);
      removeOwnerResult.success.should.equal(true);
    }));

    it('Gives the role of moderator for a user in the current group. result should be success', () => co(function *() {
      // invite user
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      // add the user as owner
      const addModeratorResult = yield rocketChatClient.groups.addModerator(createGroupId, createdUserId);
      should(addModeratorResult.success).be.ok();
    }));

    it('Removes the role of moderator from a user in the current group. result should be success', () => co(function *() {
      // invite user
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      // add the user as moderator
      const addModeratorResult = yield rocketChatClient.groups.addModerator(createGroupId, createdUserId);
      should(addModeratorResult.success).be.ok();

      // remove moderator
      const removeModeratorResult = yield rocketChatClient.groups.removeModerator(createGroupId, createdUserId);
      removeModeratorResult.success.should.equal(true);
    }));

    it('Adds a user to the private group. ' +
            'result should be success and invited user should in the username list', () => co(function *() {
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      inviteResult.group.usernames.should.matchAny(new RegExp(`^${userToAdd.username}`));
    }));

    it('Removes a user from the private group. ' +
            'result should be success and kicked user should not in username list', () => co(function *() {
      // invite user
      const inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      inviteResult.success.should.equal(true);

      // kick the user
      const kickedResult = yield rocketChatClient.groups.kick(createGroupId, createdUserId);
      kickedResult.success.should.equal(true);
      // kickedResult.group.usernames.should.not.matchAny(new RegExp(`^${userToAdd.username}`));
    }));

    it('Causes the callee to be removed from the private group, qeesung should not in the username list', () => co(function *() {
      // invite new user to the group
      const invitedResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      invitedResult.success.should.equal(true);

      // set the new user as owner
      const setOwnerResult = yield rocketChatClient.groups.addOwner(createGroupId, createdUserId);
      setOwnerResult.success.should.equal(true);

      // leave the room
      const leaveResult = yield rocketChatClient.groups.leave(createGroupId);
      leaveResult.success.should.equal(true);
      // leaveResult.group.usernames.should.not.matchAny(/^qeesung/);

      createdUserId = null;
      createGroupId = null;
    }));

    it('Lists all of the private groups the calling user has joined, ' +
            'result should be success and groups size should greater than 0', () => co(function *() {
      const groupList = yield rocketChatClient.groups.list();
      groupList.success.should.equal(true);

      (groupList.groups.length > 0).should.equal(true);
    }));

    // ignore the test case , will throw a
    // RequestError: No private group by the id of: s7A5xQR3uysq9GNG3
    xit('Adds the private group back to the user’s list of private groups. result should be success', () => co(function *() {
      // invite new user to the group
      const invitedResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
      invitedResult.success.should.equal(true);

      // set the new user as owner
      const setOwnerResult = yield rocketChatClient.groups.addOwner(createGroupId, createdUserId);
      setOwnerResult.success.should.equal(true);

      // leave the room
      const leaveResult = yield rocketChatClient.groups.leave(createGroupId);
      leaveResult.success.should.equal(true);

      // add the user into the group
      const openResult = yield rocketChatClient.groups.open(createGroupId);
      openResult.success.should.equal(true);

      createGroupId = null;
      createdUserId = null;
    }));
  });

  describe('config the get groups\' properties', () => {
    let createGroupId = null;

    beforeEach(() => co(function *() {
      const createdGroup = yield rocketChatClient.groups.create(`test-group-${Date.now()}`);
      createGroupId = createdGroup.group._id;
    }));

    afterEach(() => co(function *() {
      if (createGroupId != null) yield rocketChatClient.groups.archive(createGroupId);
      createGroupId = null;
    }));

    it('Archives a private group, only if you’re part of the group. result should be success', () => co(function *() {
      const archiveResult = yield rocketChatClient.groups.archive(createGroupId);
      archiveResult.success.should.equal(true);

      createGroupId = null;
    }));

    it('Unarchives a private group. result should be success', () => co(function *() {
      // archive first
      const archiveResult = yield rocketChatClient.groups.archive(createGroupId);
      archiveResult.success.should.equal(true);

      // unarchive
      const unarchiveResult = yield rocketChatClient.groups.unarchive(createGroupId);
      unarchiveResult.success.should.equal(true);
    }));

    it('Retrieves the integrations which the group has, ' +
            'result should be success, and should contain integrations array property', () => co(function *() {
      const integrationsResult = yield rocketChatClient.groups.getIntegrations(createGroupId);
      integrationsResult.success.should.equal(true);
      integrationsResult.integrations.should.be.Array();
    }));

    it('Retrieves the messages from a private group, the last message should be \'hello world\'', () => co(function *() {
      const textMessage = `hello world at ${Date.now()}`;
      // send message
      const postMessageResult = yield rocketChatClient.chat.postMessage({roomId: createGroupId, text: textMessage});
      postMessageResult.success.should.equal(true);

      // get the messages from channel
      const history = yield rocketChatClient.groups.history({roomId: createGroupId});
      history.messages.should.matchEach((value) => {
        value.msg.should.match(new RegExp(`^${textMessage}`));
      });
    }));

    it('Retrieves the information about the private group, ' +
            'result should be success and group property should be exist', () => co(function *() {
      const infoResult = yield rocketChatClient.groups.info(createGroupId);
      infoResult.success.should.equal(true);
      infoResult.group.should.be.ok();
    }));

    it('Changes the name of the private group. result should be success, and group name should equal to new name', () => co(function *() {
      const newGroupName = `new-group-name-${Date.now()}`;

      const renameResult = yield rocketChatClient.groups.rename(createGroupId, newGroupName);
      renameResult.success.should.equal(true);
      renameResult.group.name.should.equal(newGroupName);
    }));

    it('Sets the description for the private group.' +
            ' result should be success, and group description should equal to new description', () => {
      const newDescription = 'Hello World , Hello Group';
      return co(function *() {
        const setResult = yield rocketChatClient.groups.setDescription(createGroupId, newDescription);
        setResult.success.should.equal(true);
        setResult.description.should.equal(newDescription);
      });
    });

    it('Sets the purpose for the private group. result should be success and  purpose should equal to new purpose', () => {
      const newPurpose = 'hello world';
      return co(function *() {
        const setPurposeResult = yield rocketChatClient.groups.setPurpose(createGroupId, newPurpose);
        setPurposeResult.success.should.equal(true);
        setPurposeResult.purpose.should.equal(newPurpose);
      });
    });

    it('Sets whether the group is read only. result should be success', () => co(function *() {
      const setReadOnlyResult = yield rocketChatClient.groups.setReadOnly(createGroupId, true);
      setReadOnlyResult.success.should.equal(true);
      setReadOnlyResult.group.ro.should.equal(true);
    }));

    it('Sets the topic for the private group. result should be success, topic should equal to new topic', () => {
      const newTopic = 'hello world';
      return co(function *() {
        const setTopicResult = yield rocketChatClient.groups.setTopic(createGroupId, newTopic);
        setTopicResult.success.should.equal(true);
        setTopicResult.topic.should.equal(newTopic);
      });
    });

    it('Sets the type of room to be private. result should be success and group type should be private', () => {
      const newGroupType = 'c';
      return co(function *() {
        const setTypeResult = yield rocketChatClient.groups.setType(createGroupId, newGroupType);
        setTypeResult.success.should.equal(true);
        setTypeResult.group.t.should.equal(newGroupType);

        createGroupId = null;
      });
    });
  });
});
