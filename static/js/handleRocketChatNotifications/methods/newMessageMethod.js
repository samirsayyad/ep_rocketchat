const newMention = require("./helper/newMentionHelper").newMentionHelper;
const removeNewMentionHelper= require("./helper/newMentionHelper").removeNewMentionHelper;
const notificationHelper =  require("./helper/notificationHelper");
exports.newMessageMethod = function newMessageMethod (data){
    const padId = pad.getPadId();
    const roomId = data.name ;
    const userId = pad.getUserId();
    const headerId = (roomId == `${padId}-general-channel`) ? "general" : roomId ; 

    const lastActiveHeader = notificationHelper.getLastActiveHeader() || "";
    if (lastActiveHeader.toLowerCase() == headerId )return;
        



    // check mentioned this user
    var unreadMentionedCount = parseInt(  notificationHelper.getUserUnreadMentionedCount(headerId,userId) || 0 );
    var notificationElement = $(`#${headerId}_notification`);

    unreadMentionedCount = parseInt(unreadMentionedCount);
    if ( [`@${userId}`,"@all"].includes(data.msg) ){
        unreadMentionedCount++; 
        notificationHelper.setUserUnreadMentionedCount(headerId,userId,unreadMentionedCount)
        var unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread : unreadMentionedCount });
        notificationElement.html(unreadNotificationTemplate);
        newMention(notificationElement.attr("data-headerid")); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
    }else{
        var historyCount = parseInt( notificationHelper.getHistoryCount(headerId) ) || 0;
        var unReadCount = 0
        if (historyCount > 0) {
            unReadCount= historyCount
        }else{
            var lastNewMessageCount = parseInt( notificationHelper.getNewMessageCount(headerId) ) || 0;
            lastNewMessageCount++; 
            notificationHelper.setNewMessageCount(headerId,lastNewMessageCount);
            unReadCount= lastNewMessageCount;
        }
        var unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread : unReadCount });
        notificationElement.html(unreadNotificationTemplate);    
        removeNewMentionHelper(notificationElement.attr("data-headerid"));
          
    }
}
