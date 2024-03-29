import * as React from 'react';
import { useMemo } from 'react';
import type { ReactNode, FC } from 'react';
import * as styles from './style.module.scss';
import { getEmojiSrc } from '@/utils';
import { Mutability } from 'chatUtils/types';

export const EmojiEntityType = 'EMOJI';
export const EmojiMutability: Mutability = 'IMMUTABLE';

interface EmojiProps {
  contentState: any;
  entityKey: string;
  offsetKey: string;
  children: ReactNode;
}

const Emoji: FC<EmojiProps> = ({
  contentState,
  entityKey,
  offsetKey,
  children
}) => {
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

export default React.memo(Emoji);
