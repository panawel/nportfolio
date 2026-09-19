"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const row = { hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } };
const disc = { hidden: { scale: 0.5, opacity: 0 }, show: { scale: 1, opacity: 1 } };
const tick = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.35, delay: 0.1 } } };

/** A bullet list whose lime check marks draw themselves one after another when it scrolls into view
 *  (the same "PASS" feel as the homepage test runner). The text is passed through untouched;
 *  `lockIndex` adds a small lock that shakes after that line. */
export function CheckList({
  items,
  size = "sm",
  lockIndex,
  className,
}: {
  items: string[];
  size?: "sm" | "lg";
  lockIndex?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const large = size === "lg";

  return (
    <motion.ul
      variants={list}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {items.map((item, i) => (
        <motion.li key={item} variants={row} className="flex gap-2.5">
          <motion.span
            variants={disc}
            className={cn(
              "mt-0.5 grid shrink-0 place-items-center rounded-full bg-accent",
              large ? "h-5 w-5" : "h-4 w-4",
            )}
          >
            <svg viewBox="0 0 16 16" className={large ? "h-3.5 w-3.5" : "h-3 w-3"} fill="none" aria-hidden>
              <motion.path
                d="M3.5 8.5l3 3 6-7"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={tick}
              />
            </svg>
          </motion.span>
          <span>
            {item}
            {lockIndex === i && (
              <span aria-hidden className="cs-shake ml-1.5 inline-flex align-text-bottom text-foreground">
                <Lock className="h-3.5 w-3.5" />
              </span>
            )}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
