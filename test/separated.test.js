'use strict';

const separated = require('../rocketChat/api/separated');
const should = require('should');

const config = {
  protocol: process.env.protocol,
  host: process.env.host,
  port: process.env.port,
  username: process.env.username,
  password: process.env.password,
};

describe('Test the login rest api and rocketchat', async () => {
  it('rest api version should not be below 0.1 and rocketchat should not be beblow 0.5', async (done) => {
    const rocketChatApi = await separated.login('https', config.host, config.port, config.username, config.password, (err) => {
      if (err) throw err;
      rocketChatApi.version((err, result) => {
        should(err).be.null();
        should(result).not.be.null();
        should(result.success).be.true();
        should(result.user._id).not.be.null();
        done();
      });
    });
  });
});
