import * as React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import { UserInfo } from '@/App';
import { blockRenderMap, decorator } from 'chatUtils';
import { blockRendererFn } from './libs';
import { animated, interpolate, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';

import * as styles from './style.scss';

export interface MessageInfo {
  raw: Raw;
  timeStamp: string;
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
  const { uid, name } = userInfo;
  const position = uid === currentUserInfo.uid ? 'right' : 'left';
  const editorState = EditorState.createWithContent(
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
  );

  const [{ size }, set] = useSpring(() => ({ size: 1 }));

  const bind = useGesture({
    onPointerDown: () => {
      set({ size: 0.95 });
    },
    onPointerUp: () => {
      set({ size: 1 });
    }
  });

  return (
    <div className={styles.message}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div>
          <div className={styles.header}>
            <div className={styles.time}>{timeStamp}</div>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.main}>
            <animated.div
              {...bind()}
              style={{
                transform: interpolate([size], s => `scale(${s})`)
              }}
            >
              <div className={styles.bubble}>
                <Editor
                  readOnly
                  blockRendererFn={blockRendererFn}
                  blockRenderMap={blockRenderMap}
                  editorState={editorState}
                />
              </div>
            </animated.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
