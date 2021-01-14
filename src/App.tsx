import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import { useState } from 'react';

const App = () => {
  const [messageList, setMessageList] = useState([]);

  return (
    <div>
      <Chat />
    </div>
  );
};

export default hot(App);
