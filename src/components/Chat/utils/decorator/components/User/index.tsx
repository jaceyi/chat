import * as React from 'react';
import type { ReactNode, FC } from 'react';
import { Mutability } from 'chatUtils/types';
import * as styles from './style.module.scss';

export const UserEntityType = 'USER';
export const UserMutability: Mutability = 'IMMUTABLE';

interface UserProps {
  children: ReactNode;
  offsetKey: string;
  entityKey: string;
  contentState: any;
}

const User: FC<UserProps> = ({
  children,
  offsetKey,
  entityKey,
  contentState
}) => {
  const { email, uid } = contentState.getEntity(entityKey).getData();

  return (
    <span
      className={styles.user}
      title={email || uid}
      data-offset-key={offsetKey}
    >
      {children}
    </span>
  );
};

export default User;
