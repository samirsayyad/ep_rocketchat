const eejs = require('ep_etherpad-lite/node/eejs/');


exports.eejsBlock_scripts = (hook_name, args) => {
	args.content += eejs.require('ep_rocketchat/templates/mentionNotification.html', {}, module);
	args.content += eejs.require('ep_rocketchat/templates/unreadNotification.html', {}, module);
	args.content += eejs.require('ep_rocketchat/templates/anonymousInterface.html', {}, module);

	return [];
};

exports.eejsBlock_styles = (hookName, args, cb) => {
	args.content +=
  '<link href=\'../static/plugins/ep_rocketchat/static/css/rocketchat.css\'  type=\'text/css\' rel=\'stylesheet\'>';

	return cb();
};
