import * as React from 'react';
import * as styles from './style.scss';
import type { ComponentType, FunctionComponent } from 'react';
import type { AtomicBlockProps } from '../..';
import { stopPropagation } from '@/utils';
import clsx from 'clsx';

const Focus = (
  WrappedComponent: ComponentType
): FunctionComponent<{
  blockProps: AtomicBlockProps;
  isBlock: boolean; // 占满一行展示
}> => {
  return props => {
    const { blockProps, isBlock, ...rest } = props;

    return (
      <div onClick={blockProps.focusNextLine}>
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
