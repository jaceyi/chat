import * as React from 'react';
import * as styles from './style.module.scss';
import type { FC } from 'react';

interface FileProps {
  src: string;
  name: string;
}

export const FileBlockType = 'file';

const File: FC<FileProps> = ({ src, name }) => {
  return (
    <div className={styles.file}>
      <span className={styles.title}>文件：</span>
      <span>{name}</span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.viewer}
        href={src}
      >
        点击查看
      </a>
    </div>
  );
};

export default File;
