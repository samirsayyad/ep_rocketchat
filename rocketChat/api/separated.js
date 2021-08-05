const axios = require('axios');

module.exports = {

    login : async (protocol , host , port, username , password)=>{
        try {
            const response = await axios.post(`${protocol}://${host}:${port}/api/v1/login`,{username,password})
            return response.data
          } catch (error) {
            return error.response.body
          }
    }
}