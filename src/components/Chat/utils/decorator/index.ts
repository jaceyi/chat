import { CompositeDecorator } from 'draft-js';
import Link from './components/Link';
import Emoji from './components/Emoji';

type Mutability = 'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED';

const findEntities = (type: string, mutability: Mutability = 'MUTABLE') => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    if (entityKey !== null) {
      const entity = contentState.getEntity(entityKey);
      return entity.getType() === type && entity.getMutability() === mutability;
    }
  }, callback);
};

export const decorator = new CompositeDecorator([
  {
    strategy: findEntities('LINK'),
    component: Link
  },
  {
    strategy: findEntities('EMOJI', 'IMMUTABLE'),
    component: Emoji
  }
]);
