var padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

exports.chatResizer = function chatResizer(){
    var isDragging = false;
    var isMouseDown = false
    var padOuter = null;
	var padInner = null;
	var outerBody = null;
    var innerBody = null ;
    var startHeight , pY ;
    var minHeightChatBox = 243 ;
    var docHeight =$(document).height() ;
    $('#chatbox').css('display', 'flex');
    padcookie.setPref("chatAlwaysVisible", false);
    $('#options-stickychat').prop('checked', false);

    /**
     * options-stickychat remove
     */
    
    $('#options-stickychat').parent().hide();

    /**
     * options-chatandusers remove
     */
    
    $('#options-chatandusers').parent().hide();

    padOuter = $('iframe[name="ace_outer"]').contents();
    padInner = padOuter.find('iframe[name="ace_inner"]').contents();
    outerBody = padOuter.find("#outerdocbody");
    innerBody = padInner.find("#innerdocbody");

    // $('iframe[name="ace_outer"]').css({
    //     "padding-bottom" : minHeightChatBox
    // })
    // $('#editorcontainer').css({
    //     "padding-bottom" : minHeightChatBox
    // });

    /**
     * resizer inserting
     */
    var chatBoxBottom = document.getElementById("ep_rocketchat_container")
    var resizer = document.createElement('div');
    resizer.className = 'resizer';
    resizer.id = 'resizer';
    chatBoxBottom.prepend(resizer);

    /**
     * Mouse down
     */

         $("#resizer").on('mousedown', function(event){
            $('iframe[name="ace_outer"]').css({
                "pointer-events" : "none"
            })
            $("#editorcontainerbox").css({
                "z-index": 1000
            })
            startHeight = parseInt(document.defaultView.getComputedStyle(chatBoxBottom).height, 10);
            pY = event.pageY;
            isDragging = false;
            isMouseDown = true;
            //$("#resizer").css({"background-color":"red"})
            $("body").append("<div id='ghost_chat_resizer' style='top : "+event.pageY+"px'></div>")
            e=event || window.event;
            pauseEvent(e);
            
        })
    /**
     * mouse move
     */
    $(document).on('mousemove', function(event){
        //console.log("mousemove ",event.pageY)

        isDragging= true
        if(isMouseDown){
            //$("#resizer").css({"background-color":"brown"})
            $('#ghost_chat_resizer').css({
                top:   event.pageY
            });
            
        }else{
            
            $("#ghost_chat_resizer").remove()
        }

    });
    $("#editorcontainerbox").on('mousemove', function(event){
        ////console.log("mousemove ",event.pageY)

        isDragging= true
        if(isMouseDown){
            //$("#resizer").css({"background-color":"brown"})
            $('#ghost_chat_resizer').css({
                top:   event.pageY
            });
            
        }else{
            
            $("#ghost_chat_resizer").remove()
        }
    });

    /**
     * mouseup
     */
     $(document).on('mouseup', function(event){
        ////console.log("mouseup document")
        if(isMouseDown){
            $('iframe[name="ace_outer"]').css({
                "pointer-events" : "all"
            })
            $("#ghost_chat_resizer").remove()
            resizeChatBar(event.pageY)
        }
        isDragging = false;
        isMouseDown = false ;

    });

    $("#editorcontainerbox").on("mouseup",function(event){
            ////console.log("mouseup editorcontainerbox")
            if(isMouseDown){
                $('iframe[name="ace_outer"]').css({
                    "pointer-events" : "all"
                })
                $("#ghost_chat_resizer").remove()
                resizeChatBar(event.pageY+85)
            }
            isDragging = false;
            isMouseDown = false ;
    
    })
    function pauseEvent(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
    }
    function resizeChatBar(pageY){
        var chatBoxBottom = $("#ep_rocketchat_container")
        
        var mY = (pY - pageY );
        //console.log(mY  ,   pageY , pY , startHeight , (startHeight - mY))
        var newHeight = (startHeight + mY < 10) ?  10 : startHeight + mY ;
        var newHeight = (newHeight >= docHeight ) ?  docHeight : newHeight;

        
        chatBoxBottom.css({
            height: newHeight,
        });

        // $('iframe[name="ace_outer"]').css({
        //     "padding-bottom" : newHeight
        // })

        $('#editorcontainer').css({
            "padding-bottom" : newHeight
        });
        $('.ep_rocketchat_iframe').css({
            "height" : newHeight -36
        });
        $("#editorcontainerbox").css({
            "z-index": 0
        })
    }
}
