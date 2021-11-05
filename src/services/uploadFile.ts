import { getRandomId } from '@/utils';
import { UploadFile } from 'chatUtils/types';
import { storage } from '@/utils/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file: UploadFile) => {
  const [_, suffix] = file.type.split('/');
  const fileRef = ref(storage, `editor-file/${getRandomId()}.${suffix}`);

  await uploadString(fileRef, file.src, 'data_url');
  const url = await getDownloadURL(fileRef);
  return url;
};
