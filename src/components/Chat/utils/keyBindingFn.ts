import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const {
  hasCommandModifier,
  isCtrlKeyCommand,
  isOptionKeyCommand
} = KeyBindingUtil;

export type KeyTypes =
  | 'enter'
  | 'enter-inline'
  | 'prompt-link'
  | 'submit'
  | 'backspace';

/**
 * @description 扩展快捷键
 * @param e
 */
export const keyBindingFn = (e: any): KeyTypes => {
  if (isOptionKeyCommand(e) && e.keyCode === 13) {
    switch (e.keyCode) {
      case 13: // alt/option + enter
        return 'enter-inline';
    }
  }

  if (hasCommandModifier(e) || isCtrlKeyCommand(e)) {
    switch (e.keyCode) {
      case 13: // ctrl/command + enter
        return 'enter';
      case 76: // ctrl/command + l
        return 'prompt-link';
    }
  }

  switch (e.keyCode) {
    case 8:
      return 'backspace';
    case 13: // 回车
      return 'submit';
  }

  return getDefaultKeyBinding(e);
};
