import * as React from 'react';
import type { FC, ReactNode } from 'react';
import * as styles from './style.module.scss';

interface LoadingProps {
  loading: boolean;
  children: ReactNode;
}

const Loading: FC<LoadingProps> = ({ loading, children }) => (
  <div className={styles.contianer}>
    {loading && (
      <div className={styles.loading}>
        <div className={styles.content}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    )}
    {children}
  </div>
);

export default Loading;
