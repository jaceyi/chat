import { EditorState, genKey, ContentBlock } from 'draft-js';
import { BrRowType } from 'chatUtils/blockRenderMap/components/BrRow';

export const insertBrRow = editorState => {
  const contentState = editorState.getCurrentContent();
  const blockKey = genKey();
  const newContentState = contentState.set(
    'blockMap',
    contentState.getBlockMap().set(
      blockKey,
      new ContentBlock({
        type: BrRowType,
        key: blockKey
      })
    )
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-br-row'
  );

  return EditorState.moveFocusToEnd(newEditorState);
};
