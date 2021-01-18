import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import Message from './components/Message';
import { MESSAGE_LIST } from './components/Message/mock';
import { useState } from 'react';
import * as styles from './App.scss';

const App = () => {
  const [messageList, setMessageList] = useState(MESSAGE_LIST);

  return (
    <div className={styles.container}>
      <Message messageList={messageList} />
      <Chat />
    </div>
  );
};

export default hot(App);
