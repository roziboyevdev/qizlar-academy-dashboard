'use client';

import { useId } from 'react';

import { cn } from 'utils/styleUtils';

const PETALS = 6;

type PetalRingProps = {
  rx: number;
  ry: number;
  cy: number;
  rotationOffset: number;
  delayBase: number;
  className?: string;
};

function PetalRing({ rx, ry, cy, rotationOffset, delayBase, className }: PetalRingProps) {
  const step = 360 / PETALS;

  return (
    <g className={className}>
      {Array.from({ length: PETALS }, (_, i) => (
        <g key={i} transform={`rotate(${i * step + rotationOffset})`}>
          <ellipse
            cx={0}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="currentColor"
            className="animate-flower-petal"
            style={{
              animationDelay: `${delayBase + i * 0.065}s`,
              transformOrigin: '0px 0px',
              transformBox: 'fill-box',
            }}
          />
        </g>
      ))}
    </g>
  );
}

const Loader = ({ className }: { className?: string }) => {
  const rawId = useId().replace(/:/g, '');
  const gradId = `loader-flower-core-${rawId}`;

  return (
    <div
      className={cn('relative mx-auto flex flex-col items-center justify-center', className)}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Yuklanmoqda</span>
      <svg
        viewBox="-52 -52 104 104"
        className="h-14 w-14 overflow-visible text-primary drop-shadow-sm"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.94} />
            <stop offset="100%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.78} />
          </linearGradient>
        </defs>
        <g className="text-primary/92">
          <PetalRing rx={11} ry={24} cy={-22} rotationOffset={0} delayBase={0} />
        </g>
        <g className="text-primary/55">
          <PetalRing rx={7} ry={15} cy={-14} rotationOffset={30} delayBase={0.09} />
        </g>
        <circle
          cx={0}
          cy={0}
          r={10}
          fill={`url(#${gradId})`}
          className="animate-flower-core"
          style={{
            animationDelay: '0.12s',
            transformOrigin: '0px 0px',
            transformBox: 'fill-box',
          }}
        />
      </svg>
    </div>
  );
};

export default Loader;
