import * as React from 'react';
import * as styles from './style.module.scss';
import type { ComponentType, FunctionComponent } from 'react';
import { stopPropagation } from '@/utils';
import clsx from 'clsx';
import type { AtomicProps } from '../Atomic';

interface FocusProps extends AtomicProps {
  isBlock: boolean; // 占满一行展示
}

const Focus = (
  WrappedComponent: ComponentType<any>
): FunctionComponent<FocusProps> => {
  return props => {
    const { blockProps, isBlock, ...rest } = props;

    return (
      <div className={styles.clear} onClick={blockProps.focusNextLine}>
        <div
          onClick={stopPropagation}
          className={clsx(styles.focus, isBlock && styles.block)}
          tabIndex={0}
          onFocus={blockProps.focusCurrentBlock}
        >
          <WrappedComponent {...rest} />
        </div>
      </div>
    );
  };
};

export default Focus;
