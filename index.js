const eejs = require('ep_etherpad-lite/node/eejs/');


exports.eejsBlock_scripts = (hook_name, args, cb) => {
  args.content += eejs.require('ep_rocketchat/templates/mentionNotification.html', {}, module);
  args.content += eejs.require('ep_rocketchat/templates/unreadNotification.html', {}, module);
  return [];
};