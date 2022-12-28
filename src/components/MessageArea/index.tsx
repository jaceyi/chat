import * as React from 'react';
import type { FC } from 'react';
import Message, { MessageInfo } from './Message';
import * as styles from './style.module.scss';
import Loading from './Loading';
import { Virtuoso } from 'react-virtuoso';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  loading: boolean;
}

const MessageArea: FC<MessageAreaProps> = ({ messageList, loading }) => {
  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <Virtuoso
          initialTopMostItemIndex={messageList.length - 1}
          data={messageList}
          overscan={500}
          itemContent={(index, message) => {
            return <Message key={message.id} {...message} />;
          }}
        />
      )}
    </div>
  );
};

export default React.memo(MessageArea);
