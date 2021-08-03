const axios = require('axios');

module.exports = {

    login : async (protocol , host , port, username , password)=>{
        try {
            const response = await axios.post(`${protocol}://${host}:${port}/api/v1/login`,{username,password})
            console.log(response.data);
            console.log(response);
            return response
          } catch (error) {
            console.log(error.response.body);
            return error.response.body
          }
    }
}