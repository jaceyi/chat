import * as React from 'react';
import type { ReactNode } from 'react';
import { Mutability } from 'chatUtils/types';
import * as styles from './style.scss';

export const UserEntityType = 'USER';
export const UserMutability: Mutability = 'IMMUTABLE';

interface LinkProps {
  children: ReactNode;
  offsetKey: string;
  entityKey: string;
  contentState: any;
}

const User = ({ children, offsetKey, entityKey, contentState }: LinkProps) => {
  const { email } = contentState.getEntity(entityKey).getData();

  return (
    <span className={styles.user} title={email} data-offset-key={offsetKey}>
      {children}
    </span>
  );
};

export default User;
