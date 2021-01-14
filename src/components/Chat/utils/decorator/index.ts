import { CompositeDecorator } from 'draft-js';
import Link from './components/Link';

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

export default new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link
  }
]);
