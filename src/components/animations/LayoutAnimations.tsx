'use client';

/**
 * Layout Animation Components with Framer Motion
 * Provides smooth animations for adding/removing items
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode;
  staggerDelay?: number;
}

/**
 * Animated list container with smooth stagger effect
 * Use this to wrap list items for automatic animations
 */
export function AnimatedList({
  children,
  staggerDelay = 0.05,
}: AnimatedListProps) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.ul>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  id: string | number;
}

/**
 * Animated list item
 * Automatically animates in and out with stagger effect
 */
export function AnimatedListItem({
  children,
  id,
}: AnimatedListItemProps) {
  return (
    <motion.li
      key={id}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.li>
  );
}

interface AnimatedCardGridProps {
  children: ReactNode;
  columns?: number;
}

/**
 * Animated card grid with layout animations
 * Cards automatically animate when added/removed
 */
export function AnimatedCardGrid({
  children,
  columns = 3,
}: AnimatedCardGridProps) {
  return (
    <motion.div
      layout
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  id: string | number;
  onClick?: () => void;
}

/**
 * Animated card with layout animations
 * Smoothly animates in/out with layout reflow
 */
export function AnimatedCard({
  children,
  id,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      key={id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedDialogProps {
  isOpen: boolean;
  children: ReactNode;
}

/**
 * Animated dialog/modal with backdrop
 */
export function AnimatedDialog({
  isOpen,
  children,
}: AnimatedDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface AnimatedBadgeProps {
  children: ReactNode;
  isNew?: boolean;
}

/**
 * Animated badge with pulse effect for new items
 */
export function AnimatedBadge({
  children,
  isNew = false,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      initial={isNew ? { scale: 0 } : { opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
}
