"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

const row = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const star = {
  hidden: { scale: 0, rotate: -30, opacity: 0 },
  show: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 14 } },
};

/** Five stars in the page's second colour that pop in one after another (once) when they scroll into view. */
export function TestimonialStars({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      variants={row}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("flex gap-1.5", className)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} variants={star} className="block">
          <Star className="h-6 w-6 fill-accent-2 text-foreground" strokeWidth={2} />
        </motion.span>
      ))}
    </motion.div>
  );
}
