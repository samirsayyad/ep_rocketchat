// import {padcookie} from 'ep_etherpad-lite/static/js/pad_cookie';
import {
  handleClientMessage_CUSTOM as clientMessage_CUSTOM,
  handleClientMessage_USER_NEWINFO as clientMessage_USER_NEWINFO,
  handleClientMessage_USER_LEAVE as clientMessage_USER_LEAVE,
} from './handleClientMessage';
import handleRocketChatNotifications from './handleRocketChatNotifications/handleRocketChatNotifications';
import {handleNewMentionButton} from './handleRocketChatNotifications/methods/helper/newMentionHelper';

export const aceInitialized = () => {
  $('#chaticon').hide();
  $('#options-stickychat').prop('checked', false);
  // padcookie.setPref('chatAlwaysVisible', false);
  $('#options-stickychat').parent().hide();
  $('#options-chatandusers').parent().hide();

  // $("#editorcontainer iframe").addClass('fullHeightEditor')

  handleRocketChatNotifications();
  handleNewMentionButton();
  return [];
};

export const handleClientMessage_CUSTOM = clientMessage_CUSTOM
export const handleClientMessage_USER_NEWINFO = clientMessage_USER_NEWINFO
export const handleClientMessage_USER_LEAVE = clientMessage_USER_LEAVE
