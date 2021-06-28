exports.eejsBlock_styles = (hookName, args, cb) => {
    args.content +=
    "<link href='../static/plugins/ep_rocketchat/static/css/rocketchat.css' type='text/css' rel='stylesheet'>";
    return cb();
  };