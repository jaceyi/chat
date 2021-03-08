import * as React from 'react';
import type { ReactNode } from 'react';

interface LinkProps {
  children: ReactNode;
}

const SuggestionUser = ({ children, ...rest }: LinkProps) => {
  console.log(rest);
  return <span>{children}</span>;
};

export default SuggestionUser;
