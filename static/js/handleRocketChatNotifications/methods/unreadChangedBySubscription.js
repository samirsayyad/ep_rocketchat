const newMention = require('./helper/newMentionHelper').newMentionHelper;
const removeNewMentionHelper= require('./helper/newMentionHelper').removeNewMentionHelper;
const notificationHelper =  require('./helper/notificationHelper');

exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){

	// if there is unseen history count must click on that header first
	const padId = clientVars.padId;
	const headerId = (data.name == `${padId}-general-channel`) ? 'general' : data.name  ; 
	var historyCount = parseInt( notificationHelper.getHistoryCount(headerId) ) || 0;

	if (historyCount == 0 && data.alert == false && data.unread ==0 ) return;

	const userId = pad.getUserId();
	const lastActiveHeader = notificationHelper.getLastActiveHeader() || '';

	if (lastActiveHeader.toLowerCase() == headerId ) return;

	var notificationElement = $(`#${headerId}_notification`);
	if (!notificationElement.length)
		notificationElement = $(`#${data.fname}_notification`);
	if (!notificationElement.length)
		notificationElement = $(`#${data.fname.toLowerCase()}_notification`);
	if (!notificationElement.length) return;

	var lastUnreadCount = parseInt( notificationHelper.getUnreadCount(headerId) ) || 
                            parseInt( notificationHelper.getNewMessageCount(headerId) ) || false;
	var unreadMentionedCount = parseInt(notificationHelper.getUserUnreadMentionedCount(headerId,userId)) || 0;


	if(unreadMentionedCount == 0){
		var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : historyCount || lastUnreadCount || data.unread});
		removeNewMentionHelper(notificationElement.attr('data-headerid'));
    
	}else{
		var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount});
		newMention(notificationElement.attr('data-headerid')); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
	}
	notificationElement.html(unreadNotificationTemplate);
    
};