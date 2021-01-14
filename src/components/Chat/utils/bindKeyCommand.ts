import { KeyTypes } from './keyBindingFn';
import RichUtils from './RichUtils';

export default (setEditorState: Function) => (
  command: KeyTypes,
  editorState
) => {
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
      const selection = editorState.getSelection();
      const startOffset = selection.getStartOffset();
      const endOffset = selection.getEndOffset();

      if (startOffset !== endOffset) {
        const value = prompt('请输入链接');
        value &&
          setEditorState(
            RichUtils.promptLink(editorState, {
              url: value
            })
          );
      }
      break;
  }

  return 'not-handled';
};
