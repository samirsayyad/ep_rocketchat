exports.updateRocketChatIframeOnlineUsers = function updateRocketChatIframeOnlineUsers(payLoad){

    $("#ep_rocketchat_onlineUsersList").empty()
    var elements="";
    payLoad.data.onlineUsers.online.forEach(element => {
        elements += ` 
        <div data-userId="${element.username}" class="avatar">
            <div class="ep_rocketchat_onlineUsersList_avatarImg" style="background: url(${payLoad.data.rocketChatBaseUrl}/avatar/${element.username}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;" ></div>
        </div>`
    });
    
    if(elements){
        $("#ep_rocketchat_onlineUsersList").append(elements)
        
    }
        
}
