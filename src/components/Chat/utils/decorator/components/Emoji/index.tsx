import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import * as styles from './style.scss';
import { getEmojiSrc } from '@/utils';
import { Mutability } from 'chatUtils/types';

export const EmojiName = 'EMOJI';
export const EmojiMutability: Mutability = 'IMMUTABLE';

interface EmojiProps {
  contentState: any;
  entityKey: string;
  offsetKey: string;
  children: ReactNode;
}

const Emoji = ({
  contentState,
  entityKey,
  offsetKey,
  children
}: EmojiProps) => {
  const src = useMemo(() => {
    const { emojiText } = contentState.getEntity(entityKey).getData();
    return getEmojiSrc(emojiText);
  }, [contentState]);

  return (
    <span
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
