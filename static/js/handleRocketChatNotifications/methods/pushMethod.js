'use strict';

exports.pushMethod = (data) => {
  const event = new CustomEvent('ep_push_notification',
      {detail: {eventName: 'notifyMe', data}});
    // Dispatch/Trigger/Fire the event
  window.dispatchEvent(event);
};
