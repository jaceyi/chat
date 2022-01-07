import { EditorState, SelectionState } from 'draft-js';
import Atomic, { AtomicProps } from './components/Atomic';
import { SetEditorState } from 'chatUtils/types';
import type { FunctionComponent, FocusEvent } from 'react';

export declare namespace ViewerImage {
  interface data {
    src: string;
    name: string;
  }

  interface onViewerImage {
    (viewerImageData: data): void;
  }
}

export interface AtomicBlockProps {
  focusCurrentBlock(e: FocusEvent<HTMLDivElement>): void;
  focusNextLine(): void;
  viewerImage(data: ViewerImage.data): void;
}

export const bindBlockRendererFn = ({
  editorState,
  setEditorState,
  onViewerImage
}: {
  editorState?: any;
  setEditorState?: SetEditorState;
  onViewerImage?: ViewerImage.onViewerImage;
}) => {
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
          focusCurrentBlock(e) {
            if (!editorState || !setEditorState) return;

            // 聚焦当前块的内容
            const blockKey = block.getKey();

            const selection = window.getSelection()!;
            const range = document.createRange();
            range.setStart(e.target, 0);
            range.setEnd(e.target, 0);
            selection.removeAllRanges();
            selection.addRange(range);

            setEditorState(
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
          focusNextLine() {
            if (!editorState || !setEditorState) return;

            // 点击块空白地方时聚焦下一行
            const blockKey = block.getKey();
            const contentState = editorState.getCurrentContent();
            const afterBlock = contentState.getBlockAfter(blockKey);
            if (!afterBlock) return;
            const afterBlockKey = afterBlock.getKey();

            setEditorState(
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
          },
          viewerImage(data) {
            onViewerImage?.(data);
          }
        }
      };
    }

    return null;
  };
};
