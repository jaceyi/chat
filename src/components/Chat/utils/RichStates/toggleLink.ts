import { EditorState, RichUtils } from 'draft-js';

interface ToggleLinkOption {
  url: string;
}

export const toggleLink = (editorState, options: ToggleLinkOption) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    'LINK',
    'MUTABLE',
    options
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  if (!selection.isCollapsed()) {
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    return RichUtils.toggleLink(newEditorState, selection, entityKey);
  }

  return editorState;
};
