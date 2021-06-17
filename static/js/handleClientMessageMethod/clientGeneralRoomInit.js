exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){
    var chatHtml= `<div><iframe id="ep_rocketchat_iframe" style="width:100%" src="https://chat.docs.plus/channel/${payLoad.padId}-general-room?layout=embedded"  frameborder="1" title="myframe"></iframe></div>`
    $('body').append(chatHtml);
}