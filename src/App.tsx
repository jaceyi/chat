import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Chat from './components/Chat';
import Message, { MessageList } from './components/MessageArea';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import * as styles from './App.scss';
import { loadFileForEntityMap } from './App.funcs';
import * as day from 'dayjs';
import { alert } from 'react-alert-confirm';
import firebase, { database, githubProvider } from '@/utils/firebase';
import { MessageInfo } from '@/components/MessageArea/Message';
import { useDidMount } from '@/hooks';

export interface UserInfo {
  name: string;
  id: string;
  email: string;
  avatar: string;
}

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  useDidMount(async () => {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (!result.credential) {
        return login();
      }
      const user = result.user;
      setUserInfo({
        name: user.displayName,
        email: user.email,
        id: (window as any).md5(user.email),
        avatar: user.photoURL
      });
    } catch (e) {
      login();
    }
  });

  const login = async () => {
    await alert(
      <div className={styles.login}>
        即将跳转至<a href="https://github.com">Github</a>进行登录，请确认！
      </div>
    );
    await firebase.auth().signInWithRedirect(githubProvider);
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
        return login();
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
