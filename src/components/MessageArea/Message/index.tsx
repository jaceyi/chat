import * as React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { Raw } from 'chatUtils/types';
import { UserInfo } from '@/App';

import * as styles from './style.scss';
import { blockRendererFn, blockRenderMap, decorator } from 'chatUtils';

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
    convertFromRaw(raw),
    decorator
  );

  return (
    <div className={styles.message}>
      <div className={styles[`msg-wrapper-${position}`]}>
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.bubble}>
            <Editor
              blockRendererFn={blockRendererFn}
              blockRenderMap={blockRenderMap}
              readOnly
              editorState={editorState}
            />
          </div>
          <div>{timeStamp}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
