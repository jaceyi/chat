import { EditorState, Modifier } from 'draft-js';

/**
 * @description 插入文字 Emoji 等
 * @param editorState
 * @param text
 * @param type
 * @param insertSpace 是否需要在之后插入一个空格
 */
export const insertInline = (
  editorState: any,
  text: string,
  type: string = 'insert-text',
  insertSpace?: boolean
) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  let newContentState = Modifier.replaceText(contentState, selection, text);

  if (insertSpace) {
    newContentState = Modifier.insertText(
      newContentState,
      newContentState.getSelectionAfter(),
      ' '
    );
  }

  return EditorState.push(editorState, newContentState, type);
};
