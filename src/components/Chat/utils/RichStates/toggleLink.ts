import { EditorState, RichUtils } from 'draft-js';
import { LinkName, LinkMutability } from 'chatUtils/decorator/components/Link';

export const toggleLink = (editorState, url: string) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    LinkName,
    LinkMutability,
    { url }
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
