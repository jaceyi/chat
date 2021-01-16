import * as React from 'react';
import { MESSAGE_LIST, CURRENT_USER_ID } from './mock';
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
  messageList?: [MessageProps];
}

const Message = ({ message }: MessageWrapperProps) => {
  const { userInfo, content, timeStamp } = message;
  const { id, name } = userInfo;
  const positon = id === CURRENT_USER_ID ? 'right' : 'left';
  return (
    <div className={styles['msg-row']}>
      <div className={styles[`msg-wrapper-${positon}`]}>
        <div>
          <div className={styles['name']}>{name}</div>
          <div className={styles['bubble']}>{content}</div>
        </div>
      </div>
    </div>
  );
};

const MessageArea = ({ messageList }: MessageAreaProps) => {
  messageList = messageList || MESSAGE_LIST;

  return (
    <div className={styles['message-area']}>
      {messageList.map(message => (
        <Message key={message.msgId} message={message} />
      ))}
    </div>
  );
};

export default MessageArea;
