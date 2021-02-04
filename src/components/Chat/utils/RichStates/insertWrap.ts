import { EditorState, Modifier } from 'draft-js';

/**
 * @description 换行
 * @param editorState
 */
export const insertWrap = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newContentState = Modifier.splitBlock(contentState, selection);

  return EditorState.push(editorState, newContentState, 'insert-wrap');
};
