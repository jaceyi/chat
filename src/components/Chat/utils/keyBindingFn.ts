import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const { hasCommandModifier } = KeyBindingUtil;

export type KeyTypes = 'enter' | 'prompt-link';

/**
 * @description 扩展快捷键
 * @param e
 */
export default (e: any): KeyTypes => {
  if (hasCommandModifier(e)) {
    switch (e.keyCode) {
      case 13:
        return 'enter';
      case 76:
        return 'prompt-link';
    }
  }

  return getDefaultKeyBinding(e);
};
