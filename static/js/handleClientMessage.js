const clientGeneralRoomInit = require("./handleClientMessageMethod/clientGeneralRoomInit").clientGeneralRoomInit
exports.handleClientMessage_CUSTOM = function handleClientMessage_CUSTOM(hook, context, cb){
    const current_user_id = pad.getUserId();

    if (context.payload.action == 'clientGeneralRoomInit') {
        if(current_user_id == context.payload.userId )
            clientGeneralRoomInit(context.payload)
    }
    return[];
}