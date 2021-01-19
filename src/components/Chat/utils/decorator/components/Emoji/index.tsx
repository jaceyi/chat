import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import * as styles from './style.scss';
import { getEmojiSrc } from '@/utils';

export const EmojiName = 'EMOJI';
export const EmojiMutability = 'IMMUTABLE';

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
      {children}
    </span>
  );
};

export default Emoji;
