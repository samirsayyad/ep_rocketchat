const separated = require("../rocketChat/api/separated")
const should = require("should");

const config = {
    protocol: process.env.protocol,
    host :  process.env.host,
    port : process.env.port,
    username :  process.env.username,
    password : process.env.password
};

describe("Test the login rest api and rocketchat", function () {
    it("rest api version should not be below 0.1 and rocketchat should not be beblow 0.5", function (done) {
        var rocketChatApi = await separated.login("https",config.host,config.port,config.username,config.password, function (err) {
            if (err) throw err;
            rocketChatApi.version(function (err, body) {
                should(err).be.null();
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.user._id).not.be.null();
                done();
            });
        });
    });
});