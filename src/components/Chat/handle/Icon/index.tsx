import * as React from 'react';
import { ReactNode } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import * as styles from './style.scss';

interface IconProps {
  children: ReactNode;
}

const Icon = ({ children }: IconProps) => {
  const [{ size, r }, set] = useSpring(() => ({ size: 1, r: 0 }));

  const bind = useGesture({
    onMoveStart: () => {
      set({ size: 1.2, r: -10 });
    },
    onMoveEnd: () => {
      set({ size: 1, r: 0 });
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{
        transform: interpolate(
          [size, r],
          (s, r) => `scale(${s}) rotate(${r}deg)`
        )
      }}
      className={styles.icon}
    >
      {children}
    </animated.div>
  );
};

export default Icon;
