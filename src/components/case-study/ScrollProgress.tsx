"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** A thin lime line at the very top of the page that fills as you scroll down it. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  const progress = reduced ? scrollYProgress : smooth;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-accent shadow-[0_1px_0_rgb(0_0_0/0.18)]"
      style={{ scaleX: progress }}
    />
  );
}
