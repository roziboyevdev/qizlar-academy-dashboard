import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type SvgProps = React.SVGProps<SVGSVGElement>;

export const SparkleSvg: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 60 60" fill="none" {...props}>
    <defs>
      <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
        <stop offset="60%" stopColor="#ffd5e6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ec5e94" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path
      d="M30 4 L34 26 L56 30 L34 34 L30 56 L26 34 L4 30 L26 26 Z"
      fill="url(#sparkleGrad)"
    />
  </svg>
);

export const PetalSvg: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" {...props}>
    <defs>
      <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd5e6" />
        <stop offset="60%" stopColor="#f490b3" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#a888d6" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <path
      d="M50 8 C70 24 86 44 80 70 C76 88 56 96 50 92 C44 96 24 88 20 70 C14 44 30 24 50 8 Z"
      fill="url(#petalGrad)"
      opacity="0.8"
    />
  </svg>
);

export const HeartSvg: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" {...props}>
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffb5cc" />
        <stop offset="100%" stopColor="#c4a8f0" />
      </linearGradient>
    </defs>
    <path
      d="M50 86 C20 64 6 46 6 28 C6 14 18 4 32 4 C42 4 50 12 50 18 C50 12 58 4 68 4 C82 4 94 14 94 28 C94 46 80 64 50 86 Z"
      fill="url(#heartGrad)"
      opacity="0.7"
    />
  </svg>
);

export const CrystalSvg: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 100 120" fill="none" {...props}>
    <defs>
      <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#d9c5ff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#a888d6" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <path
      d="M50 4 L86 32 L70 110 L30 110 L14 32 Z"
      fill="url(#crystalGrad)"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.4"
    />
    <path d="M14 32 L50 50 L86 32" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" />
    <path d="M50 50 L70 110 M50 50 L30 110" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
  </svg>
);

export const ButterflySvg: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 120 100" fill="none" {...props}>
    <defs>
      <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe4ef" />
        <stop offset="50%" stopColor="#f490b3" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#a888d6" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <path
      d="M60 50 C40 18 14 14 6 30 C-2 50 12 70 30 76 C44 80 56 70 60 56 Z"
      fill="url(#wingGrad)"
      opacity="0.85"
    />
    <path
      d="M60 50 C80 18 106 14 114 30 C122 50 108 70 90 76 C76 80 64 70 60 56 Z"
      fill="url(#wingGrad)"
      opacity="0.85"
    />
    <ellipse cx="60" cy="52" rx="2.5" ry="14" fill="#3a1f4f" />
    <circle cx="60" cy="38" r="3" fill="#3a1f4f" />
  </svg>
);

type Ornament = {
  id: string;
  Component: React.FC<SvgProps>;
  style: React.CSSProperties;
  duration: number;
  delay: number;
  rotate: number;
  desktopOnly?: boolean;
};

const FLOAT_KEYFRAMES = {
  y: [0, -22, 0, 18, 0],
  x: [0, 12, 0, -10, 0],
  rotate: [0, 8, 0, -6, 0],
};

interface FloatingOrnamentLayerProps {
  variant?: 'soft' | 'rich' | 'mint' | 'lavender';
  className?: string;
}

/**
 * A decorative SVG ornament layer for sections.
 * Renders ABSOLUTE-positioned floating shapes inside the parent.
 * Parent must have `position: relative` and `overflow: hidden`.
 */
