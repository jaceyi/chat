import * as React from 'react';
import Message, { MessageInfo } from './Message';
import { UserInfo } from '@/App';
import * as styles from './style.scss';
import Loading from '@/components/Loading';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  userInfo: UserInfo;
  loading: boolean;
}

const MessageArea = ({ userInfo, messageList, loading }: MessageAreaProps) => {
  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        messageList.map(message => (
          <Message key={message.id} {...message} currentUserInfo={userInfo} />
        ))
      )}
    </div>
  );
};

export default React.memo(MessageArea);
