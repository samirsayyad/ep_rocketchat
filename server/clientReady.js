const db = require('ep_etherpad-lite/node/db/DB');

exports.clientReady =function(hook, message) {
    var padData =  db.get(`pad:${message.padId}`);
    console.log("clientReady")
};