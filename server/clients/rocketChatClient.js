var restClient = require("./restClient");

function RocketChatClient (protocol, host, port, userId, token, onConnected) {
    let basepath = "";
        
    if (arguments.length === 1) {
        host = arguments[0].host || "localhost";
        port = arguments[0].port || 3000;
        username = arguments[0].userId || "";
        password = arguments[0].token || "";
        onConnected = arguments[0].onConnected;
        basepath = (arguments[0].basepath || "").replace(/^\/+|\/+$/g, "");
        protocol = arguments[0].protocol || "http";
    }
    
    onConnected = onConnected || function() {};
    var restClientObj = new restClient.RestClient(protocol, host, port, basepath + "/api/v1/");
    var wsClient = new restClient.WsClient("ws", host, port, basepath + "/websocket");

    this.authentication = new (require("../api/authentication"))(restClientObj);

    // this.miscellaneous = new (require("./api/miscellaneous"))(restClient);
    // this.chat = new (require("./api/chat"))(restClient);
    // this.channels = new (require("./api/channels"))(restClient);
    // this.groups = new (require("./api/groups"))(restClient);
    // this.settings = new (require("./api/setting"))(restClient);
    // this.users = new (require("./api/users"))(restClient);
    // this.integration = new (require("./api/integration"))(restClient);
    // this.realtime = new (require("./api/realtime"))(wsClient);
    // this.notify = new (require("./api/notify"))(wsClient);
    // this.im = new (require("./api/im"))(restClient);

    this.restClient = restClientObj;
    this.wsClient = wsClient;
    if (userId && token) {
        restClientObj.setHeader("X-Auth-Token", token);
        restClientObj.setHeader("X-User-Id", userId);

        this.authentication.me(function (err, body) {
            if (err) {
                return onConnected(err, null);
            }
            onConnected(null, { userId });
        });
    } else {
        onConnected(null, null);
    }
}
exports.RocketChatClient = RocketChatClient;
