'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';

interface Step {
  label: string;
  content: ReactNode;
}

interface Props {
  steps: Step[];
  className?: string;
}

export default function PinnedSection({ steps, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // useMotionValueEvent avoids calling hooks inside loops
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveIndex(Math.min(Math.floor(v * steps.length), steps.length - 1));
  });

  const stickyY = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);

  if (prefersReduced) {
    return (
      <div className={`space-y-8 ${className}`}>
        {steps.map((step, i) => (
          <div key={i} className="p-8 border border-white/10 rounded-xl">
            <p className="text-sm text-white/50 mb-2">0{i + 1}</p>
            <h3 className="text-xl font-semibold mb-4">{step.label}</h3>
            {step.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${steps.length * 100}vh` }}
    >
      <motion.div
        className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ y: stickyY }}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
          {/* Step navigator */}
          <div className="flex flex-col justify-center gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i === activeIndex ? 1 : 0.3,
                  x: i === activeIndex ? 0 : -12,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  style={{
                    borderLeft: `2px solid ${
                      i === activeIndex
                        ? 'rgba(139,92,246,1)'
                        : 'rgba(255,255,255,0.15)'
                    }`,
                    paddingLeft: '1.5rem',
                    transition: 'border-color 0.4s',
                  }}
                >
                  <p className="text-xs text-white/40 mb-1">0{i + 1}</p>
                  <h3 className="text-lg font-semibold text-white">{step.label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Active content panel */}
          <div className="relative flex items-center">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 flex items-center"
                animate={{
                  opacity: i === activeIndex ? 1 : 0,
                  y: i === activeIndex ? 0 : 20,
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {step.content}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
