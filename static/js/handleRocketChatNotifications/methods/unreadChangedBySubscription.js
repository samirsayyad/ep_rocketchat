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

  const lastUnreadCount = parseInt(notificationHelper.getUnreadCount(headerId)) ||
                            parseInt(notificationHelper.getNewMessageCount(headerId)) || false;
  const unreadMentionedCount = parseInt(notificationHelper.getUserUnreadMentionedCount(headerId, userId)) || 0;

  let unreadNotificationTemplate;
  if (unreadMentionedCount === 0) {
    unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread: historyCount || lastUnreadCount || data.unread});
    removeNewMentionHelper(notificationElement.attr('data-headerid'));
  } else {
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread: unreadMentionedCount});
    newMention(notificationElement.attr('data-headerid')); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
  }
  notificationElement.html(unreadNotificationTemplate);
  if (isMobile) {
    const unreadCount = unreadMentionedCount;
    const $el = $bodyAceOuter().find('iframe')
        .contents()
        .find('#innerdocbody')
        .find(`[headerid="${headerId}"]`)[0].shadowRoot;
    $el.querySelector('.counter').innerText = unreadCount;
    console.log($el.querySelector('.counter'), unreadCount);
  }
};
