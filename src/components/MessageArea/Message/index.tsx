import * as React from 'react';
import type { FC } from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import store from '@/store';
import { blockRenderMap, getDecorator, bindBlockRendererFn, RichStates } from 'chatUtils';
import { ChatStore } from 'chatUtils/types';
import { animated, to, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import * as day from 'dayjs';
import * as styles from './style.module.scss';
import { useState, useContext, useRef } from 'react';
import Loading from '@/components/Loading';
import AlertConfirm from 'react-alert-confirm';

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

const Message: FC<MessageInfo & { onResize: Function }> = ({ uid, raw, timeStamp, onResize }) => {
  const [{ userInfo: currentUserInfo, userList }] = useContext(store);
  const userInfo = userList.find(item => item.uid === uid);
  const { name = '-', avatar = '', state = 'offline' } = userInfo!;

  const onViewerImage: ChatStore['onViewerImage'] = data => {
    AlertConfirm({
      maskClosable: true,
      custom: (
        <div className={styles.viewer}>
          <img src={data.src} title={data.name} alt={data.name} />
        </div>
      )
    });
  };

  const position = uid === currentUserInfo?.uid ? 'right' : 'left';
  const [editorState] = useState(() =>
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
      const editor = (window as any).editor;
      const { editorState, onChange } = editor.props;
      userInfo && onChange(EditorState.moveFocusToEnd(RichStates.insertUser(editorState, userInfo)));
    }
  });

  const contentRef = useRef<HTMLDivElement>(null);

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
            <img src={avatar || ''} alt="头像" />
          </animated.div>
        </div>
        <div className={styles.content} ref={contentRef}>
          <div className={styles.header}>
            <div className={styles.time}>
              {timeStamp ? day.unix(timeStamp).format('YY年M月D日 HH:mm:ss') : '发送中'}
            </div>
            <div className={styles.name}>{name || '-'}</div>
          </div>
          <div className={styles.main}>
            <div className={styles.bubble}>
              <Loading loading={!timeStamp}>
                <div>
                  <Editor
                    readOnly
                    blockRendererFn={bindBlockRendererFn({
                      store: {
                        onViewerImage,
                        getWrapperWidth: () => {
                          const wrapperWidth = contentRef.current?.offsetWidth || 0;
                          return wrapperWidth ? wrapperWidth - 20 : 0;
                        },
                        onResize
                      }
                    })}
                    blockRenderMap={blockRenderMap}
                    editorState={editorState}
                  />
                </div>
              </Loading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
