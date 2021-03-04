import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { ChangeEditorState } from 'chatUtils/types';
import { tryDeleteAtomicBlock } from 'chatUtils/RichStates';

const { hasCommandModifier, isCtrlKeyCommand } = KeyBindingUtil;

export type KeyTypes = 'enter' | 'prompt-link' | 'submit';

/**
 * @description 扩展快捷键
 */
export const bindKeyBindingFn = (
  editorState: any,
  onChange: ChangeEditorState
) => (e: KeyboardEvent): KeyTypes => {
  if (e.key.length === 1) {
    const handled = tryDeleteAtomicBlock(editorState, onChange);
    if (handled) {
      return;
    }
  }
  if (hasCommandModifier(e) || isCtrlKeyCommand(e)) {
    switch (e.key) {
      case 'Enter': // ctrl/command + enter
        return 'enter';
      case 'l': // ctrl/command + l
        return 'prompt-link';
    }
  }

  switch (e.key) {
    case 'Enter': // enter
      if (e.shiftKey) {
        return 'enter'; // shift + enter
      }
      return 'submit';
  }

  return getDefaultKeyBinding(e);
};
