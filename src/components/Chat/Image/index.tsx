import * as React from 'react';
import * as styles from './style.scss';
import { UploadFile } from 'chatUtils/types';

interface ImageProps {
  onUpload: (src: UploadFile) => void;
}

const Image = ({ onUpload }: ImageProps) => {
  const handleUploadFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      onUpload({
        src: reader.result as string,
        type: file.type,
        name: file.name
      });
    };
  };

  return (
    <label>
      <img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f301.png" alt="" />
      <input
        value=""
        accept="image/*"
        onChange={handleUploadFile}
        className={styles.input}
        type="file"
      />
    </label>
  );
};

export default React.memo(Image);
