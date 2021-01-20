import { EditorState, AtomicBlockUtils } from 'draft-js';

export const insertAtomic = (editorState, type, data?: any) => {
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

  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
};
