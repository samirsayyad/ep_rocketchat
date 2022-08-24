function Authentication(client) {
  this.client = client;
}

Authentication.prototype.logout = function (callback) {
  const restClient = this.client;
  restClient.request('GET', 'logout', null, (err, body) => {
    if (err == null) {
      restClient.removeHeader('X-Auth-Token');
      restClient.removeHeader('X-User-Id');
    }
    return callback(err, body);
  });
};

Authentication.prototype.me = function (callback) {
  this.client.request('GET', 'me', null, callback);
};

module.exports = Authentication;
