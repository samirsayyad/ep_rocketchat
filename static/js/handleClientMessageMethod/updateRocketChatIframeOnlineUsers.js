exports.updateRocketChatIframeOnlineUsers = function updateRocketChatIframeOnlineUsers(payLoad){

	$('#ep_rocketchat_onlineUsersList').empty();
	if(payLoad.data.onlineUsers){
		var elements='';
		payLoad.data.onlineUsers.online.forEach(element => {
			console.log('element',element);
			elements += ` 
            <div data-userId="${element.username}" class="avatar">
                <div class="ep_rocketchat_onlineUsersList_avatarImg" style="background: url(/static/getUserProfileImage/${element.username}/${clientVars.padId}?t=${clientVars.serverTimestamp}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;" ></div>
            </div>`;
		});
        
		if(elements){
			$('#ep_rocketchat_onlineUsersList').append(elements);
            
		}
	}

        
};
