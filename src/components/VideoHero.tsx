'use client';

import { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  src: string;
  poster?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function VideoHero({
  src,
  poster,
  overlayOpacity = 0.4,
  children,
  className = '',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!prefersReduced && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [prefersReduced]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {prefersReduced ? (
        poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
