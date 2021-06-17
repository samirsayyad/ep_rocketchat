exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    $("#ep_rocketchat_iframe").css({"background-color":"blue"})
    $("#ep_rocketchat_iframe").attr({"src": `https://chat.docs.plus/channel/${payLoad.data.room}?layout=embedded`})
}
