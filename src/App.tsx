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
import AlertConfirm from 'react-alert-confirm';
import { auth, db } from '@/utils/firebase';
import { MessageInfo } from '@/components/MessageArea/Message';
import { useDidMount } from '@/hooks';
import { isEmpty } from '@/utils';
import store, { reducer, initialState, UserInfo } from '@/store';
import {
  getRedirectResult,
  signInWithRedirect,
  GithubAuthProvider,
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
      const { uid } = user;
      const token = (window as any).CURRENT_MESSAGE_TOKEN;
      if (token && uid) {
        // 将当前 message token 存起来，同一个用户只存留最后登录的 Token
        set(ref(db, 'messageTokens/' + uid), token);
      }
      const userRef = ref(db, 'user/' + uid);

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
        uid,
        name: user.displayName || user.email || user.uid,
        email: user.email,
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
          login();
        }
      }
    });
  });

  const login = async () => {
    await AlertConfirm.alert({
      title: '在线聊天室',
      desc: '底层使用 Google Firebase 服务，需要保持网络环境能与 Google 连接才可使用。',
      okText: '使用 GitHub 认证登陆'
    });

    const provider = new GithubAuthProvider();
    signInWithRedirect(auth, provider);
    window.setTimeout(() => {
      AlertConfirm.alert('响应超时，应是你的网络不支持访问！');
    }, 5000);
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
          })
          .catch(() => {
            AlertConfirm.alert('无权限！');
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
        {!!userInfo && (
          <div className={styles.status}>
            在线人数：{userList.filter(user => user.state === 'online').length}人
          </div>
        )}
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
