'use strict';

const __LOGOUT = '1';
exports.updateRocketChatAnonymousInterface = () => {
  document.getElementById('ep_rocketchat_iframe').contentWindow.postMessage(
      {externalCommand: 'userEtherpadStatus', status: clientVars.ep_profile_modal.userStatus === __LOGOUT ? 'loginNeeded' : 'LoggedIn'}, '*');
};
