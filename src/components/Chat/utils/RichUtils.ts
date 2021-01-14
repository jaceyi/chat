import { EditorState, RichUtils } from 'draft-js';

export default {
  ...RichUtils,

  promptLink(editorState, options: object) {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        options
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity
      });

      return RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      );
    }
  }
};
