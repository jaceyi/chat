import { useEffect, useRef } from 'react';

/**
 * @description 此 hooks 类似于 class 组件的额 componentDidUpdate 不包含 DidMount
 */
export const useDidUpdate = (callback, inputs) => {
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    callback?.();
  }, inputs);
};
