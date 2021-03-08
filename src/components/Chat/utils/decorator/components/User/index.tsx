import * as React from 'react';
import type { ReactNode } from 'react';
import { Mutability } from 'chatUtils/types';

export const UserEntityType = 'USER';
export const UserMutability: Mutability = 'IMMUTABLE';

interface LinkProps {
  children: ReactNode;
}

const User = ({ children, ...rest }: LinkProps) => {
  console.log(rest);
  return <span>{children}</span>;
};

export default User;
