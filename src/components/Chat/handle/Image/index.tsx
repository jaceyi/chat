import * as React from 'react';
import * as styles from './style.scss';

interface ImageProps {
  onUpload: (src: File[]) => void;
}

const Image = ({ onUpload }: ImageProps) => {
  const handleUploadFile = e => {
    onUpload([...e.target.files]);
  };

  return (
    <label>
      <img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f301.png" alt="" />
      <input
        value=""
        multiple
        onChange={handleUploadFile}
        className={styles.input}
        type="file"
      />
    </label>
  );
};

export default React.memo(Image);
