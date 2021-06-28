exports.unreadChangedBySubscription = function unreadChangedBySubscription (data){
    if(data.alert == true){
        $(`#${data.name}`).css({"background-color":"blue"})
    }
}
