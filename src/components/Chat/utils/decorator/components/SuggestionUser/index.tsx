import * as React from 'react';
import type { ReactNode, FC } from 'react';
import { useRef, useEffect } from 'react';
import { ChatStore } from 'chatUtils/types';

export const SuggestionUserReg = /@(\w|[\u4e00-\u9fa5])*/g;

interface SuggestionUserProps {
  children: ReactNode;
  offsetKey: string;
  start: number;
  end: number;
  blockKey: string;
  store: ChatStore;
}

const SuggestionUser: FC<SuggestionUserProps> = ({
  children,
  offsetKey,
  start,
  end,
  blockKey,
  store
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!store) return;
    store.suggestion = {
      start,
      end,
      blockKey,
      rect: nodeRef.current
    };
    return () => {
      store.suggestion = null;
    };
  });

  return (
    <span data-offset-key={offsetKey} ref={nodeRef}>
      {children}
    </span>
  );
};

export default SuggestionUser;
