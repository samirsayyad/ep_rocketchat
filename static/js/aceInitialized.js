var padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

exports.aceInitialized = function aceInitialized(){
        $('#chaticon').hide();
        $('#options-stickychat').prop('checked', false);
        padcookie.setPref("chatAlwaysVisible", false);
        $('#options-stickychat').parent().hide();
        $('#options-chatandusers').parent().hide();
        var chatHtml= '<div><iframe id="ep_rocketchat_iframe" style="width:100%" src="https://chat.docs.plus/channel/general?layout=embedded"  frameborder="1" title="myframe"></iframe></div>'
        $('body').append(chatHtml);
        return []
}
