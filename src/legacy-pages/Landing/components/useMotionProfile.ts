import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export type MotionTier = 'lite' | 'medium' | 'full';

export interface MotionProfile {
  tier: MotionTier;
  reducedMotion: boolean;
  width: number;
  isTouch: boolean;
  enable3D: boolean;
  enableParticles: boolean;
  enableParallax: boolean;
  particleDensity: number;
  butterflyCount: number;
  crystalCount: number;
  petalCount: number;
}

/**
 * Adaptive motion/visual budget for the landing page.
 * - desktop full: rich 3D, particles, parallax
 * - tablet medium: lighter 3D, fewer particles
 * - mobile / reduced-motion: no 3D, no particles, minimal parallax
 */
export function useMotionProfile(): MotionProfile {
  const reduced = !!useReducedMotion();
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);

    setIsTouch(
      window.matchMedia?.('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints > 0,
    );

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;

  let tier: MotionTier = 'full';
  if (reduced) tier = 'lite';
  else if (width < 640 || cores <= 2) tier = 'lite';
  else if (width < 1024 || cores <= 4) tier = 'medium';

  const enable3D = tier !== 'lite';
  const enableParticles = tier !== 'lite';
  const enableParallax = !reduced;

  const particleDensity = tier === 'full' ? 36 : tier === 'medium' ? 22 : 0;
  const butterflyCount = tier === 'full' ? 3 : tier === 'medium' ? 2 : 0;
  const crystalCount = tier === 'full' ? 4 : tier === 'medium' ? 2 : 0;
  const petalCount = tier === 'full' ? 6 : tier === 'medium' ? 3 : 0;

  return {
    tier,
    reducedMotion: reduced,
    width,
    isTouch,
    enable3D,
    enableParticles,
    enableParallax,
    particleDensity,
    butterflyCount,
    crystalCount,
    petalCount,
  };
}
