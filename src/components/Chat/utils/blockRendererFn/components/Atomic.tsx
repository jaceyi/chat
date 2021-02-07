import * as React from 'react';
import Image, { ImageBlockType } from './Image';
import Focus from './Focus';

interface AtomicProps {
  contentState: any;
  block: any;
}

const Atomic = ({ contentState, block }: AtomicProps) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  let render = null;
  switch (type) {
    case ImageBlockType:
      render = <Image {...data} />;
  }

  if (render) {
    return <Focus block={block}>{render}</Focus>;
  }

  return null;
};

export default Atomic;
