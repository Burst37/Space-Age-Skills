'use client';

import React, { useId, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Reduced-motion detection hook
// ---------------------------------------------------------------------------
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
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
// Generate radial lens normal map as a data-URI via canvas
// Encoding: pixel.r = 128 + normalX*127, pixel.g = 128 + normalY*127
// This creates a convex lens profile — center flat, edges curve outward
// ---------------------------------------------------------------------------
function generateDisplacementMap(size: number): string {
  const canvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(size, size)
      : (() => {
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          return c;
        })();

  const ctx = (canvas as OffscreenCanvas).getContext('2d') as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) return '';

  const imageData = ctx.createImageData(size, size);
  const { data } = imageData;
  const half = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - half) / half;
      const ny = (y - half) / half;
      const r = Math.sqrt(nx * nx + ny * ny);
      const clampedR = Math.min(r, 1);

      // Sine-based convex lens falloff — flat center, curved edge
      const lensProfile = Math.sin((clampedR * Math.PI) / 2);

      const normalX = r > 0 ? (nx / r) * lensProfile : 0;
      const normalY = r > 0 ? (ny / r) * lensProfile : 0;

      const idx = (y * size + x) * 4;
      data[idx + 0] = Math.round(128 + normalX * 127); // R → X displacement
      data[idx + 1] = Math.round(128 + normalY * 127); // G → Y displacement
      data[idx + 2] = 128;                              // B unused
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (canvas instanceof OffscreenCanvas) {
    const tmp = document.createElement('canvas');
    tmp.width = size;
    tmp.height = size;
    const tmpCtx = tmp.getContext('2d')!;
    tmpCtx.drawImage(canvas as unknown as HTMLCanvasElement, 0, 0);
    return tmp.toDataURL('image/png');
  }

  return (canvas as HTMLCanvasElement).toDataURL('image/png');
}

// ---------------------------------------------------------------------------
// Detect backdrop-filter: url() support (Chrome/Blink only)
// ---------------------------------------------------------------------------
function supportsBackdropUrl(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
  return CSS.supports('backdrop-filter', 'url(#x)');
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface LiquidGlassProps {
  children?: React.ReactNode;
  className?: string;
  /** 0–1, controls feDisplacementMap scale (scale = intensity * 55). Default 0.6 */
  intensity?: number;
  /** Chromatic aberration overlay (R=-2px, B=+2px channel offset). Default true */
  chromatic?: boolean;
  /** CSS border-radius. Default '9999px' (pill) */
  borderRadius?: string;
}

// ---------------------------------------------------------------------------
// Rim highlight — 4-layer inset box-shadow simulating curved glass edge
// Values from Crystal Lux UI Kit reverse-engineering
// ---------------------------------------------------------------------------
const RIM_SHADOW = [
  'inset 10px 10px 20px rgba(153,192,255,0.10)',
  'inset 2px 2px 5px rgba(195,218,255,0.20)',
  'inset -10px -10px 20px rgba(229,253,190,0.10)',
  'inset -2px -2px 30px rgba(247,255,226,0.20)',
].join(', ');

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LiquidGlass({
  children,
  className,
  intensity = 0.6,
  chromatic = true,
  borderRadius = '9999px',
}: LiquidGlassProps) {
  const uid = useId().replace(/:/g, '');
  const filterId = `lg-filter-${uid}`;
  const chromaticId = `lg-chroma-${uid}`;

  const reducedMotion = useReducedMotion();
  const mapRef = useRef<string>('');
  const [mapDataUri, setMapDataUri] = React.useState<string>('');
  const [browserSupports, setBrowserSupports] = React.useState<boolean>(false);

  // scale = max pixel displacement; 0.6 intensity → 33px warp at edges
  const scale = Math.round(intensity * 55);

  useEffect(() => {
    setBrowserSupports(supportsBackdropUrl());
    if (!mapRef.current) {
      mapRef.current = generateDisplacementMap(256);
    }
    setMapDataUri(mapRef.current);
  }, []);

  // Reduced motion: simple blur, no SVG distortion
  if (reducedMotion) {
    return (
      <div
        className={className}
        style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderRadius,
        }}
      >
        {children}
      </div>
    );
  }

  // Non-Chrome fallback: blur + rim shadows
  const fallbackStyle: React.CSSProperties = {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius,
    boxShadow: RIM_SHADOW,
  };

  if (!browserSupports || !mapDataUri) {
    return (
      <div className={className} style={fallbackStyle}>
        {children}
      </div>
    );
  }

  // Full SVG filter effect (Chrome/Blink)
  const fullStyle: React.CSSProperties = {
    backdropFilter: `url(#${filterId}) blur(20px) contrast(80%) saturate(120%)`,
    WebkitBackdropFilter: `url(#${filterId}) blur(20px) contrast(80%) saturate(120%)`,
    borderRadius,
    boxShadow: RIM_SHADOW,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      {/* Hidden SVG filter definitions */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <defs>
          {/* Primary displacement filter */}
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {/* Step 1: Pre-blur reduces aliasing artifacts */}
            <feGaussianBlur stdDeviation="2" result="preBlur" />

            {/* Step 2: Lens normal map drives displacement */}
            <feImage
              href={mapDataUri}
              result="dispMap"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
            {/* scale attr = max pixel displacement (intensity*55) */}
            <feDisplacementMap
              in="preBlur"
              in2="dispMap"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            {/* Step 3: Saturation boost — punches color through glass */}
            <feColorMatrix
              in="displaced"
              type="saturate"
              values="50"
              result="saturated"
            />

            {/* Step 4: Blend displaced+saturated over pre-blur */}
            <feBlend in="saturated" in2="preBlur" mode="luminosity" />
          </filter>

          {/* Chromatic aberration filter — 3-channel offset */}
          {chromatic && (
            <filter
              id={chromaticId}
              x="-5%"
              y="-5%"
              width="110%"
              height="110%"
              colorInterpolationFilters="sRGB"
            >
              {/* Red channel: isolate and shift -2px on X (inward) */}
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="redCh"
              />
              <feOffset in="redCh" dx="-2" dy="0" result="redShifted" />

              {/* Green channel: reference, no shift */}
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="greenCh"
              />

              {/* Blue channel: isolate and shift +2px on X (outward) */}
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blueCh"
              />
              <feOffset in="blueCh" dx="2" dy="0" result="blueShifted" />

              {/* Merge all three channels via screen blend */}
              <feBlend in="redShifted" in2="greenCh" mode="screen" result="rg" />
              <feBlend in="rg" in2="blueShifted" mode="screen" />
            </filter>
          )}
        </defs>
      </svg>

      <div className={className} style={fullStyle}>
        {/* Chromatic aberration overlay — subtle color fringing at edges */}
        {chromatic && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius,
              filter: `url(#${chromaticId})`,
              opacity: 0.15,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        )}
        {children}
      </div>
    </>
  );
}
