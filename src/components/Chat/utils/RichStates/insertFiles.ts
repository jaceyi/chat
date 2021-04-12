import { insertAtomic } from './insertAtomic';
import { ImageBlockType } from 'chatUtils/blockRendererFn/components/Image';
import { FileBlockType } from 'chatUtils/blockRendererFn/components/File';

export const insertFiles = async (
  editorState: any,
  setEditorState: any,
  fileList: FileList
) => {
  let _editorState = editorState;

  for (const file of Array.from(fileList)) {
    _editorState = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(
          insertAtomic(
            _editorState,
            /^image\/.+$/.test(file.type) ? ImageBlockType : FileBlockType,
            {
              src: reader.result as string,
              type: file.type,
              name: file.name
            }
          )
        );
      };
    });
  }
  setEditorState(_editorState);
};
