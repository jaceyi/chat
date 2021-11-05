import * as React from 'react';
import Message, { MessageInfo } from './Message';
import * as styles from './style.module.scss';
import Loading from './Loading';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  loading: boolean;
}

const MessageArea = ({ messageList, loading }: MessageAreaProps) => {
  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        messageList.map(message => <Message key={message.id} {...message} />)
      )}
    </div>
  );
};

export default React.memo(MessageArea);
