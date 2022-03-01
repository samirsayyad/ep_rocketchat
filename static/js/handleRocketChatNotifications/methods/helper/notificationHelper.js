'use strict';

exports.setHistoryCount = (headerId, historyCount) => {
  localStorage.setItem(`${headerId}_historyCount`, historyCount);
};

exports.getHistoryCount = (headerId) => localStorage.getItem(`${headerId}_historyCount`);

exports.getLastActiveHeader = () => localStorage.getItem('lastActiveHeader');

exports.setUserUnreadMentionedCount = (headerId, userId, unreadMentionedCount) => {
  localStorage.setItem(`${headerId}_unreadMentionedCount_${userId}`, unreadMentionedCount);
};

exports.getUserUnreadMentionedCount = (headerId, userId) => localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`);
exports.setNewMessageCount = (headerId, lastNewMessageCount) => {
  localStorage.setItem(`${headerId}_newMessage`, lastNewMessageCount);
};

exports.getNewMessageCount = (headerId) => localStorage.getItem(`${headerId}_newMessage`);

exports.setUnreadCount = (headerId, unreadCount) => {
  localStorage.setItem(`${headerId}_unreadCount`, unreadCount);
};

exports.getUnreadCount = (headerId) => localStorage.getItem(`${headerId}_unreadCount`);

exports.setLastActiveHeader = (headerId) => {
  localStorage.setItem('lastActiveHeader', headerId);
};
