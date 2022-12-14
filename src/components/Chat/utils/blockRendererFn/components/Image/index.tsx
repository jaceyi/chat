import * as React from 'react';
import * as styles from './style.module.scss';
import type { FC } from 'react';
import type { AtomicBlockProps } from '../..';
import { useState, useRef } from 'react';

interface ImageProps {
  src: string;
  name: string;
  offsetKey: string;
  blockProps: AtomicBlockProps;
}

export const ImageBlockType = 'image';

const Image: FC<ImageProps> = ({ src, name, offsetKey, blockProps }) => {
  const [isError, setIsError] = useState(false);
  const onError = () => {
    setIsError(true);
  };

  const timer = useRef(0);
  const ing = useRef(false);
  const handleTouchEnd = () => {
    // 简易实现移动端双击事件
    const clear = () => {
      ing.current = false;
      clearTimeout(timer.current);
    };
    if (ing.current) {
      clear();
      blockProps.viewerImage({ src, name });
      return;
    }
    clear();
    ing.current = true;
    timer.current = window.setTimeout(clear, 300);
  };

  if (isError) {
    return <div className={styles.error}>图片加载失败</div>;
  }

  return (
    <img
      onDoubleClick={() => blockProps.viewerImage({ src, name })}
      onTouchEnd={handleTouchEnd}
      data-offset-key={offsetKey}
      onError={onError}
      title={name}
      className={styles.image}
      src={src}
      alt={name}
    />
  );
};

export default Image;
