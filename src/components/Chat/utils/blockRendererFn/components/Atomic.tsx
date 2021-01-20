import * as React from 'react';
import Image from './Image';

interface AtomicProps {
  contentState: any;
  block: any;
}

const Atomic = ({ contentState, block }: AtomicProps) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  switch (type) {
    case 'image':
      return <Image {...data} />;
  }

  return null;
};

export default Atomic;
