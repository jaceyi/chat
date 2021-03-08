import * as React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import { UserInfo } from '@/App';
import { blockRenderMap, decorator, bindBlockRendererFn } from 'chatUtils';
import { animated, interpolate, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import * as day from 'dayjs';

import * as styles from './style.scss';
import { useState } from 'react';

export interface MessageInfo {
  raw: Raw;
  timeStamp: number;
  id: string;
  userInfo: UserInfo;
}

interface MessageProps extends MessageInfo {
  currentUserInfo: UserInfo;
}

const Message = ({
  currentUserInfo,
  userInfo,
  raw,
  timeStamp
}: MessageProps) => {
  const { uid, name, avatar } = userInfo;
  const position = uid === currentUserInfo.uid ? 'right' : 'left';
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
      decorator
    )
  );

  const [{ size }, set] = useSpring(() => ({ size: 1 }));

  const bind = useGesture({
    onPointerDown: () => {
      set({ size: 1.2 });
    },
    onPointerUp: () => {
      set({ size: 1 });
    }
  });

  return (
    <div className={styles.message}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div className={styles.avatar}>
          <animated.div
            {...bind()}
            style={{
              transform: interpolate([size], s => `scale(${s})`)
            }}
          >
            <img src={avatar} alt="头像" />
          </animated.div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.time}>
              {timeStamp ? day.unix(timeStamp).format('HH:mm:ss') : '发送中'}
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
