"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { TestRunLine } from "@/content/profile";
import { InlineCount } from "@/components/HeroStatValue";
import { cn } from "@/lib/cn";

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// The run is a small state machine. Steps, in order:
//   0 header "running"        1 line 1 pending   2 line 1 PASS
//   3 line 2 pending          4 line 2 PASS      5 line 3 pending
//   6 line 3 PASS             7 header "N passed" (hold)   8 fade out, then back to 0
// STEP_MS[step] is how long to stay on that step (the whole loop is about 7.8s).
const STEP_MS = [600, 700, 400, 700, 400, 700, 400, 3300, 600];
const LAST_STEP = STEP_MS.length - 1;
const DONE_STEP = 7;

// Bar width per step: it fills as the run proceeds, holds full at PASS, and resets.
const PROGRESS = [0, 12, 33, 45, 66, 78, 100, 100, 100];

function Spinner({ active }: { active: boolean }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 90);
    return () => clearInterval(id);
  }, [active]);

  return <span className="text-accent">{SPINNER[frame]}</span>;
}

/** A tiny test-runner readout: each line resolves to PASS or FAILED in turn while a progress bar fills,
 *  then it holds and loops. Decorative (hidden from screen readers); the footer line under it carries
 *  the real stat. Runs only while on screen; reduced motion shows the finished state. */
export function TestRunPanel({
  lines,
  stat,
}: {
  lines: TestRunLine[];
  stat: { value: string; label: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reducedMotion = useReducedMotion();
  const [runStep, setRunStep] = useState(0);
  const step = reducedMotion ? DONE_STEP : runStep;

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const id = setTimeout(() => setRunStep((s) => (s >= LAST_STEP ? 0 : s + 1)), STEP_MS[runStep]);
    return () => clearTimeout(id);
  }, [inView, reducedMotion, runStep]);

  const done = step >= DONE_STEP;
  const failed = lines.filter((l) => l.result === "fail").length;
  const passed = lines.length - failed;

  return (
    <>
      <div
        ref={ref}
        aria-hidden
        className={cn(
          "h-[76px] shrink-0 overflow-hidden rounded-xl bg-foreground px-2.5 py-2 font-mono text-[10px] leading-[15px] text-white/80 transition-opacity duration-500",
          step === LAST_STEP && "opacity-0",
        )}
      >
        <div className="text-white/60">
          {done ? (
            failed > 0 ? (
              <>
                <span className="text-red-400">✗</span> {failed} failed · {passed} passed
              </>
            ) : (
              <>
                <span className="text-accent">✓</span> {passed} passed
              </>
            )
          ) : (
            <>
              $ running tests… <Spinner active={inView && !reducedMotion} />
            </>
          )}
        </div>
        {lines.map(({ name, result }, i) => {
          const visible = step >= 2 * i + 1;
          const resolved = step >= 2 * i + 2;
          const fail = result === "fail";
          if (!visible) return null;
          return (
            <div key={name} className="ticket-line-in flex items-center justify-between">
              <span className="truncate">
                {resolved ? (
                  <span className={fail ? "text-red-400" : "text-accent"}>{fail ? "✗" : "✓"}</span>
                ) : (
                  "▸"
                )}{" "}
                {name}
              </span>
              {resolved ? (
                fail ? (
                  <span className="ticket-fail font-bold text-red-400">FAILED</span>
                ) : (
                  <span className="ticket-pop font-bold text-accent">PASS</span>
                )
              ) : (
                <span className="text-white/35">···</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <span className="text-[11.5px] tracking-[-0.02em] text-foreground/70">
          <InlineCount value={stat.value} className="font-mono font-bold text-foreground" />{" "}
          {stat.label.toLowerCase()}
        </span>
        <div aria-hidden className="h-[5.4px] overflow-hidden rounded-full bg-foreground/[0.08]">
          <span
            className="block h-full rounded-full bg-foreground transition-[width] duration-500 ease-out"
            style={{ width: `${PROGRESS[step]}%` }}
          />
        </div>
      </div>
    </>
  );
}
