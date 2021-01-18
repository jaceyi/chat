import { EditorState, Modifier } from 'draft-js';
import { EmojiInfo } from '@/components/Chat/Emoji';

export const insertEmoji = (editorState, options: EmojiInfo) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const newContentState = Modifier.replaceText(
    contentState,
    selection,
    options.emoji + '\r',
    null
  );

  return EditorState.push(editorState, newContentState, 'insert-emoji');
};
