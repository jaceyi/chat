import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import Emoji, { EmojiInfo } from './Emoji';
import Icon from './Icon';
import Image from './Image';
import { compose } from '@/utils';

import {
  decorator,
  keyBindingFn,
  KeyTypes,
  KeyCommands,
  RichStates,
  AttachUtils,
  blockRendererFn
} from 'chatUtils';

import 'draft-js/dist/Draft.css';
import * as styles from './style.scss';

const Chat = () => {
  const editor = useRef(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

  const changeEditorState = useCallback(editorState => {
    let newEditorState = compose(
      AttachUtils.entitiesToEmojis,
      AttachUtils.entitiesToLinks
    )(editorState);

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

  const focusEditor = useCallback(() => {
    editor.current.focus();
  }, []);

  const handleKeyCommand = useCallback((command: KeyTypes, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command as string);

    if (newState) {
      changeEditorState(newState);
      return 'handled';
    }

    switch (command) {
      case 'enter':
        changeEditorState(RichStates.insertInline(editorState, '\n'));
        return 'handled';
      case 'prompt-link':
        KeyCommands.promptLink(changeEditorState, editorState);
        return 'handled';
      case 'submit':
        console.log('submit');
        return 'handled';
    }

    return 'not-handled';
  }, []);

  const handleSelectEmoji = useCallback(
    (emoji: EmojiInfo) => {
      changeEditorState(
        RichStates.insertInline(editorState, emoji.emoji, 'insert-emoji')
      );
    },
    [editorState]
  );

  const handleUploadImage = useCallback(
    (src: string) => {
      changeEditorState(
        RichStates.insertAtomic(editorState, 'image', {
          src
        })
      );
    },
    [editorState]
  );

  return (
    <div className={styles.container}>
      <div className={styles.handle}>
        <Icon>
          <Emoji onSelect={handleSelectEmoji} />
        </Icon>
        <Icon>
          <Image onUpload={handleUploadImage} />
        </Icon>
      </div>
      <div onClick={focusEditor} className={styles.chat}>
        <Editor
          ref={editor}
          placeholder="请输入内容"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={changeEditorState}
          keyBindingFn={keyBindingFn}
          blockRendererFn={blockRendererFn}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);
