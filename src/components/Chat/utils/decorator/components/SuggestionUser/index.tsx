import * as React from 'react';
import type { ReactNode } from 'react';
import { useRef, useContext } from 'react';
import store from '@/store';

interface LinkProps {
  children: ReactNode;
}

const SuggestionUser = ({ children, ...rest }: LinkProps) => {
  const [{ userInfo, userList }] = useContext(store);
  console.log(userList);

  const nodeRef = useRef(null);

  console.log(rest);
  return <span ref={nodeRef}>{children}</span>;
};

export default SuggestionUser;
