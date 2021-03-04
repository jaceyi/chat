import * as React from 'react';
import * as styles from './style.scss';
import type { FunctionComponent } from 'react';

interface ImageProps {
  src: string;
  name: string;
}

export const ImageBlockType = 'image';

const Image: FunctionComponent<ImageProps> = ({ src, name }) => {
  return <img title={name} className={styles.image} src={src} alt={name} />;
};

export default Image;
