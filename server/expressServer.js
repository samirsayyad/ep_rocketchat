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
exports.expressCreateServer = (hookName, context) => {
    console.log("context",context)
    context.app.get('/static/pluginfw/ep_rocketchat/rocket_chat_auth_get', async(req, res) => {
        res.set('Access-Control-Allow-Origin', `https://${config.host}` )
        res.set('Access-Control-Allow-Credentials', 'true');
        const {session : {user} = {}} = req;
        const accessObj = await securityManager.checkAccess(
            "NOT_MATTER_PADID", req.cookies.sessionID, req.cookies.token, user);
        if (accessObj.accessStatus == "grant"){
            if (req.session.user && req.session.rocketchatAuthToken) {
                res.send({ loginToken: req.session.rocketchatAuthToken })
                return;
            } else {
                var rocketChatClient = new rocketChatClientInstance("https",config.host,config.port,config.userId,config.token,()=>{});
                const author = await AuthorManager.getAuthor(accessObj.authorID)
                console.log(rocketChatClient,"rocketChatClient")

                const rocketChatUser = await db.get(`ep_rocketchat:${accessObj.authorID}`) || false;
                console.log(rocketChatUser,"rocketChatUser")
                if(rocketChatUser){
                    var login =await rocketChatClient.users.login({user : rocketChatUser.username, password: rocketChatUser.password})
                    res.send({ loginToken: login.data.authToken })
                }else{
                    const globalProfileInfo = await db.get(`ep_profile_modal:${accessObj.authorID}`) || {};
                    let userToAdd = {
                        "name": author.name, 
                        "email": globalProfileInfo.email ? globalProfileInfo.email : `${author.name}-${accessObj.authorID}@docs.plus`, 
                        "password": `${author.name}@docs.plus${config.userId}`, 
                        "username": `${author.name}-${accessObj.authorID}`, 
                        "sendWelcomeEmail": false, 
                        "joinDefaultChannels": false,
                        "verified":true,
                        "requirePasswordChange":false,
                        "roles":["user"]
                    };
                    console.log(userToAdd,"userToAdd")
                    try {
                        var newUser = rocketChatClient.users.create(userToAdd,(err, result)=>{
                            console.log(err.message, result)
                        })
                        db.set(`ep_rocketchat:${accessObj.authorID}`,userToAdd);
                        var login =await rocketChatClient.users.login({user : `${author.name}-${accessObj.authorID}`, password: `${author.name}@docs.plus${config.userId}`})
                        console.log(newUser)
                        res.send({ loginToken: login.data.authToken })
                    }catch(e){
                        res.send({ loginToken: e.message })

                    }
                    
                    
                }
                return;
                 
            }
        }else{
            res.send({ loginToken: accessObj.accessStatus})
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