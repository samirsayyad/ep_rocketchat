'use strict';


function Realtime(client) {
  this.client = client;
}

Realtime.prototype.joinChannel = function (roomId, callback) {
  this.client.request('method', 'joinRoom', [roomId], callback);
};

Realtime.prototype.leaveChannel = function (roomId, callback) {
  this.client.request('method', 'leaveRoom', [roomId], callback);
};

module.exports = Realtime;
