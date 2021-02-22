import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

firebase.initializeApp({
  apiKey: 'AIzaSyCsZIA1726HXfB02ZPf1tGmuIa_1lmJ-GY',
  authDomain: 'chat-cc664.firebaseapp.com',
  projectId: 'chat-cc664',
  storageBucket: 'chat-cc664.appspot.com',
  appId: '1:916276032579:web:cdb79658a33fe9fa9c10f6'
});

export const storage = firebase.storage();
export const database = firebase.database();
