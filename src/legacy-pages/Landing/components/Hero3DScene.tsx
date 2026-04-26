import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Hero3DSceneProps {
  butterflyCount?: number;
  crystalCount?: number;
  petalCount?: number;
  /** Optional hybrid integration point: render a custom 3D-feel node
   *  (e.g. a Spline/glTF embed wrapper) alongside the procedural elements. */
  externalAsset?: React.ReactNode;
}

/* ─────────────── SHAPE PRIMITIVES ─────────────── */

const Wing: React.FC<{ color: string; mirrored?: boolean }> = ({ color, mirrored }) => (
  <svg
    width="80"
    height="68"
    viewBox="0 0 80 68"
    style={{ transform: mirrored ? 'scaleX(-1)' : undefined, display: 'block' }}
  >
    <defs>
      <radialGradient id={`wg-${color.replace('#', '')}`} cx="60%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="40%" stopColor={color} stopOpacity="0.95" />
        <stop offset="100%" stopColor="#a888d6" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    <path
      d="M40 36 C28 8 6 4 4 22 C2 42 18 60 32 62 C40 62 42 50 40 36 Z"
      fill={`url(#wg-${color.replace('#', '')})`}
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="0.6"
    />
    <circle cx="18" cy="22" r="3" fill="#ffffff" opacity="0.55" />
    <circle cx="22" cy="42" r="2" fill="#ffffff" opacity="0.45" />
  </svg>
);

