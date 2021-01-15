import { KeyTypes } from './keyBindingFn';
import RichUtils from './RichUtils';

type KeyHandleTypes = 'handled' | 'not-handled';

export default (setEditorState: Function) => (
  command: KeyTypes,
  editorState
): KeyHandleTypes => {
  const newState = RichUtils.handleKeyCommand(editorState, command as string);

  if (newState) {
    setEditorState(newState);
    return 'handled';
  }

  switch (command) {
    case 'enter':
      console.log('Ctrl+回车');
      break;
    case 'prompt-link':
      const value = prompt('请输入链接');
      value &&
        setEditorState(
          RichUtils.insertLink(editorState, {
            url: value
          })
        );
      return 'handled';
  }

  return 'not-handled';
};
