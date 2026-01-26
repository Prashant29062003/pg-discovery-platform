'use client';

/**
 * Page Transition Component with Framer Motion
 * Provides smooth fade and slide animations on route changes
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
  delay?: number;
}

const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export function PageTransition({
  children,
  variant = 'fade',
  delay = 0,
}: PageTransitionProps) {
  const variants = pageVariants[variant];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for animating multiple child elements
 */
export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.05,
}: {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item for use within StaggerContainer
 */
export function StaggerItem({
  children,
  variant = 'slide-up',
}: {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
}) {
  const variants = pageVariants[variant];

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
