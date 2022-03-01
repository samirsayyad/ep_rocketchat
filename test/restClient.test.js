'use strict';

const RestClient = require('../rocketChat/clients/restClient');
const should = require('should');

const config = {
  protocol: {
    rest: process.env.protocol,
    ws: 'ws',
  },
  host: process.env.host,
  port: process.env.port,
  userId: process.env.userId,
  token: process.env.token,
};

describe('WsClient', () => {
  const loginData = {
    user: {username: config.user},
    password: config.password,
  };

  const wsClient = new RestClient.WsClient(config.protocol.ws, config.host, config.port, '/websocket');

  describe('Integration', () => {
    it('should be able to connect and call a method', (done) => {
      wsClient.request('method', 'login', [loginData], (err, data) => {
        should(err).be.null;
        should(data).not.be.null;
        done();
      });
    });
  });
});

describe('RestClient', () => {
  const restClient = new RestClient.RestClient(config.protocol.rest, config.host, config.port, '/api/v1/');
  describe('Unit', () => {
    describe('Headers', () => {
      const headerKey = 'test';
      const headerValue = 'header';

      it('should be able to add headers', (done) => {
        restClient.setHeader(headerKey, headerValue);
        restClient.getHeader(headerKey).should.be.equal(headerValue);
        done();
      });

      it('should be able to remove headers', (done) => {
        restClient.setHeader(headerKey, headerValue);
        restClient.removeHeader(headerKey);
        (restClient.getHeader(headerKey) === undefined).should.be.true();
        done();
      });
    });
  });

  describe('Integration', () => {
    it('should be able to connect and call a method', (done) => {
      restClient.request('GET', 'info', null, (err, body) => {
        (err == null).should.be.true();
        body.success.should.be.true;
        done();
      });
    });
  });
});
