import * as React from 'react';
import * as styles from './style.scss';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

interface ImageProps {
  src: string;
  name: string;
  offsetKey: string;
}

export const ImageBlockType = 'image';

const Image: FunctionComponent<ImageProps> = ({ src, name, offsetKey }) => {
  const [isError, setIsError] = useState(false);

  const onError = () => {
    setIsError(true);
  };

  if (isError) {
    return <div className={styles.error}>图片加载失败</div>;
  }

  return (
    <img
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
