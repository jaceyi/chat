import * as React from 'react';
import RCTooltip from 'rc-tooltip';
import * as styles from './style.scss';
import { useEffect, useState } from 'react';
import emojis from './emojis';

export interface EmojiInfo {
  src: string;
  alt: string;
}

interface EmojiProps {
  onSelect: (src: EmojiInfo) => void;
}

const Emoji = ({ onSelect }: EmojiProps) => {
  const [contentHTML, setContentHTML] = useState('');

  useEffect(() => {
    const box = document.createElement('div');
    emojis.forEach(emoji => {
      const div = document.createElement('div');
      div.textContent = emoji;
      div.className = styles.emoji;
      box.appendChild(div);
    });
    twemoji.parse(box);
    setContentHTML(box.innerHTML);
  }, []);

  const handleClickBox = e => {
    const { nodeName, src, alt } = e.target;
    if (nodeName === 'IMG') {
      onSelect({
        src,
        alt
      });
    }
  };

  return (
    <RCTooltip
      overlayClassName={styles.container}
      placement="topRight"
      trigger={['click']}
      overlay={
        <div
          onClick={handleClickBox}
          className={styles.box}
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        />
      }
    >
      <div className={styles.icon}>
        <img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f60b.png" alt="" />
      </div>
    </RCTooltip>
  );
};

export default Emoji;
