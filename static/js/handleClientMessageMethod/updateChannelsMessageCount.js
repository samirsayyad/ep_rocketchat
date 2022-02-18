const removeNewMentionHelper= require('../handleRocketChatNotifications/methods/helper/newMentionHelper').removeNewMentionHelper;
const notificationHelper =  require('../handleRocketChatNotifications/methods/helper/notificationHelper');

exports.updateChannelsMessageCount = function updateChannelsMessageCount(payLoad){
	try{
		const channelsMessageCounts = payLoad.data.channelsMessageCount;
		const padId =payLoad.padId;

		var lastActiveHeader = localStorage.getItem('lastActiveHeader');
		lastActiveHeader = (lastActiveHeader) ? lastActiveHeader.toLowerCase() : lastActiveHeader;

		channelsMessageCounts.filter(v => v.name !== lastActiveHeader && v.count > 0 ).forEach(element => {
			const headerId = (element.name == `${padId}-general-channel`) ? 'general' : element.name  ; 

			var notificationElement = $(`#${headerId}_notification`);
			if (!notificationElement.length)
				notificationElement = $(`#${headerId.toLowerCase()}_notification`);
			if (!notificationElement.length)
				notificationElement = $(`#${element.fname.toLowerCase()}_notification`);
			if (!notificationElement.length) return;

			var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : element.count });
			notificationElement.html(unreadNotificationTemplate);
			removeNewMentionHelper(notificationElement.attr('data-headerid'));
			notificationHelper.setHistoryCount(headerId, element.count );


		});
	}catch(error){
		console.log(error);
	}
    

};
