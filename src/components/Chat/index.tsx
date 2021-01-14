import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Editor, EditorState } from 'draft-js';

import decorator from './utils/decorator';
import keyBindingFn, { KeyTypes } from './utils/keyBindingFn';
import RichUtils from './utils/RichUtils';

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

  const handleKeyCommand = useCallback((command: KeyTypes, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command as string);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    // todo 可以考虑抽出去
    switch (command) {
      case 'enter':
        console.log('Ctrl+回车');
        break;
      case 'prompt-link':
        const selection = editorState.getSelection();
        const startOffset = selection.getStartOffset();
        const endOffset = selection.getEndOffset();

        if (startOffset !== endOffset) {
          const value = prompt('请输入链接');
          value &&
            setEditorState(
              RichUtils.promptLink(editorState, {
                url: value
              })
            );
        }
        break;
    }

    return 'not-handled';
  }, []);

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
