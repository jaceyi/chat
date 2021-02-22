import * as React from 'react';
import Message, { MessageInfo } from './Message';
import { UserInfo } from '@/App';
import * as styles from './style.scss';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  commitMessageList: MessageList;
  userInfo: UserInfo;
}

const MessageArea = ({
  userInfo,
  messageList,
  commitMessageList
}: MessageAreaProps) => {
  return (
    <div className={styles.container}>
      {/*这是自己要发送的消息队列*/}
      {commitMessageList.map(message => (
        <Message
          key={message.id}
          {...message}
          userInfo={userInfo}
          currentUserInfo={userInfo}
        />
      ))}
      {messageList.map(message => (
        <Message key={message.id} {...message} currentUserInfo={userInfo} />
      ))}
    </div>
  );
};

export default MessageArea;
