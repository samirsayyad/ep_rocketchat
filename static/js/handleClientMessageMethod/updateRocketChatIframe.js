const notificationHelper =  require('../handleRocketChatNotifications/methods/helper/notificationHelper');

exports.updateRocketChatIframe = function updateRocketChatIframe(payLoad){
	try{
 
		// $("#ep_rocketchat_iframe").animate({
		//     opacity: 0
		//   }, {
		//     duration: 500,
		//     complete: function () {

		//       $("#chat-loading").css({"opacity":1})

		//       $("#chat-loading").css({"display":"flex"})
		//     }
		// });

		document.getElementById('ep_rocketchat_iframe').contentWindow.postMessage(
			{  externalCommand: 'go',  path:  `/channel/${payLoad.data.room}?layout=embedded` }, '*');

		//$("#ep_rocketchat_iframe").attr({"src": `${payLoad.data.rocketChatBaseUrl}/channel/${payLoad.data.room}?layout=embedded`})

		setTimeout(()=>{
			$('#chat-loading').animate({
				opacity: 0
			}, {
				duration: 500,
				complete: function () {
					$('#chat-loading').css({'display':'none'});
					$('#ep_rocketchat_iframe').animate({opacity: 1}, 500);

					let room =payLoad.data.room;
					let padId =payLoad.padId;
					let userId =payLoad.userId;
					room = (room == `${padId}-general-channel` ) ? 'general' : room;
                
					notificationHelper.setUnreadCount(room,0);
					notificationHelper.setNewMessageCount(room,0);
					notificationHelper.setUserUnreadMentionedCount(room,userId,0);
					notificationHelper.setHistoryCount(room,0); 
					notificationHelper.setLastActiveHeader(room); 
					$(`#${room}_notification`).empty();

        
				}
			});
        
		},500);


	}catch(e){
		console.log(e);
	}
    

};
