const rocketChatClientInstance = require("../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');

const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token
};
exports.expressConfigure = (hookName, context) => {
    context.app.get('/static/:padId/pluginfw/ep_rocketchat/rocket_chat_auth_get', (req, res) => {
        if (req.session.user && req.session.user.rocketchatAuthToken) {
          res.send({ loginToken: ctx.session.user.rocketchatAuthToken })
          return;
        } else {
          res.status(401).json({ message: 'User not logged in'});
          return;
        }
      })
    context.app.get('/static/:padId/pluginfw/ep_rocketchat/rocket_chat_iframe', (req, res) => {
        if (req.session.user && req.session.user.rocketchatAuthToken) {
            // We are sending a script tag to the front-end with the RocketChat Auth Token that will be used to authenticate the user
            return res.send(`<script>
                window.parent.postMessage({
                event: 'login-with-token',
                loginToken: '${ req.session.user.rocketchatAuthToken }'
                }, '${ config.host }');
            </script>
            `)
            return;
        } else {
            return res.status(401).send('User not logged in')
        }
    })
    context.app.get('/static/:padId/pluginfw/ep_rocketchat/login/:username/:userId', async (req, res, next) => {
             const username = req.params.username;
            const etherUserId = req.params.userId;

            var done = ()=>{
    
            }
            var rocketChatClient = new rocketChatClientInstance("https",config.host,config.port,config.userId,config.token,done);
            try {
                var login =await rocketChatClient.users.login({user : username, password: `${username}@docs.plus${config.userId}`})
                res.status(201).json(login)
            }catch(e){
                try {
                    console.log(e.message,"message")
                    let userToAdd = {
                        "name": username, 
                        "email": `${username}@docs.plus`, 
                        "password": `${username}@docs.plus${config.userId}`, 
                        "username": `${username}`, 
                        "sendWelcomeEmail": false, 
                        "joinDefaultChannels": false,
                        "verified":true,
                        "requirePasswordChange":false,
                        "roles":["user"]
                    };
                    var newUser = await rocketChatClient.users.create(userToAdd)
                    console.log(newUser)
                    res.status(201).json(newUser)

                }catch(e){
                    console.log(e.message)
                    res.status(201).json(e.message)

                }
                
            }
            
        
       
    })
}