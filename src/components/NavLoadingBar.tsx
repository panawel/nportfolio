"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { getPhase, getServerPhase, reportPending, subscribe } from "@/lib/nav-loading";

/** A thin lime bar fixed to the very top of the viewport (above the nav pill), shown only while
 *  something is genuinely still loading - never a fixed-duration animation played for effect. Two
 *  real signals feed the shared state machine this reads (`src/lib/nav-loading.ts`, which also owns
 *  the loading -> done -> idle timing, so this component has no local state of its own to keep in
 *  sync with anything):
 *   1. The browser's own `load` event, for the very first paint (fonts/images still arriving) - set
 *      up right here.
 *   2. Next's own `useLinkStatus` pending state for an in-app navigation that has not been prefetched
 *      yet (see `AppLink.tsx`). Most clicks on this fully static site are already prefetched, so this
 *      correctly stays silent for them - the bar can go an entire visit without ever appearing, and
 *      that is the intended, honest behaviour, not a bug.
 *  The one thing that *is* a visual approximation, same as any progress bar (native or not) for a
 *  request with no byte-level progress to report: while genuinely pending it eases toward 85% over a
 *  few seconds without ever finishing on its own; once the real signal clears it snaps to 100% and
 *  fades. Reduced motion: it still appears/disappears (the show/hide is information, not decoration),
 *  just without the eased fill - it jumps straight to each target. */
export function NavLoadingBar() {
  const phase = useSyncExternalStore(subscribe, getPhase, getServerPhase);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (document.readyState === "complete") return;
    reportPending(true);
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      reportPending(false);
    };
    // The real signal: the browser's own `load` event fires once every resource the initial document
    // requested has finished (or failed). A hard cap alongside it: one stuck resource (a slow image
    // optimizer request, a flaky font host) must never leave the bar showing forever - a loader stuck
    // on screen is worse than no loader, so past a generous ceiling this gives up waiting and settles
    // anyway, same as it would if `load` had actually fired.
    window.addEventListener("load", settle);
    const cap = setTimeout(settle, 8000);
    return () => {
      window.removeEventListener("load", settle);
      clearTimeout(cap);
      settle(); // unmounting before either fires still counts as settling, so it can never leak the counter
    };
  }, []);

  const width = phase === "loading" ? "85%" : phase === "done" ? "100%" : "0%";
  const opacity = phase === "loading" ? 1 : 0;
  const duration = reducedMotion ? "0ms" : phase === "loading" ? "4000ms" : "200ms";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        className="h-full bg-accent ease-out"
        style={{ width, opacity, transitionProperty: "width, opacity", transitionDuration: duration }}
      />
    </div>
  );
}
