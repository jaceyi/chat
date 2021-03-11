import * as React from 'react';
import * as styles from './style.scss';

const Loading = () => (
  <div className={styles.loader}>
    <div className={styles.dot} />
    <div className={styles.dot} />
    <div className={styles.dot} />
    <div className={styles.dot} />
    <div className={styles.dot} />
  </div>
);

export default Loading;
