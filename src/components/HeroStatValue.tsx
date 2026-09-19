"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type RefObject,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/lib/use-count-up";

/** Splits a stat like "50+" into its number and suffix and counts the number up once the element
 *  is scrolled into view (no animation for reduced motion). Non-numeric values are shown as-is. */
function useStatDisplay(value: string, ref: RefObject<Element | null>) {
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reducedMotion = useReducedMotion();

  const match = value.match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const numeric = match ? parseFloat(match[1].replace(/,/g, "")) : null;
  const suffix = match ? match[2] : "";
  const animated = useCountUp(numeric ?? 0, inView && numeric !== null && !reducedMotion);
  const shown = numeric === null ? value : (reducedMotion ? numeric : animated).toLocaleString("en-US");

  return { shown, suffix: numeric === null ? "" : suffix };
}

/** A count-up number inside a line of text (the footer of the hero statement card). */
export function InlineCount({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { shown, suffix } = useStatDisplay(value, ref);

  return (
    <b ref={ref} className={className}>
      {shown}
      {suffix}
    </b>
  );
}

// The live counters' current values live in session storage (so a round trip to a case study, or a
// reload in the same tab, continues the number instead of restarting it) with an in-memory copy for
// when storage is unavailable. They are read through useSyncExternalStore, so the server render and
// first client render both show `start` and the saved value is adopted right after hydration.
const storageKey = (key: string) => `hero-counter:${key}`;
const memory = new Map<string, number>();
const listeners = new Set<() => void>();

function readCount(key: string, start: number) {
  let saved = memory.get(key);
  if (saved === undefined) {
    try {
      const raw = sessionStorage.getItem(storageKey(key));
      if (raw !== null) saved = Number(raw);
    } catch {}
  }
  return typeof saved === "number" && Number.isFinite(saved) && saved >= start ? saved : start;
}

function writeCount(key: string, value: number) {
  memory.set(key, value);
  try {
    sessionStorage.setItem(storageKey(key), String(value));
  } catch {}
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

/** One character of the live number. Only characters that appear after the intro count-up (i.e. that
 *  changed on a tick) play the roll + flash; the choice is fixed when the character mounts. */
function Digit({ char, animate }: { char: string; animate: boolean }) {
  const [fx] = useState(animate);
  return <span className={fx ? "counter-digit-new" : undefined}>{char}</span>;
}

/** The big number on a hero ticket: counts up to its value once when scrolled into view, then goes
 *  up by one every `tickMs` while on screen (`offsetMs` staggers two counters so they never change
 *  together). Decorative, so it shows a "live demo counter" hint on hover and says the same to screen
 *  readers; reduced motion shows the number without ticking. */
export function LiveCount({
  id,
  start,
  tickMs,
  offsetMs = 0,
  flash,
}: {
  id: string;
  start: number;
  tickMs: number;
  offsetMs?: number;
  /** Colour of the soft highlight that fades behind a changed digit. */
  flash: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20px" });
  const inView = useInView(ref, { margin: "100px" });
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  const count = useSyncExternalStore(
    subscribe,
    () => readCount(id, start),
    () => start,
  );
  const animated = useCountUp(count, seen && !introDone && !reducedMotion);
  const ticking = introDone && !reducedMotion;
  const shown = reducedMotion || introDone ? count : animated;

  // The intro count-up takes 900ms; ticking starts once it has landed.
  useEffect(() => {
    if (!seen || reducedMotion) return;
    const timer = setTimeout(() => setIntroDone(true), 950);
    return () => clearTimeout(timer);
  }, [seen, reducedMotion]);

  useEffect(() => {
    if (!ticking || !inView) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (!document.hidden) writeCount(id, readCount(id, start) + 1);
      }, tickMs);
    }, offsetMs);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [ticking, inView, id, start, tickMs, offsetMs]);

  const chars = shown.toLocaleString("en-US").split("");

  return (
    <div
      ref={ref}
      style={{ "--flash": flash } as CSSProperties}
      className="group/count relative inline-flex font-mono text-[2.2rem] font-semibold leading-none text-foreground"
    >
      <span className="sr-only">{count.toLocaleString("en-US")} (live demo counter)</span>
      <span aria-hidden>
        {chars.map((char, i) => (
          <Digit key={`${chars.length - i}-${char}`} char={char} animate={ticking} />
        ))}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-1 font-mono text-[10px] font-bold leading-none tracking-wide text-accent opacity-0 transition-opacity duration-200 group-hover/count:opacity-100"
      >
        live demo counter
      </span>
    </div>
  );
}
