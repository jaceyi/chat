import * as React from 'react';
import type { InputHTMLAttributes } from 'react';

import * as styles from './style.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (string) => string;
}

const Input = ({ onChange, className = '', ...props }: InputProps) => {
  return (
    <input
      onChange={e => onChange(e.target.value)}
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
};

export default React.memo(Input);
