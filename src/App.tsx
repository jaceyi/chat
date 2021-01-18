import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import Message from './components/Message';
import { useState } from 'react';

const App = () => {
  const [messageList, setMessageList] = useState([]);

  return (
    <div>
      <Message />
      <Chat />
    </div>
  );
};

export default hot(App);
