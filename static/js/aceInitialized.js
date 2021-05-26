var padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

exports.aceInitialized = function aceInitialized(){
        $('#chaticon').hide();
        $('#options-stickychat').prop('checked', false);
        padcookie.setPref("chatAlwaysVisible", false);
        $('#options-stickychat').parent().hide();
        $('#options-chatandusers').parent().hide();

        window.parent.postMessage({
                event: 'login-with-token',
                loginToken: 'ziRLpepKoLsaxzxE0CMQIvpAgWPKBUE3EOMcdaEvI5m'
              }, 'https://chat.docs.plus/');
        var chatHtml= '<div><iframe id="ep_rocketchat_iframe" style="width:100%" src="https://chat.docs.plus/channel/general?layout=embedded" title="myframe"></iframe></div>'
        $('body').append(chatHtml);
        console.log("ssssssssssss");
      
        return []
}
