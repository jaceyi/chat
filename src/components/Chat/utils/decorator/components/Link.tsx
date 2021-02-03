import * as React from 'react';
import { ReactNode } from 'react';
import { Mutability } from 'chatUtils/types';

export const LinkType = 'LINK';
export const LinkMutability: Mutability = 'MUTABLE';

interface LinkProps {
  contentState: any;
  entityKey: string;
  children: ReactNode;
}

const Link = ({ contentState, entityKey, children }: LinkProps) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return <a href={url}>{children}</a>;
};

export default Link;
