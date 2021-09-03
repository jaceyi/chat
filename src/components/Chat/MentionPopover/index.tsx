import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { ChatStore, KeyCommand } from 'chatUtils/types';
import store, { UserInfo } from '@/store';
import * as styles from './style.module.scss';
import { animated, useSpring } from '@react-spring/web';
import { debounce } from '@/utils';
import clsx from 'clsx';

interface PopoverProps {
  editorState: any;
  store: ChatStore;
  onSelect: (user: UserInfo) => void;
  keyCommand: KeyCommand;
}

const keyCommandType = 'MentionPopoverKeyCommand';

const getRelativeParent = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) {
    return null;
  }

  const position = window
    .getComputedStyle(element)
    .getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

const MentionPopover = ({
  editorState,
  store: chatStore,
  onSelect,
  keyCommand
}: PopoverProps) => {
  const [{ userList }] = useContext(store);

  const [options, setOptions] = useState<UserInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [{ size, top, left, ...style }, setStyle] = useState({
    size: 0,
    opacity: 0,
    display: 'none',
    left: 0,
    top: 0
  });
  const animateStyle = useSpring({
    transform: `scale(${size})`,
    ...style,
    config: {
      tension: 300
    }
  });

  const getStyle = debounce(() => {
    const clearStyle = () => {
      setActiveIndex(0);
      setOptions([]);
      setStyle({ size: 0, opacity: 0, display: 'none', left: 0, top: 0 });
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
      const relativeParent = getRelativeParent(rect);
      let left = rect.offsetLeft + 10;
      let top = rect.offsetTop + rect.offsetHeight;
      if (relativeParent) {
        const relativeParentRect = relativeParent.getBoundingClientRect();
        left += relativeParentRect.left;
        top += relativeParentRect.top;
      }
      setStyle({
        size: 1,
        opacity: 1,
        display: 'block',
        left,
        top
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
      const { length } = options;
      if (!chatStore.suggestion || !length) return 'not-handled';
      switch (command) {
        case 'submit':
          onSelect(options[activeIndex]);
          return 'handled';
        case 'up':
          if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
          }
          return 'handled';
        case 'down':
          if (activeIndex < length - 1) {
            setActiveIndex(activeIndex + 1);
          }
          return 'handled';
      }
      return 'not-handled';
    });
    const activeEle = document.querySelector(`.${styles.active}`);
    if (activeEle) {
      activeEle.scrollIntoView(false);
    }
    return () => {
      keyCommand.delete(keyCommandType);
    };
  }, [options, activeIndex]);

  return (
    <animated.div
      style={{ ...animateStyle, top, left }}
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
            {user.state === 'online' && <span className={styles.online} />}
          </div>
        ))}
      </div>
    </animated.div>
  );
};

export default React.memo(MentionPopover);
