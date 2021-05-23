exports.aceInitialized = (() => {
    const aceInitialized = (hook, context) => {
        var chatHtml= '<iframe src="https://chat.docs.plus/channel/general?layout=embedded" title="myframe"></iframe>'
        $('body').append(chatHtml);

    };
    return aceInitialized;
})();
