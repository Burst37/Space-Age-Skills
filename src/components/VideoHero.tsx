'use client';
import { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface VideoHeroProps {
  src: string;
  poster?: string;
  children?: ReactNode;
  overlayOpacity?: number;
  className?: string;
  style?: CSSProperties;
}

export default function VideoHero({
  src,
  poster,
  children,
  overlayOpacity = 0.6,
  className = '',
  style,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `rgba(3,3,10,${overlayOpacity})`,
          zIndex: 1,
        }}
      />
      <motion.div
        style={{ position: 'relative', zIndex: 2, height: '100%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
