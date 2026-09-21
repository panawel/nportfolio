"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Animates its own height to whatever its content measures, so anything inside can change size (swap, open,
 *  grow) and the box eases there instead of jumping. The content is measured (not this box), so it cannot
 *  resize itself into a loop. The first paint is `height: auto`; there is no animation until the first measure.
 *  The 8px padding (cancelled by the negative margin) leaves room for hard shadows and the spring's overshoot. */
export function AutoHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={height === null ? undefined : { height }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      className={`-m-2 overflow-hidden ${className ?? ""}`}
    >
      <div ref={inner} className="p-2">
        {children}
      </div>
    </motion.div>
  );
}
