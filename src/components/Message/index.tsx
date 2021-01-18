import * as React from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import { CURRENT_USER_ID } from './mock';
import * as styles from './style.scss';

interface MessageProps {
  content: string;
  timeStamp: string;
  msgId: string;
  userInfo: {
    name: string;
    id: string;
  };
}

interface MessageWrapperProps {
  message: MessageProps;
}

interface MessageAreaProps {
  messageList: MessageProps[];
}

const Message = ({ message }: MessageWrapperProps) => {
  const { userInfo, content, timeStamp } = message;
  const { id, name } = userInfo;
  const position = id === CURRENT_USER_ID ? 'right' : 'left';
  return (
    <div className={styles['msg-row']}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div>
          <div className={styles['name']}>{name}</div>
          <div className={styles['bubble']}>{content}</div>
        </div>
      </div>
    </div>
  );
};

const MessageArea = ({ messageList }: MessageAreaProps) => {
  const [{ y }, set] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ last, movement: [, my] }) => {
      set({ y: last ? 0 : my, immediate: true });
    },
    {
      initial: () => [0, 0],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true
    }
  );

  return (
    <animated.div
      className={styles['message-area']}
      {...bind()}
      style={{
        transform: y.interpolate(y => `translate3d(0px, ${y}px, 0px)`)
      }}
    >
      {messageList.map(message => (
        <Message key={message.msgId} message={message} />
      ))}
    </animated.div>
  );
};

export default MessageArea;
