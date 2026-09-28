/** External store (same `subscribe`/`getSnapshot` shape `useSyncExternalStore` wants, matching the
 *  pattern `LiveCount` already uses in `HeroStatValue.tsx`) for "is something genuinely still
 *  loading" - read by `NavLoadingBar`, written by `NavLoadingBar` itself (the real first-paint
 *  signal) and by `AppLink` (Next's own `useLinkStatus` pending state for an in-app navigation).
 *
 *  The whole "loading -> done -> idle" state machine lives here, in plain module state with a plain
 *  `setTimeout`, not inside a React effect: React's `react-hooks/set-state-in-effect` rule (this
 *  project's eslint-plugin-react-hooks is v7, React-Compiler-aligned) flags an effect whose body is
 *  just a `setState` mirroring a dependency, which is exactly what "keep a `done` React state in sync
 *  with this counter" would be - moving the machine out here, external to React, is the same fix
 *  `LiveCount` already uses for its own timers, and it also means `NavLoadingBar` has no local state
 *  of its own to keep in sync at all. */
type Listener = () => void;
type Phase = "idle" | "loading" | "done";

const listeners = new Set<Listener>();
let count = 0; // real pending sources currently active (a counter, not a boolean, so two overlapping
// real sources - e.g. the first paint still loading while a link is also pending - don't clobber
// each other when only one of them resolves)
let phase: Phase = "idle";
let doneTimer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  for (const listener of listeners) listener();
}

function setPhase(next: Phase) {
  if (phase === next) return;
  phase = next;
  notify();
}

/** Reports one real source of loading starting/stopping. Never call this on a timer "for effect" -
 *  only from a genuine signal: `AppLink`'s `useLinkStatus` pending state, or `NavLoadingBar`'s own
 *  first-paint `document.readyState`/`load` check. */
export function reportPending(active: boolean) {
  count += active ? 1 : -1;
  if (count < 0) count = 0; // defensive: a stray extra "false" must never go negative and get stuck

  if (doneTimer) {
    clearTimeout(doneTimer);
    doneTimer = null;
  }

  if (count > 0) {
    setPhase("loading");
    return;
  }

  // Just dropped to zero: hold at "done" (100%, about to fade) for a moment before going idle, so the
  // completion flourish (see NavLoadingBar) has time to show instead of the bar just vanishing.
  if (phase === "loading") {
    setPhase("done");
    doneTimer = setTimeout(() => setPhase("idle"), 250);
  }
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPhase(): Phase {
  return phase;
}

export function getServerPhase(): Phase {
  return "idle";
}
