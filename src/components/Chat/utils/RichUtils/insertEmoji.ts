import { EditorState, Modifier } from 'draft-js';
import { EmojiInfo } from '@/components/Chat/Emoji';

export const insertEmoji = (editorState, options: EmojiInfo) => {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    'EMOJI',
    'MUTABLE',
    options
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let newContentState = Modifier.insertText(
    contentState,
    selection,
    options.alt,
    null,
    entityKey
  );

  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    ' '
  );

  return EditorState.push(editorState, newContentState, 'insert-link');
};
