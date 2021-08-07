const rocketChatClientInstance = require("../rocketChat/clients/rocketChatClientInstance").rocketChatClientInstance;
const settings = require('ep_etherpad-lite/node/utils/Settings');
const securityManager = require('ep_etherpad-lite/node/db/SecurityManager');
const AuthorManager = require('ep_etherpad-lite/node/db/AuthorManager');
const db = require('ep_etherpad-lite/node/db/DB');

const config = {
    protocol: settings.ep_rocketchat.protocol,
    host :  settings.ep_rocketchat.host,
    port : settings.ep_rocketchat.port,
    userId :  settings.ep_rocketchat.userId,
    token : settings.ep_rocketchat.token
};
const rocketchatAuthenticator = require("./helpers/rocketchatAuthenticator");


exports.expressCreateServer = (hookName, context) => {
    context.app.get('/static/pluginfw/ep_rocketchat/rocket_chat_auth_get', async(req, res) => {
        res.set('Access-Control-Allow-Origin', `https://${config.host}` )
        res.set('Access-Control-Allow-Credentials', 'true');
        const {session : {user} = {}} = req;
        const accessObj = await securityManager.checkAccess(
            "NOT_MATTER_PADID", req.cookies.sessionID, req.cookies.token, user);
            console.log("rocket_chat_auth_get accessObj",accessObj)

        if (accessObj.accessStatus == "grant"){
            if (req.session.user && req.session.rocketchatAuthToken) {
                res.status(200).json({ loginToken: req.session.rocketchatAuthToken })
                return;
            } else {

                const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(accessObj.authorID);
                console.log("rocket_chat_auth_get",rocketchatUserAuth)
                res.status(200).json({ loginToken: rocketchatUserAuth.authToken })
                return;
                 
            }
        }else{
            res.status(200).json({ loginToken: accessObj.accessStatus})
            return;
        }

      })
    context.app.get('/static/pluginfw/ep_rocketchat/rocket_chat_iframe', (req, res) => {
        res.set('Access-Control-Allow-Origin', `https://${config.host}` )
        res.set('Access-Control-Allow-Credentials', 'true');

        if (req.session.user && req.session.user.rocketchatAuthToken) {
            // We are sending a script tag to the front-end with the RocketChat Auth Token that will be used to authenticate the user
            return res.send(`<script>
                window.parent.postMessage({
                event: 'login-with-token',
                loginToken: ${req.session.user.rocketchatAuthToken}
                }, '${ config.host }');
            </script>
            `)
        } else {
            return res.send(`<script>
            window.parent.postMessage({
            event: 'login-with-token',
            loginToken: ${config.token}
            }, '${ config.host }');
        </script>
        `)        }
    })
    context.app.post('/static/:padId/pluginfw/ep_rocketchat/login/:username/:userId', async (req, res, next) => {
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
                    res.status(201).json(newUser)

                }catch(e){
                    res.status(201).json(e.message)

                }
                
            }
            
        
       
    })
}