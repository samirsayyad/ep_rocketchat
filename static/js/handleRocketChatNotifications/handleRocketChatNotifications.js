import notificationsMethod from './methods/notificationsMethod';
import unreadChangedBySubscription from './methods/unreadChangedBySubscription';
import newMessageMethod from './methods/newMessageMethod';
import chatLoading from './methods/chatLoading';

const bindEvent = (element, eventName, eventHandler) => {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent(`on${eventName}`, eventHandler);
  }
};

export default () => {
  bindEvent(window, 'message', (e) => {
    const eventName = e.data.eventName;
    const data = e.data.data;
    if (eventName === 'notification') {
      notificationsMethod(data);
    }
    if (eventName === 'new-message') {
      newMessageMethod(data);
    }
    if (eventName === 'unread-changed-by-subscription') {
      unreadChangedBySubscription(data);
    }
    if (eventName === 'chatLoading') {
      chatLoading();
    }
  });
};
