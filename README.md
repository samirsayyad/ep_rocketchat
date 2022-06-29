# ep_rocketchat
## API has used by https://github.com/qeesung/rocketchat-node 

Integrate RocketChat API instead of Etherpad internal chat.


add configuration to `settings.json` to :

```
  "ep_rocketchat": {
    "baseUrl": "https://etherpad_instance",
    "protocol": "https",
    "host": "etherpad_instance",
    "port": 443,
    "userId": "userId",
    "token": "PersonalToken",
    "rocketChatDbKey" : "anything"
  },
```

Channel will create on Rocketchat after the first initialize of pad on Etherpad.
This plugin is using Rocketchat embedded layout that should active by administration/general of Rocketchat.
That need to setup iframe_auth_url like below there :

`https://yourEtherpadInstance.com/static/pluginfw/ep_rocketchat/rocket_chat_iframe`
`https://yourEtherpadInstance.com/static/pluginfw/ep_rocketchat/rocket_chat_auth_get`

In order to config a rocketchat instance you can use below document:
https://drive.google.com/file/d/1uaOj85wocAQHvjmD_pQIUEnDzednXedg/view?usp=sharing

Still under development
