import { EditorState, Modifier } from 'draft-js';

interface InsertLinkOption {
  url: string;
  text: string;
}

export const insertLink = (editorState, options: InsertLinkOption) => {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    'LINK',
    'MUTABLE',
    options
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let newContentState = Modifier.insertText(
    contentState,
    selection,
    options.text,
    null,
    entityKey
  );

  return EditorState.push(editorState, newContentState, 'insert-link');
};
