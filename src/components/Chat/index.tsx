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
  RichStates,
  AttachUtils
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
      handleChangeEditorState(RichStates.insertEmoji(editorState, emoji));
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
        setEditorState(RichStates.insertInline(editorState, '\n'));
        return 'handled';
      case 'prompt-link':
        KeyCommands.promptLink(setEditorState, editorState);
        return 'handled';
      case 'submit':
        console.log('submit');
        return 'handled';
    }

    return 'not-handled';
  }, []);

  const handleChangeEditorState = useCallback(editorState => {
    let newEditorState = AttachUtils.entitiesToEmojis(editorState);
    if (
      !newEditorState
        .getCurrentContent()
        .equals(editorState.getCurrentContent())
    ) {
      const selection = editorState.getSelection();
      newEditorState = EditorState.forceSelection(newEditorState, selection);
    }
    setEditorState(newEditorState);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.handle}>
        <Icon>
          <Emoji onSelect={handleSelectEmoji} />
        </Icon>
      </div>
      <div onClick={focusEditor} className={styles.chat}>
        <Editor
          ref={editor}
          placeholder="请输入内容"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleChangeEditorState}
          keyBindingFn={keyBindingFn}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);
