import * as React from 'react';
import alertConfirm from 'react-alert-confirm';
import * as RichUtils from '../..';
import * as styles from './style.scss';
import { REG_EXP_INTERNET } from '@/utils/consts';

export default async (setEditorState, editorState) => {
  let selection = editorState.getSelection();

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

  let isCollapsed = selection.isCollapsed();

  if (!REG_EXP_INTERNET.test(value)) return;

  if (isCollapsed) {
    setEditorState(
      RichUtils.insertLink(editorState, {
        url: value,
        text: value
      })
    );
  } else {
    setEditorState(
      RichUtils.toggleLink(editorState, {
        url: value
      })
    );
  }
};
