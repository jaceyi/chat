import * as React from 'react';
import Image, { ImageBlockType } from './Image';
import File, { FileBlockType } from './File';
import Focus from './Focus';
import type { FunctionComponent } from 'react';

export interface AtomicProps {
  contentState: any;
  block: any;
}

const FocusImage = Focus(Image);
const FocusFile = Focus(File);

const Atomic: FunctionComponent<AtomicProps> = props => {
  const { contentState, block } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  switch (type) {
    case ImageBlockType:
      return <FocusImage {...props} {...data} />;
    case FileBlockType:
      return <FocusFile {...props} {...data} />;
  }

  return <div />;
};

export default Atomic;
