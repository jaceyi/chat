import { EditorState, RichUtils } from 'draft-js';
import {
  LinkEntityType,
  LinkMutability
} from 'chatUtils/decorator/components/Link';

/**
 * @description 将选中内容转为链接
 * @param editorState
 * @param url
 */
export const toggleLink = (editorState, url: string) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    LinkEntityType,
    LinkMutability,
    { url, toggle: true }
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
