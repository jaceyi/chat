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
        const userInfo = {
          name: user.displayName || user.email,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL
        };
        console.log(`登陆用户：${userInfo.name}`);
        database.ref('user/').on('value', snapshot => {
          const data: { [key: string]: UserInfo } = snapshot.val() ?? {};
          dispatch({
            type: 'setUserList',
            payload: Object.values(data)
          });
        });
        database.ref('user/' + userInfo.uid).set(userInfo);
        dispatch({
          type: 'setUserInfo',
          payload: userInfo
        });
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
        if (loading) {
          setLoading(false);
        }
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
    <store.Provider value={storeValue}>
      <div className={styles.container}>
        <div className={styles.background}>
          <svg
            className={styles.waves}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className={styles.parallax}>
              <use
                href="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255,255,255,0.7"
              />
              <use
                href="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(255,255,255,0.5)"
              />
              <use
                href="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(255,255,255,0.3)"
              />
              <use href="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
        <div className={styles.main}>
          <Message
            loading={loading}
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
      </div>
    </store.Provider>
  );
};

export default hot(App);
