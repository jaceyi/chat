import { EditorState, Modifier } from 'draft-js';

export const insertInline = (
  editorState,
  text: string,
  type: string = 'insert-text'
) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const newContentState = Modifier.replaceText(
    contentState,
    selection,
    text,
    null
  );

  return EditorState.push(editorState, newContentState, type);
};
