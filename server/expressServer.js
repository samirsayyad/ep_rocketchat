const rocketChatClientInstance = require('../rocketChat/clients/rocketChatClientInstance').rocketChatClientInstance;
const config = require('./helpers/configs');
const rocketchatAuthenticator = require('./helpers/rocketchatAuthenticator');


exports.expressCreateServer = (hookName, context) => {
	context.app.get('/static/pluginfw/ep_rocketchat/rocket_chat_auth_get/:userId', async(req, res) => {
		res.set('Access-Control-Allow-Origin', `${config.protocol}://${config.host}` );
		res.set('Access-Control-Allow-Credentials', 'true');
		const etherUserId = req.params.userId || false;
		if(!etherUserId){
			res.send({ loginToken: false });
			return;
		}
		const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(etherUserId);
		res.send({ loginToken: rocketchatUserAuth.rocketchatAuthToken });
		return;


	});
	context.app.get('/static/pluginfw/ep_rocketchat/rocket_chat_iframe/:userId', async(req, res) => {
		res.set('Access-Control-Allow-Origin', `${config.protocol}://${config.host}` );
		res.set('Access-Control-Allow-Credentials', 'true');
		const etherUserId = req.params.userId || false;
		if(!etherUserId){
			res.send('');
			return;
		}
		if (req.session.user && req.session.user.rocketchatAuthToken) {
			// We are sending a script tag to the front-end with the RocketChat Auth Token that will be used to authenticate the user
			return res.send(`<script>
                window.parent.postMessage({
                event: 'login-with-token',
                loginToken: '${req.session.user.rocketchatAuthToken}'
                }, '${ config.host }');
            </script>
            `);
		} else {
			const rocketchatUserAuth = await rocketchatAuthenticator.runValidator(etherUserId);
			return res.send(`<script>
            window.parent.postMessage({
            event: 'login-with-token',
            loginToken: '${rocketchatUserAuth.rocketchatAuthToken}'
            }, '${ config.host }');
        </script>
        `);        }
	});
	context.app.post('/static/:padId/pluginfw/ep_rocketchat/login/:username/:userId', async (req, res) => {
		const username = req.params.username;
		var done = ()=>{
    
		};
		var rocketChatClient = new rocketChatClientInstance(config.protocol,config.host,config.port,config.userId,config.token,done);
		try {
			var login =await rocketChatClient.users.login({user : username, password: `${username}@docs.plus${config.userId}`});
			res.status(201).json(login);
		}catch(e){
			try {
				let userToAdd = {
					'name': username, 
					'email': `${username}@docs.plus`, 
					'password': `${username}@docs.plus${config.userId}`, 
					'username': `${username}`, 
					'sendWelcomeEmail': false, 
					'joinDefaultChannels': false,
					'verified':true,
					'requirePasswordChange':false,
					'roles':['user']
				};
				var newUser = await rocketChatClient.users.create(userToAdd);
				res.status(201).json(newUser);

			}catch(e){
				res.status(201).json(e.message);

			}
                
		}
            
        
       
	});
};
