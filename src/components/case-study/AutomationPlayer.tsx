"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Lock, Monitor, Play, RotateCw, Smartphone } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { AutoHeight } from "@/components/case-study/AutoHeight";
import { cn } from "@/lib/cn";
import type { PreparedCue, PreparedExample } from "@/lib/automation-prepare";

// A recorded run played back as if the test were executing, living inside the "plus" scope card. Closed, the card
// shows a peek of each test with its own Execute button. Pressing one opens the card for that test, a short
// "launching" moment plays, then the browser or phone pops in beside the code and the run starts; when it ends the
// card closes again. The recording is the only clock during the run: every visual (the running line, the check
// marks, the progress line, the timer) is computed from `video.currentTime`, so the code and the video start,
// stall and end together by construction. The video has no controls and cannot be stopped.

type Id = PreparedExample["id"];
type Phase = "standby" | "launching" | "starting" | "running" | "passed";

const LINE_H = 20; // px; must match `h-5` on the code lines
const PAD = 8; // px above the first line
const PEEK_LINES = 6;
const ADDRESS = "app.example.com/store"; // a neutral placeholder, on purpose
const LAUNCH_MS = 2000; // keep in step with `.ide-launch` in globals.css
const START_TIMEOUT_MS = 8000;
const PASSED_MS = 2500;

const fmt = (t: number) => {
  const s = Math.max(0, t);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
};

const fmtMs = (dt: number) => (dt < 1 ? `${Math.max(1, Math.round(dt * 1000))} ms` : `${dt.toFixed(1)} s`);

const testIcon = { desktop: Monitor, mobile: Smartphone } as const;

