import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import Message, { MessageList } from './components/MessageArea';
import { useCallback, useEffect, useState, useRef } from 'react';
import * as styles from './App.scss';
import { ImageBlockType } from 'chatUtils/blockRendererFn/components/Image';
import { uploadFile } from '@/services/uploadFile';
import { getRandomId } from '@/utils';
import * as day from 'dayjs';

export interface UserInfo {
  name: string;
  id: string;
}

const App = () => {
  const isCommitRef = useRef(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(() => ({
    name: 'Jace',
    id: getRandomId()
  }));
  const [messageList, setMessageList] = useState<MessageList>([]);
  const [commitMessageList, setCommitMessageList] = useState<MessageList>([]);

  useEffect(() => {
    commitMessages(commitMessageList);
  }, [commitMessageList]);

  const commitMessages = async (commitMessageList: MessageList) => {
    const message = commitMessageList[0];
    if (!message || isCommitRef.current) return;
    isCommitRef.current = true;
    const { entityMap } = message.raw;

    interface Req {
      key: string;
      req: Promise<string>;
    }
    const fileReqs: Req[] = [];
    for (const key in entityMap) {
      if (!entityMap.hasOwnProperty(key)) continue;
      const entity = entityMap[key];
      if (entity.type === ImageBlockType) {
        fileReqs.push({
          key,
          req: uploadFile(entity.data)
        });
      }
    }
    const fileUrlList = await Promise.allSettled(
      fileReqs.map(item => item.req)
    );
    for (let i = 0; i < fileUrlList.length; i++) {
      const item = fileUrlList[i];
      const activeEntity = fileReqs[i];
      if (item.status === 'fulfilled') {
        entityMap[activeEntity.key].data.src = item.value;
      } else {
        entityMap[activeEntity.key].data.src = '';
      }
    }

    setCommitMessageList(commitMessageList.slice(1));
    setMessageList([
      ...messageList,
      {
        ...message,
        timeStamp: day().format('hh:mm:ss')
      }
    ]);
    isCommitRef.current = false;
  };

  const handleCommit = useCallback(
    raw => {
      setCommitMessageList([
        ...commitMessageList,
        {
          id: userInfo.id + new Date(),
          userInfo,
          timeStamp: '发送中',
          raw
        }
      ]);
    },
    [userInfo, commitMessageList]
  );

  return (
    <div className={styles.container}>
      <Message
        userInfo={userInfo}
        messageList={messageList}
        commitMessageList={commitMessageList}
      />
      <Chat onCommit={handleCommit} />
    </div>
  );
};

export default hot(App);
