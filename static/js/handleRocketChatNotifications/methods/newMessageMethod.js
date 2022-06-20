'use strict';

const newMention = require('./helper/newMentionHelper').newMentionHelper;
const removeNewMentionHelper = require('./helper/newMentionHelper').removeNewMentionHelper;
const notificationHelper = require('./helper/notificationHelper');
const pushMethod = require('./pushMethod').pushMethod;

const $bodyAceOuter = () => $(document).find('iframe[name="ace_outer"]').contents();

exports.newMessageMethod = (data) => {
  const padId = pad.getPadId();
  const roomId = data.name;
  const userId = pad.getUserId();
  const headerId = (roomId === `${padId}-general-channel`) ? 'general' : roomId;
  const isMobile = clientVars.userAgent.isMobile;

  const lastActiveHeader = notificationHelper.getLastActiveHeader() || '';
  if (lastActiveHeader.toLowerCase() === headerId) return;


  // check mentioned this user
  let unreadMentionedCount = parseInt(notificationHelper.getUserUnreadMentionedCount(headerId, userId) || 0);
  const notificationElement = $(`#${headerId}_notification`);
  const realHeaderId = notificationElement.attr('data-headerid');
  let unreadNotificationTemplate;

  unreadMentionedCount = parseInt(unreadMentionedCount);
  if ([`@${userId}`, '@all'].includes(data.msg)) {
    unreadMentionedCount++;
    notificationHelper.setUserUnreadMentionedCount(headerId, userId, unreadMentionedCount);
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread: unreadMentionedCount});
    notificationElement.html(unreadNotificationTemplate);
    pushMethod({title: 'New message', body: 'You have new message.'});
    newMention(realHeaderId); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
  } else {
    const historyCount = parseInt(notificationHelper.getHistoryCount(headerId)) || 0;
    let unReadCount = 0;
    if (historyCount > 0) {
      unReadCount = historyCount;
    } else {
      let lastNewMessageCount = parseInt(notificationHelper.getNewMessageCount(headerId)) || 0;
      lastNewMessageCount++;
      notificationHelper.setNewMessageCount(headerId, lastNewMessageCount);
      unReadCount = lastNewMessageCount;
    }
    unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread: unReadCount});
    notificationElement.html(unreadNotificationTemplate);
    removeNewMentionHelper(realHeaderId);
    if (isMobile) {
      let $el = $bodyAceOuter().find('iframe')
          .contents()
          .find('#innerdocbody')
          .find(`[headerid="${realHeaderId}"]`)[0];
      if ($el) {
        $el = $el.shadowRoot;
        $el.querySelector('.counter').innerText = unReadCount;
        console.log($el.querySelector('.counter'), unReadCount);
      }
    }
  }
};
