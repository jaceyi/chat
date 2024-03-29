import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, SelectionState, AtomicBlockUtils } from 'draft-js';
import Emoji, { EmojiInfo } from './handle/Emoji';
import Icon from './handle/Icon';
import Image from './handle/Image';
import { compose } from '@/utils';
import AlertConfirm, { Button } from 'react-alert-confirm';
import {
  getDecorator,
  bindKeyBindingFn,
  KeyCommands,
  RichStates,
  AttachUtils,
  bindBlockRendererFn,
  blockRenderMap
} from 'chatUtils';
import { SetEditorState, Raw, ChatStore, HandleKeyCommand, KeyCommand, DraftHandleValue } from 'chatUtils/types';
import MentionPopover from './MentionPopover';
import { UserInfo } from '@/store';
import 'draft-js/dist/Draft.css';
import * as styles from './style.module.scss';

interface ChatProps {
  onCommit: (raw: Raw) => void;
}

const Chat: FC<ChatProps> = ({ onCommit }) => {
  const storeRef: ChatStore = useRef({
    editor: null,
    suggestion: null,
    getWrapperWidth: () => storeRef.current.editor.editor.offsetWidth
  });

  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty(getDecorator(storeRef.current));
  });

  const changeEditorState = useCallback<SetEditorState>(editorState => {
    let newEditorState = compose(AttachUtils.entitiesToEmojis, AttachUtils.entitiesToLinks)(editorState);

    if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
      const selection = editorState.getSelection();
      newEditorState = EditorState.forceSelection(newEditorState, selection);
    }
    setEditorState(newEditorState);
  }, []);

  const commitEditorState = useCallback(
    (editorState: typeof EditorState) => {
      const contentState = editorState.getCurrentContent();
      const row = convertToRaw(contentState);
      if (!contentState.hasText()) return;
      const { blocks } = row;
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock.type === 'unstyled' && !lastBlock.text) {
        blocks.pop(); // 如果最后一行为空则删除该行
      }
      const first = blocks[0];
      if (blocks.length > 1 && blocks[1].type === 'atomic' && first.type === 'unstyled' && !first.text) {
        blocks.shift(); // 如果第二个块是原子块，则删除第一个空块
      }
      onCommit(row);

      const emptyEditorState = EditorState.createEmpty(getDecorator(storeRef.current?.editor));
      const selection = emptyEditorState.getSelection();
      setEditorState(EditorState.forceSelection(emptyEditorState, selection));
    },
    [onCommit]
  );

  const handleClickSubmit = () => {
    commitEditorState(editorState);
  };

  // 键盘事件队列
  const keyCommandRef = useRef<KeyCommand>(new Map());

  const handleKeyCommand = useCallback<HandleKeyCommand>(
    (command, editorState) => {
      for (const [_, keyCommand] of keyCommandRef.current) {
        const handled = keyCommand(command, editorState);
        if (handled === 'handled') return handled;
      }
      switch (command) {
        case 'enter':
          changeEditorState(RichStates.insertWrap(editorState));
          return 'handled';
        case 'prompt-link':
          KeyCommands.promptLink(editorState, changeEditorState);
          return 'handled';
        case 'backspace':
          if (RichStates.tryDeleteAtomicBlock(editorState, changeEditorState)) return 'handled';
          break;
        case 'submit':
          commitEditorState(editorState);
          return 'handled';
        case 'up':
          changeEditorState(RichStates.focusBeforeBlock(editorState));
          return 'handled';
        case 'down':
          changeEditorState(RichStates.focusAfterBlock(editorState));
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

  const handlePastedFiles = useCallback((fileList: FileList) => {
    try {
      RichStates.insertFiles(editorState, setEditorState, fileList);
    } catch (e) {
      AlertConfirm.alert('文件上传失败！');
    }
    return 'handled';
  }, []);

  const handleSelectEmoji = useCallback(
    (emoji: EmojiInfo) => {
      changeEditorState(RichStates.insertInline(editorState, emoji.emoji, 'insert-emoji'));
    },
    [editorState]
  );

  const handleUploadImage = useCallback(
    (fileList: FileList) => {
      try {
        RichStates.insertFiles(editorState, setEditorState, fileList);
      } catch (e) {
        AlertConfirm.alert('文件上传失败！');
      }
    },
    [editorState]
  );

  const handleDrop = useCallback(
    (selection: any, dataTransfer: any, isInternal: string): DraftHandleValue => {
      if (isInternal === 'internal') {
        const contentState = editorState.getCurrentContent();
        const currentSelection = editorState.getSelection();
        const currentBlockKey = currentSelection.getFocusKey();
        const currentBlock = contentState.getBlockForKey(currentBlockKey);
        if (currentBlock.getType('atomic')) {
          // 在拖动原子块
          const selectedBlockKey = selection.getFocusKey();
          const beforeBlockKey = contentState.getKeyBefore(currentBlockKey);
          const beforeBlock = contentState.getBlockForKey(beforeBlockKey);
          const afterBlockKey = contentState.getKeyAfter(currentBlockKey);

          if (
            selectedBlockKey === currentBlockKey ||
            (selectedBlockKey === beforeBlockKey && selection.getFocusOffset() === beforeBlock.getLength()) ||
            (selectedBlockKey === afterBlockKey && selection.getFocusOffset() === 0)
          ) {
            return 'handled';
          }

          changeEditorState(AtomicBlockUtils.moveAtomicBlock(editorState, currentBlock, selection, 'replace'));
          return 'handled';
        }
      }
      return 'not-handled';
    },
    [editorState]
  );

  const handleSelectUser = useCallback(
    (user: UserInfo) => {
      const { suggestion } = storeRef.current;
      if (!suggestion) return;
      const selection = editorState.getSelection();
      const focusOffset = selection.getFocusOffset();

      const { blockKey, start } = suggestion;

      const newEditorState = EditorState.forceSelection(
        editorState,
        new SelectionState({
          anchorKey: blockKey,
          anchorOffset: start,
          focusKey: blockKey,
          focusOffset: focusOffset,
          isBackward: false
        })
      );

      changeEditorState(RichStates.insertUser(newEditorState, user));
    },
    [editorState]
  );

  const focusEditor = () => {
    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) {
      setEditorState(EditorState.moveFocusToEnd(editorState));
    }
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
      <div onClick={focusEditor} className={styles.chat}>
        <Editor
          ref={(editor: any) => {
            storeRef.current.editor = editor;
            (window as any).editor = editor;
          }}
          placeholder="请输入内容"
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={changeEditorState}
          keyBindingFn={bindKeyBindingFn({ editorState, setEditorState })}
          blockRendererFn={bindBlockRendererFn({
            store: storeRef.current
          })}
          blockRenderMap={blockRenderMap}
          handlePastedFiles={handlePastedFiles}
          handleDrop={handleDrop}
        />
        <MentionPopover
          keyCommand={keyCommandRef.current}
          editorState={editorState}
          store={storeRef.current}
          onSelect={handleSelectUser}
        />
      </div>
    </div>
  );
};

export default React.memo(Chat);