const Butterfly3D: React.FC<{ color: string; flapMs: number }> = ({ color, flapMs }) => {
  const reduce = useReducedMotion();
  const flap = reduce
    ? undefined
    : { rotateY: [-55, 25, -55] };
  const flapMirror = reduce
    ? undefined
    : { rotateY: [55, -25, 55] };

  return (
    <div className="butterfly-3d">
      <motion.div
        className="butterfly-wing left"
        animate={flap}
        transition={{
          duration: flapMs / 1000,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Wing color={color} />
      </motion.div>
      <div className="butterfly-body" />
      <motion.div
        className="butterfly-wing right"
        animate={flapMirror}
        transition={{
          duration: flapMs / 1000,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Wing color={color} mirrored />
      </motion.div>
    </div>
  );
};

const Crystal3D: React.FC<{ color: string; spinMs: number }> = ({ color, spinMs }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="crystal-3d"
      animate={
        reduce
          ? undefined
          : { rotateY: 360, rotateX: [-12, 18, -12] }
      }
      transition={{
        rotateY: { duration: spinMs / 1000, repeat: Infinity, ease: 'linear' },
        rotateX: { duration: (spinMs / 1000) * 1.4, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg width="72" height="92" viewBox="0 0 72 92">
        <defs>
          <linearGradient id={`cgrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a888d6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id={`cgloss-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M36 4 L62 26 L52 84 L20 84 L10 26 Z"
          fill={`url(#cgrad-${color.replace('#', '')})`}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
        />
        <path
          d="M10 26 L36 38 L62 26 M36 38 L52 84 M36 38 L20 84"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.9"
          fill="none"
        />
        <path
          d="M36 4 L62 26 L36 38 Z"
          fill={`url(#cgloss-${color.replace('#', '')})`}
        />
      </svg>
    </motion.div>
  );
};

const Petal3D: React.FC<{ color: string; spinMs: number }> = ({ color, spinMs }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="petal-3d"
      animate={
        reduce
          ? undefined
          : { rotateZ: 360, rotateX: [10, -10, 10] }
      }
      transition={{
        rotateZ: { duration: spinMs / 1000, repeat: Infinity, ease: 'linear' },
        rotateX: { duration: (spinMs / 1000) * 0.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg width="56" height="72" viewBox="0 0 56 72">
        <defs>
          <linearGradient id={`pgrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a888d6" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path
          d="M28 4 C46 18 50 44 28 68 C6 44 10 18 28 4 Z"
          fill={`url(#pgrad-${color.replace('#', '')})`}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.8"
        />
        <path
          d="M28 12 C40 26 42 42 28 60"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.6"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

const Heart3D: React.FC<{ spinMs: number }> = ({ spinMs }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="heart-3d"
      animate={reduce ? undefined : { rotateY: 360 }}
      transition={{ duration: spinMs / 1000, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="44" height="40" viewBox="0 0 44 40">
        <defs>
          <linearGradient id="hgrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd5e6" />
            <stop offset="60%" stopColor="#ec5e94" />
            <stop offset="100%" stopColor="#a888d6" />
          </linearGradient>
        </defs>
        <path
          d="M22 38 C8 26 2 18 2 11 C2 5 7 1 12 1 C17 1 22 6 22 9 C22 6 27 1 32 1 C37 1 42 5 42 11 C42 18 36 26 22 38 Z"
          fill="url(#hgrad)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.8"
        />
        <ellipse cx="14" cy="10" rx="4" ry="2.5" fill="#ffffff" opacity="0.5" />
      </svg>
    </motion.div>
  );
};

/* ─────────────── PARTICLES (DOM-cheap) ─────────────── */

const Particle: React.FC<{
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  color: string;
}> = ({ size, left, top, duration, delay, color }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="hero-particle"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={
        reduce
          ? { opacity: 0.55 }
          : {
              opacity: [0, 0.85, 0.85, 0],
              y: [0, -120, -240, -360],
              scale: [0.6, 1, 1, 0.5],
            }
      }
      transition={
        reduce
          ? undefined
          : { duration, repeat: Infinity, delay, ease: 'easeOut' }
      }
    />
  );
};

/* ─────────────── SCENE ─────────────── */

interface SceneItem {
  id: string;
  cls: string;
  style: React.CSSProperties;
  floatDur: number;
  floatDelay: number;
  drift: number;
  depth: number;
  node: React.ReactNode;
}

const BUTTERFLY_COLORS = ['#ec5e94', '#a888d6', '#f490b3'];
const CRYSTAL_COLORS = ['#ffb5cc', '#c4a8f0', '#b8e8c9', '#ffd5e6'];
const PETAL_COLORS = ['#ffb5cc', '#c4a8f0', '#90d6ac', '#ffd5e6', '#a888d6', '#f490b3'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Pure CSS-3D + SVG + Framer-Motion adaptive feminine scene.
 * Uses CSS `perspective` + `transform-style: preserve-3d` + `translateZ`
 * to render butterflies, crystals, petals, hearts and ambient sparkles
 * with a believable 3D feel — no Three.js, no R3F, no WebGL.
 *
 * Includes a subtle parallax tied to mouse position for desktop depth.
 * Renders nothing when all element counts are 0.
 */
export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  butterflyCount = 3,
  crystalCount = 4,
  petalCount = 6,
  externalAsset,
}) => {
  const reduce = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduce]);

  const items: SceneItem[] = useMemo(() => {
    const out: SceneItem[] = [];
    for (let i = 0; i < butterflyCount; i++) {
      const color = BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length];
      out.push({
        id: `bfly-${i}`,
        cls: 'scene-butterfly',
        style: {
          left: `${rand(8, 88)}%`,
          top: `${rand(10, 70)}%`,
          width: `${rand(80, 120)}px`,
        },
        floatDur: rand(8, 14),
        floatDelay: rand(0, 4),
        drift: rand(20, 50),
        depth: rand(40, 130),
        node: <Butterfly3D color={color} flapMs={rand(380, 620)} />,
      });
    }
    for (let i = 0; i < crystalCount; i++) {
      const color = CRYSTAL_COLORS[i % CRYSTAL_COLORS.length];
      out.push({
        id: `cry-${i}`,
        cls: 'scene-crystal',
        style: {
          left: `${rand(4, 92)}%`,
          top: `${rand(10, 80)}%`,
          width: `${rand(50, 90)}px`,
        },
        floatDur: rand(7, 13),
        floatDelay: rand(0, 3),
        drift: rand(18, 40),
        depth: rand(-60, 80),
        node: <Crystal3D color={color} spinMs={rand(6000, 12000)} />,
      });
    }
    for (let i = 0; i < petalCount; i++) {
      const color = PETAL_COLORS[i % PETAL_COLORS.length];
      out.push({
        id: `ptl-${i}`,
        cls: 'scene-petal',
        style: {
          left: `${rand(2, 95)}%`,
          top: `${rand(8, 88)}%`,
          width: `${rand(40, 70)}px`,
        },
        floatDur: rand(8, 16),
        floatDelay: rand(0, 5),
        drift: rand(15, 35),
        depth: rand(-100, 120),
        node: <Petal3D color={color} spinMs={rand(8000, 16000)} />,
      });
    }
    if (butterflyCount > 0) {
      out.push({
        id: 'heart-1',
        cls: 'scene-heart',
        style: { right: '8%', bottom: '14%', width: '54px' },
        floatDur: 9,
        floatDelay: 1.2,
        drift: 28,
        depth: 50,
        node: <Heart3D spinMs={7000} />,
      });
    }
    return out;
  }, [butterflyCount, crystalCount, petalCount]);

  const particles = useMemo(() => {
    if (reduce) return [];
    const count = butterflyCount + crystalCount + petalCount > 0 ? 18 : 0;
    return Array.from({ length: count }).map((_, i) => ({
      key: `p${i}`,
      size: rand(3, 7),
      left: `${rand(2, 98)}%`,
      top: `${rand(60, 100)}%`,
      duration: rand(8, 16),
      delay: rand(0, 8),
      color: ['rgba(236,94,148,0.65)', 'rgba(168,136,214,0.65)', 'rgba(255,213,230,0.85)'][
        i % 3
      ],
    }));
  }, [reduce, butterflyCount, crystalCount, petalCount]);

  if (butterflyCount + crystalCount + petalCount === 0) return null;

  const parallaxStyle = reduce
    ? undefined
    : {
        transform: `translate3d(${parallax.x * 12}px, ${parallax.y * 8}px, 0)`,
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      };

  return (
    <div className="hero-3d-scene" ref={sceneRef}>
      <div className="hero-3d-stage" style={parallaxStyle}>
        {items.map((it) => (
          <motion.div
            key={it.id}
            className={`scene-item ${it.cls}`}
            style={{ ...it.style, transform: `translateZ(${it.depth}px)` }}
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -it.drift, 0, it.drift * 0.6, 0],
                    x: [0, it.drift * 0.4, 0, -it.drift * 0.5, 0],
                    rotateZ: [0, 6, 0, -4, 0],
                  }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: it.floatDur,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: it.floatDelay,
                  }
            }
          >
            {it.node}
          </motion.div>
        ))}

        {particles.map((p) => (
          <Particle
            key={p.key}
            size={p.size}
            left={p.left}
            top={p.top}
            duration={p.duration}
            delay={p.delay}
            color={p.color}
          />
        ))}

        {externalAsset}
      </div>
    </div>
  );
};

export default Hero3DScene;
