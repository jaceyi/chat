import * as React from 'react';
import { animated, interpolate, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import * as styles from './style.scss';

interface ImageProps {
  src: string;
}

const Image = ({ src }: ImageProps) => {
  const [{ size }, set] = useSpring(() => ({ size: 1 }));

  const bind = useGesture({
    onPointerDown: () => {
      set({ size: 0.95 });
    },
    onPointerUp: () => {
      set({ size: 1 });
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{
        transform: interpolate([size], s => `scale(${s})`)
      }}
      className={styles.box}
    >
      <img className={styles.img} src={src} alt="" />
    </animated.div>
  );
};

export default Image;
