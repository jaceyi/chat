import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Editor, EditorState } from 'draft-js';

import decorator from './utils/decorator';
import keyBindingFn from './utils/keyBindingFn';
import bindKeyCommand from './utils/bindKeyCommand';

import 'draft-js/dist/Draft.css';
import * as styles from './style.scss';

const Chat = () => {
  const editor = useRef(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

  const focusEditor = useCallback(() => {
    editor.current.focus();
  }, []);

  const handleKeyCommand = useCallback(bindKeyCommand(setEditorState), []);

  return (
    <div className={styles.container}>
      <div onClick={focusEditor} className={styles.chat}>
        <Editor
          ref={editor}
          placeholder="请输入内容"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          keyBindingFn={keyBindingFn}
        />
      </div>
    </div>
  );
};

export default Chat;
