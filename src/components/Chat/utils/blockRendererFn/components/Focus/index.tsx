import * as React from 'react';
import { ReactNode, useRef } from 'react';
import * as styles from './style.scss';
import store from 'store';
import { EditorState, SelectionState } from 'draft-js';

interface FocusProps {
  children: ReactNode;
  block: any;
}

const Focus = ({ children, block }: FocusProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const focusBlock = () => {
    const node = ref.current;
    ref.current.focus();
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 0);
    selection.removeAllRanges();
    selection.addRange(range);

    store.setEditorState(
      EditorState.forceSelection(
        store.getEditorState(),
        new SelectionState({
          anchorKey: block.getKey(),
          anchorOffset: 0,
          focusKey: block.getKey(),
          focusOffset: 0,
          isBackward: false
        })
      )
    );
  };

  const handleFocus = () => {
    // 这里延迟从 editor 上抢回 focus
    setTimeout(focusBlock);
  };

  return (
    <div
      className={styles.focus}
      ref={ref}
      tabIndex={1}
      onClick={handleFocus}
      onFocus={handleFocus}
    >
      {children}
    </div>
  );
};

export default Focus;
