import * as React from 'react';
import * as styles from './style.scss';

interface ImageProps {
  onUpload: (src: string) => void;
}

const Image = ({ onUpload }: ImageProps) => {
  const handleUploadFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onUpload(reader.result as string);
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
