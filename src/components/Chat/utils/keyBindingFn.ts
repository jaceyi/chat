import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const { hasCommandModifier } = KeyBindingUtil;

export type KeyTypes = 'enter' | 'prompt-link';

/**
 * @description 扩展快捷键
 * @param e
 */
export const keyBindingFn = (e: any): KeyTypes => {
  if (hasCommandModifier(e)) {
    switch (e.keyCode) {
      case 13: // 回车
        return 'enter';
      case 76: // ctrl/command + l
        return 'prompt-link';
    }
  }

  return getDefaultKeyBinding(e);
};
