exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){
    console.log("clientGeneralRoomInit",payLoad)
    var chatHtml= `<div class="ep_rocketchat_container"><iframe id="ep_rocketchat_iframe" style="width:100%;height:242px;border-top:1px solid #A8ABAE" src="${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.padId}-general-room?layout=embedded"  frameborder="۰" title="myframe"></iframe></div>`
    $('body').append(chatHtml);
}