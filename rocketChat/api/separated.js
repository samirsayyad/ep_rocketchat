'use strict';

const axios = require('axios');

module.exports = {

  login: async (protocol, host, port, username, password) => {
    try {
      const response = await axios.post(`${protocol}://${host}:${port}/api/v1/login`, {username, password});
      return response.data;
    } catch (error) {
      return error.response.body;
    }
  },

  getChannelOnlineUsers: async (config, roomId) => {
    try {
      const response = await axios.get(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.online?query=${JSON.stringify({
        _id: roomId,
      })}`,
      {
        headers: {
          'X-Auth-Token': config.token,
          'X-User-Id': config.userId,
        },
      },
      );
      return response.data;
    } catch (error) {
      return error.response.body;
    }
  },

  joinChannel: async (config, roomId, token, userId) => {
    try {
      const response = await axios.post(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.join`,
          {
            roomId,
          },
          {
            headers: {
              'X-Auth-Token': token,
              'X-User-Id': userId,
            },
          },
      );
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  joinChannels: async (config, roomIds, token, userId) => {
    try {
      const response = await axios.post(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.joinToAll`,
          {
            rooms: roomIds,
          },
          {
            headers: {
              'X-Auth-Token': token,
              'X-User-Id': userId,
            },
          },
      );
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  getChannelsMessageCount: async (config, roomIds) => {
    try {
      const response = await axios.post(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.getChannelsMessageCount`,
          {
            rooms: roomIds,
          },
          {
            headers: {
              'X-Auth-Token': config.token,
              'X-User-Id': config.userId,
            },
          },
      );
      return response.data;
    } catch (error) {
      return error.response.body;
    }
  },
  getChannelMessages: async (config, roomName) => {
    try {
      const response = await axios.get(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.messages?roomName=${roomName}`,
          {
            headers: {
              'X-Auth-Token': config.token,
              'X-User-Id': config.userId,
            },
          },
      );
      return response.data;
    } catch (error) {
      return error.response.body;
    }
  },

};
