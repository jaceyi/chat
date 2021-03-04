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
import { isEmpty } from '@/utils';

export interface UserInfo {
  name: string;
  uid: string;
  email: string;
  avatar: string;
}

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [userList, setUserList] = useState<UserInfo[]>([]);

  console.log('用户列表：', userList);

  useDidMount(async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userInfo = {
          name: user.displayName || user.email,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL
        };
        console.log(`登陆用户：${userInfo.name}`);
        database.ref('user/').on('value', snapshot => {
          const data: { [key: string]: UserInfo } = snapshot.val() ?? {};
          setUserList(Object.values(data));
        });
        database.ref('user/' + userInfo.uid).set(userInfo);
        setUserInfo(userInfo);
      } else {
        login();
      }
    });
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
    if (!isEmpty(userInfo)) {
      database.ref('messages/').on('value', snapshot => {
        const data: { [key: string]: MessageInfo } = snapshot.val() ?? {};
        setMessageList(Object.values(data).reverse());
      });
    }
  }, [userInfo]);

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
      timeStamp: day().unix()
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
          id: new Date().getTime() + '_' + userInfo.uid,
          userInfo,
          timeStamp: null,
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
