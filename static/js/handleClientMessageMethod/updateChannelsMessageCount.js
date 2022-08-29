import {removeNewMentionHelper} from '../handleRocketChatNotifications/methods/helper/newMentionHelper';
import {setHistoryCount} from '../handleRocketChatNotifications/methods/helper/notificationHelper';
import {$bodyAceOuter} from '../utiles';

export default (payLoad) => {
  try {
    const channelsMessageCounts = payLoad.data.channelsMessageCount;
    const padId = payLoad.padId;
    const isMobile = clientVars.userAgent.isMobile;


    let lastActiveHeader = localStorage.getItem('lastActiveHeader');
    lastActiveHeader = (lastActiveHeader) ? lastActiveHeader.toLowerCase() : lastActiveHeader;

    channelsMessageCounts
        .filter((v) => v.name !== lastActiveHeader && v.count > 0)
        .forEach((element) => {
          const headerId = (element.name === `${padId}-general-channel`) ? 'general' : element.name;
          let notificationElement = $(`#${headerId}_notification`);
          const realHeaderId = notificationElement.attr('data-headerid');
          let unreadCount = element.count;

          if (!notificationElement.length) {
            notificationElement = $(`#${headerId.toLowerCase()}_notification`);
          }
          if (!notificationElement.length) {
            notificationElement = $(`#${element.fname.toLowerCase()}_notification`);
          }
          if (!notificationElement.length) return;

          const unreadNotificationTemplate = $('#ep_rocketchat_unreadNotification')
              .tmpl({unread: unreadCount});

          notificationElement.html(unreadNotificationTemplate);
          removeNewMentionHelper(realHeaderId);
          setHistoryCount(headerId, unreadCount);

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
        });
  } catch (error) {
    console.log(error);
  }
};
