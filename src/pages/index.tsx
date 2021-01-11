import * as React from 'react';
import { Editor, EditorState } from 'draft-js';
import { useState } from 'react';

const Chat = () => {
  const [value, setValue] = useState(EditorState.createEmpty());
  const [messageList, setMessageList] = useState([]);

  return <Editor editorState={value} onChange={setValue} />;
};

export default Chat;
