import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { ChatStore, KeyCommand } from 'chatUtils/types';
import store, { UserInfo } from '@/store';
import * as styles from './style.scss';
import { animated, useSpring } from 'react-spring';
import { debounce } from '@/utils';
import clsx from 'clsx';

interface PopoverProps {
  editorState: any;
  store: ChatStore;
  onSelect: (user: UserInfo) => void;
  keyCommand: KeyCommand;
}

const keyCommandType = 'MentionPopoverKeyCommand';

const MentionPopover = ({
  editorState,
  store: chatStore,
  onSelect,
  keyCommand
}: PopoverProps) => {
  const [{ userList }] = useContext(store);

  const [options, setOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
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
      setActiveIndex(0);
      setOptions([]);
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
      setActiveIndex(0);
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

  useEffect(() => {
    keyCommand.set(keyCommandType, command => {
      switch (command) {
        case 'submit':
          if (options.length) {
            onSelect(options[activeIndex]);
            return 'handled';
          }
          return 'not-handled';
      }
      return 'not-handled';
    });
    return () => {
      keyCommand.delete(keyCommandType);
    };
  }, [options, activeIndex]);

  return (
    <animated.div
      style={{
        transform: size.interpolate(s => `scale(${s})`),
        ...style
      }}
      className={styles.popover}
    >
      <div className={styles.content}>
        {options.map((user, index) => (
          <div
            onClick={e => {
              onSelect(user);
              e.preventDefault();
              e.stopPropagation();
            }}
            className={clsx(
              styles.user,
              activeIndex === index && styles.active
            )}
            key={user.email}
          >
            {user.name}
          </div>
        ))}
      </div>
    </animated.div>
  );
};

export default React.memo(MentionPopover);
