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

// ---------------------------------------------------------------------------
// Color math — hex → HSL → shift lightness → hex
// Required because neumorphism shadow colors must be derived from bg color
// ---------------------------------------------------------------------------
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
    case gn: h = ((bn - rn) / d + 2) / 6; break;
    default:  h = ((rn - gn) / d + 4) / 6; break;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hueChannel(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  let r: number, g: number, b: number;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    r = hueChannel(p, q, hn + 1 / 3);
    g = hueChannel(p, q, hn);
    b = hueChannel(p, q, hn - 1 / 3);
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function adjustLightness(hex: string, delta: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + delta)));
}

// ---------------------------------------------------------------------------
// Shadow builder
// Formula: dark shadow = bg - 15% lightness, light shadow = bg + 15% lightness
// Raised: offset/blur outward. Pressed: inset. Flat: none.
// ---------------------------------------------------------------------------
type NeuState = 'raised' | 'flat' | 'pressed';
type NeuSize  = 'sm' | 'md' | 'lg';

const SIZE_CONFIG: Record<NeuSize, { offset: number; blur: number; radius: number }> = {
  sm: { offset: 4,  blur: 8,  radius: 8  },
  md: { offset: 8,  blur: 16, radius: 16 },
  lg: { offset: 12, blur: 24, radius: 24 },
};

function buildBoxShadow(
  state: NeuState,
  { offset, blur }: { offset: number; blur: number },
  dark: string,
  light: string
): string | undefined {
  if (state === 'raised') {
    return [
      `${offset}px ${offset}px ${blur}px ${dark}`,
      `-${offset}px -${offset}px ${blur}px ${light}`,
    ].join(', ');
  }
  if (state === 'pressed') {
    const hblur = Math.round(blur / 2);
    return [
      `inset ${offset}px ${offset}px ${hblur}px ${dark}`,
      `inset -${offset}px -${offset}px ${hblur}px ${light}`,
    ].join(', ');
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface NeumorphicSurfaceProps {
  children?: React.ReactNode;
  className?: string;
  /** Background color as hex. MUST match parent background. Default '#e0e5ec' */
  bg?: string;
  /** Surface state. Default 'raised' */
  state?: NeuState;
  /** Size preset controlling shadow offsets. Default 'md' */
  size?: NeuSize;
  /** Click toggles raised ↔ pressed. Default false */
  interactive?: boolean;
}

export default function NeumorphicSurface({
  children,
  className,
  bg = '#e0e5ec',
  state: stateProp = 'raised',
  size = 'md',
  interactive = false,
}: NeumorphicSurfaceProps) {
  const reducedMotion = useReducedMotion();
  const [internalState, setInternalState] = useState<NeuState>(stateProp);

  useEffect(() => { setInternalState(stateProp); }, [stateProp]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    setInternalState(prev => prev === 'raised' ? 'pressed' : 'raised');
  }, [interactive]);

  const cfg = SIZE_CONFIG[size];
  const dark  = adjustLightness(bg, -15);
  const light = adjustLightness(bg, +15);
  const boxShadow = buildBoxShadow(internalState, cfg, dark, light);

  const style: React.CSSProperties = {
    background: bg,          // MUST equal parent bg
    borderRadius: `${cfg.radius}px`,
    boxShadow: boxShadow ?? 'none',
    ...(reducedMotion ? {} : { transition: 'box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)' }),
    ...(interactive ? { cursor: 'pointer', userSelect: 'none' } : {}),
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive
        ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }
        : undefined
      }
    >
      {children}
    </div>
  );
}
