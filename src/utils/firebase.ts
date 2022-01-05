import { initializeApp } from 'firebase/app';
import { getAuth, signOut, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getToken, getMessaging } from 'firebase/messaging';

const firebase = initializeApp({
  apiKey: 'AIzaSyCsZIA1726HXfB02ZPf1tGmuIa_1lmJ-GY',
  authDomain: 'chat.jaceyi.com',
  projectId: 'chat-cc664',
  storageBucket: 'chat-cc664.appspot.com',
  appId: '1:916276032579:web:cdb79658a33fe9fa9c10f6',
  messagingSenderId: '916276032579',
  databaseURL: 'https://chat-cc664-default-rtdb.firebaseio.com'
});

export const auth = getAuth(firebase);
export const db = getDatabase(firebase);
export const storage = getStorage(firebase);
export const messaging = getMessaging(firebase);

if (location.hostname === 'localhost' && location.port === '5000') {
  connectDatabaseEmulator(db, 'localhost', 9000); // 本地模拟 启用本地数据库
  connectAuthEmulator(auth, 'http://localhost:9099');
}

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    getToken(messaging, {
      vapidKey:
        'BAKEGBI_RXi6rigdNdlQ_hW25yKKUTggGQGMM7Cw4lBoMijEq8oKx5jrtNGoo9Z_ZGefrH6nfC5VlekNiKVathk'
    }).then(currentToken => {
      (window as any).CURRENT_MESSAGE_TOKEN = currentToken;
    });
  } else {
    console.log('Unable to get permission to notify.');
  }
});

(window as any).signOut = () => signOut(auth);

export default firebase;
