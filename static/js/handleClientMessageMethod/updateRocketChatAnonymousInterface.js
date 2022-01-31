const __LOGOUT= '1';
exports.updateRocketChatAnonymousInterface = function updateRocketChatAnonymousInterface(payLoad){
    document.getElementById("ep_rocketchat_iframe").contentWindow.postMessage(
        {  externalCommand: 'userEtherpadStatus', status : clientVars.ep_profile_modal.user_status === __LOGOUT ? "loginNeeded" : "LoggedIn"}, '*')
}