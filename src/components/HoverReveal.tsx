'use client';

import React, { useState, useEffect, useCallback } from 'react';

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export type RevealMethod = 'clip' | 'mask' | 'slide';
export type RevealDirection = 'left' | 'right' | 'up' | 'down';

export interface HoverRevealProps {
  children?: React.ReactNode;
  className?: string;
  /** Animation method. Default 'clip' */
  method?: RevealMethod;
  /** Reveal direction. Default 'up' */
  direction?: RevealDirection;
  /** Transition duration in seconds. Default 0.5 */
  duration?: number;
  /** CSS easing. Default 'cubic-bezier(0.76,0,0.24,1)' */
  easing?: string;
}

// ---------------------------------------------------------------------------
// clip-path values per direction
// Hardware accelerated — does not trigger layout recalculation
// ---------------------------------------------------------------------------
const CLIP_INITIAL: Record<RevealDirection, string> = {
  up:    'inset(100% 0 0 0)',
  down:  'inset(0 0 100% 0)',
  left:  'inset(0 0 0 100%)',
  right: 'inset(0 100% 0 0)',
};
const CLIP_REVEALED: Record<RevealDirection, string> = {
  up:    'inset(0% 0 0 0)',
  down:  'inset(0 0 0% 0)',
  left:  'inset(0 0 0 0%)',
  right: 'inset(0 0% 0 0)',
};

// ---------------------------------------------------------------------------
// mask-image gradient + mask-position animation
// Technique from Smashing Magazine — single <img>, no extra markup
// ---------------------------------------------------------------------------
function getMaskStyle(direction: RevealDirection, revealed: boolean): React.CSSProperties {
  const gradientMap: Record<RevealDirection, string> = {
    up:    'linear-gradient(to top, black 50%, transparent 50%)',
    down:  'linear-gradient(to bottom, black 50%, transparent 50%)',
    left:  'linear-gradient(to left, black 50%, transparent 50%)',
    right: 'linear-gradient(to right, black 50%, transparent 50%)',
  };
  const sizeMap: Record<RevealDirection, string> = {
    up:    '100% 200%',
    down:  '100% 200%',
    left:  '200% 100%',
    right: '200% 100%',
  };
  const posInitial: Record<RevealDirection, string> = {
    up:    '0 100%',
    down:  '0 -100%',
    left:  '100% 0',
    right: '-100% 0',
  };
  const posRevealed: Record<RevealDirection, string> = {
    up:    '0 0%',
    down:  '0 0%',
    left:  '0% 0',
    right: '0% 0',
  };
  return {
    maskImage: gradientMap[direction],
    WebkitMaskImage: gradientMap[direction],
    maskSize: sizeMap[direction],
    WebkitMaskSize: sizeMap[direction],
    maskPosition: revealed ? posRevealed[direction] : posInitial[direction],
    WebkitMaskPosition: revealed ? posRevealed[direction] : posInitial[direction],
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
}

// ---------------------------------------------------------------------------
// slide: overflow:hidden + translateY/X — most compatible
// ---------------------------------------------------------------------------
function getSlideTransform(direction: RevealDirection, revealed: boolean): string {
  if (revealed) return 'translate(0, 0)';
  const map: Record<RevealDirection, string> = {
    up:    'translateY(100%)',
    down:  'translateY(-100%)',
    left:  'translateX(100%)',
    right: 'translateX(-100%)',
  };
  return map[direction];
}

// ---------------------------------------------------------------------------
// HoverReveal
// ---------------------------------------------------------------------------
export default function HoverReveal({
  children,
  className,
  method = 'clip',
  direction = 'up',
  duration = 0.5,
  easing = 'cubic-bezier(0.76,0,0.24,1)',
}: HoverRevealProps) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const transition = `${duration}s ${easing}`;

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (method === 'clip') {
    const clipPath = hovered ? CLIP_REVEALED[direction] : CLIP_INITIAL[direction];
    return (
      <div className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div style={{
          clipPath,
          WebkitClipPath: clipPath,
          transition: `clip-path ${transition}, -webkit-clip-path ${transition}`,
        }}>
          {children}
        </div>
      </div>
    );
  }

  if (method === 'mask') {
    const maskStyle = getMaskStyle(direction, hovered);
    const maskTransition = ['mask-position', '-webkit-mask-position']
      .map(p => `${p} ${transition}`).join(', ');
    return (
      <div className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div style={{ ...maskStyle, transition: maskTransition }}>
          {children}
        </div>
      </div>
    );
  }

  // slide
  return (
    <div
      className={className}
      style={{ overflow: 'hidden' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{
        transform: getSlideTransform(direction, hovered),
        transition: `transform ${transition}`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HoverRevealGroup — triggers staggered reveal on all children from parent hover
// ---------------------------------------------------------------------------
export interface HoverRevealGroupProps {
  children?: React.ReactNode;
  className?: string;
  method?: RevealMethod;
  direction?: RevealDirection;
  duration?: number;
  easing?: string;
  /** Delay between each child in seconds. Default 0.05 */
  stagger?: number;
}

export function HoverRevealGroup({
  children,
  className,
  method = 'clip',
  direction = 'up',
  duration = 0.5,
  easing = 'cubic-bezier(0.76,0,0.24,1)',
  stagger = 0.05,
}: HoverRevealGroupProps) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  if (reducedMotion) return <div className={className}>{children}</div>;

  const childArray = React.Children.toArray(children);

  return (
    <div className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {childArray.map((child, i) => {
        const t = `${duration}s ${i * stagger}s ${easing}`;

        if (method === 'clip') {
          const clipPath = hovered ? CLIP_REVEALED[direction] : CLIP_INITIAL[direction];
          return (
            <div key={i} style={{
              clipPath,
              WebkitClipPath: clipPath,
              transition: `clip-path ${t}, -webkit-clip-path ${t}`,
            }}>{child}</div>
          );
        }

        if (method === 'mask') {
          const maskStyle = getMaskStyle(direction, hovered);
          const maskTransition = ['mask-position', '-webkit-mask-position']
            .map(p => `${p} ${t}`).join(', ');
          return (
            <div key={i} style={{ ...maskStyle, transition: maskTransition }}>{child}</div>
          );
        }

        return (
          <div key={i} style={{ overflow: 'hidden' }}>
            <div style={{
              transform: getSlideTransform(direction, hovered),
              transition: `transform ${t}`,
            }}>{child}</div>
          </div>
        );
      })}
    </div>
  );
}
