import * as React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import store from '@/store';
import { blockRenderMap, getDecorator, bindBlockRendererFn } from 'chatUtils';
import { animated, to, useSpring } from '@react-spring/web';
import { useGesture } from 'react-use-gesture';
import * as day from 'dayjs';
import * as styles from './style.module.scss';
import { useState, useContext } from 'react';

export interface MessageInfo {
  uid: string;
  id: string;
  raw: Raw;
  timeStamp: number | null;
}

interface StateMap {
  [key: string]: string;
}
const stateMaps: StateMap = {
  online: '在线',
  offline: '离线'
};

type MessageProps = MessageInfo;

const Message = ({ uid, raw, timeStamp }: MessageProps) => {
  const [{ userInfo: currentUserInfo, userList }, dispatch] = useContext(store);
  const userInfo = userList.find(item => item.uid === uid);
  const { name, avatar, state } = userInfo!;

  const position = uid === currentUserInfo!.uid ? 'right' : 'left';
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(
        Object.assign(
          {
            blocks: {},
            entityMap: {}
          },
          raw
        )
      ),
      getDecorator()
    )
  );

  const [{ size }, set] = useSpring(() => ({ size: 1 }));

  const bind = useGesture({
    onPointerDown: () => {
      set({ size: 1.15 });
    },
    onPointerUp: () => {
      set({ size: 1 });
    }
  });

  return (
    <div className={styles.message}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div className={styles.avatar} title={stateMaps[state]}>
          <animated.div
            {...bind()}
            style={{
              transform: to([size], s => `scale(${s})`)
            }}
          >
            {state === 'online' && <div className={styles.online} />}
            <img src={avatar} alt="头像" />
          </animated.div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.time}>
              {timeStamp
                ? day.unix(timeStamp).format('YY年M月D日 HH:mm:ss')
                : '发送中'}
            </div>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.main}>
            <div className={styles.bubble}>
              <Editor
                readOnly
                blockRendererFn={bindBlockRendererFn(
                  editorState,
                  setEditorState
                )}
                blockRenderMap={blockRenderMap}
                editorState={editorState}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
