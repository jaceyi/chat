import * as React from 'react';
import type { ReactNode, FC } from 'react';

export const CodeReg = /`.+?`/g;

interface CodeProps {
  children: ReactNode;
  offsetKey: string;
}

const Code: FC<CodeProps> = ({ children, offsetKey }) => {
  return <code data-offset-key={offsetKey}>{children}</code>;
};

export default Code;
