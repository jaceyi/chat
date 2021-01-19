import { EmojiInfo } from '@/components/Chat/Emoji';
import { insertInline } from './insertInline';

export const insertEmoji = (editorState, options: EmojiInfo) => {
  return insertInline(editorState, options.emoji + '\r', 'insert-emoji');
};
