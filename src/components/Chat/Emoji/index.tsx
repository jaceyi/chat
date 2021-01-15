import * as React from 'react';
import RCTooltip from 'rc-tooltip';
import * as styles from './style.scss';
import { useEffect, useRef } from 'react';

declare const twemoji: any;

const Emoji = () => {
  const imgBoxRef = useRef(null);

  useEffect(() => {
    imgBoxRef.current && twemoji.parse(imgBoxRef.current);
  }, []);

  return (
    <RCTooltip
      overlayClassName={styles.container}
      placement="topRight"
      trigger={['click']}
      defaultVisible={true}
      overlay={
        <div ref={imgBoxRef} className={styles.box}>
          😀😁🤣😂😄😅😆😉😊☺️😋😍😘😜😝🤓😎🤗🤡😑😒🙄🤔😳😠😡😣😖😫😤😱😨😰😥😪😓🤤😭🤥🤢🤧🤐😷🤒🤕😴😵😬💩😈💀👻👄👅👀👦👧👩👱👴👵👮🐶🐭🐻🐯🦁🐮🐷🐸🐵🐔
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
