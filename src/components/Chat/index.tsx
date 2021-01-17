import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import Emoji, { EmojiInfo } from './Emoji';
import Icon from './Icon';

import {
  decorator,
  keyBindingFn,
  KeyTypes,
  KeyCommands,
  insertEmoji
} from './utils';

import 'draft-js/dist/Draft.css';
import * as styles from './style.scss';

const Chat = () => {
  const editor = useRef(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

  const handleSelectEmoji = useCallback(
    (emoji: EmojiInfo) => {
      setEditorState(insertEmoji(editorState, emoji));
    },
    [editorState]
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

    switch (command) {
      case 'enter':
        console.log('Ctrl+回车');
        return 'handled';
      case 'prompt-link':
        KeyCommands.promptLink(setEditorState, editorState);
        return 'handled';
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
      <Icon>
        <Emoji onSelect={handleSelectEmoji} />
      </Icon>
    </div>
  );
};

export default Chat;
