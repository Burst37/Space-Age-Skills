'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  intensity?: 'subtle' | 'standard' | 'dramatic';
}

const directionMap = {
  up:    (o: number) => ({ y: o }),
  down:  (o: number) => ({ y: -o }),
  left:  (o: number) => ({ x: o }),
  right: (o: number) => ({ x: -o }),
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  intensity = 'standard',
}: Props) {
  const prefersReduced = useReducedMotion();
  const offset = { subtle: 20, standard: 40, dramatic: 60 }[intensity];

  const initial = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, ...directionMap[direction](offset) };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: prefersReduced ? 0.2 : 0.7,
        delay: prefersReduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
