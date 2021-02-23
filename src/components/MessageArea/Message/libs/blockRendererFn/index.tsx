import * as React from 'react';
import Image, {
  ImageBlockType
} from 'chatUtils/blockRendererFn/components/Image';
import File, { FileBlockType } from 'chatUtils/blockRendererFn/components/File';

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
    case FileBlockType:
      return <File {...data} />;
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
