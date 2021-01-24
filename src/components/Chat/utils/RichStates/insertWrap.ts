import { EditorState, genKey, ContentBlock } from 'draft-js';
import { WrapBlockType } from 'chatUtils';

/**
 * @description 另起一行 插入块
 * @param editorState
 */
export const insertWrap = editorState => {
  const contentState = editorState.getCurrentContent();
  const wrapKey = genKey();
  const blockKey = genKey();
  const newContentState = contentState.set(
    'blockMap',
    contentState
      .getBlockMap()
      .set(
        wrapKey,
        new ContentBlock({
          type: WrapBlockType,
          key: wrapKey
        })
      )
      .set(
        blockKey,
        new ContentBlock({
          key: blockKey
        })
      )
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-nowrap'
  );

  return EditorState.moveFocusToEnd(newEditorState);
};
