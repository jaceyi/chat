import * as React from 'react';
import Chat from './components/Chat';
import Message, { MessageList } from './components/MessageArea';
import {
  useReducer,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo
} from 'react';
import * as styles from './App.module.scss';
import { loadFileForEntityMap } from './App.funcs';
import * as day from 'dayjs';
import confirm, { Button, alert } from 'react-alert-confirm';
import { auth, db } from '@/utils/firebase';
import { MessageInfo } from '@/components/MessageArea/Message';
import { useDidMount } from '@/hooks';
import { isEmpty } from '@/utils';
import store, { reducer, initialState, UserInfo } from '@/store';
import {
  getRedirectResult,
  signInWithRedirect,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ref, set, onValue, onDisconnect } from 'firebase/database';

const App = () => {
  const reducerValue = useReducer<typeof reducer>(reducer, initialState);
  const [{ userInfo, userList }, dispatch] = reducerValue;

  const [loading, setLoading] = useState(true);

  const storeValue = useMemo(() => reducerValue, reducerValue);

  useDidMount(async () => {
    const setUser = (user: User) => {
      const userRef = ref(db, 'user/' + user.uid);

      // 监听当前用户
      onValue(userRef, snapshot => {
        if (snapshot.exists()) {
          dispatch({
            type: 'setUserInfo',
            payload: snapshot.val()
          });
        }
      });

      // 监听用户列表
      onValue(ref(db, 'user/'), snapshot => {
        let userList: UserInfo[] = [];
        if (snapshot.exists()) {
          userList = Object.values(snapshot.val());
        }
        dispatch({
          type: 'setUserList',
          payload: userList
        });
      });

      // 设置当前用户
      const userInfo = {
        name: user.displayName || user.email,
        email: user.email,
        uid: user.uid,
        avatar: user.photoURL
      };
      set(userRef, userInfo);
    };

    onAuthStateChanged(auth, async user => {
      if (user) {
        // 当前有登陆用户
        setUser(user);
      } else {
        try {
          const result = await getRedirectResult(auth);
          if (!result) throw Error('not result');
          setUser(result.user);
        } catch (error: any) {
          if (typeof error === 'object') {
            const errorCode = error.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              const email = error.email || error.customData?.email;
              const message = email
                ? `邮箱「${email}」已经存在别的认证方式！无法使用。`
                : '该认证方式邮箱与其他已认证方式邮箱冲突！';
              await alert(message);
            }
          }

          login();
        }
      }
    });
  });

  const login = async () => {
    const [isOk, action] = await confirm({
      title: '请登录',
      content: <div className={styles.login}>请选择登陆方式。</div>,
      footer(dispatch) {
        return (
          <>
            <Button onClick={() => dispatch('google')}>Google</Button>
            <Button onClick={() => dispatch('github')}>Github</Button>
          </>
        );
      }
    });

    // 超时提示
    window.setTimeout(() => {
      alert('长时间未响应，应是你的网络不支持访问！🥺');
    }, 10000);

    let provider;
    switch (action) {
      case 'google':
        // 跳转 Google 验证
        provider = new GoogleAuthProvider();
        break;
      case 'github':
        // 跳转 Github 验证
        provider = new GithubAuthProvider();
        break;
    }
    provider && signInWithRedirect(auth, provider);
  };

  // 当前正在提交
  const isCommitRef = useRef(false);
  const [messageList, setMessageList] = useState<MessageList>([]);
  const [commitMessageList, setCommitMessageList] = useState<MessageList>([]);

  useEffect(() => {
    if (!isEmpty(userInfo)) {
      onValue(ref(db, 'messages/'), snapshot => {
        if (loading) {
          setLoading(false);
        }
        if (snapshot.exists()) {
          const data: { [key: string]: MessageInfo } = snapshot.val() ?? {};
          setMessageList(Object.values(data).reverse());
        }
      });

      onValue(ref(db, '.info/connected'), snapshot => {
        if (snapshot.val() === false) return;
        const userRef = ref(db, 'user/' + userInfo!.uid);
        onDisconnect(userRef)
          .set({
            ...userInfo,
            state: 'offline'
          })
          .then(() => {
            set(userRef, {
              ...userInfo,
              state: 'online'
            });
          });
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

    await set(ref(db, 'messages/' + message.id), {
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
          uid: userInfo.uid,
          timeStamp: null,
          raw
        },
        ...commitMessageList
      ]);
    },
    [userInfo, commitMessageList]
  );

  return (
    <store.Provider value={storeValue}>
      <div className={styles.container}>
        <div className={styles.status}>
          在线人数：{userList.filter(user => user.state === 'online').length} 人
        </div>
        <div className={styles.main}>
          <Message
            loading={loading}
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
      </div>
    </store.Provider>
  );
};

export default App;
