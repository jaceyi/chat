import * as React from 'react';
import * as styles from './style.scss';
import type { ComponentType, FunctionComponent } from 'react';
import type { AtomicBlockProps } from '../..';

const Focus = (
  WrappedComponent: ComponentType
): FunctionComponent<{
  blockProps: AtomicBlockProps;
}> => {
  return props => {
    const { blockProps, ...rest } = props;

    return (
      <div onClick={blockProps.focusNextLine}>
        <div
          className={styles.focus}
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
