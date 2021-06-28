exports.notificationsMethod = function notificationsMethod (data){
    if(!data.fromOpenedRoom){ // must be false in order to notify user
        const headerId = data.notification.payload.name ; 
        $(`#${headerId}`).css({ "color": "blue"})
    }
    
}
