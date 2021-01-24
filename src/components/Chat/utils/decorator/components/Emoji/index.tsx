import * as React from 'react';
import { SelectionState, EditorState } from 'draft-js';
import { ReactNode, useMemo } from 'react';
import * as styles from './style.scss';
import { getEmojiSrc } from '@/utils';
import { Mutability } from 'chatUtils/types';
import store from 'store';

export const EmojiName = 'EMOJI';
export const EmojiMutability: Mutability = 'IMMUTABLE';

interface EmojiProps {
  contentState: any;
  entityKey: string;
  offsetKey: string;
  children: ReactNode;
  blockKey: string;
  start: number;
  end: number;
}

const Emoji = ({
  contentState,
  entityKey,
  offsetKey,
  children,
  blockKey,
  start,
  end
}: EmojiProps) => {
  const src = useMemo(() => {
    const { emojiText } = contentState.getEntity(entityKey).getData();
    return getEmojiSrc(emojiText);
  }, [contentState]);

  return (
    <span
      tabIndex={0}
      onFocus={e => {
        const selection = window.getSelection();
        const range = document.createRange();

        range.setStart(e.target, 0);
        range.setEnd(e.target, 1);
        selection.removeAllRanges();
        selection.addRange(range);

        const editorState = store.getEditorState();

        store.setEditorState(
          EditorState.forceSelection(
            editorState,
            new SelectionState({
              anchorKey: blockKey,
              anchorOffset: start,
              focusKey: blockKey,
              focusOffset: end,
              isBackward: false
            })
          )
        );
      }}
      onBlur={() => console.log('blur')}
      data-offset-key={offsetKey}
      style={{
        backgroundImage: `url(${src})`
      }}
      className={`editor-emoji ${styles.emoji}`}
    >
      <span className={styles.inner}>{children}</span>
    </span>
  );
};

export default Emoji;
