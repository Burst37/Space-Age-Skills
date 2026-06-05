'use client';

import React, { useEffect, useState } from 'react';

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

export type GlassVariant = 'light' | 'dark' | 'colored';
export type GlassDepth = 'flat' | 'raised' | 'floating';

export interface GlassmorphicCardProps {
  children?: React.ReactNode;
  className?: string;
  /** Visual variant. Default 'dark' */
  variant?: GlassVariant;
  /** Blur radius in px. Default 12 */
  blur?: number;
  /** Saturation %. Default 180 — pumps color through the glass */
  saturation?: number;
  /** Border opacity 0–1. Default 0.2 */
  borderOpacity?: number;
  /** Shadow depth. Default 'raised' */
  depth?: GlassDepth;
}

// Exact box-shadow values from research
const DEPTH_SHADOWS: Record<GlassDepth, string> = {
  flat: 'none',
  raised: '0 8px 32px 0 rgba(0,0,0,0.37)',
  floating:
    '0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
};

export default function GlassmorphicCard({
  children,
  className,
  variant = 'dark',
  blur = 12,
  saturation = 180,
  borderOpacity = 0.2,
  depth = 'raised',
}: GlassmorphicCardProps) {
  const reducedMotion = useReducedMotion();

  const buildStyle = (): React.CSSProperties => {
    const boxShadow = DEPTH_SHADOWS[depth];
    const borderRadius = '16px';
    const shadow = boxShadow === 'none' ? undefined : boxShadow;

    // Reduced motion: skip backdrop-filter (layout shift risk), solid bg instead
    if (reducedMotion) {
      const solidBg: Record<GlassVariant, string> = {
        dark: 'rgba(0,0,0,0.55)',
        light: 'rgba(255,255,255,0.25)',
        colored: 'rgba(139,92,246,0.35)',
      };
      const border: Record<GlassVariant, string> = {
        dark: `1px solid rgba(255,255,255,${borderOpacity})`,
        light: `1px solid rgba(255,255,255,${borderOpacity})`,
        colored: '1px solid rgba(139,92,246,0.3)',
      };
      return { background: solidBg[variant], border: border[variant], borderRadius, boxShadow: shadow };
    }

    switch (variant) {
      case 'dark':
        return {
          // brightness(0.8) darkens the blurred bg so content reads on top
          backdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(0.8)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(0.8)`,
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid rgba(255,255,255,${borderOpacity})`,
          borderRadius,
          boxShadow: shadow,
        };

      case 'light':
        return {
          // saturate(180%) — without this the blur looks grey and dead
          backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
          background: 'rgba(255,255,255,0.12)',
          border: `1px solid rgba(255,255,255,${borderOpacity})`,
          borderRadius,
          boxShadow: shadow,
        };

      case 'colored':
        return {
          // hue-rotate(10deg) shifts the blurred bg toward violet tint
          backdropFilter: `blur(${blur}px) saturate(${saturation}%) hue-rotate(10deg)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) hue-rotate(10deg)`,
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius,
          boxShadow: shadow,
        };

      default:
        return {};
    }
  };

  return (
    <div className={className} style={buildStyle()}>
      {children}
    </div>
  );
}
