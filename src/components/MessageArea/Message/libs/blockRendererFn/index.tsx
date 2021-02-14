import * as React from 'react';
import Image, {
  ImageBlockType
} from 'chatUtils/blockRendererFn/components/Image';

interface AtomicProps {
  contentState: any;
  block: any;
}

const Atomic = ({ contentState, block }: AtomicProps) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  switch (type) {
    case ImageBlockType:
      return <Image {...data} />;
  }
};

export const blockRendererFn = block => {
  if (block.getType() === 'atomic') {
    return {
      component: Atomic,
      editable: false
    };
  }

  return null;
};