export const FloatingOrnamentLayer: React.FC<FloatingOrnamentLayerProps> = ({
  variant = 'soft',
  className,
}) => {
  const reduce = useReducedMotion();

  const ornaments: Ornament[] = React.useMemo(() => {
    if (variant === 'rich') {
      return [
        {
          id: 'butterfly-1',
          Component: ButterflySvg,
          style: { width: 110, top: '8%', left: '6%', opacity: 0.55 },
          duration: 12,
          delay: 0,
          rotate: -10,
          desktopOnly: true,
        },
        {
          id: 'crystal-1',
          Component: CrystalSvg,
          style: { width: 70, top: '14%', right: '8%', opacity: 0.45 },
          duration: 10,
          delay: 1.2,
          rotate: 12,
        },
        {
          id: 'petal-1',
          Component: PetalSvg,
          style: { width: 78, bottom: '10%', left: '12%', opacity: 0.45 },
          duration: 14,
          delay: 0.6,
          rotate: -22,
        },
        {
          id: 'heart-1',
          Component: HeartSvg,
          style: { width: 56, bottom: '16%', right: '14%', opacity: 0.5 },
          duration: 11,
          delay: 1.5,
          rotate: 14,
          desktopOnly: true,
        },
        {
          id: 'sparkle-1',
          Component: SparkleSvg,
          style: { width: 48, top: '40%', left: '50%', opacity: 0.6 },
          duration: 8,
          delay: 2,
          rotate: 0,
        },
      ];
    }
    if (variant === 'lavender') {
      return [
        {
          id: 'crystal-l1',
          Component: CrystalSvg,
          style: { width: 80, top: '12%', left: '5%', opacity: 0.4 },
          duration: 11,
          delay: 0,
          rotate: -8,
          desktopOnly: true,
        },
        {
          id: 'petal-l1',
          Component: PetalSvg,
          style: { width: 70, bottom: '14%', right: '6%', opacity: 0.4 },
          duration: 13,
          delay: 1.2,
          rotate: 18,
        },
        {
          id: 'sparkle-l1',
          Component: SparkleSvg,
          style: { width: 38, top: '60%', left: '12%', opacity: 0.55 },
          duration: 9,
          delay: 0.4,
          rotate: 0,
        },
      ];
    }
    if (variant === 'mint') {
      return [
        {
          id: 'butterfly-m1',
          Component: ButterflySvg,
          style: { width: 90, top: '20%', right: '5%', opacity: 0.45 },
          duration: 12,
          delay: 0,
          rotate: 8,
          desktopOnly: true,
        },
        {
          id: 'heart-m1',
          Component: HeartSvg,
          style: { width: 52, bottom: '12%', left: '8%', opacity: 0.45 },
          duration: 11,
          delay: 1,
          rotate: -10,
        },
        {
          id: 'sparkle-m1',
          Component: SparkleSvg,
          style: { width: 38, top: '50%', right: '20%', opacity: 0.5 },
          duration: 9,
          delay: 0.6,
          rotate: 0,
        },
      ];
    }
    return [
      {
        id: 'sparkle-s1',
        Component: SparkleSvg,
        style: { width: 36, top: '12%', left: '8%', opacity: 0.5 },
        duration: 9,
        delay: 0,
        rotate: 0,
      },
      {
        id: 'petal-s1',
        Component: PetalSvg,
        style: { width: 60, bottom: '12%', right: '8%', opacity: 0.4 },
        duration: 12,
        delay: 1,
        rotate: 18,
      },
      {
        id: 'sparkle-s2',
        Component: SparkleSvg,
        style: { width: 24, top: '60%', left: '52%', opacity: 0.55 },
        duration: 8,
        delay: 1.6,
        rotate: 0,
        desktopOnly: true,
      },
    ];
  }, [variant]);

  const wrapClass = ['parallax-fill', className].filter(Boolean).join(' ');

  return (
    <div className={wrapClass} aria-hidden="true">
      {ornaments.map((o) => (
        <motion.div
          key={o.id}
          className={`femme-ornament${o.desktopOnly ? ' ornament-desktop-only' : ''}`}
          style={{ ...o.style, rotate: o.rotate }}
          initial={false}
          animate={
            reduce
              ? undefined
              : {
                  y: FLOAT_KEYFRAMES.y,
                  x: FLOAT_KEYFRAMES.x,
                  rotate: FLOAT_KEYFRAMES.rotate.map((r) => r + o.rotate),
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: o.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: o.delay,
                }
          }
        >
          <o.Component />
        </motion.div>
      ))}
    </div>
  );
};
