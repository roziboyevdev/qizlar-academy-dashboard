import React, { useEffect, useRef } from 'react';

interface AmbientCanvasProps {
  density?: number;
  className?: string;
}

const COLORS = [
  'rgba(236, 94, 148, 0.55)',
  'rgba(168, 136, 214, 0.55)',
  'rgba(184, 232, 201, 0.45)',
  'rgba(255, 213, 226, 0.7)',
];

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  c: string;
  glow: number;
  phase: number;
  speed: number;
}

/**
 * Lightweight pastel ambient particle field rendered to a single canvas.
 * Cheap on CPU/GPU; gracefully no-ops when density === 0.
 */
export const AmbientCanvas: React.FC<AmbientCanvasProps> = ({
  density = 30,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (density <= 0) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = wrap.clientWidth;
    let height = wrap.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.6);

    const resize = () => {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const particles: Particle[] = Array.from({ length: density }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.4 + Math.random() * 2.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.12 - Math.random() * 0.32,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      glow: 6 + Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.8,
    }));

    let last = performance.now();
    let visible = true;

    const onVis = () => {
      visible = document.visibilityState === 'visible';
      if (visible) {
        last = performance.now();
        loop(last);
      } else if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = (now: number) => {
      if (!visible) return;
      const dt = Math.min(50, now - last);
      last = now;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.phase += 0.0015 * dt * p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.18;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.c;
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density]);

  if (density <= 0) return null;

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};
