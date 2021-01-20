import Atomic from './components/Atomic';

export const blockRendererFn = block => {
  if (block.getType() === 'atomic') {
    return {
      component: Atomic,
      editable: false
    };
  }

  return null;
};
