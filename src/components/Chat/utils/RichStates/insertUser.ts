import { EditorState, Modifier } from 'draft-js';
import { UserInfo } from '@/store';
import { UserEntityType } from 'chatUtils/decorator/components/User';

/**
 * @description 插入用户
 * @param editorState
 * @param user
 */
export const insertUser = (editorState: any, user: UserInfo) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const contentStateWithEntity = contentState.createEntity(
    UserEntityType,
    'IMMUTABLE',
    user
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newContentState = Modifier.replaceText(
    contentStateWithEntity,
    selection,
    '@' + user.name,
    null,
    entityKey
  );

  return EditorState.push(
    editorState,
    Modifier.insertText(
      newContentState,
      newContentState.getSelectionAfter(),
      ' '
    ),
    'insert-user'
  );
};
