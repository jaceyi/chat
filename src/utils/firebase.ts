import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebase = initializeApp({
  apiKey: 'AIzaSyCsZIA1726HXfB02ZPf1tGmuIa_1lmJ-GY',
  authDomain: 'chat.jaceyi.com',
  projectId: 'chat-cc664',
  storageBucket: 'chat-cc664.appspot.com',
  appId: '1:916276032579:web:cdb79658a33fe9fa9c10f6',
  databaseURL: 'https://chat-cc664-default-rtdb.firebaseio.com'
});

export const auth = getAuth(firebase);
export const db = getDatabase(firebase);
export const storage = getStorage(firebase);

(window as any).signOut = () => signOut(auth);

export default firebase;
