'use strict';

const newMention = require('./helper/newMentionHelper').newMentionHelper;
const removeNewMentionHelper = require('./helper/newMentionHelper').removeNewMentionHelper;
const notificationHelper = require('./helper/notificationHelper');

const $bodyAceOuter = () => $(document).find('iframe[name="ace_outer"]').contents();

exports.unreadChangedBySubscription = (data) => {
  // if there is unseen history count must click on that header first
  const padId = clientVars.padId;
  const headerId = (data.name === `${padId}-general-channel`) ? 'general' : data.name;
  const historyCount = parseInt(notificationHelper.getHistoryCount(headerId)) || 0;
  const isMobile = clientVars.userAgent.isMobile;

  if (historyCount === 0 && data.alert === false && data.unread === 0) return;

  const userId = pad.getUserId();
  const lastActiveHeader = notificationHelper.getLastActiveHeader() || '';

  if (lastActiveHeader.toLowerCase() === headerId) return;

  let notificationElement = $(`#${headerId}_notification`);
  if (!notificationElement.length) notificationElement = $(`#${data.fname}_notification`);
  if (!notificationElement.length) notificationElement = $(`#${(data.fname) ? data.fname.toLowerCase() : ''}_notification`);
  if (!notificationElement.length) return;

  const realHeaderId = notificationElement.attr('data-headerid');
  const lastUnreadCount = parseInt(notificationHelper.getUnreadCount(headerId)) ||
                            parseInt(notificationHelper.getNewMessageCount(headerId)) || false;
  const unreadMentionedCount = parseInt(notificationHelper.getUserUnreadMentionedCount(headerId, userId)) || 0;

  let unreadNotificationTemplate;
  if (unreadMentionedCount === 0) {
    unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread: historyCount || lastUnreadCount || data.unread});
    removeNewMentionHelper(realHeaderId);
    if (isMobile) {
      let unreadCount = historyCount || lastUnreadCount || data.unread;
      let $el = $bodyAceOuter().find('iframe')
          .contents()
          .find('#innerdocbody')
          .find(`[headerid="${realHeaderId}"]`)[0];
      if ($el) {
        $el = $el.shadowRoot;
        if (unreadCount > 9) {
          unreadCount = '+9';
          $el.style.marginLeft = '-6px';
        }
        $el.querySelector('.counter').innerText = unreadCount;
      }
    }
  } else {
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread: unreadMentionedCount});
    newMention(realHeaderId); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
  }
  notificationElement.html(unreadNotificationTemplate);
};
