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
        // $("#toc").css({"border":"none"});
        // $(".headerContainer").css({"border":"none"});
        $(".tocWrapper").css({"border":"none"});

        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        $(`#${lastActiveHeader}_container`).removeClass("highlightHeader");
        localStorage.setItem("lastActiveHeader",null);
    }else{
        // $("#toc").css({"border-right":"1px solid #DADCE0"});
        // $(".headerContainer").css({"border-right":"1px solid #DADCE0"});
        $(".tocWrapper").css({"border-right":"1px solid #DADCE0"});

    }
    var chatHtml = $('#ep_rocketchat_chatBar').tmpl({
        activeClass : activeClass ,
        headerText: headerText,
        payLoad : payLoad,
        channelId,
        headerId
    });
    $('body').append(chatHtml);

    // var chatHtml= `<div id='ep_rocketchat_container' class="${activeClass}">
    // <div class='ep_rocketchat_header'>
    //     <div class='header_chat_room_container'>
    //         <div id='header_chat_room' class='header_chat_room'>
    //             <span class='master_header_chat_room' id='master_header_chat_room'>${headerText}</span>
    //         </div>
 
    //     </div>
    //     <div id='ep_rocketchat_onlineUsersList' class='ep_rocketchat_onlineUsersList'>
    //     </div>
    //     <div class='header_chat_room_close_container'>

    //         <div id='header_chat_room_close' class='header_chat_room_close'>
                
    //         </div>
    //     </div>
    // </div>
    // <iframe id="ep_rocketchat_iframe" class="ep_rocketchat_iframe" src="${payLoad.data.rocketChatBaseUrl}/channel/${channelId}?layout=embedded"  frameborder="۰" title="myframe"></iframe></div>`

    if ( (headerId || headerId!=null)  ){
        $('#editorcontainer').css({
            "padding-bottom" : $("#ep_rocketchat_container").height()
        });
    }

    chatResizer();

    if(headerId && headerId!=="" && (headerParamText && headerParamText!="") ){
        localStorage.setItem("lastActiveHeader",null); // because of initialize of header need to be null temporary and scroll will fill it
        //$(`#${headerId}`).click();

        $(`#${headerId}`).click(function(e){e.preventDefault();}).click();

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

        // $("#toc").css({"border":"none"});
        // $(".headerContainer").css({"border":"none"});

        // remove highlight

        // set null last active header
        
        // removing url param
        const params = new URLSearchParams(location.search);
        params.delete('id');
        params.delete('header');
        window.history.replaceState({}, '', `${location.pathname}?${params}`);

       
    });
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
