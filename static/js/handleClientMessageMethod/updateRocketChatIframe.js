exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    $("#ep_rocketchat_iframe").css({"background-color":"blue"})
    $("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
}
