const RocketChatClient = require("../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;

const co = require("co");

const config = {
    protocol: process.env.protocol,
    host :  process.env.host,
    port : process.env.port,
    userId :  process.env.userId,
    token : process.env.token
};

describe("setttings", () => {
    let rocketChatClient = null;
    const id = "Livechat_enabled";
    before(function (done) {
        rocketChatClient = new RocketChatClient("https",config.host,config.port,config.userId,config.token, done);
    });

    it(`get ${id} configurations values should be false or true`, () => {
        return co(function *() {
            let livechatEnabledValue = yield rocketChatClient.settings.get(id);
            livechatEnabledValue.value.should.be.oneOf([true, false]);
        });
    });

    it(`update ${id} the configurations to be true`, () => {
        return co(function *() {
            let updatedResult = yield rocketChatClient.settings.update(id, true);
            updatedResult.success.should.equal(true);
        });
    });
});