export function AutomationPlayer({ examples }: { examples: PreparedExample[] }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Partial<Record<Id, HTMLVideoElement | null>>>({});
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const launchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const startTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const passedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const idxRef = useRef(-1);
  const phaseRef = useRef<Phase>("standby");

  // The test being run (or the last one run).
  const [tab, setTab] = useState<Id>(examples[0].id);
  const [loaded, setLoaded] = useState<Partial<Record<Id, boolean>>>({});
  const [phase, setPhase] = useState<Phase>("standby");
  // -1: nothing run yet; cues.length: the run has finished.
  const [cueIdx, setCueIdx] = useState(-1);
  const [failed, setFailed] = useState(false);
  const [runId, setRunId] = useState(0);

  const ex = examples.find((e) => e.id === tab) ?? examples[0];
  const cues = ex.cues;
  // The card is open for exactly as long as a run is going (launching, playing, and the PASSED moment).
  const open = phase !== "standby";
  const previewOn = phase === "starting" || phase === "running" || phase === "passed";
  const isMobile = ex.id === "mobile";
  const cue = cueIdx >= 0 && cueIdx < cues.length ? cues[cueIdx] : null;
  const Icon = testIcon[ex.id];

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const warm = useCallback((id: Id) => setLoaded((l) => (l[id] ? l : { ...l, [id]: true })), []);

  const resetDisplay = useCallback(() => {
    idxRef.current = -1;
    setCueIdx(-1);
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    if (timerRef.current) timerRef.current.textContent = fmt(0);
  }, []);

  const fail = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(launchTimer.current);
    clearTimeout(startTimer.current);
    for (const v of Object.values(videoRefs.current)) {
      if (!v) continue;
      v.pause();
      v.currentTime = 0;
    }
    resetDisplay();
    setFailed(true);
    go("standby");
  }, [go, resetDisplay]);

  // Nothing may fire after the card is gone.
  useEffect(
    () => () => {
      clearTimeout(launchTimer.current);
      clearTimeout(startTimer.current);
      clearTimeout(passedTimer.current);
      cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // The recording's own events drive the run (only the video of the test being run).
  useEffect(() => {
    const v = videoRefs.current[ex.id];
    if (!v) return;

    // Every frame while running: the current cue (state changes only when it changes), the progress line and the timer.
    const tick = () => {
      const t = v.currentTime;
      let i = idxRef.current;
      while (i + 1 < cues.length && cues[i + 1].t <= t) i++;
      if (i !== idxRef.current) {
        idxRef.current = i;
        setCueIdx(i);
      }
      const d = v.duration || ex.video.duration;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(1, t / d)})`;
      if (timerRef.current) timerRef.current.textContent = fmt(t);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPlaying = () => {
      if (phaseRef.current !== "starting") return;
      clearTimeout(startTimer.current);
      go("running");
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    // The flow cannot be stopped: if the browser pauses the recording mid-run (a hidden tab, an interruption), resume it.
    const onPause = () => {
      if ((phaseRef.current === "starting" || phaseRef.current === "running") && !v.ended) {
        v.play().catch(fail);
      }
    };
    const onEnded = () => {
      if (phaseRef.current !== "running" && phaseRef.current !== "starting") return;
      cancelAnimationFrame(rafRef.current);
      idxRef.current = cues.length;
      setCueIdx(cues.length);
      if (progressRef.current) progressRef.current.style.transform = "scaleX(1)";
      if (timerRef.current) timerRef.current.textContent = fmt(v.duration || ex.video.duration);
      go("passed");
      // After the PASSED moment the card closes and the Execute buttons return.
      passedTimer.current = setTimeout(() => {
        v.pause();
        v.currentTime = 0;
        resetDisplay();
        go("standby");
      }, PASSED_MS);
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", fail);
    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", fail);
    };
  }, [cues, ex.id, ex.video.duration, fail, go, resetDisplay]);

  const scrollIntoViewOnPhones = (delay: number) => {
    if (window.innerWidth >= 1024) return;
    window.setTimeout(() => rootRef.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }), delay);
  };

  // After the launching moment: the preview pops in and the recording starts, at the same instant.
  const begin = (id: Id) => {
    const v = videoRefs.current[id];
    if (!v) {
      fail();
      return;
    }
    go("starting");
    // Stacked (below lg) the preview appears under the code: bring the whole block back into view.
    scrollIntoViewOnPhones(500);
    v.currentTime = 0;
    v.play().catch(fail);
    startTimer.current = setTimeout(() => {
      if (phaseRef.current === "starting") fail();
    }, START_TIMEOUT_MS);
  };

  const execute = (id: Id) => {
    if (phaseRef.current !== "standby") return;
    setFailed(false);
    setRunId((n) => n + 1);
    warm(id);
    setTab(id);
    idxRef.current = -1;
    setCueIdx(-1);
    go("launching");
    scrollIntoViewOnPhones(450);
    launchTimer.current = setTimeout(() => begin(id), LAUNCH_MS);
  };

  // One easing and duration for everything that moves sideways (columns, gap, card straighten/widen); the height of the
  // whole card is animated by <AutoHeight> alone.
  const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";
  // Columns from lg: the code takes it all until the preview pops in beside it.
  const columns = previewOn
    ? isMobile
      ? "lg:[grid-template-columns:minmax(0,1fr)_calc(var(--pv)+20px)]"
      : "lg:[grid-template-columns:52fr_48fr]"
    : isMobile
      ? "lg:[grid-template-columns:minmax(0,1fr)_0px]"
      : "lg:[grid-template-columns:1fr_0fr]";

  return (
    <div ref={rootRef} data-open={open} className="mt-6">
      <p className="mb-3 font-mono text-[11px] uppercase leading-relaxed tracking-wide text-foreground/70">
        <span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle ring-1 ring-foreground" />
        Automation Example <span className="normal-case tracking-normal text-foreground/50">· real test, names changed · recorded with a test account</span>
      </p>

      <AutoHeight>
      <div
        className={cn(
          "ide-stage grid grid-cols-1 transition-[grid-template-columns,gap] duration-500 [container-type:inline-size] motion-reduce:transition-none lg:items-stretch",
          ease,
          "[--pv:180px] lg:[--stage-h:clamp(400px,32vw,460px)] lg:[--pv:calc((var(--stage-h)_-_52px)*0.4615)]",
          previewOn ? "gap-y-4 lg:gap-x-4 lg:gap-y-0" : "gap-0",
          columns,
        )}
      >
        {/* The editor window: dots, then either the two peeks (closed) or the running test (open). */}
        <div
          className={cn(
            "ide shadow-hard relative flex min-w-0 flex-col overflow-hidden rounded-[20px]",
            // The same stage height for Desktop and Mobile.
            open && "lg:h-[var(--stage-h)]",
          )}
        >
          <div className="flex min-h-8 shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-[var(--ide-line)] bg-[var(--ide-bar)] px-2.5 py-1">
            <span aria-hidden className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
            </span>

            {open ? (
              <>
                <span className="inline-flex h-6 items-center gap-1 rounded-md bg-black/25 px-2 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
                  <Icon aria-hidden className="h-3 w-3 shrink-0" />
                  {ex.title}
                </span>
                {/* Status only (the run cannot be stopped): Launching, Running, then Passed. */}
                <span
                  aria-hidden
                  className="ml-auto inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-white/10 px-2.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white/70"
                >
                  {phase === "passed" ? (
                    <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                  ) : (
                    <span className="ide-dot h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                  {phase === "passed" ? "Passed" : phase === "launching" ? "Launching…" : "Running…"}
                </span>
              </>
            ) : (
              failed && <span className="ml-auto truncate font-mono text-[10px] text-[#ff8b7e]">Couldn&apos;t start the recording. Try again.</span>
            )}
          </div>

          {/* Closed: a peek of each test's real code (from sm: side by side), typing itself in and fading out at the
              bottom, each with its own Execute button. Below sm: one peek with both buttons on top of it. */}
          <div className={open ? "hidden" : undefined} inert={open}>
            <div className="grid sm:grid-cols-2">
              {examples.map((e, i) => {
                const TestIcon = testIcon[e.id];
                return (
                  <div
                    key={e.id}
                    className={cn(
                      "relative min-w-0 bg-[var(--ide-bg)]",
                      i > 0 && "max-sm:hidden sm:border-l sm:border-[var(--ide-line)]",
                    )}
                  >
                    <div className="hidden h-8 items-center gap-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--ide-dim)] sm:flex">
                      <TestIcon aria-hidden className="h-3 w-3 shrink-0" />
                      {e.title}
                    </div>
                    <div className="relative h-[132px]">
                      <PeekCode ex={e} />
                      {/* The code behind the button(s) is dimmed and softly blurred. */}
                      <span aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-black/30 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 z-10 grid place-items-center max-sm:hidden">
                        <ExecuteButton e={e} onRun={() => execute(e.id)} onWarm={() => warm(e.id)} />
                      </div>
                      {i === 0 && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 sm:hidden">
                          {examples.map((b) => (
                            <ExecuteButton key={b.id} e={b} onRun={() => execute(b.id)} onWarm={() => warm(b.id)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open: the progress line, the code window and the step line. */}
          <div className={cn("min-h-0 flex-1", !open && "hidden")} inert={!open}>
            <div className="flex h-full min-h-0 flex-col">
              <div aria-hidden className="relative h-0.5 shrink-0 bg-[var(--ide-line)]">
                <div ref={progressRef} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
              </div>

              {examples.map((e) => (
                <div key={e.id} className={cn("flex min-h-0 flex-1 flex-col", e.id !== tab && "hidden")}>
                  <CodePane
                    ex={e}
                    cue={e.id === tab ? cue : null}
                    cueIdx={e.id === tab ? cueIdx : -1}
                    phase={e.id === tab ? phase : "standby"}
                    launching={e.id === tab && phase === "launching"}
                    launchLabel={e.id === "mobile" ? "Launching the phone" : "Launching the browser"}
                    runId={runId}
                    reduce={!!reduce}
                  />
                </div>
              ))}

              {/* Step line: what the run is doing right now, the timer, and the honest label. */}
              <div className="flex h-[26px] shrink-0 items-center gap-2 border-t border-[var(--ide-line)] bg-[var(--ide-bar)] px-2.5 font-mono text-[10px] text-[var(--ide-dim)]">
                {phase === "launching" ? (
                  <span>Launching…</span>
                ) : phase === "starting" ? (
                  <span>Starting…</span>
                ) : phase === "passed" ? (
                  <>
                    <Check aria-hidden className="h-3 w-3 shrink-0 text-accent" strokeWidth={3} />
                    <span className="truncate text-accent">PASSED · 1 passed in {ex.video.duration.toFixed(1)} s</span>
                  </>
                ) : (
                  <>
                    <Play aria-hidden className="h-2.5 w-2.5 shrink-0 fill-accent text-accent" />
                    <span className="truncate text-[var(--ide-text)]">{cue?.label ?? "Running"}</span>
                  </>
                )}
                <span className="ml-auto flex shrink-0 items-center gap-3">
                  <span ref={timerRef} className="tabular-nums">
                    00:00.0
                  </span>
                  <span className="hidden text-[9px] uppercase tracking-wide opacity-70 sm:inline">Recorded run</span>
                </span>
              </div>
            </div>
          </div>

          <span
            aria-hidden
            className={cn(
              "ide-glow pointer-events-none absolute inset-0 z-30 rounded-[20px] transition-opacity duration-500",
              phase === "passed" ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* The preview pops in beside the code (below lg: under it) once the run starts. */}
        <div className={cn("relative min-w-0", !previewOn && "max-lg:hidden")}>
          {/* From lg the window is taken out of the flow (absolute, centred), so it never sets the height of the row. */}
          <div className="flex min-w-0 flex-col justify-center lg:absolute lg:inset-0">
            {examples.map((e) => (
              <PopFrame key={e.id} shown={previewOn} hidden={e.id !== tab} mobile={e.id === "mobile"} reduce={!!reduce}>
                {e.id === "desktop" ? (
                  <BrowserFrame runId={runId}>
                    <VideoArea
                      ex={e}
                      idle={e.id !== tab || phase === "standby" || phase === "starting"}
                      preload={loaded[e.id] ? "auto" : "none"}
                      videoRef={(el) => {
                        videoRefs.current[e.id] = el;
                      }}
                    />
                  </BrowserFrame>
                ) : (
                  <PhoneFrame runId={runId}>
                    <VideoArea
                      ex={e}
                      idle={e.id !== tab || phase === "standby" || phase === "starting"}
                      preload={loaded[e.id] ? "auto" : "none"}
                      videoRef={(el) => {
                        videoRefs.current[e.id] = el;
                      }}
                    />
                  </PhoneFrame>
                )}
              </PopFrame>
            ))}
          </div>
        </div>
      </div>
      </AutoHeight>

      <p role="status" className="sr-only">
        {phase === "launching" ? "Launching" : phase === "running" ? "Test running" : phase === "passed" ? "Test passed" : ""}
      </p>
    </div>
  );
}

/** The Execute button of a closed peek: a plain lime pill with a breathing ring; on hover it lifts, glows and a light
 *  shine sweeps across once (see `.ide-btn` in globals.css). */
function ExecuteButton({ e, onRun, onWarm }: { e: PreparedExample; onRun: () => void; onWarm: () => void }) {
  return (
    <button
      type="button"
      onClick={onRun}
      onPointerEnter={onWarm}
      onFocus={onWarm}
      className="ide-btn ide-breathe relative flex h-7 w-fit items-center overflow-hidden rounded-lg bg-accent px-3.5 font-mono text-[10px] font-bold uppercase tracking-wide text-on-accent sm:h-9 sm:rounded-xl sm:px-5 sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ide-bg)] active:scale-[0.97]"
    >
      <span aria-hidden className="ide-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/40" />
      Execute {e.title}
    </button>
  );
}

/** The first lines of the test (from `def`), each wiping in from the left the first time the card is on screen. */
function PeekCode({ ex }: { ex: PreparedExample }) {
  const start = useMemo(() => {
    const i = ex.lines.findIndex((tokens) => tokens[0]?.[0] === "def");
    return Math.max(0, i);
  }, [ex.lines]);
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-full overflow-hidden font-mono text-[11px] leading-5 text-[var(--ide-text)] [mask-image:linear-gradient(to_bottom,#000_58%,transparent)] lg:text-xs"
      style={{ paddingTop: PAD }}
    >
      {ex.lines.slice(start, start + PEEK_LINES + 3).map((tokens, k) => (
        <div key={k} className={cn("flex h-5 items-center", k === 0 && "bg-white/[0.045]")}>
          <span
            className={cn(
              "flex w-11 shrink-0 select-none justify-end self-stretch border-r border-white/[0.06] pr-3 text-[11px] tabular-nums",
              k === 0 ? "items-center text-[var(--ide-dim)]" : "items-center text-[var(--ide-num)]/80",
            )}
          >
            {start + k + 1}
          </span>
          <span className="ide-text ide-wipe min-w-0 flex-1 overflow-hidden whitespace-pre pl-3" style={{ animationDelay: `${0.25 + k * 0.14}s` }}>
            {tokens.map(([text, kind], j) => (
              <span key={j} className={`tk-${kind}`}>
                {text}
              </span>
            ))}
            {k === 0 && <span className="ide-caret ml-px inline-block h-3.5 w-[2px] translate-y-0.5 bg-[var(--ide-text)]" />}
          </span>
        </div>
      ))}
    </div>
  );
}

function CodePane({
  ex,
  cue,
  cueIdx,
  phase,
  launching,
  launchLabel,
  runId,
  reduce,
}: {
  ex: PreparedExample;
  cue: PreparedCue | null;
  cueIdx: number;
  phase: Phase;
  launching: boolean;
  launchLabel: string;
  runId: number;
  reduce: boolean;
}) {
  const winRef = useRef<HTMLDivElement>(null);
  const [winH, setWinH] = useState(0);
  const cues = ex.cues;

  useEffect(() => {
    const el = winRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWinH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const finished = cueIdx >= cues.length;
  const running = phase === "running" || phase === "starting";
  const focus = cue ?? (finished ? cues[cues.length - 1] : null);
  const total = ex.lines.length * LINE_H + PAD * 2;
  const offset = focus ? Math.min(Math.max(0, focus.start * LINE_H - winH * 0.4), Math.max(0, total - winH)) : 0;
  const firstActive = finished ? Infinity : cue ? cue.start : -1;
  const transition = reduce ? "none" : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";

  // Ghost hints at the end of a line: a passed assertion shows how long it took; a response wait shows a pulsing
  // "waiting" until the run leaves the `with` block, then the status it got. Both come from the recording's own timeline.
  const chips = useMemo(() => {
    const map = new Map<number, { wait: boolean; text: string }>();
    const at = cue ? cue.start : Infinity;
    cues.forEach((c, j) => {
      if (j > cueIdx) return;
      if (c.kind === "assert") {
        if (j < cueIdx) map.set(c.start, { wait: false, text: fmtMs((cues[j + 1]?.t ?? ex.video.duration) - c.t) });
      } else if (c.kind === "api" && c.chip) {
        const waiting = !finished && at >= c.start && at <= c.blockEnd;
        map.set(c.start, { wait: waiting, text: waiting ? "waiting for response…" : c.chip });
      }
    });
    return map;
  }, [cue, cueIdx, cues, ex.video.duration, finished]);

  return (
    <div ref={winRef} className="relative min-h-[220px] flex-1 overflow-hidden bg-[var(--ide-bg)] lg:min-h-[260px]">
      <div
        className="absolute inset-x-0 top-0 font-mono text-[11px] leading-5 text-[var(--ide-text)] lg:text-xs"
        style={{ transform: `translateY(${PAD - offset}px)`, transition }}
      >
        {cue && running && (
          <div
            aria-hidden
            className="ide-band pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: (cue.end - cue.start + 1) * LINE_H,
              transform: `translateY(${cue.start * LINE_H}px)`,
              transition: reduce ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), height 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}
        {ex.lines.map((tokens, i) => {
          const isActive = running && cue !== null && i >= cue.start && i <= cue.end;
          const done = ex.executable[i] && i < firstActive;
          const chip = chips.get(i);
          return (
            <div key={i} className={cn("relative flex h-5 items-center", isActive && "ide-line-active")}>
              <span aria-hidden className="flex w-11 shrink-0 select-none justify-end pr-3 text-[11px] tabular-nums text-[var(--ide-num)]">
                {done ? <Check className="h-3 w-3 self-center text-accent" strokeWidth={3} /> : i + 1}
              </span>
              <span className="ide-text min-w-0 flex-1 overflow-hidden whitespace-pre">
                {tokens.map(([text, kind], k) => (
                  <span key={k} className={`tk-${kind}`}>
                    {text}
                  </span>
                ))}
              </span>
              {chip && (
                <span
                  aria-hidden
                  className={cn(
                    "ml-2 mr-3 hidden shrink-0 rounded px-1.5 text-[10px] leading-4 sm:inline-block",
                    chip.wait ? "ide-wait bg-white/10 text-[#b9bdc2]" : "ide-pop bg-[#2e4a2b] text-[#a5d68f]",
                  )}
                >
                  {!chip.wait && "✓ "}
                  {chip.text}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* The 2-second launching moment before the run: the code dimmed, a spinner, the label and a filling bar. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-20 grid place-items-center bg-[var(--ide-bg)]/80 transition-opacity duration-300",
          launching ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex flex-col items-center gap-3 font-mono text-[11px] text-[var(--ide-text)]">
          <svg viewBox="0 0 24 24" className="ide-spin h-7 w-7 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" />
          </svg>
          <span>{launchLabel}</span>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
            <span key={runId} className="ide-launch block h-full w-full origin-left rounded-full bg-accent" />
          </span>
        </div>
      </div>
    </div>
  );
}

const popFull: Variants = {
  off: { opacity: 0, scale: 0.88, rotateY: -14, x: -24, transition: { duration: 0.3, ease: [0.4, 0, 0.6, 1] } },
  on: { opacity: 1, scale: 1, rotateY: 0, x: 0, transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.12 } },
};
const popPlain: Variants = {
  off: { opacity: 0, transition: { duration: 0.2 } },
  on: { opacity: 1, transition: { duration: 0.2, delay: 0.12 } },
};

/** The preview window springs in (a slight 3D tilt that settles flat) and shrinks back when the run is over. */
function PopFrame({
  shown,
  hidden,
  mobile,
  reduce,
  children,
}: {
  shown: boolean;
  hidden: boolean;
  mobile: boolean;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={reduce ? popPlain : popFull}
      initial={false}
      animate={shown ? "on" : "off"}
      style={{ transformPerspective: 1200, transformOrigin: mobile ? "center" : "left center" }}
      // The desktop window keeps its final width while the slot opens around it (48% of the stage minus the gap), so the
      // video never reflows during the pop; the stage is a size container, and the card clips whatever is still outside.
      className={cn("min-w-0", !mobile && "lg:w-[calc((100cqw-1rem)*0.48)]", hidden && "hidden")}
    >
      {children}
    </motion.div>
  );
}

/** The recording, exactly its own aspect ratio (no black edges), with the still shown until it plays. */
function VideoArea({
  ex,
  idle,
  preload,
  videoRef,
}: {
  ex: PreparedExample;
  idle: boolean;
  preload: "none" | "auto";
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: `${ex.video.width} / ${ex.video.height}` }}>
      <video
        ref={videoRef}
        src={ex.video.src}
        muted
        playsInline
        preload={preload}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        tabIndex={-1}
        draggable={false}
        aria-hidden
        onContextMenu={(e) => e.preventDefault()}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />
      <Image
        src={ex.video.poster}
        alt=""
        fill
        sizes={ex.id === "desktop" ? "(min-width: 1024px) 560px, 100vw" : "240px"}
        className={cn("pointer-events-none select-none object-cover transition-opacity duration-500", idle ? "opacity-100" : "opacity-0")}
      />
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-500", idle ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

function AddressPill({ runId, className }: { runId: number; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1.5 rounded-full bg-[#f1f3f4] px-3 py-1 text-[11px] text-neutral-600", className)}>
      <Lock aria-hidden className="h-3 w-3 shrink-0 text-neutral-500" />
      <span key={runId} className="ide-addr truncate">
        {ADDRESS}
      </span>
    </span>
  );
}

/** A drawn Chrome-like window: tab strip, address bar (lock + neutral address) and the page underneath. */
function BrowserFrame({ runId, children }: { runId: number; children: React.ReactNode }) {
  const dots = ["#ff5f57", "#febc2e", "#28c840"];
  return (
    <div aria-hidden className="overflow-hidden rounded-xl border border-black/10 bg-[#dee1e6] shadow-[0_18px_40px_-22px_rgb(0_0_0/0.5)]">
      <div className="flex items-end gap-3 px-3 pt-2">
        <span className="mb-2 flex gap-1.5">
          {dots.map((c, i) => (
            <span key={`${runId}-${i}`} className="ide-pop h-2.5 w-2.5 rounded-full" style={{ background: c, animationDelay: `${0.12 + i * 0.07}s` }} />
          ))}
        </span>
        <span className="flex h-8 w-40 max-w-[55%] items-center gap-2 rounded-t-lg bg-white px-3">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent ring-1 ring-black/20" />
          <span className="h-1.5 flex-1 rounded-full bg-neutral-300" />
        </span>
      </div>
      <div className="flex items-center gap-2 bg-white px-3 py-1.5 text-neutral-500">
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
        <RotateCw className="h-3.5 w-3.5 shrink-0" />
        <AddressPill runId={runId} className="flex-1" />
        <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-200" />
      </div>
      {children}
    </div>
  );
}

/** A drawn phone: plain rounded body (no notch), a mobile browser's address bar and the page. Fluid from `lg`. */
function PhoneFrame({ runId, children }: { runId: number; children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className="mx-auto w-[calc(var(--pv)+20px)] rounded-[2.2rem] bg-[#0b0b0d] p-2.5 shadow-[0_18px_40px_-22px_rgb(0_0_0/0.6)]"
    >
      <div className="overflow-hidden rounded-[1.6rem] bg-white">
        <div className="flex h-8 items-center gap-2 bg-[#f1f3f4] px-3 text-neutral-500">
          <Lock className="h-3 w-3 shrink-0" />
          <span key={runId} className="ide-addr min-w-0 flex-1 truncate text-[10px] text-neutral-600">
            {ADDRESS.split("/")[0]}
          </span>
          <RotateCw className="h-3 w-3 shrink-0" />
        </div>
        {children}
      </div>
    </div>
  );
}
