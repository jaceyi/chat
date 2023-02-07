import Atomic, { AtomicProps } from './components/Atomic';
import type { FunctionComponent } from 'react';
import { ChatStore } from '../types';

export const bindBlockRendererFn = ({ store = {} }: { store: ChatStore }) => {
  return (
    block: any
  ): {
    component: FunctionComponent<AtomicProps>;
    editable: boolean;
    props: {
      store: ChatStore;
    };
  } | null => {
    if (block.getType() === 'atomic') {
      return {
        component: Atomic,
        editable: false,
        props: {
          store
        }
      };
    }

    return null;
  };
};
