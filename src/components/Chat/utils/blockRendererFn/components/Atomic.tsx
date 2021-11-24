import * as React from 'react';
import Image, { ImageBlockType } from './Image';
import File, { FileBlockType } from './File';
import Focus from './Focus';
import type { FunctionComponent } from 'react';
import { AtomicBlockProps } from '../index';

export interface AtomicProps {
  contentState: any;
  block: any;
  blockProps: AtomicBlockProps;
}

const FocusImage = Focus(Image);
const FocusFile = Focus(File);

const Atomic: FunctionComponent<AtomicProps> = props => {
  const { contentState, block } = props;

  const key = block.getEntityAt(0);
  if (key) {
    const entity = contentState.getEntity(key);
    const data = entity.getData();
    const type = entity.getType();

    switch (type) {
      case ImageBlockType:
        return <FocusImage {...props} {...data} />;
      case FileBlockType:
        return <FocusFile {...props} {...data} />;
    }
  }

  return null;
};

export default Atomic;
