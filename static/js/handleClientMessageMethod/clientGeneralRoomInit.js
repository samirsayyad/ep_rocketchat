exports.clientGeneralRoomInit = function clientGeneralRoomInit(payLoad){



    const params = new URLSearchParams(location.search);
    const headerId = params.get('id');
    var parentHeader = ""
    var childHeader = ""
    var channelId= `${payLoad.padId}-general-channel`;

    if(headerId && headerId!==""){
        var parentHeaderId = $(`#${headerId}`).attr("parent");
        if(headerId == parentHeaderId){
            parentHeader =""
            childHeader =trimLeftTexts($(`#${headerId}`).attr("title"));
        }else{
            parentHeader =trimLeftTexts( $(`#${parentHeaderId}`).attr("title") ) + " /";
            childHeader =trimLeftTexts( $(`#${headerId}`).attr("title") ) ;
        }
        channelId = headerId;
    }else{
        parentHeader = "";
        childHeader = $("#generalItem").attr("title");
    }

    var chatHtml= `<div id='ep_rocketchat_container' class="ep_rocketchat_container">
    <div class='ep_rocketchat_header'>
        <div class='header_chat_room_container'>
            <div id='header_chat_room' class='header_chat_room'>
                <span class='parent_header_chat_room' id='parent_header_chat_room'>${parentHeader}</span>
                <span class='master_header_chat_room' id='master_header_chat_room'>${childHeader}</span>
            </div>
        </div>
        <div class='header_chat_room_close_container'>

            <div id='header_chat_room_close' class='header_chat_room_close'>
                
            </div>
        </div>
    </div>
    <iframe id="ep_rocketchat_iframe" class="ep_rocketchat_iframe" src="${payLoad.data.rocketChatBaseUrl}/channel/${channelId}?layout=embedded"  frameborder="۰" title="myframe"></iframe></div>`
    $('body').append(chatHtml);



    $( "#header_chat_room_close" ).on( "click", function() {
        //$("#ep_rocketchat_container").animate({height:41},200);
        $("#ep_rocketchat_container").hide();
        $("#toc").css({"border":"none"});
        $(".headerContainer").css({"border":"none"});
        const lastActiveHeader = localStorage.getItem("lastActiveHeader");
        $(`#${lastActiveHeader}_container`).removeClass("highlightHeader");
        localStorage.setItem("lastActiveHeader",null);

        $("#editorcontainer iframe").removeClass('chatHeightEditor')
        $("#editorcontainer iframe").addClass('fullHeightEditor')
    });
}

function trimLeftTexts(text){
    if(text.length > 36){
      var newText = "..."+text.substr((text.length - 1)-36,36);
      return newText;
    }
    return text;
    
}