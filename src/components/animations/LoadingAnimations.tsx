'use client';

/**
 * Loading Animation Components with Framer Motion
 * Provides smooth and professional loading states
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Animated skeleton loader with shimmer effect
 */
export function AnimatedSkeleton({
  width = '100%',
  height = '1rem',
  className = '',
}: SkeletonProps) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded ${className}`}
      style={{ width, height }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    />
  );
}

/**
 * Spinning loader animation
 */
export function AnimatedSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
}

/**
 * Pulsing dot animation
 */
export function PulsingDot({
  className = '',
}: {
  className?: string;
}) {
  return (
    <motion.div
      className={`w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    />
  );
}

/**
 * Three dots loading animation
 */
export function DotsLoader({
  className = '',
}: {
  className?: string;
}) {
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        repeat: Infinity,
      },
    }),
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
          custom={i}
          animate="animate"
          variants={dotVariants}
        />
      ))}
    </div>
  );
}

/**
 * Progress bar animation
 */
export function ProgressBar({
  progress = 0,
  className = '',
}: {
  progress?: number;
  className?: string;
}) {
  return (
    <div className={`w-full h-1 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-blue-500 dark:bg-blue-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * Fade in animation for text
 */
export function FadeInText({
  children,
  delay = 0,
  className = '',
}: {
  children: string | React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Slide in animation
 */
export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}) {
  const directionVariants = {
    up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  };

  const variant = directionVariants[direction];

  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
