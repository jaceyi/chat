import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const { hasCommandModifier } = KeyBindingUtil;

export type KeyTypes = 'enter' | 'prompt-link';

/**
 * @description 扩展快捷键
 * @param e
 */
export default (e: any): KeyTypes => {
  if (e.keyCode === 13 && hasCommandModifier(e)) {
    return 'enter';
  }

  if (e.keyCode === 76 && hasCommandModifier(e)) {
    return 'prompt-link';
  }

  return getDefaultKeyBinding(e);
};
