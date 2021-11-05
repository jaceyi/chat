import * as React from 'react';
import type { ReactNode } from 'react';

export const CodeReg = /`.+?`/g;

interface CodeProps {
  children: ReactNode;
  offsetKey: string;
}

const Code = ({ children, offsetKey }: CodeProps) => {
  return <code data-offset-key={offsetKey}>{children}</code>;
};

export default Code;
