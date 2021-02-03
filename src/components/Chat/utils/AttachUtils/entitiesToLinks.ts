import {
  EditorState,
  SelectionState,
  Modifier,
  CharacterMetadata
} from 'draft-js';
import { REGEX_INTERNET } from '@/utils/consts';
import { findWithRegex } from './findWithRegex';
import { LinkType, LinkMutability } from 'chatUtils/decorator/components/Link';

export const entitiesToLinks = editorState => {
  const contentState = editorState.getCurrentContent();
  // 先删除所有的 link entity
  let newContentState = contentState.set(
    'blockMap',
    contentState.getBlockMap().map(block => {
      if (block) {
        const characterList = block.getCharacterList();
        return block.set(
          'characterList',
          characterList.map(item => {
            const entityKey = item.getEntity();
            if (!entityKey) return item;
            const entity = contentState.getEntity(entityKey);
            // toggle 表示是 文字链，而不是链接文本
            if (entity && entity.type === LinkType && !entity.data.toggle) {
              return CharacterMetadata.applyEntity(item, null);
            }
            return item;
          })
        );
      }
    })
  );
  const blocks = newContentState.getBlockMap();

  blocks.forEach(block => {
    if (block) {
      const plainText = block.getText();
      /**
       * @description 将所有链接匹配性变为 link entity
       * @param start
       * @param end
       */
      const addEntityToLink = (start: number, end: number): void => {
        const selection = SelectionState.createEmpty(block.getKey())
          .set('anchorOffset', start)
          .set('focusOffset', end);

        const url = plainText.substring(start, end);

        const contentStateWithEntity = newContentState.createEntity(
          LinkType,
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
