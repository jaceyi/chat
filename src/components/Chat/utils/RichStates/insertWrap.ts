import { EditorState, Modifier } from 'draft-js';
import { WrapBlockType } from '@/components/Chat/utils';

/**
 * @description 换行
 * @param editorState
 */
export const insertWrap = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let newContentState = Modifier.splitBlock(contentState, selection);

  const blockKey = selection.getFocusKey();
  const blocks = newContentState.getBlockMap();
  const block = newContentState.getBlockAfter(blockKey);

  newContentState = newContentState.set(
    'blockMap',
    blocks.set(
      block.getKey(),
      block.merge({
        type: WrapBlockType
      })
    )
  );

  return EditorState.push(editorState, newContentState, 'insert-wrap');
};
