import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { ChangeEditorState } from 'chatUtils/types';
import { tryDeleteAtomicBlock } from 'chatUtils/RichStates';

const { hasCommandModifier, isCtrlKeyCommand } = KeyBindingUtil;

export type KeyTypes =
  | 'enter'
  | 'prompt-link'
  | 'submit'
  | 'backspace'
  | 'up'
  | 'down';

/**
 * @description 扩展快捷键
 */
export const bindKeyBindingFn = (
  editorState: any,
  onChange: ChangeEditorState
) => {
  return (e: KeyboardEvent): KeyTypes => {
    if (e.key.length === 1) {
      // 输入字符 除了输入字符 其他 ctrl shift 之类的都是多个字母的单词
      tryDeleteAtomicBlock(editorState, onChange);
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
      case 'Backspace':
        return 'backspace';
      case 'Enter': // enter
        if (e.shiftKey) {
          return 'enter'; // shift + enter
        }
        return 'submit';
      case 'ArrowUp':
        return 'up';
      case 'ArrowDown':
        return 'down';
    }

    return getDefaultKeyBinding(e);
  };
};
