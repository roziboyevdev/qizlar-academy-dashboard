import React from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionProps,
  type Variants,
} from 'framer-motion';

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: SOFT_EASE },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: SOFT_EASE } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: SOFT_EASE },
  },
};

const rotateIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, rotate: -6, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { duration: 0.95, ease: SOFT_EASE },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const motionVariants = { fadeUp, fadeIn, scaleIn, rotateIn, stagger };

type CommonProps = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  margin?: string;
} & Omit<MotionProps, 'variants' | 'initial' | 'whileInView' | 'viewport'>;

function buildViewport(once: boolean, margin: string) {
  return { once, margin: margin as `${number}px` };
}

export const FadeUp: React.FC<CommonProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  delay = 0,
  once = true,
  margin = '-80px',
  ...rest
}) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={buildViewport(once, margin)}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<CommonProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  delay = 0,
  once = true,
  margin = '-80px',
  ...rest
}) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={buildViewport(once, margin)}
      variants={scaleIn}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const RotateIn: React.FC<CommonProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  delay = 0,
  once = true,
  margin = '-80px',
  ...rest
}) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={buildViewport(once, margin)}
      variants={rotateIn}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

type StaggerProps = CommonProps & {
  amount?: number;
  staggerChildren?: number;
  delayChildren?: number;
};

export const StaggerGroup: React.FC<StaggerProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  once = true,
  margin = '-60px',
  amount,
  staggerChildren = 0.12,
  delayChildren = 0.05,
  ...rest
}) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as `${number}px`, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

type ParallaxProps = {
  children?: React.ReactNode;
  className?: string;
  offset?: number;
  style?: React.CSSProperties;
};

/**
 * Subtle viewport-progress parallax for decorative elements.
 * Uses page scroll, so it works regardless of nesting.
 */
export const ParallaxLayer: React.FC<ParallaxProps> = ({
  children,
  className,
  offset = 80,
  style,
}) => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
};
