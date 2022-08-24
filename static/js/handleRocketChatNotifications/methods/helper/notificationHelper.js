export const setHistoryCount = (headerId, historyCount) => {
  localStorage.setItem(`${headerId}_historyCount`, historyCount);
};

export const getHistoryCount = (headerId) => localStorage.getItem(`${headerId}_historyCount`);

export const getLastActiveHeader = () => localStorage.getItem('lastActiveHeader');

export const setUserUnreadMentionedCount = (headerId, userId, unreadMentionedCount) => {
  localStorage.setItem(`${headerId}_unreadMentionedCount_${userId}`, unreadMentionedCount);
};

export const getUserUnreadMentionedCount = (headerId, userId) => {
  localStorage.getItem(`${headerId}_unreadMentionedCount_${userId}`);
};

export const setNewMessageCount = (headerId, lastNewMessageCount) => {
  localStorage.setItem(`${headerId}_newMessage`, lastNewMessageCount);
};

export const getNewMessageCount = (headerId) => localStorage.getItem(`${headerId}_newMessage`);

export const setUnreadCount = (headerId, unreadCount) => {
  localStorage.setItem(`${headerId}_unreadCount`, unreadCount);
};

export const getUnreadCount = (headerId) => localStorage.getItem(`${headerId}_unreadCount`);

export const setLastActiveHeader = (headerId) => {
  localStorage.setItem('lastActiveHeader', headerId);
};
