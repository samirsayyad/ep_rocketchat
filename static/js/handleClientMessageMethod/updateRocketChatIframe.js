exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    $("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
    $(`#${payLoad.data.room}_notification`).empty()
    localStorage.setItem(`${payLoad.data.room}_unreadCount`,0);

}
