import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: 'AIzaSyCsZIA1726HXfB02ZPf1tGmuIa_1lmJ-GY',
  authDomain: 'chat.jaceyi.com',
  projectId: 'chat-cc664',
  storageBucket: 'chat-cc664.appspot.com',
  appId: '1:916276032579:web:cdb79658a33fe9fa9c10f6'
});

(window as any).signOut = firebase.auth().signOut.bind(firebase.auth());

export const storage = firebase.storage();
export const database = firebase.database();
export const githubProvider = new firebase.auth.GithubAuthProvider();

export default firebase;
