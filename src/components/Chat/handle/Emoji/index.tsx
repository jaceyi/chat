import * as React from 'react';
import RCTooltip from 'rc-tooltip';
import { useEffect, useState } from 'react';
import emojis from './emojis';
import { getEmojiSrc } from '@/utils';

import 'rc-tooltip/assets/bootstrap_white.css';
import * as styles from './style.module.scss';

export interface EmojiInfo {
  src: string;
  emoji: string;
}

interface EmojiProps {
  onSelect: (emoji: EmojiInfo) => void;
}

const Emoji = ({ onSelect }: EmojiProps) => {
  const [emojiList, setEmojiList] = useState<EmojiInfo[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const emojiList: EmojiInfo[] = [];
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

  const handleClickEmoji = (item: EmojiInfo) => () => {
    onSelect(item);
    setVisible(false);
  };

  return (
    <RCTooltip
      overlayClassName={styles.container}
      placement="topRight"
      trigger={['hover']}
      visible={visible}
      onVisibleChange={setVisible}
      destroyTooltipOnHide
      overlay={
        <div className={styles.box}>
          {emojiList.map(item => (
            <div
              onClick={handleClickEmoji(item)}
              key={item.src}
              className={styles.emoji}
            >
              <img src={item.src} alt={item.emoji} />
            </div>
          ))}
        </div>
      }
    >
      <img
        src="https://twemoji.maxcdn.com/v/latest/72x72/1f60b.png"
        alt=""
      />
    </RCTooltip>
  );
};

export default React.memo(Emoji);
