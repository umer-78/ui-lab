import { motion, useScroll, useSpring } from 'motion/react';

/** The bar across the top of the page: scroll position in, a spring-smoothed scaleX out. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400"
    />
  );
}
