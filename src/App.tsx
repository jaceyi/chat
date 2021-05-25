import * as React from 'react';
import { hot } from 'react-hot-loader/root';
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
import * as styles from './App.scss';
import { loadFileForEntityMap } from './App.funcs';
import * as day from 'dayjs';
import { alert } from 'react-alert-confirm';
import firebase, { database, githubProvider } from '@/utils/firebase';
import { MessageInfo } from '@/components/MessageArea/Message';
import { useDidMount } from '@/hooks';
import { isEmpty } from '@/utils';
import store, { reducer, initialState, UserInfo } from '@/store';

const App = () => {
  const reducerValue = useReducer<typeof reducer>(reducer, initialState);
  const [{ userInfo }, dispatch] = reducerValue;

  const [loading, setLoading] = useState(true);

  const storeValue = useMemo(() => reducerValue, reducerValue);

  useDidMount(async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = database.ref('user/' + user.uid);
        userRef.get().then(snapshot => {
          if (snapshot.exists()) {
            const userInfo = snapshot.val();
            dispatch({
              type: 'setUserInfo',
              payload: userInfo
            });
          } else {
            const userInfo = {
              name: user.displayName || user.email,
              email: user.email,
              uid: user.uid,
              avatar: user.photoURL
            };
            userRef.set(userInfo);
          }
        });

        userRef.on('value', snapshot => {
          dispatch({
            type: 'setUserInfo',
            payload: snapshot.val()
          });
        });
      } else {
        login();
      }
    });

    // 监听用户列表
    database.ref('user/').on('value', snapshot => {
      const data: { [key: string]: UserInfo } = snapshot.val() ?? {};
      dispatch({
        type: 'setUserList',
        payload: Object.values(data)
      });
    });
  });

  const login = async () => {
    await alert(
      <div className={styles.login}>
        即将跳转至<a href="https://github.com">Github</a>进行登录，请确认！
      </div>
    );
    window.setTimeout(() => {
      alert('长时间未响应，应是你的网络不支持访问！🥺');
    }, 10000);
    await firebase.auth().signInWithRedirect(githubProvider);
  };

  // 当前正在提交
  const isCommitRef = useRef(false);
  const [messageList, setMessageList] = useState<MessageList>([]);
  const [commitMessageList, setCommitMessageList] = useState<MessageList>([]);

  useEffect(() => {
    if (!isEmpty(userInfo)) {
      database.ref('messages/').on('value', snapshot => {
        if (loading) {
          setLoading(false);
        }
        const data: { [key: string]: MessageInfo } = snapshot.val() ?? {};
        setMessageList(Object.values(data).reverse());
      });

      database.ref('.info/connected').on('value', snapshot => {
        if (snapshot.val() === false) return;
        const userRef = database.ref('user/' + userInfo!.uid);
        userRef
          .onDisconnect()
          .set({
            ...userInfo,
            state: 'offline'
          })
          .then(() => {
            userRef.set({
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

export default hot(App);
