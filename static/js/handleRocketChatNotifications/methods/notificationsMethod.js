const newMention = require('./helper/newMentionHelper').newMentionHelper;
const removeNewMentionHelper= require('./helper/newMentionHelper').removeNewMentionHelper;
const notificationHelper =  require('./helper/notificationHelper');

exports.notificationsMethod = function notificationsMethod (data){
	if(!data.fromOpenedRoom){ // must be false in order to notify user
		const padId = pad.getPadId();
		const userId = pad.getUserId();

		const headerId = (data.notification.payload.name == `${padId}-general-channel`) ? 'general' : data.notification.payload.name  ; 
		const lastActiveHeader = notificationHelper.getLastActiveHeader() || '' ;

		if (lastActiveHeader.toLowerCase() == headerId ) return;

		var notificationElement = $(`#${headerId}_notification`);
		if (!notificationElement.length)
			notificationElement = $(`#${data.notification.payload.fname}_notification`);
		if (!notificationElement.length)
			notificationElement = $(`#${data.notification.payload.fname.toLowerCase()}_notification`);
		if (!notificationElement.length) return;



		// check mentioned this user
		var unreadMentionedCount = parseInt(  notificationHelper.getUserUnreadMentionedCount(headerId,userId) || 0 );
		if ( [`@${userId}`,'@all'].includes(data.notification.payload.message.msg) ){ // it means mentioned by someone or generally
            
			unreadMentionedCount++; 
			notificationHelper.setUserUnreadMentionedCount(headerId,userId,unreadMentionedCount);
			var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount });
			notificationElement.html(unreadNotificationTemplate);
			newMention(notificationElement.attr('data-headerid')); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
		}else{
			var historyCount = parseInt( notificationHelper.getHistoryCount(headerId) ) || 0;
			var unReadCount = 0;

			if (historyCount > 0){
				unReadCount = historyCount;
			}else{
				var lastUnreadCount = parseInt( notificationHelper.getUnreadCount(headerId)  || 0 );
				lastUnreadCount++; 
				notificationHelper.setUnreadCount(headerId,lastUnreadCount);
				unReadCount = lastUnreadCount;

			}
    

			var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : unReadCount + unreadMentionedCount});
			notificationElement.html(unreadNotificationTemplate);    
			removeNewMentionHelper(notificationElement.attr('data-headerid'));

		}
        
	}
    
};
