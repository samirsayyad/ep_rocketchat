const chatResizer = require('../chatResizer').chatResizer

exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){
    const params = new URLSearchParams(location.search);
    const headerId = params.get('id');
    const headerParamText = params.get('header');

    const lastActiveHeader = localStorage.getItem("lastActiveHeader");
    var channelId= `${payLoad.padId}-general-channel`;    
    var headerText= clientVars.ep_set_title_on_pad.title;
    var activeClass = "ep_rocketchat_container"; 
    if ( (!headerId || headerId==null)  && (!headerParamText || headerParamText==null)  ){ // if there isn't any active header and param should add as hidden  && (!lastActiveHeader || lastActiveHeader == null || lastActiveHeader == "null" )
        activeClass = "ep_rocketchat_container_hidden";
        $(".tocWrapper").css({"border":"none"});
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        $(`#${lastActiveHeader}_container`).removeClass("highlightHeader");
        localStorage.setItem("lastActiveHeader",null);
    }else{
        channelId = headerId.toLowerCase();
        $(".tocWrapper").css({"border-right":"1px solid #DADCE0"});
    }
    //let lowerCaseHeaderId = headerId.toLowerCase()
    var chatHtml = $('#ep_rocketchat_chatBar').tmpl({
        activeClass : activeClass ,
        headerText: headerText,
        payLoad : payLoad,
        channelId,
        headerId //lowerCaseHeaderId
    });
    $('body').append(chatHtml);
    if ( (headerId || headerId!=null)  ){
        $('#editorcontainer').css({
            "padding-bottom" : $('#ep_rocketchat_container').css("height")
        });
    }

    chatResizer();

    if(headerId && headerId!=="" && (headerParamText && headerParamText!="") ){
        localStorage.setItem("lastActiveHeader",null); // because of initialize of header need to be null temporary and scroll will fill it
        //$(`#${headerId}`).click();

        $(`#${headerId}_container`).click(function(e){e.preventDefault();}).click()
        $('#toc').animate({
        scrollTop: $(`#${headerId}_container`).offset().top
        });
        //$(`#${headerId}_container`).click()

    }else{
        $("#master_header_chat_room").text(clientVars.ep_set_title_on_pad.title);
    }

    $("#ep_rocketchat_onlineUsersList").on( "click",".avatar", function(){
        $('#usersIconList').trigger("avatarClick",$(this).attr("data-userId"));
    })
    $( "#header_chat_room_close" ).on( "click", function() {

        $("#ep_rocketchat_container").animate({bottom:'-40%'},function(){
            $("#ep_rocketchat_container").hide();
            $("#ep_rocketchat_container").removeClass("ep_rocketchat_container");
            $("#ep_rocketchat_container").addClass("ep_rocketchat_container_hidden");
            $(".tocWrapper").css({"border":"none"});
            const lastActiveHeader = localStorage.getItem("lastActiveHeader");
            $(`#${lastActiveHeader}_container`).removeClass("highlightHeader");
            localStorage.setItem("lastActiveHeader",null);
            // remove padding for chat
            $('#editorcontainer').css({
                "padding-bottom" : 0
            });
        });

        // removing url param
        const params = new URLSearchParams(location.search);
        params.delete('id');
        params.delete('header');
        let url = location.pathname;
        if (params.toString().length > 0) url = `${location.pathname}?${params}`;
        window.history.replaceState({}, document.title, url);
        
    });



    // document.getElementById("ep_rocketchat_iframe").addEventListener( "load", function(e) {
    //     console.log("payLoad.data.rcToken",payLoad.data.rcToken)
    //     document.getElementById("ep_rocketchat_iframe").contentWindow.parent.postMessage({
    //         event: 'login-with-token',
    //         loginToken: payLoad.data.rcToken
    //     }, '*');
    
    // } );
}

function trimLeftTexts(text){
    text = text || ""
    const characterLimit=90
    if(text.length > characterLimit){
      var newText = "..."+text.substr((text.length - 1)-characterLimit,characterLimit);
      return newText;
    }
    return text;
}
