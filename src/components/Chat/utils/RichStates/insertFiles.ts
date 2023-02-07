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
    _editorState = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result: string = reader.result as string;
        if (/^image\/.+$/.test(file.type)) {
          const image = new Image();
          image.onload = () => {
            resolve(
              insertAtomic(_editorState, ImageBlockType, {
                src: result,
                type: file.type,
                name: file.name,
                width: image.width,
                height: image.height
              })
            );
          };
          image.onerror = reject;
          image.src = result;
        } else {
          resolve(
            insertAtomic(_editorState, FileBlockType, {
              src: result,
              type: file.type,
              name: file.name
            })
          );
        }
      };
    });
  }
  setEditorState(_editorState);
};
