import * as React from 'react';
import alertConfirm from 'react-alert-confirm';
import { RichStates } from '../..';
import * as styles from './style.scss';
import { REGEX_INTERNET } from '@/utils/consts';

export default async (setEditorState, editorState) => {
  const selection = editorState.getSelection();

  let value = '';
  try {
    await alertConfirm(
      <input
        autoFocus
        placeholder="请输入链接 https://xx.com"
        onChange={e => (value = e.target.value)}
        className={styles.input}
      />
    );
  } catch (e) {}

  if (!value) return;

  const isCollapsed = selection.isCollapsed();

  if (!REGEX_INTERNET.test(value)) return;

  if (isCollapsed) {
    setEditorState(
      RichStates.insertLink(editorState, {
        url: value,
        text: value
      })
    );
  } else {
    setEditorState(
      RichStates.toggleLink(editorState, {
        url: value
      })
    );
  }
};
