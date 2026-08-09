// Central motion variants for the whole site
// Import these in any page/component to keep animations consistent

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
};

// For staggered children — wrap parent with this
export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// Card entrance for grid items
export const cardVariant = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// Slide up from bottom (for modals, bottom sheets)
export const slideUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  exit:    { opacity: 0, y: 20, transition: { duration: 0.25 } },
};

// Modal backdrop
export const backdropVariant = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

// Sidebar nav item hover spring
export const navItemHover = {
  rest:  { x: 0 },
  hover: { x: 4, transition: { type: 'spring', stiffness: 400, damping: 20 } },
};

// Counter number pop
export const numberPop = {
  hidden:  { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1,   y: 0,  transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

// Progress bar fill
export const progressFill = (pct) => ({
  hidden:  { width: '0%' },
  visible: { width: `${pct}%`, transition: { duration: 0.9, ease: 'easeOut', delay: 0.3 } },
});

// Page-level entrance wrapper
export const pageVariant = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.07 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25 } },
};
