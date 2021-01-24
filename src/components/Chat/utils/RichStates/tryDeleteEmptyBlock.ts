import { EditorState } from 'draft-js';
import { WrapBlockType } from 'chatUtils';

/**
 * @description 当前删除块无内容时，尝试将前面某些块也删除。
 * @param editorState
 * @param setEditorState
 */
export const tryDeleteEmptyBlock = (editorState, setEditorState): string => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) return;
  const blockKey = selection.getFocusKey();
  const block = contentState.getBlockForKey(blockKey);
  // 当前删除块为空
  if (block.getLength()) return;

  const beforeBlock = contentState.getBlockBefore(blockKey);
  const beforeType = beforeBlock?.getType();
  // 该块前面的块是 用于换行的或者原子都一起删除
  if (!(beforeType === WrapBlockType || beforeType === 'atomic')) return;

  const newContentState = contentState.set(
    'blockMap',
    contentState.getBlockMap().delete(beforeBlock.getKey()).delete(blockKey)
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'remove-empty-block'
  );
  setEditorState(newEditorState);
  return 'handled';
};
