const RocketChatClient = require("../server/clients/rocketChatClient").RocketChatClient;
const should = require("should");

const config = {
    protocol: "https",
    host : "",
    port : 443,
    userId : "",
    token : ""
};

describe("test 'me' interface to get user detail information", function () {
    var rocketChatClientObj = null;
    beforeEach(function (done) {
        config.onConnected = done;
        rocketChatClientObj = new RocketChatClient("https",config.host,config.port,config.userId,config.token, config.onConnected);
    });
    it("_id should equal to " + config.userId, function (done) {
        rocketChatClientObj.authentication.me(function (err, body) {
            should(err).be.null();
            should.equal(body._id, config.userId);
            done();
        });
    });
});