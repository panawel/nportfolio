"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function RotatingText({ words, interval = 2500 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reducedMotion]);

  const word = reducedMotion ? words[0] : words[index];

  return (
    <span className="inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
