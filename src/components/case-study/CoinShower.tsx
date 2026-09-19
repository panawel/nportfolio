"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/cn";

// Left position (%), delay (s) and kind (gold, black with a ring, or pink) of each falling coin: fixed values, so it never re-renders differently.
const coins = [
  { left: 6, delay: 0, kind: "gold" },
  { left: 15, delay: 0.35, kind: "black" },
  { left: 26, delay: 0.1, kind: "pink" },
  { left: 37, delay: 0.55, kind: "gold" },
  { left: 48, delay: 0.2, kind: "black" },
  { left: 58, delay: 0.7, kind: "pink" },
  { left: 68, delay: 0.05, kind: "gold" },
  { left: 78, delay: 0.45, kind: "black" },
  { left: 87, delay: 0.25, kind: "pink" },
  { left: 94, delay: 0.6, kind: "gold" },
];

/** A handful of coins (or, with `variant`, ticket stubs, stars or play buttons) in the page colours that fall
 *  once, when the section they sit in scrolls into view. */
export function CoinShower({ className, variant = "coins" }: { className?: string; variant?: "coins" | "tickets" | "stars" | "plays" | "bubbles" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {inView &&
        !reduced &&
        coins.map((c) =>
          variant === "stars" ? (
            <span
              key={c.left}
              className="cs-fall absolute top-0 block opacity-0"
              style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  c.kind === "gold" && "fill-accent-2 text-foreground",
                  c.kind === "pink" && "fill-accent text-foreground",
                  c.kind === "black" && "fill-foreground text-accent",
                )}
                strokeWidth={2}
              />
            </span>
          ) : variant === "bubbles" ? (
            <span
              key={c.left}
              className={cn(
                "cs-fall absolute top-0 block h-5 w-8 rounded-xl border-2 opacity-0",
                c.kind === "black" && "border-accent bg-foreground",
                c.kind === "gold" && "border-foreground bg-accent-2",
                c.kind === "pink" && "border-foreground bg-accent",
              )}
              style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}
            >
              <span
                className={cn(
                  "absolute -bottom-[5px] left-1.5 h-2 w-2 rotate-45 border-b-2 border-r-2",
                  c.kind === "black" && "border-accent bg-foreground",
                  c.kind === "gold" && "border-foreground bg-accent-2",
                  c.kind === "pink" && "border-foreground bg-accent",
                )}
              />
            </span>
          ) : variant === "plays" ? (
            <span
              key={c.left}
              className={cn(
                "cs-fall absolute top-0 grid h-7 w-7 place-items-center rounded-lg border-2 opacity-0",
                c.kind === "black" && "border-accent bg-foreground text-accent",
                c.kind === "gold" && "border-foreground bg-accent-2 text-on-accent-2",
                c.kind === "pink" && "border-foreground bg-accent text-foreground",
              )}
              style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
          ) : (
          <span
            key={c.left}
            className={cn(
              "cs-fall absolute top-0 grid place-items-center border-2 opacity-0",
              variant === "coins" ? "h-6 w-6 rounded-full" : "h-4 w-7 rounded-[5px]",
              c.kind === "black" && "border-accent bg-foreground",
              c.kind === "gold" && "border-foreground bg-accent-2",
              c.kind === "pink" && "border-foreground bg-accent",
            )}
            style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}
          >
            {variant === "coins" ? (
              <span className={cn("h-2.5 w-2.5 rounded-full border-2", c.kind === "black" ? "border-accent/70" : "border-foreground/50")} />
            ) : (
              <>
                {/* the notches of a ticket stub */}
                <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white" />
                <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white" />
                <span className={cn("h-1.5 w-3 rounded-full", c.kind === "black" ? "bg-accent/80" : "bg-foreground/50")} />
              </>
            )}
          </span>
        ))}
    </div>
  );
}
