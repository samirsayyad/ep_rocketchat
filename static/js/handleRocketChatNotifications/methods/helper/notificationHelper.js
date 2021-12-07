exports.setHistoryCount = function setHistoryCount(headerId,historyCount){
    localStorage.setItem(`${headerId}_historyCount`,historyCount)

}

exports.getHistoryCount = function getHistoryCount(headerId){
    return localStorage.getItem(`${headerId}_historyCount`);
}

exports.getLastActiveHeader = function getLastActiveHeader(){
    return localStorage.getItem("lastActiveHeader");
}

exports.setUserUnreadMentionedCount = function setUserUnreadMentionedCount(headerId,userId,unreadMentionedCount){
    localStorage.setItem(`${headerId}_unreadMentionedCount_${userId}`,unreadMentionedCount);
}

exports.getUserUnreadMentionedCount = function getUserUnreadMentionedCount(headerId,userId){
    return localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`);
}
exports.setNewMessageCount = function setNewMessageCount(headerId,lastNewMessageCount){
    localStorage.setItem(`${headerId}_newMessage`,lastNewMessageCount);
}

exports.getNewMessageCount = function getNewMessageCount(headerId){
    return localStorage.getItem(`${headerId}_newMessage`);
}

exports.setUnreadCount = function setUnreadCount(headerId,unreadCount){
    localStorage.setItem(`${headerId}_unreadCount`,unreadCount);
}

exports.getUnreadCount = function getUnreadCount(headerId){
    return localStorage.getItem(`${headerId}_unreadCount`) ;
}

exports.setLastActiveHeader =  function setLastActiveHeader(headerId){
    localStorage.setItem("lastActiveHeader",headerId);

}