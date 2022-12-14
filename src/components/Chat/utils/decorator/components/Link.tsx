import * as React from 'react';
import type { ReactNode, FC } from 'react';
import { Mutability } from 'chatUtils/types';

export const LinkEntityType = 'LINK';
export const LinkMutability: Mutability = 'MUTABLE';

interface LinkProps {
  contentState: any;
  entityKey: string;
  children: ReactNode;
}

const Link: FC<LinkProps> = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return <a href={url}>{children}</a>;
};

export default Link;
