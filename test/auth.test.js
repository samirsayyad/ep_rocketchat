const RocketChatClient = require("../rocketChat/clients/rocketChatClient").RocketChatClient;
const should = require("should");

const config = {
    protocol: process.env.protocol,
    host :  process.env.host,
    port : process.env.port,
    userId :  process.env.userId,
    token : process.env.token
};

describe("test 'me' interface to get user detail information", function () {
    console.log(config)
    var rocketChatClientObj = null;
    beforeEach(function (done) {
        rocketChatClientObj = new RocketChatClient("https",config.host,config.port,config.userId,config.token, done);
    });
    it("_id should equal to " + config.userId, function (done) {
        rocketChatClientObj.authentication.me(function (err, body) {
            should(err).be.null();
            should.equal(body._id, config.userId);
            done();
        });
    });
});