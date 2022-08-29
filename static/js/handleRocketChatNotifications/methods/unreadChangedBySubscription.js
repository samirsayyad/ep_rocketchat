import {newMentionHelper as newMention, removeNewMentionHelper} from './helper/newMentionHelper';
import {
  getHistoryCount,
  getLastActiveHeader,
  getUnreadCount,
  getNewMessageCount,
  getUserUnreadMentionedCount,
} from './helper/notificationHelper';
import {$bodyAceOuter} from '../../utiles';


export default ({name, alert, unread, fname}) => {
  // if there is unseen history count must click on that header first
  const padId = clientVars.padId;
  const headerId = (name === `${padId}-general-channel`) ? 'general' : name;
  const historyCount = parseInt(getHistoryCount(headerId)) || 0;
  const isMobile = clientVars.userAgent.isMobile;

  if (historyCount === 0 && alert === false && unread === 0) return;

  const userId = pad.getUserId();
  const lastActiveHeader = getLastActiveHeader() || false;

  if (lastActiveHeader?.toLowerCase() === headerId) return;

  let notificationElement = $(`#${headerId}_notification`);
  if (!notificationElement.length) notificationElement = $(`#${fname}_notification`);
  if (!notificationElement.length) {
    notificationElement = $(`#${(fname) ? fname.toLowerCase() : ''}_notification`);
  }

  if (!notificationElement.length) return;

  const realHeaderId = notificationElement.attr('data-headerid');
  const notifUnreadCount = getUnreadCount(headerId);
  const notifNewMsgCount = getNewMessageCount(headerId);
  const lastUnreadCount = parseInt(notifUnreadCount) || parseInt(notifNewMsgCount) || false;

  let unreadMentionedCount = getUserUnreadMentionedCount(headerId, userId) || 0;
  unreadMentionedCount = parseInt(unreadMentionedCount);

  let unreadNotificationTemplate;
  if (unreadMentionedCount === 0) {
    unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification')
        .tmpl({unread: historyCount || lastUnreadCount || unread});

    removeNewMentionHelper(realHeaderId);
    let unreadCount = historyCount || lastUnreadCount || unread;
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
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification')
        .tmpl({unread: unreadMentionedCount});

    $('body > header .shortMenue .btnChat .messageCount').text(unreadMentionedCount);

    // because of Rocketchat make to lower case need to access
    // real header id via notificationElement.attr("data-headerid")
    newMention(realHeaderId);
  }
  notificationElement.html(unreadNotificationTemplate);
};
