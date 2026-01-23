// Animation constants for consistent motion across the app
// Using spring physics for natural, responsive animations

export const SPRINGS = {
  DEFAULT: { stiffness: 260, damping: 20 },
  SNAPPY: { stiffness: 400, damping: 25 },
  GENTLE: { stiffness: 170, damping: 26 },
  WOBBLY: { stiffness: 180, damping: 12 }
} as const;

export const TRANSITIONS = {
  FAST: { duration: 0.2 },
  NORMAL: { duration: 0.3 },
  SLOW: { duration: 0.5 }
} as const;

export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 }
  },
  cardHover: {
    whileHover: { y: -2, scale: 1.01 }
  },
  slideOutLeft: {
    exit: { opacity: 0, x: -20, scale: 0.95 }
  },
  scaleOut: {
    exit: { opacity: 0, scale: 0.9, y: 10 }
  }
} as const;

// Stagger delay for list items (in seconds)
export const STAGGER_DELAY = 0.05;
