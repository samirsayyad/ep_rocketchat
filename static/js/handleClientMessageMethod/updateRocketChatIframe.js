exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
    try{
        //$("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})
        document.getElementById("ep_rocketchat_iframe").contentWindow.postMessage(
            {  externalCommand: 'go',  path:  `/channel/${payLoad.data.room}?layout=embedded` }, '*')
        let room =payLoad.data.room;
        let padId =payLoad.padId;
        room = (room == `${padId}-general-channel` ) ? "general" : room;
        localStorage.setItem(`${room}_unreadCount`,0);
        $(`#${room}_notification`).empty()

    }catch(e){
        console.log(e)
    }
    

}
