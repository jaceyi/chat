import * as React from 'react';
import alertConfirm from 'react-alert-confirm';
import { RichStates } from 'chatUtils';
import Input from '@/components/Input';
import { REGEX_INTERNET } from '@/utils/consts';

export const promptLink = async (editorState, setEditorState) => {
  const selection = editorState.getSelection();

  let value = '';
  try {
    await alertConfirm(
      <Input
        placeholder="请输入链接 https://xx.com"
        onChange={_val => (value = _val)}
      />
    );
  } catch (e) {}

  if (!value) return;

  const isCollapsed = selection.isCollapsed();

  if (!new RegExp(REGEX_INTERNET).test(value)) return;

  if (isCollapsed) {
    setEditorState(RichStates.insertInline(editorState, value, 'insert-link'));
  } else {
    setEditorState(RichStates.toggleLink(editorState, value));
  }
};
