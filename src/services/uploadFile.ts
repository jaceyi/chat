import { storage } from '@/utils/firebase';
import { getRandomId } from '@/utils';
import { UploadFile } from 'chatUtils/types';

const fileRef = storage.ref();

export const uploadFile = async (file: UploadFile) => {
  const [_, suffix] = file.type.split('/');
  const res = await fileRef
    .child(`editor-file/${getRandomId()}.${suffix}`)
    .putString(file.src, 'data_url');
  return await res.ref.getDownloadURL();
};
