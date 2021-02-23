import * as React from 'react';
import * as styles from './style.scss';

interface ImageProps {
  src: string;
}

export const ImageBlockType = 'image';

const Image = ({ src }: ImageProps) => {
  return (
    <div className={styles.box}>
      <img title={name} className={styles.img} src={src} alt="" />
    </div>
  );
};

export default Image;
