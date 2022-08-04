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
  const lastActiveHeader = notificationHelper.getLastActiveHeader() || false;

  if (lastActiveHeader) if (lastActiveHeader.toLowerCase() === headerId) return;

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
    let unreadCount = historyCount || lastUnreadCount || data.unread;
    let $el = $bodyAceOuter().find('iframe')
        .contents()
        .find('#innerdocbody')
        .find(`[headerid="${realHeaderId}"]`)[0];

    if ($el) {
      $el = $el.shadowRoot;
      // change the inline icon when notification counter is 0
      if (!isMobile) {
        if (unreadCount === 0) {
          $el.querySelector('.bubbleNotify').style.display = 'none';
          $el.querySelector('.mobileIcon').style.display = 'block';
          $el.querySelector('.mobileIcon').style.marginTop = '5px';
        } else if (unreadCount > 0) {
          $el.querySelector('.bubbleNotify').style.display = 'block';
          $el.querySelector('.mobileIcon').style.display = 'none';
          $el.querySelector('.mobileIcon').style.marginTop = '0';
        }
      }

      if (unreadCount > 9) {
        unreadCount = '9+';
        if (isMobile) {
          $el.querySelectorAll('.counter').forEach((el) => {
            el.style.marginLeft = '-7px';
          });
        }
      }
      $el.querySelectorAll('.counter').forEach((el) => {
        el.innerText = unreadCount;
      });
    }
  } else {
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification').tmpl({unread: unreadMentionedCount});
    $('body > header .shortMenue .btnChat .messageCount').text(unreadMentionedCount);
    newMention(realHeaderId); // because of Rocketchat make to lower case need to access real header id via notificationElement.attr("data-headerid")
  }
  notificationElement.html(unreadNotificationTemplate);
};
