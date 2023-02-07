import type { ComponentType, FC, FocusEvent } from 'react';
import type { AtomicBlockProps, AtomicProps } from '../Atomic';
import * as React from 'react';
import { EditorState, SelectionState } from 'draft-js';
import { stopPropagation } from '@/utils';
import * as styles from './style.module.scss';

interface FocusProps extends AtomicProps {
  block: any;
  blockProps: AtomicBlockProps;
  data?: object;
}

const Focus = (WrappedComponent: ComponentType<any>): FC<FocusProps> => {
  return props => {
    const { block, blockProps } = props;
    const editor = blockProps.store?.editor?.props;
    const focusCurrentBlock = (e: FocusEvent) => {
      if (!editor) return;

      // 聚焦当前块的内容
      const blockKey = block.getKey();

      const selection = window.getSelection()!;
      const range = document.createRange();
      range.setStart(e.target, 0);
      range.setEnd(e.target, 0);
      selection.removeAllRanges();
      selection.addRange(range);

      editor.onChange(
        EditorState.forceSelection(
          editor.editorState,
          new SelectionState({
            anchorKey: blockKey,
            anchorOffset: 0,
            focusKey: blockKey,
            focusOffset: 0,
            isBackward: false
          })
        )
      );
    };
    const focusNextLine = () => {
      if (!editor) return;

      // 点击块空白地方时聚焦下一行
      const blockKey = block.getKey();
      const contentState = editor.editorState.getCurrentContent();
      const afterBlock = contentState.getBlockAfter(blockKey);
      if (!afterBlock) return;
      const afterBlockKey = afterBlock.getKey();

      editor.onChange(
        EditorState.forceSelection(
          editor.editorState,
          new SelectionState({
            anchorKey: afterBlockKey,
            anchorOffset: 0,
            focusKey: afterBlockKey,
            focusOffset: 0,
            isBackward: false
          })
        )
      );
    };

    return (
      <div className={styles.line} onClick={focusNextLine}>
        <div onClick={stopPropagation} className={styles.focus} tabIndex={0} onFocus={focusCurrentBlock}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default Focus;
