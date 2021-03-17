import * as React from 'react';
import type { ReactNode } from 'react';
import { useRef, useContext } from 'react';
import store from '@/store';

interface LinkProps {
  children: ReactNode;
  offsetKey: string;
}

const SuggestionUser = ({ children, offsetKey, ...rest }: LinkProps) => {
  const [{ userInfo, userList }] = useContext(store);
  console.log(userList);

  const nodeRef = useRef(null);

  console.log(rest);
  return (
    <span data-offset-key={offsetKey} ref={nodeRef}>
      {children}
    </span>
  );
};

export default SuggestionUser;
