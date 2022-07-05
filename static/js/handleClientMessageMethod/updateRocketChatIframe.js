'use strict';

const notificationHelper = require('../handleRocketChatNotifications/methods/helper/notificationHelper');
const $bodyAceOuter = () => $(document).find('iframe[name="ace_outer"]').contents();

exports.updateRocketChatIframe = (payLoad) => {
  try {
    document.getElementById('ep_rocketchat_iframe').contentWindow.postMessage(
        {externalCommand: 'go', path: `/channel/${payLoad.data.room}?layout=embedded`}, '*');
    setTimeout(() => {
      $('#chat-loading').animate({
        opacity: 0,
      }, {
        duration: 500,
        complete: () => {
          $('#chat-loading').css({display: 'none'});
          $('#ep_rocketchat_iframe').animate({opacity: 1}, 500);

          const isMobile = clientVars.userAgent.isMobile;
          let room = payLoad.data.room;
          const padId = payLoad.padId;
          const userId = payLoad.userId;
          room = (room === `${padId}-general-channel`) ? 'general' : room;

          notificationHelper.setUnreadCount(room, 0);
          notificationHelper.setNewMessageCount(room, 0);
          notificationHelper.setUserUnreadMentionedCount(room, userId, 0);
          notificationHelper.setHistoryCount(room, 0);
          notificationHelper.setLastActiveHeader(room);
          $(`#${room}_notification`).empty();

          const headerId = $(`#${room}_notification`).attr('data-headerid');
          let $el = $bodyAceOuter().find('iframe')
              .contents()
              .find('#innerdocbody')
              .find(`[headerid="${headerId}"]`)[0];
          if ($el) {
            $el = $el.shadowRoot;
            if (!isMobile) {
              $el.querySelector('.bubbleNotify').style.display = 'none';
              $el.querySelector('.mobileIcon').style.display = 'block';
              $el.querySelector('.mobileIcon').style.marginTop = '5px';
            }

            $el.querySelectorAll('.counter').forEach((el) => {
              el.innerText = '';
            });
          }
        },
      });
    }, 500);
  } catch (e) {
    console.log(e);
  }
};
