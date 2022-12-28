import * as React from 'react';
import * as styles from './style.module.scss';
import type { ComponentType, FC } from 'react';
import { stopPropagation } from '@/utils';
import clsx from 'clsx';
import type { AtomicProps } from '../Atomic';

interface FocusProps extends AtomicProps {
  isBlock: boolean; // 占满一行展示
}

const Focus = (WrappedComponent: ComponentType<any>): FC<FocusProps> => {
  return props => {
    const { blockProps, isBlock, ...rest } = props;
    const { focusNextLine, focusCurrentBlock } = blockProps;

    return (
      <div className={styles.clear} onClick={focusNextLine}>
        <div
          onClick={stopPropagation}
          className={clsx(styles.focus, isBlock && styles.block)}
          tabIndex={0}
          onFocus={focusCurrentBlock}
        >
          <WrappedComponent {...rest} blockProps={blockProps} />
        </div>
      </div>
    );
  };
};

export default Focus;
