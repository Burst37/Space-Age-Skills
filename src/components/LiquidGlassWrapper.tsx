'use client'

/**
 * Liquid glass wrapper using `liquid-glass-react`.
 * Integrates with VL-01 Dark Glassmorphism tokens.
 *
 * Install: npm install liquid-glass-react
 *
 * Usage:
 *   import LiquidGlassWrapper from '@/components/LiquidGlassWrapper'
 *   <LiquidGlassWrapper cornerRadius={16}><YourContent /></LiquidGlassWrapper>
 *
 * If the package is not installed, falls back to native VL-01 glass styling.
 */

import React, { useRef, ComponentProps, ReactNode } from 'react'

interface LiquidGlassWrapperProps {
  children: ReactNode
  /** Border radius in px — match your component's border-radius */
  cornerRadius?: number
  /** Refraction style */
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
  /** Displacement intensity (default 70) */
  displacementScale?: number
  /** Frosting level (default 0.0625) */
  blurAmount?: number
  /** Color saturation (default 120 — tuned for VL-01 dark base) */
  saturation?: number
  /** Chromatic aberration (default 2) */
  aberrationIntensity?: number
  /** Elastic liquid feel 0–1 (default 0.15) */
  elasticity?: number
  /** CSS padding */
  padding?: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  /** Ref of the container to track mouse over — use for full-screen panels */
  mouseContainer?: React.RefObject<HTMLElement | null> | null
}

let _LiquidGlass: React.ComponentType<Record<string, unknown>> | null = null

function getLiquidGlass() {
  if (_LiquidGlass !== null) return _LiquidGlass
  try {
    // Dynamic require so missing package doesn't break the build
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _LiquidGlass = require('liquid-glass-react').default
  } catch {
    _LiquidGlass = undefined as unknown as null
  }
  return _LiquidGlass
}

export default function LiquidGlassWrapper({
  children,
  cornerRadius = 16,
  mode = 'standard',
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 120,
  aberrationIntensity = 2,
  elasticity = 0.15,
  padding,
  className = '',
  style,
  onClick,
  mouseContainer,
}: LiquidGlassWrapperProps) {
  const LiquidGlass = getLiquidGlass()

  if (!LiquidGlass) {
    // Fallback: native VL-01 glass styling
    return (
      <div
        className={className}
        style={{
          backdropFilter: 'blur(48px) saturate(200%)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: cornerRadius,
          padding,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }

  return (
    <LiquidGlass
      cornerRadius={cornerRadius}
      mode={mode}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      padding={padding}
      className={className}
      style={style}
      onClick={onClick}
      mouseContainer={mouseContainer}
      overLight={false}
    >
      {children}
    </LiquidGlass>
  )
}
