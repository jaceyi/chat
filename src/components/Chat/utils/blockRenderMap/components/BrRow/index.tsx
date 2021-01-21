import * as React from 'react';
import { ReactNode } from 'react';
import * as styles from './style.scss';

export const BrRowType = 'br-row';

interface BrRowProps {
  children?: ReactNode;
}

const BrRow = ({ children }: BrRowProps) => {
  return <div className={styles.row}>{children}</div>;
};

export default BrRow;
