import { EditorState, genKey, Modifier, ContentBlock } from 'draft-js';
import * as Immutable from 'immutable';

/**
 * @description 换行
 * @param editorState
 */
export const insertWrap = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newBlockKey = genKey();
  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: 'unstyled',
    text: '',
    characterList: Immutable.List()
  });

  const blocks = contentState.getBlockMap();
  const targetKey = selection.getStartKey();
  const block = contentState.getBlockForKey(targetKey);

  let newContentState;
  if (block.getType() === 'atomic') {
    newContentState = contentState.merge({
      blockMap: blocks.set(newBlockKey, newBlock),
      selectionBefore: selection,
      selectionAfter: selection.merge({
        anchorKey: newBlock.getKey(),
        anchorOffset: newBlock.getLength(),
        focusKey: newBlock.getKey(),
        focusOffset: newBlock.getLength(),
        isBackward: false,
        hasFocus: true
      })
    });
  } else {
    newContentState = Modifier.splitBlock(contentState, selection);
  }

  return EditorState.push(editorState, newContentState, 'insert-fragment');
};
