import * as React from 'react';
import Message, { MessageInfo } from './Message';
import { UserInfo } from '@/App';
import * as styles from './style.scss';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  userInfo: UserInfo;
}

const MessageArea = ({ userInfo, messageList }: MessageAreaProps) => {
  return (
    <div className={styles.container}>
      {messageList.map(message => (
        <Message key={message.id} {...message} currentUserInfo={userInfo} />
      ))}
    </div>
  );
};

export default React.memo(MessageArea);
