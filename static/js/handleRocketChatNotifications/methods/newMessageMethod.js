import {newMentionHelper as newMention, removeNewMentionHelper} from './helper/newMentionHelper';
import {
  getLastActiveHeader,
  getUserUnreadMentionedCount,
  setUserUnreadMentionedCount,
  getHistoryCount,
  getNewMessageCount,
  setNewMessageCount,
} from './helper/notificationHelper';
import pushMethod from './pushMethod';

const $bodyAceOuter = () => $(document).find('iframe[name="ace_outer"]').contents();

export default (data) => {
  const padId = pad.getPadId();
  const roomId = data.name;
  const userId = pad.getUserId();
  const headerId = (roomId === `${padId}-general-channel`) ? 'general' : roomId;
  const isMobile = clientVars.userAgent.isMobile;

  const lastActiveHeader = getLastActiveHeader() || '';
  if (lastActiveHeader.toLowerCase() === headerId) return;


  // check mentioned this user
  let unreadMentionedCount = getUserUnreadMentionedCount(headerId, userId) || 0;
  unreadMentionedCount = parseInt(unreadMentionedCount);

  const notificationElement = $(`#${headerId}_notification`);
  const realHeaderId = notificationElement.attr('data-headerid');
  let unreadNotificationTemplate;

  unreadMentionedCount = parseInt(unreadMentionedCount);
  if ([`@${userId}`, '@all'].includes(data.msg)) {
    unreadMentionedCount++;
    setUserUnreadMentionedCount(headerId, userId, unreadMentionedCount);
    unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification')
        .tmpl({unread: unreadMentionedCount});

    $('body > header .shortMenue .btnChat .messageCount').text(unreadMentionedCount);
    notificationElement.html(unreadNotificationTemplate);
    pushMethod({title: 'New message', body: 'You have new message.'});

    // because of Rocketchat make to lower case need to access real
    // header id via notificationElement.attr("data-headerid")
    newMention(realHeaderId);
  } else {
    const historyCount = parseInt(getHistoryCount(headerId)) || 0;
    let unReadCount = 0;
    if (historyCount > 0) {
      unReadCount = historyCount;
    } else {
      let lastNewMessageCount = parseInt(getNewMessageCount(headerId)) || 0;
      lastNewMessageCount++;
      setNewMessageCount(headerId, lastNewMessageCount);
      unReadCount = lastNewMessageCount;
    }
    unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification').tmpl({unread: unReadCount});
    notificationElement.html(unreadNotificationTemplate);
    removeNewMentionHelper(realHeaderId);

    let unreadCount = unReadCount;
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
  }
};
