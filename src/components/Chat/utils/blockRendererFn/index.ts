import { EditorState, SelectionState } from 'draft-js';
import Atomic, { AtomicProps } from './components/Atomic';
import { ChangeEditorState } from 'chatUtils/types';
import type { FunctionComponent, FocusEvent } from 'react';

export interface AtomicBlockProps {
  focusCurrentBlock: (e: FocusEvent<HTMLDivElement>) => void;
  focusNextLine: () => void;
}

export const bindBlockRendererFn = (
  editorState: any,
  onChange: ChangeEditorState
) => (
  block
): {
  component: FunctionComponent<AtomicProps>;
  editable: boolean;
  props: AtomicBlockProps;
} => {
  if (block.getType() === 'atomic') {
    return {
      component: Atomic,
      editable: false,
      props: {
        focusCurrentBlock: e => {
          const blockKey = block.getKey();

          const selection = window.getSelection()!;
          const range = document.createRange();
          range.setStart(e.target, 0);
          range.setEnd(e.target, 0);
          selection.removeAllRanges();
          selection.addRange(range);

          onChange(
            EditorState.forceSelection(
              editorState,
              new SelectionState({
                anchorKey: blockKey,
                anchorOffset: 0,
                focusKey: blockKey,
                focusOffset: 0,
                isBackward: false
              })
            )
          );
        },
        focusNextLine: () => {}
      }
    };
  }

  return null;
};
