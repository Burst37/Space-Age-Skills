'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ElementType } from 'react';

interface Props {
  text: string;
  splitBy?: 'word' | 'char';
  className?: string;
  delay?: number;
  as?: ElementType;
}

export default function KineticText({
  text,
  splitBy = 'word',
  className = '',
  delay = 0,
  as: Tag = 'h1',
}: Props) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const units = splitBy === 'word' ? text.split(' ') : text.split('');
  const stagger = splitBy === 'char' ? 0.03 : 0.08;
  const gap = splitBy === 'char' ? '0' : '0.25em';

  return (
    <Tag
      className={className}
      aria-label={text}
      style={{ display: 'flex', flexWrap: 'wrap', gap }}
    >
      {units.map((unit, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {unit}
        </motion.span>
      ))}
    </Tag>
  );
}
