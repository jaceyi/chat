const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const getBlocksText = (blocks, maxCount = 20) => {
  let text = '';
  for (const item of blocks) {
    if (text.length > maxCount) {
      return text.slice(0, maxCount) + '...';
    }
    text += item.text;
  }
  return text;
};

exports.sendMessage = functions.database
  .ref('/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const { messageId } = context.params;
    try {
      const tokenSnapshot = await admin
        .database()
        .ref('messageTokens')
        .once('value');
      if (!tokenSnapshot.exists()) return null;
      const tokenMap = tokenSnapshot.val();
      const message = snapshot.val();
      const tokens = [];
      if (!message.raw.entityMap) return null;
      for (const entity of message.raw.entityMap) {
        if (entity.type !== 'USER') continue;
        // 只有包含有 USER(@) 的 type 才发消息
        const token = tokenMap[entity.data.uid];
        token && tokens.push(token);
      }

      if (!tokens.length) return null;
      const body = getBlocksText(message.raw.blocks) || '...';
      await admin.messaging().sendMulticast({
        data: {
          title: '有人@你~',
          body
        },
        tokens: tokens,
        webpush: {
          notification: {
            tag: 'at',
            title: '有人@你~',
            body,
            icon: 'https://chat.jaceyi.com/favicon.ico'
          },
          fcmOptions: {
            link: 'https://chat.jaceyi.com'
          }
        }
      });
      return functions.logger.log('Send success', messageId, {
        body,
        tokens
      });
    } catch (e) {
      return functions.logger.error('Send error', messageId, e);
    }
  });
