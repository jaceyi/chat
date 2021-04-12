import { EditorState, SelectionState } from 'draft-js';

/**
 * @description 输入时判断当前是否选中原子块，是的话就直接删除该原子块
 * @param editorState
 * @param setEditorState
 */
export const tryDeleteAtomicBlock = (
  editorState: any,
  setEditorState: any
): boolean | void => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) return;
  const blockKey = selection.getFocusKey();
  const block = contentState.getBlockForKey(blockKey);

  const blockType = block.getType();

  if (blockType === 'atomic') {
    const beforeBlock = contentState.getBlockBefore(blockKey);
    const beforeBlockKey = beforeBlock?.getKey();
    const blocks = contentState.getBlockMap();
    if (blocks.length === 1) return;
    const newContentState = contentState.set(
      'blockMap',
      blocks.delete(blockKey)
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'delete-atomic-block'
    );
    const blockLength = beforeBlock.getLength();

    setEditorState(
      EditorState.forceSelection(
        newEditorState,
        new SelectionState({
          anchorKey: beforeBlockKey,
          anchorOffset: blockLength,
          focusKey: beforeBlockKey,
          focusOffset: blockLength,
          isBackward: false
        })
      )
    );
  }
  return false;
};
