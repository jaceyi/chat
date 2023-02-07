import * as React from 'react';
import * as styles from './style.module.scss';
import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { AtomicBlockProps } from '../Atomic';
import type { ChatStore } from 'chatUtils/types';

interface ImageProps {
  data: {
    src: string;
    name: string;
    width: number;
    height: number;
  };
  offsetKey: string;
  blockProps: AtomicBlockProps;
}

export const ImageBlockType = 'image';

const Image: FC<ImageProps> = ({ data, offsetKey, blockProps }) => {
  const { src, name, width, height } = data;
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const computeSize = () => {
      const el = imgRef.current;
      if (!el) return;
      const fullWidth = blockProps.store?.getFullBlockWidth?.() || 300;
      let _width = fullWidth ? (width > fullWidth ? fullWidth : width) : width;
      let _height = height * (_width / width);
      if (_height > 300) {
        _width *= 300 / _height;
        _height = 300;
      }
      el.style.width = `${_width}px`;
      el.style.height = `${_height}px`;
    };
    computeSize();
    window.addEventListener('resize', computeSize);
    () => {
      window.removeEventListener('resize', computeSize);
    };
  });

  const [isError, setIsError] = useState(false);
  const onError = () => {
    setIsError(true);
  };

  const viewerImage: ChatStore['onViewerImage'] = data => {
    blockProps.store?.onViewerImage?.(data);
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
      viewerImage({ src, name });
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
      ref={imgRef}
      onDoubleClick={() => viewerImage({ src, name })}
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
