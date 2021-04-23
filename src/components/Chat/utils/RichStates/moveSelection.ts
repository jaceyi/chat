import { EditorState, SelectionState } from 'draft-js';

const focusBlock = (
  editorState: any,
  eventName: 'getKeyBefore' | 'getKeyAfter'
) => {
  const selection = editorState.getSelection();
  let anchorOffset = selection.getAnchorOffset();
  let focusOffset = selection.getFocusOffset();
  const activeKey = selection.getFocusKey();
  const contentState = editorState.getCurrentContent();
  const key = contentState[eventName](activeKey);
  if (!key) return editorState;
  const block = contentState.getBlockForKey(key);
  const blockLength = block.getLength();
  if (anchorOffset > blockLength) {
    anchorOffset = blockLength;
  }
  if (focusOffset > blockLength) {
    focusOffset = blockLength;
  }
  return EditorState.forceSelection(
    editorState,
    new SelectionState({
      anchorKey: key,
      anchorOffset,
      focusKey: key,
      focusOffset,
      isBackward: false
    })
  );
};

// 选中上一个块
export const focusBeforeBlock = (editorState: any) => {
  return focusBlock(editorState, 'getKeyBefore');
};

// 选中下一个块
export const focusAfterBlock = (editorState: any) => {
  return focusBlock(editorState, 'getKeyAfter');
};
