import {newMentionHelper as newMention, removeNewMentionHelper} from './helper/newMentionHelper';
import {
  getLastActiveHeader,
  getUserUnreadMentionedCount,
  setUserUnreadMentionedCount,
  getHistoryCount,
  getUnreadCount,
  setUnreadCount,
} from './helper/notificationHelper';
import pushMethod from './pushMethod';

const $bodyAceOuter = () => $(document).find('iframe[name="ace_outer"]').contents();

export default (data) => {
  if (!data.fromOpenedRoom) { // must be false in order to notify user
    const padId = pad.getPadId();
    const userId = pad.getUserId();
    const isMobile = clientVars.userAgent.isMobile;
    const {name, fname, message} = data.notification.payload;


    const headerId = (name === `${padId}-general-channel`) ? 'general' : name;
    const lastActiveHeader = getLastActiveHeader() || false;

    if (lastActiveHeader?.toLowerCase() === headerId) return;

    let notificationElement = $(`#${headerId}_notification`);
    if (!notificationElement.length) notificationElement = $(`#${fname}_notification`);
    if (!notificationElement.length) notificationElement = $(`#${(fname) ? fname.toLowerCase() : ''}_notification`);
    if (!notificationElement.length) return;

    const realHeaderId = notificationElement.attr('data-headerid');

    // check mentioned this user
    let unreadNotificationTemplate;
    let unreadMentionedCount = getUserUnreadMentionedCount(headerId, userId) || 0;
    unreadMentionedCount = parseInt(unreadMentionedCount);

    // it means mentioned by someone or generally
    if ([`@${userId}`, '@all'].includes(message.msg)) {
      unreadMentionedCount++;
      setUserUnreadMentionedCount(headerId, userId, unreadMentionedCount);
      unreadNotificationTemplate = $('#ep_rocketchat_mentionNotification')
          .tmpl({unread: unreadMentionedCount});

      $('body > header .shortMenue .btnChat .messageCount').text(unreadMentionedCount);
      notificationElement.html(unreadNotificationTemplate);
      pushMethod({title: 'New message', body: 'You have new message.'});
      // because of Rocketchat make to lower case need to access
      // real header id via notificationElement.attr("data-headerid")
      newMention(realHeaderId);
    } else {
      const historyCount = parseInt(getHistoryCount(headerId)) || 0;
      let unReadCount = 0;

      if (historyCount > 0) {
        unReadCount = historyCount;
      } else {
        let lastUnreadCount = parseInt(getUnreadCount(headerId) || 0);
        lastUnreadCount++;
        setUnreadCount(headerId, lastUnreadCount);
        unReadCount = lastUnreadCount;
      }

      unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification')
          .tmpl({unread: unReadCount + unreadMentionedCount});

      notificationElement.html(unreadNotificationTemplate);
      removeNewMentionHelper(realHeaderId);
      let unreadCount = unReadCount + unreadMentionedCount;
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
  }
};
