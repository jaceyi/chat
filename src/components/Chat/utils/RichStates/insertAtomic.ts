import { EditorState, AtomicBlockUtils } from 'draft-js';

export const insertAtomic = (editorState, type, data?: any) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const activeBlock = contentState.getBlockForKey(selection.getFocusKey());
  const contentLength = activeBlock.getLength();
  const contentStateWithEntity = contentState.createEntity(
    type,
    'IMMUTABLE',
    data
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  let newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity
  });
  newEditorState = AtomicBlockUtils.insertAtomicBlock(
    newEditorState,
    entityKey,
    ' '
  );

  if (contentLength) {
    // 原本块有内容 直接新增一个块
    return newEditorState;
  } else {
    // 原本块无内容 新增一个图片块 并删除掉之前的块
    let newContentState = newEditorState.getCurrentContent();
    newContentState = newContentState.set(
      'blockMap',
      newContentState.getBlockMap().delete(activeBlock.key)
    );

    return EditorState.push(editorState, newContentState, 'insert-image');
  }
};
