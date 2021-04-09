import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { ChatStore } from 'chatUtils/types';
import store, { UserInfo } from '@/store';
import * as styles from './style.scss';
import { animated, useSpring } from 'react-spring';
import { debounce } from '@/utils';

interface PopoverProps {
  editorState: any;
  store: ChatStore;
  onSelect: (user: UserInfo) => void;
}

const Popover = ({ editorState, store: chatStore, onSelect }: PopoverProps) => {
  const [{ userList }] = useContext(store);

  const [options, setOptions] = useState([]);
  const [{ size, ...style }, setStyle] = useSpring(() => ({
    size: 0,
    opacity: 0,
    display: 'none',
    left: 0,
    top: 0,
    config: {
      tension: 300
    }
  }));

  const getStyle = debounce(() => {
    const clearStyle = () => {
      setStyle({ size: 0, opacity: 0, display: 'none' });
    };
    const selection = editorState.getSelection();
    if (!selection.isCollapsed() || !selection.getHasFocus()) {
      clearStyle();
      return;
    }

    const focusKey = selection.getFocusKey();
    const focusOffset = selection.getFocusOffset();
    const { suggestion } = chatStore;
    if (!suggestion) {
      clearStyle();
      return;
    }
    const { blockKey, start, end, rect } = suggestion;
    if (
      focusKey === blockKey &&
      focusOffset > start &&
      focusOffset <= end &&
      rect
    ) {
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(blockKey);
      const text = block.getText();
      // 光标聚焦在当前提及位置
      const value = text.slice(start + 1, focusOffset);
      const options = userList.filter(user => user.name.includes(value));
      if (!options.length) {
        clearStyle();
        return;
      }
      setOptions(options);
      setStyle({
        size: 1,
        opacity: 1,
        display: 'block',
        left: rect.offsetLeft + 10,
        top: rect.offsetTop + rect.offsetHeight
      });
    } else {
      clearStyle();
    }
  }, 200);

  useEffect(() => {
    getStyle();
  }, [editorState]);

  return (
    <animated.div
      style={{
        transform: size.interpolate(s => `scale(${s})`),
        ...style
      }}
      className={styles.popover}
    >
      <div className={styles.content}>
        {options.map(user => (
          <div
            onClick={e => {
              onSelect(user);
              e.preventDefault();
              e.stopPropagation();
            }}
            className={styles.user}
            key={user.email}
          >
            {user.name}
          </div>
        ))}
      </div>
    </animated.div>
  );
};

export default React.memo(Popover);
