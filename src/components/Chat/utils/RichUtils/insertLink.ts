import { EditorState, RichUtils, Modifier } from 'draft-js';

export const insertLink = (editorState, options) => {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    'LINK',
    'MUTABLE',
    options
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  if (selection.isCollapsed()) {
    let newContentState = Modifier.insertText(
      contentState,
      selection,
      options.url,
      null,
      entityKey
    );

    return EditorState.push(editorState, newContentState, 'insert-link');
  } else {
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    return RichUtils.toggleLink(newEditorState, selection, entityKey);
  }
};
