import * as React from 'react';
import * as styles from './style.module.scss';
import type { ChangeEvent } from 'react';

interface ImageProps {
  onUpload: (src: FileList) => void;
}

const Image = ({ onUpload }: ImageProps) => {
  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files!);
  };

  return (
    <label>
      <img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f301.png" alt="" />
      <input
        value=""
        onChange={handleUploadFile}
        className={styles.input}
        type="file"
      />
    </label>
  );
};

export default React.memo(Image);
