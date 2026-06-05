'use client';
import { useRef, MouseEvent, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  intensity = 15,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -intensity;
    const rotateY = (x - 0.5) * intensity;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12), transparent 60%)`;
    }
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.15s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
