import * as React from 'react';
import { ReactNode } from 'react';

export const LinkName = 'LINK';
export const LinkMutability = 'MUTABLE';

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
