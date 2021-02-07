import { EditorState, Modifier, SelectionState } from 'draft-js';
import { WrapBlockType } from '@/components/Chat/utils';

/**
 * @description 换行
 * @param editorState
 */
export const insertWrap = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let newContentState = Modifier.splitBlock(contentState, selection);

  const blockKey = selection.getFocusKey();
  const blocks = newContentState.getBlockMap();
  const afterBlock = newContentState.getBlockAfter(blockKey);
  const afterBlockKey = afterBlock.getKey();

  newContentState = newContentState.set(
    'blockMap',
    blocks.set(
      afterBlockKey,
      afterBlock.merge({
        type: WrapBlockType
      })
    )
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-wrap'
  );

  // 强制将光标聚焦到换行后的DIV
  return EditorState.forceSelection(
    newEditorState,
    new SelectionState({
      anchorKey: afterBlockKey,
      anchorOffset: 0,
      focusKey: afterBlockKey,
      focusOffset: 0,
      isBackward: false
    })
  );
};
