# ep_rocketchat
## API has used by https://github.com/qeesung/rocketchat-node 

Integrate RocketChat API instead of Etherpad internal chat.


add configuration to `settings.json` to :

```
 "ep_rocketchat": {
    "protocol": "https", 
    "host" :  "localhost",
    "port" :443,
    "userId" : "" , // admin user id 
    "token" : ""   // personal token for managing other users 
  }
```

Channel will create on Rocketchat after the first initialize of pad on Etherpad.
This plugin is using Rocketchat embedded layout that should active by administration/general of Rocketchat.
That need to setup iframe_auth_url like below there :

`https://yourEtherpadInstance.com/static/pluginfw/ep_rocketchat/rocket_chat_auth_get`


Still under development
