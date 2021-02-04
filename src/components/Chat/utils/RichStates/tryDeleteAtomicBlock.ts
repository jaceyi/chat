import { EditorState, SelectionState } from 'draft-js';
import { WrapBlockType } from '@/components/Chat/utils';

/**
 * @description 删除时判断当前要删除的是否原子块，如果是直接删除，不走默认操作
 * @param editorState
 * @param setEditorState
 */
export const tryDeleteAtomicBlock = (editorState, setEditorState): string => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) return;
  const blockKey = selection.getFocusKey();
  const block = contentState.getBlockForKey(blockKey);

  const beforeBlock = contentState.getBlockBefore(blockKey);
  const beforeBlockKey = beforeBlock?.getKey();
  const blockType = block.getType();

  if (blockType === 'atomic' || blockType === WrapBlockType) {
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
    return 'handled';
  }
};
