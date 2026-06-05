'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ClipTransitionProps {
  children: ReactNode;
  shape?: 'triangle' | 'diamond' | 'hexagon';
  className?: string;
  delay?: number;
}

const shapes = {
  triangle: {
    hidden:  'polygon(50% 0%, 50% 0%, 50% 0%)',
    full:    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  diamond: {
    hidden:  'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    full:    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  hexagon: {
    hidden:  'polygon(50% 25%, 50% 25%, 50% 75%, 50% 75%)',
    full:    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
};

export default function ClipTransition({
  children,
  shape = 'diamond',
  className,
  delay = 0,
}: ClipTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: shapes[shape].hidden, opacity: 0 }}
      whileInView={{ clipPath: shapes[shape].full, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
