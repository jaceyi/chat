import { EditorState, SelectionState, Modifier } from 'draft-js';
import { REGEX_EMOJI } from '@/utils/consts';
import { findWithRegex } from './findWithRegex';
import {
  EmojiEntityType,
  EmojiMutability
} from 'chatUtils/decorator/components/Emoji';

export const entitiesToEmojis = (editorState: any) => {
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();
  let newContentState = contentState;

  blocks.forEach((block: any) => {
    if (block) {
      const plainText = block.getText();
      const addEntityToEmoji = (start: number, end: number): void => {
        const existingEntityKey = block.getEntityAt(start);
        if (existingEntityKey) {
          const entity = newContentState.getEntity(existingEntityKey);
          if (entity && entity.getType() === EmojiEntityType) {
            return;
          }
        }

        const selection = SelectionState.createEmpty(block.getKey())
          .set('anchorOffset', start)
          .set('focusOffset', end);

        const emojiText = plainText.substring(start, end);

        const contentStateWithEntity = newContentState.createEntity(
          EmojiEntityType,
          EmojiMutability,
          { emojiText }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        newContentState = Modifier.replaceText(
          newContentState,
          selection,
          emojiText,
          null,
          entityKey
        );
      };

      findWithRegex(new RegExp(REGEX_EMOJI), block, addEntityToEmoji);
    }
  });

  if (!newContentState.equals(contentState)) {
    return EditorState.push(editorState, newContentState, 'change-block-data');
  }

  return editorState;
};
