const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const sessioninfos = require('ep_etherpad-lite/node/handler/PadMessageHandler').sessioninfos;

exports.sendToRoom = (msg) => {
  const bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if (bufferAllows) {
    setTimeout(() => { // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      try {
        padMessageHandler.handleCustomObjectMessage(msg, false, () => {
          // console.log(error)
          // TODO: Error handling.
        });
      } catch (error) {
        console.log(error);
      }
    }
    , 100);
  }
};

exports.sendToUser = (msg, client) => {
  const sessionID = sessioninfos[client.id].sessionID;
  const bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if (bufferAllows) {
    setTimeout(() => { // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      try {
        padMessageHandler.handleCustomObjectMessage(msg, sessionID, () => {
          // TODO: Error handling.
        });
      } catch (error) {
        console.log(error, error.message);
      }
    }
    , 100);
  }
};
