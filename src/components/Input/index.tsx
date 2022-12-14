import * as React from 'react';
import type { FC, InputHTMLAttributes } from 'react';
import * as styles from './style.module.scss';

type InputProps = Override<
  InputHTMLAttributes<HTMLInputElement>,
  {
    onChange: (string: string) => void;
  }
>;

const Input: FC<InputProps> = ({ onChange, className = '', ...props }) => {
  return (
    <input
      onChange={e => onChange(e.target.value)}
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
};

export default React.memo(Input);
