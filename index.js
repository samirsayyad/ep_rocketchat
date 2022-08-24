const eejs = require('ep_etherpad-lite/node/eejs/');


exports.eejsBlock_scripts = (hookName, args) => {
  args.content += eejs.require('ep_rocketchat/templates/mentionNotification.html', {}, module);
  args.content += eejs.require('ep_rocketchat/templates/unreadNotification.html', {}, module);
  args.content += eejs.require('ep_rocketchat/templates/anonymousInterface.html', {}, module);

  return [];
};

exports.eejsBlock_styles = (hookName, args, cb) => {
  const clsAddress = '../static/plugins/ep_rocketchat/static/css/rocketchat.css';

  args.content +=
  `<link href='${clsAddress}'  type='text/css' rel='stylesheet'>`;

  return cb();
};
