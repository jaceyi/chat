import * as React from 'react';
import { ReactNode } from 'react';
import * as styles from './style.scss';

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
  const { src } = contentState.getEntity(entityKey).getData();
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
