import { EditorState, SelectionState, Modifier } from 'draft-js';
import { REGEX_INTERNET } from '@/utils/consts';
import { findWithRegex } from './findWithRegex';
import { LinkName, LinkMutability } from 'chatUtils/decorator/components/Link';

export const entitiesToLinks = editorState => {
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();
  let newContentState = contentState;

  blocks.forEach(block => {
    if (block) {
      const plainText = block.getText();
      const addEntityToLink = (start: number, end: number): void => {
        const existingEntityKey = block.getEntityAt(start);
        if (existingEntityKey) {
          const entity = newContentState.getEntity(existingEntityKey);
          if (entity && entity.getType() === LinkName) {
            return;
          }
        }

        const selection = SelectionState.createEmpty(block.getKey())
          .set('anchorOffset', start)
          .set('focusOffset', end);

        const url = plainText.substring(start, end);

        const contentStateWithEntity = newContentState.createEntity(
          LinkName,
          LinkMutability,
          { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        newContentState = Modifier.replaceText(
          newContentState,
          selection,
          url,
          null,
          entityKey
        );
      };

      findWithRegex(new RegExp(REGEX_INTERNET), block, addEntityToLink);
    }
  });

  if (!newContentState.equals(contentState)) {
    return EditorState.push(editorState, newContentState, 'change-block-data');
  }

  return editorState;
};
