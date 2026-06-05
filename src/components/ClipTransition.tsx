'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

type Shape = 'triangle' | 'diamond' | 'hexagon';

interface Props {
  children: ReactNode;
  shape?: Shape;
  delay?: number;
  className?: string;
}

const shapes: Record<Shape, { hidden: string; full: string }> = {
  triangle: {
    hidden: 'polygon(50% 0%, 0% 100%, 100% 100%, 50% 0%)',
    full:   'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
  },
  diamond: {
    hidden: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
    full:   'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
  },
  hexagon: {
    hidden: 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 100%)',
    full:   'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  },
};

export default function ClipTransition({
  children,
  shape = 'diamond',
  delay = 0,
  className = '',
}: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { clipPath: shapes[shape].hidden, opacity: 0 }
      }
      whileInView={
        prefersReduced
          ? { opacity: 1 }
          : { clipPath: shapes[shape].full, opacity: 1 }
      }
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: prefersReduced ? 0.2 : 1,
        delay: prefersReduced ? 0 : delay,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
