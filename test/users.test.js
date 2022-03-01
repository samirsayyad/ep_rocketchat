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

describe('users', () => {
  let rocketChatClient = null;
  before((done) => {
    rocketChatClient = new RocketChatClient('https', config.host, config.port, config.userId, config.token, done);
  });
  const userToAdd = {
    name: 'name',
    email: 'email@example.com',
    password: 'anypassyouwant',
    username: 'uniqueusername',
    sendWelcomeEmail: false,
    joinDefaultChannels: false,
    verified: false,
    requirePasswordChange: false,
    roles: ['user'],
  };

  let userId = null;
  before(() => {
    userToAdd.name += Date.now();
    userToAdd.username += Date.now();
    userToAdd.email = `email${Date.now()}@example.com`;
  });

  describe('adding user', () => {
    it('should add the new user successfully', function (done) {
      this.timeout(5000);
      rocketChatClient.users.create(userToAdd, (err, result) => {
        should(err).be.null();
        should(result).not.be.null();
        should(result.success).be.true();
        should(result.user._id).not.be.null();
        userId = result.user._id;
        done();
      });
    });
  });


  describe('get user information', () => {
    it('should retrieve user information for a userId', (done) => {
      rocketChatClient.users.info({userId}, (err, result) => {
        should(err).be.null();
        should(result).not.be.null();
        should(result.success).be.true();
        should(result.user.username).be.equal(userToAdd.username);
        should(result.user.name).be.equal(userToAdd.name);
        should(result.user.active).be.true();
        done();
      });
    });

    it('should retrieve user information by username', (done) => {
      rocketChatClient.users.info({username: userToAdd.username}, (err, result) => {
        should(err).be.null();
        should(result).not.be.null();
        should(result.success).be.true();
        should(result.user.username).be.equal(userToAdd.username);
        should(result.user.name).be.equal(userToAdd.name);
        should(result.user.active).be.true();
        done();
      });
    });

    it('should return an error when the user does not exist using callback', (done) => {
      rocketChatClient.users.info({username: 'this user does not exist'}, (err) => {
        should(err).not.be.null();
        done();
      });
    });

    it('should return an error when the user does not exist using rejection', (done) => {
      rocketChatClient.users.info({username: 'this user does not exist'})
          .catch((err) => {
            should(err).not.be.null();
            done();
          });
    });
  });

  describe('update user', () => {
    const newUsername = 'new name';
    it(`updated username should equal to ${newUsername}`, (done) => {
      rocketChatClient.users.update(userId, {
        name: newUsername,
      }, (err, updatedUser) => {
        should(err).be.null();
        should(updatedUser.success).be.true();
        should.equal(updatedUser.user.name, newUsername);
        done();
      });
    });
  });

  describe('get user presence', () => {
    it('should get the user presence successfully', (done) => {
      rocketChatClient.users.getPresence(userId, (err, result) => {
        should(err).be.null();
        should(result.success).be.true();
        done();
      });
    });
  });

  describe('set user avatar', () => {
    const avatarUrl = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y';
    it('should set the user avatar successfully', (done) => {
      rocketChatClient.users.setAvatar(avatarUrl, (err, result) => {
        should(err).be.null();
        should(result.success).be.true();
        done();
      });
    });
  });

  describe('deleting user', () => {
    it('should delete the user successfully', (done) => {
      rocketChatClient.users.delete(userId, (err, result) => {
        should(err).be.null();
        should(result).not.be.null();
        should(result.success).be.true();
        done();
      });
    });
  });
});
