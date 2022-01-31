exports.updateRocketChatAnonymousInterface = function updateRocketChatAnonymousInterface(payLoad){


    // $("#ep_rocketchat_iframe").css({"display":"none"})

    // const chatHtml = $("#ep_rocketchat_anonymousInterface").tmpl()
 


    // $('#ep_rocketchat_container').append(chatHtml);



    //setTimeout(()=>{
        document.getElementById("ep_rocketchat_iframe").contentWindow.postMessage(
            {  externalCommand: 'userEtherpadStatus', status : "loginNeeded"}, '*')
    //},2000)
}