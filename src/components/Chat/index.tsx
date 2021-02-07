import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import Emoji, { EmojiInfo } from './Emoji';
import Icon from './Icon';
import Image from './Image';
import { compose } from '@/utils';
import store from 'store';

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
import { UploadFile } from 'chatUtils/types';

import { ImageBlockType } from 'chatUtils/blockRendererFn/components/Image';

import 'draft-js/dist/Draft.css';
import * as styles from './style.scss';
import { uploadFile } from '@/services/uploadFile';

const emptyEditorState = EditorState.createEmpty(decorator);

const Chat = () => {
  const editor = useRef(null);

  useEffect(() => {
    store.initial(editor.current);
  }, [editor]);

  const [editorState, setEditorState] = useState(emptyEditorState);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = useCallback(async editorState => {
    if (loading) return;
    setLoading(false);
    const contentState = editorState.getCurrentContent();
    const { entityMap } = convertToRaw(contentState);
    const reqs = [];
    for (const key in entityMap) {
      if (!entityMap.hasOwnProperty(key)) continue;
      const entity = entityMap[key];
      if (entity.type === ImageBlockType) {
        reqs.push({
          key,
          req: uploadFile(entity.data)
        });
      }
    }
    const newFileEntityList = await Promise.allSettled(reqs);
    for (const res of newFileEntityList) {
      console.log(res);
    }

    setEditorState(emptyEditorState);
    setLoading(true);
  }, []);

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
          handleSubmit(editorState);
          return 'handled';
      }

      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        changeEditorState(newState);
        return 'handled';
      }

      return 'not-handled';
    },
    [handleSubmit]
  );

  const handleSelectEmoji = useCallback(
    (emoji: EmojiInfo) => {
      changeEditorState(
        RichStates.insertInline(editorState, emoji.emoji, 'insert-emoji')
      );
    },
    [editorState]
  );

  const handleUploadImage = useCallback(
    (file: UploadFile) => {
      setEditorState(RichStates.insertAtomic(editorState, 'image', file));
    },
    [editorState]
  );

  const focusEditor = () => {
    setEditorState(EditorState.moveFocusToEnd(editorState));
  };

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
      <div tabIndex={0} onFocus={focusEditor} className={styles.chat}>
        <div onFocus={e => e.stopPropagation()}>
          <Editor
            ref={editor}
            placeholder="请输入内容"
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={changeEditorState}
            keyBindingFn={keyBindingFn}
            blockRendererFn={blockRendererFn}
            blockRenderMap={blockRenderMap}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chat);
