const axios = require('axios');

module.exports = {

    login : async (protocol , host , port, username , password)=>{
        try {
            const response = await axios.post(`${protocol}://${host}:${port}/api/v1/login`,{username,password})
            console.log(response);
            console.log(response.data);
            return response.data
          } catch (error) {
            console.log(error.response.body);
            return error.response.body
          }
    }
}