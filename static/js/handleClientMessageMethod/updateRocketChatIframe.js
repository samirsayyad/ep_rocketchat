exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    try{
        $("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
        let room =payLoad.data.room;
        let padId =payLoad.data.room;

        room = (room == `${padId}-general-channel` ) ? "general" : room;
        console.log(room,"ropo")
        localStorage.setItem(`${room}_unreadCount`,0);
        $(`#${room}_notification`).empty()

    }catch(e){
        console.log(e)
    }
    

}
