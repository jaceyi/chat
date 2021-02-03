import { CompositeDecorator } from 'draft-js';
import Link, { LinkType, LinkMutability } from './components/Link';
import Emoji, { EmojiType, EmojiMutability } from './components/Emoji';
import { Mutability } from 'chatUtils/types';

const findEntities = (type: string, mutability: Mutability) => (
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
    strategy: findEntities(LinkType, LinkMutability),
    component: Link
  },
  {
    strategy: findEntities(EmojiType, EmojiMutability),
    component: Emoji
  }
]);
