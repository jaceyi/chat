import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import Emoji, { EmojiInfo } from './handle/Emoji';
import Icon from './handle/Icon';
import Image from './handle/Image';
import { compose } from '@/utils';
import store from 'store';
import { Button } from 'react-alert-confirm';
import {
  decorator,
  keyBindingFn,
  KeyTypes,
  KeyCommands,
  RichStates,
  AttachUtils,
  blockRendererFn,
  blockRenderMap
} from 'chatUtils';
import { Raw } from 'chatUtils/types';

import 'draft-js/dist/Draft.css';
import * as styles from './style.scss';

const emptyEditorState = EditorState.createEmpty(decorator);

interface ChatProps {
  onCommit: (raw: Raw) => void;
}

const Chat = ({ onCommit }: ChatProps) => {
  const editor = useRef(null);

  useEffect(() => {
    store.initial(editor.current);
  }, [editor]);

  const [editorState, setEditorState] = useState(emptyEditorState);

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

  const commitEditorState = useCallback(
    editorState => {
      const contentState = editorState.getCurrentContent();
      const row = convertToRaw(contentState);
      if (!contentState.hasText()) return;
      onCommit(row);

      const selection = emptyEditorState.getSelection();
      setEditorState(EditorState.forceSelection(emptyEditorState, selection));
    },
    [onCommit]
  );

  const handleClickSubmit = () => {
    commitEditorState(editorState);
  };

  const handleKeyCommand = useCallback(
    (command: KeyTypes, editorState) => {
      switch (command) {
        case 'enter':
          changeEditorState(RichStates.insertWrap(editorState));
          return 'handled';
        case 'enter-inline':
          changeEditorState(RichUtils.insertSoftNewline(editorState));
          return 'handled';
        case 'prompt-link':
          KeyCommands.promptLink(editorState, changeEditorState);
          return 'handled';
        case 'backspace':
          const handled = RichStates.tryDeleteAtomicBlock(
            editorState,
            changeEditorState
          );
          if (handled) return 'handled';
          break;
        case 'submit':
          commitEditorState(editorState);
          return 'handled';
      }

      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        changeEditorState(newState);
        return 'handled';
      }

      return 'not-handled';
    },
    [commitEditorState]
  );

  const handleBeforeInput = useCallback(() => {
    if (store.focusBlockKey) {
      return 'handled';
    }
  }, []);

  const handlePastedText = useCallback(() => {
    if (store.focusBlockKey) {
      return 'handled';
    }
  }, []);

  const handlePastedFiles = useCallback(fileList => {
    if (store.focusBlockKey) {
      return 'handled';
    }
    RichStates.insertFiles(editorState, setEditorState, fileList);
    return 'handled';
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
    (fileList: File[]) => {
      RichStates.insertFiles(editorState, setEditorState, fileList);
    },
    [editorState]
  );

  const focusEditor = () => {
    setEditorState(EditorState.moveFocusToEnd(editorState));
  };

  return (
    <div className={styles.container}>
      <div className={styles.handle}>
        <div className={styles.menu}>
          <Icon>
            <Emoji onSelect={handleSelectEmoji} />
          </Icon>
          <Icon>
            <Image onUpload={handleUploadImage} />
          </Icon>
        </div>
        <div>
          <Button onClick={handleClickSubmit} styleType="primary">
            发 送
          </Button>
        </div>
      </div>
      <div tabIndex={0} onFocus={focusEditor} className={styles.chat}>
        <Editor
          ref={editor}
          placeholder="请输入内容"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={changeEditorState}
          keyBindingFn={keyBindingFn}
          blockRendererFn={blockRendererFn}
          blockRenderMap={blockRenderMap}
          handleBeforeInput={handleBeforeInput}
          handlePastedText={handlePastedText}
          handlePastedFiles={handlePastedFiles}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);
