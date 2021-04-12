import { EditorState, AtomicBlockUtils } from 'draft-js';

/**
 * @description 插入原子块 一般用于图片 视频等
 * @param editorState
 * @param type
 * @param data
 */
export const insertAtomic = (editorState: any, type: string, data?: any) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    type,
    'IMMUTABLE',
    data
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, '📃');
};
