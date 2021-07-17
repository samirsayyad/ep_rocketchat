exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){
    console.log("clientGeneralRoomInit",payLoad)
    var chatHtml= `<div class="ep_rocketchat_container">
    <div class='ep_rocketchat_header'>
        <div id='header_chat_room' class='header_chat_room'>
            <span class='parent_header_chat_room' id='parent_header_chat_room'></span>
            <span class='master_header_chat_room' id='master_header_chat_room'>${$("#generalItem").attr("title")}</span>
        </div>
    </div>
    <iframe id="ep_rocketchat_iframe" class="ep_rocketchat_iframe" src="${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.padId}-general-channel?layout=embedded"  frameborder="۰" title="myframe"></iframe></div>`
    $('body').append(chatHtml);
}