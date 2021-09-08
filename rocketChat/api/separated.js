const axios = require('axios');

module.exports = {

    login : async (protocol , host , port, username , password)=>{
        try {
            const response = await axios.post(`${protocol}://${host}:${port}/api/v1/login`,{username,password})
            return response.data
          } catch (error) {
            return error.response.body
          }
    },

    getChannelOnlineUsers : async (config, roomId)=>{
      try {
        const response = await axios.get(`${config.protocol}://${config.host}:${config.port}/api/v1/channels.online?query=${JSON.stringify({
          "_id": roomId
        })}`,
        {
          headers: {
            'X-Auth-Token': config.token ,
            'X-User-Id': config.userId 
          }
         }
        )
        return response.data
      } catch (error) {
        return error.response.body
      }
    }
}