import * as React from 'react';
import Image, { ImageBlockType } from './Image';
import File, { FileBlockType } from './File';
import Focus from './Focus';
import type { FC } from 'react';
import { ChatStore } from '../../types';

export interface AtomicBlockProps {
  store: ChatStore;
}

export interface AtomicProps {
  blockProps: AtomicBlockProps;
  contentState: any;
  block: any;
  data?: object;
}

const FocusImage = Focus(Image);
const FocusFile = Focus(File);

const Atomic: FC<AtomicProps> = props => {
  const { contentState, block, blockProps } = props;

  const key = block.getEntityAt(0);
  if (key) {
    const entity = contentState.getEntity(key);
    const data = entity.getData();
    const type = entity.getType();

    switch (type) {
      case ImageBlockType:
        return <FocusImage {...props} blockProps={blockProps} data={data} />;
      case FileBlockType:
        return <FocusFile {...props} blockProps={blockProps} data={data} />;
    }
  }

  return null;
};

export default Atomic;
