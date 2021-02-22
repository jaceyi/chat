import * as React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import { UserInfo } from '@/App';
import { blockRenderMap, decorator } from 'chatUtils';
import { blockRendererFn } from './libs';

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
  const { id, name } = userInfo;
  const position = id === currentUserInfo.id ? 'right' : 'left';
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

  return (
    <div className={styles.message}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div>
          <div className={styles.header}>
            <div className={styles.time}>{timeStamp}</div>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.main}>
            <div className={styles.bubble}>
              <Editor
                readOnly
                blockRendererFn={blockRendererFn}
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
