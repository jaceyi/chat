import * as React from 'react';
import RCTooltip from 'rc-tooltip';
import * as styles from './style.scss';
import { useEffect, useState } from 'react';
import emojis from './emojis';
import { getEmojiSrc, connector } from '@/utils';

interface EmojiProps {
  onSelect: (src: EmojiInfo) => void;
}

export interface EmojiInfo {
  src: string;
  emoji: string;
}

const Emoji = ({ onSelect }: EmojiProps) => {
  const [emojiList, setEmojiList] = useState<EmojiInfo[]>([]);

  useEffect(() => {
    const emojiList = [];
    emojis.forEach(emoji => {
      const src = getEmojiSrc(emoji);
      const img = document.createElement('img');
      img.src = src;
      emojiList.push({
        src,
        emoji
      });
    });
    setEmojiList(emojiList);
  }, []);

  const handleClickEmoji = ([item]) => {
    onSelect(item);
  };

  return (
    <RCTooltip
      overlayClassName={styles.container}
      placement="topRight"
      trigger={['click']}
      overlay={
        <div className={styles.box}>
          {emojiList.map(item => (
            <div
              onClick={connector(handleClickEmoji)(item)}
              key={item.src}
              className={styles.emoji}
            >
              <img src={item.src} alt={item.emoji} />
            </div>
          ))}
        </div>
      }
    >
      <div className={styles.icon}>
        <img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f60b.png" alt="" />
      </div>
    </RCTooltip>
  );
};

export default Emoji;
