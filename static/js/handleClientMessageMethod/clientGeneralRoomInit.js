exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){
    console.log("clientGeneralRoomInit",payLoad)
    var chatHtml= `<div class="ep_rocketchat_container"><iframe id="ep_rocketchat_iframe" style="width:100%" src="${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.padId}-general-room?layout=embedded"  frameborder="1" title="myframe"></iframe></div>`
    $('body').append(chatHtml);
}