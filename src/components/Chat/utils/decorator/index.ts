import { CompositeDecorator } from 'draft-js';
import Link from './components/Link';
import Index from './components/Emoji';

const findEntities = (type: string) => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null && contentState.getEntity(entityKey).getType() === type
    );
  }, callback);
};

export const decorator = new CompositeDecorator([
  {
    strategy: findEntities('LINK'),
    component: Link
  },
  {
    strategy: findEntities('EMOJI'),
    component: Index
  }
]);
