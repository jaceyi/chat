import * as React from 'react';
import { ReactNode } from 'react';
import * as styles from './style.scss';
import store from 'store';
import { EditorState, SelectionState } from 'draft-js';

interface FocusProps {
  children: ReactNode;
  block: any;
}

const Focus = ({ children, block }: FocusProps) => {
  const handleFocus = e => {
    e.stopPropagation();
    const blockKey = block.getKey();

    store.focusBlockKey = blockKey;

    const node: HTMLInputElement = e.target;
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
          anchorKey: blockKey,
          anchorOffset: 0,
          focusKey: blockKey,
          focusOffset: 0,
          isBackward: false
        })
      )
    );
  };

  return (
    <div
      className={styles.focus}
      tabIndex={1}
      onFocus={handleFocus}
      onBlur={() => (store.focusBlockKey = null)}
    >
      {children}
    </div>
  );
};

export default React.memo(Focus);
