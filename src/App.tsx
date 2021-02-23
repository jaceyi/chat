import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import Message, { MessageList } from './components/MessageArea';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import * as styles from './App.scss';
import { loadFileForEntityMap } from './App.funcs';
import { getRandomId } from '@/utils';
import * as day from 'dayjs';
import alertConfirm, { Button } from 'react-alert-confirm';
import Input from '@/components/Input';
import { useDidUpdate } from '@/hooks';
import { database } from '@/utils/firebase';
import { MessageInfo } from '@/components/MessageArea/Message';

export interface UserInfo {
  name: string;
  id: string;
}

const LOCAL_USER_INFO_NAME = 'USER_INFO';

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(LOCAL_USER_INFO_NAME));
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!userInfo) {
      initialUserInfo();
    }
  }, []);

  useDidUpdate(() => {
    window.localStorage.setItem(LOCAL_USER_INFO_NAME, JSON.stringify(userInfo));
  }, [userInfo]);

  const initialUserInfo = async () => {
    let name: string;
    await alertConfirm({
      content: (
        <Input
          autoFocus
          placeholder="请输入用户名"
          onChange={_val => (name = _val)}
        />
      ),
      footer(dispatch) {
        return (
          <Button onClick={() => dispatch('ok')} styleType="primary">
            确 认
          </Button>
        );
      }
    });
    if (!name) {
      return initialUserInfo();
    }
    setUserInfo({
      name,
      id: getRandomId()
    });
  };

  // 当前正在提交
  const isCommitRef = useRef(false);
  const [messageList, setMessageList] = useState<MessageList>([]);
  const [commitMessageList, setCommitMessageList] = useState<MessageList>([]);

  useEffect(() => {
    if (userInfo) {
      database.ref('messages/').off('value', updateMessage);
      database.ref('messages/').on('value', updateMessage);
    }
  }, [userInfo]);

  const updateMessage = snapshot => {
    const data: { [key: string]: MessageInfo } = snapshot.val() ?? {};
    setMessageList(Object.values(data).reverse());
  };

  useEffect(() => {
    commitMessages(commitMessageList);
  }, [commitMessageList]);

  const commitMessages = async (commitMessageList: MessageList) => {
    const message = commitMessageList[0];

    if (!message || isCommitRef.current) return;

    isCommitRef.current = true;
    const { entityMap } = message.raw;

    await loadFileForEntityMap(entityMap);

    await database.ref('messages/' + message.id).set({
      ...message,
      timeStamp: day().format('HH:mm:ss')
    });
    setCommitMessageList(commitMessageList.slice(1));

    isCommitRef.current = false;
  };

  const handleCommit = useCallback(
    raw => {
      if (!userInfo) {
        return initialUserInfo();
      }
      setCommitMessageList([
        {
          id: new Date().getTime() + '_' + userInfo.id,
          userInfo,
          timeStamp: '发送中',
          raw
        },
        ...commitMessageList
      ]);
    },
    [userInfo, commitMessageList]
  );

  return (
    <div className={styles.container}>
      <Message
        userInfo={userInfo}
        messageList={useMemo(() => {
          const list = [...messageList];
          // 组件更新会有延迟 导致渲染延迟
          commitMessageList.forEach(message => {
            if (!list.find(item => item.id === message.id)) {
              list.unshift(message);
            }
          });
          return list;
        }, [messageList, commitMessageList])}
      />
      <Chat onCommit={handleCommit} />
    </div>
  );
};

export default hot(App);
