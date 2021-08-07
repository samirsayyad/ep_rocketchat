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
        if (accessObj.accessStatus == "grant"){
            if (req.session.user && req.session.rocketchatAuthToken) {
                res.send({ loginToken: req.session.rocketchatAuthToken })
                return;
            } else {

                const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(accessObj.authorID);
                res.send({ loginToken: rocketchatUserAuth.authToken })
                return;

                // var rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,()=>{});
                // const author = await AuthorManager.getAuthor(accessObj.authorID);
                // const rocketChatUser = await db.get(`ep_rocketchat:${accessObj.authorID}`) || [];
                // if(rocketChatUser.username){
                //     try{
                //         //var login =await rocketChatClient.users.login({user : rocketChatUser.username, password: rocketChatUser.password})
                //         var login =await loginApi('https', config.host, config.port, rocketChatUser.username,rocketChatUser.password);

                //         res.send({ loginToken: login.data.authToken })
                //     }catch(e){
                //         res.send({ loginToken: e.message })

                //     }
                    
                // }else{
                //     const globalProfileInfo = await db.get(`ep_profile_modal:${accessObj.authorID}`) || {};
                //     if(author && author.name)
                //         var username = author.name.replace(/\s/g, '') || "Anonymous"
                //     else
                //         var username = "Anonymous";
                    
                //     var email = globalProfileInfo.email ? globalProfileInfo.email : `${username}-${accessObj.authorID}@docs.plus`;
                //     var password = `${username}-${accessObj.authorID}@docs.plus${config.userId}` ;
                //     var usernameUserId = `${username}_${accessObj.authorID}`; 

                //     var userToAdd = {
                //         "name": username, 
                //         "email": email, 
                //         "password": password, 
                //         "username": usernameUserId, 
                //         "sendWelcomeEmail": false, 
                //         "joinDefaultChannels": false,
                //         "verified":true,
                //         "requirePasswordChange":false,
                //         "roles":["user"],
                //     };
                //     try {
                //         var newUser = await rocketChatClient.users.create(userToAdd,async (err, result)=>{
                //             try{
                //                 var login =await loginApi('https', config.host, config.port,usernameUserId,password);
                //                 await db.set(`ep_rocketchat:${accessObj.authorID}`,{data :result || login , info:userToAdd });
                //                 res.send({ loginToken: login.data.authToken })

                //             }catch(e){
                //                 res.send({ loginToken: e.message })
        
                //             }
                //         })
                //     }catch(e){
                //         res.send({ loginToken: e.message })
                //     }
                // }
                
                
                 
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