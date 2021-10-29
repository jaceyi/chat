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
) => {
  return (
    block: any
  ): {
    component: FunctionComponent<AtomicProps>;
    editable: boolean;
    props: AtomicBlockProps;
  } | null => {
    if (block.getType() === 'atomic') {
      return {
        component: Atomic,
        editable: false,
        props: {
          focusCurrentBlock: e => {
            // 聚焦当前块的内容
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
          focusNextLine: () => {
            // 点击块空白地方时聚焦下一行
            const blockKey = block.getKey();
            const contentState = editorState.getCurrentContent();
            const afterBlock = contentState.getBlockAfter(blockKey);
            if (!afterBlock) return;
            const afterBlockKey = afterBlock.getKey();

            onChange(
              EditorState.forceSelection(
                editorState,
                new SelectionState({
                  anchorKey: afterBlockKey,
                  anchorOffset: 0,
                  focusKey: afterBlockKey,
                  focusOffset: 0,
                  isBackward: false
                })
              )
            );
          }
        }
      };
    }

    return null;
  };
};
