const functions = require('firebase-functions');
const { initializeApp, messaging } = require('firebase-admin');

initializeApp();

exports.sendMessage = functions.database
  .ref('/messages')
  .onCreate(async (snapshot, context) => {
    try {
      const original = snapshot.val();
      const snap = await database().ref('messageTokens').once('value');
      let tokens = [];
      if (snap && snap.exists()) {
        tokens = Object.values(snap.val());
      }
      functions.logger.log('sendMessage', context.params.pushId, {
        sendContent: original,
        tokens
      });
      const payload = {
        notification: {
          title: '有新消息！',
          body: 'Test body'
        }
      };
      messaging().sendToDevice(tokens, payload);
    } catch (e) {
      console.log(e);
    }
    return null;
  });
