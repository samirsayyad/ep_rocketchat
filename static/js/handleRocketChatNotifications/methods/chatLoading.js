'use strict';

exports.chatLoading = () => {
  $('#ep_rocketchat_iframe').animate({
    opacity: 0,
  }, {
    duration: 200,
    complete: () => {
      $('#chat-loading').css({opacity: 1});

      $('#chat-loading').css({display: 'flex'});
    },
  });
};
