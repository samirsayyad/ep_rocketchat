exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    try{
        $("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
        $(`#${payLoad.data.room}_notification`).empty()
        let room =payLoad.data.room;
        room = (room == "GENERAL") ? "general" : room;
        localStorage.setItem(`${room}_unreadCount`,0);
    }catch(e){
        console.log(e)
    }
    

}
