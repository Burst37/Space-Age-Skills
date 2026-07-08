'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  intensity?: number;
  glare?: boolean;
  className?: string;
}

export default function TiltCard({
  children,
  intensity = 0.5,
  glare = false,
  className = '',
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(
        window.matchMedia('(hover: none)').matches || window.innerWidth < 768
      );
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile || prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxDeg = 15 * intensity;
    setTransform(
      `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) scale3d(1.02,1.02,1.02)`
    );
    if (glare) {
      setGlarePos({
        x: (e.clientX - rect.left) / rect.width * 100,
        y: (e.clientY - rect.top) / rect.height * 100,
        opacity: 0.15,
      });
    }
  }

  function handleMouseLeave() {
    setTransform('');
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
            transition: 'opacity 0.2s',
          }}
        />
      )}
    </div>
  );
}
