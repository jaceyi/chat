import { getRandomId } from '@/utils';
import { UploadFile } from 'chatUtils/types';
import { storage } from '@/utils/firebase';
import { ref, uploadString } from 'firebase/storage';

export const uploadFile = async (file: UploadFile) => {
  const [_, suffix] = file.type.split('/');
  const fileRef = ref(storage, `editor-file/${getRandomId()}.${suffix}`);

  const res = await uploadString(fileRef, file.src, 'data_url');
  return res.ref.fullPath;
};
