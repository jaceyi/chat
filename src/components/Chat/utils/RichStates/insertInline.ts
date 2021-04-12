import { EditorState, Modifier } from 'draft-js';

/**
 * @description 插入文字 Emoji 等
 * @param editorState
 * @param text
 * @param type
 */
export const insertInline = (
  editorState: any,
  text: string,
  type: string = 'insert-text'
) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const newContentState = Modifier.replaceText(contentState, selection, text);

  return EditorState.push(editorState, newContentState, type);
};
