import { Gamepad2, Play, Sparkle, Star } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { Scaled } from "@/components/Scaled";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A drawn retro TV (no words): a wiggling antenna, knobs that turn, and a screen that changes "channel"
// every ~2.2s between four cartoon scenes made of shapes. Each channel is one layer of an 8.8s loop
// (negative delays put them 2.2s apart), and a burst of static flashes at every change. Loops sit under
// TicketRow, so they pause off screen.
const CYCLE = 8.8;
const channelDelay = (i: number) => `${(i * CYCLE) / 4 - CYCLE}s`;

const eqBars = [
  { tone: "bg-accent", delay: 0 },
  { tone: "bg-accent-2", delay: 0.2 },
  { tone: "bg-accent", delay: 0.4 },
  { tone: "bg-accent-2", delay: 0.1 },
  { tone: "bg-accent", delay: 0.3 },
];

const stars = [
  { className: "left-3 top-4 h-6 w-6", delay: 0 },
  { className: "right-4 top-9 h-8 w-8", delay: 0.5 },
  { className: "bottom-4 left-10 h-5 w-5", delay: 1 },
];

function Rod({ tilt, delay, tip }: { tilt: number; delay: string; tip: string }) {
  return (
    <span className="absolute bottom-0 left-1/2 -ml-0.5 h-16 w-1 origin-bottom" style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="cs-antenna relative block h-full w-full rounded-full bg-foreground" style={{ animationDelay: delay }}>
        <span className={cn("absolute -top-1.5 left-1/2 -ml-[5px] block h-2.5 w-2.5 rounded-full border-2 border-foreground", tip)} />
      </span>
    </span>
  );
}

function Knob({ delay }: { delay: string }) {
  return (
    <span className="relative block h-8 w-8 shrink-0 rounded-full border-2 border-foreground bg-white">
      <span
        className="cs-hand absolute left-1/2 top-[3px] block h-[11px] w-[3px] -ml-[1.5px] rounded-full bg-foreground"
        style={{ animationDelay: delay }}
      />
    </span>
  );
}

/** `scale` shrinks the whole TV (1 = 208 x 238px, see `Scaled`: a transform inside a box of the scaled size, not CSS
 *  `zoom`, which older Safari ignores; the px steps of the loops scale with it). `chips={false}` leaves out the
 *  floating icons around it (for the small copy beside the title on phones). */
export function RetroTv({ className, scale = 1, chips = true }: { className?: string; scale?: number; chips?: boolean }) {
  const tv = (
    <TicketRow className="relative mx-auto w-[208px]">
      <div aria-hidden>
        {chips && (
          <>
            <FloatingIcon icon={Play} className="-left-9 top-28" rotate={-8} />
            <FloatingIcon icon={Star} tone="accent-2" className="-right-9 top-16" delay={1.2} rotate={8} />
            <FloatingIcon icon={Gamepad2} tone="accent-2" className="-left-7 bottom-3" delay={2.1} rotate={-6} />
            <Sparkle className="cs-blink absolute -right-3 bottom-6 h-4 w-4 fill-accent text-foreground" />
          </>
        )}

        {/* The antenna. */}
        <div className="relative h-[76px] w-full">
          <Rod tilt={-26} delay="0s" tip="bg-accent" />
          <Rod tilt={24} delay="-1.5s" tip="bg-accent-2" />
          <span className="absolute bottom-0 left-1/2 -ml-5 h-2.5 w-10 rounded-t-full bg-foreground" />
        </div>

        <div className="relative">
          <div className="cs-sway relative flex h-[146px] w-[208px] gap-2 rounded-[26px] border-[3px] border-foreground bg-accent-2 p-3 shadow-hard-sm">
            {/* The screen. */}
            <div className="relative h-full flex-1 rounded-2xl bg-foreground p-1.5">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-foreground">
                {/* 1: a bouncing ball */}
                <div className="cs-scene absolute inset-0 bg-accent" style={{ animationDelay: channelDelay(0) }}>
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-foreground" />
                  <span className="cs-ball absolute bottom-[22px] left-1/2 -ml-4 h-8 w-8 rounded-full border-2 border-foreground bg-accent-2" />
                  <span className="absolute bottom-3 left-1/2 -ml-3 h-1.5 w-6 rounded-full bg-foreground/20" />
                </div>
                {/* 2: twinkling stars */}
                <div className="cs-scene absolute inset-0 bg-foreground" style={{ animationDelay: channelDelay(1) }}>
                  {stars.map((s) => (
                    <Star
                      key={s.className}
                      className={cn("cs-blink absolute fill-accent text-accent", s.className)}
                      style={{ animationDelay: `${s.delay}s` }}
                    />
                  ))}
                </div>
                {/* 3: an equalizer */}
                <div className="cs-scene absolute inset-0 bg-white" style={{ animationDelay: channelDelay(2) }}>
                  <div className="absolute inset-x-3 bottom-3 flex h-[70px] items-end justify-between gap-1.5">
                    {eqBars.map((b, i) => (
                      <span
                        key={i}
                        className={cn("cs-eq block h-full flex-1 rounded-t-md border-2 border-foreground", b.tone)}
                        style={{ animationDelay: `${b.delay}s` }}
                      />
                    ))}
                  </div>
                </div>
                {/* 4: a play button and a filling bar */}
                <div className="cs-scene absolute inset-0 bg-accent-2" style={{ animationDelay: channelDelay(3) }}>
                  <span className="absolute left-1/2 top-4 -ml-8 grid h-16 w-16 place-items-center rounded-full border-2 border-foreground bg-accent text-foreground">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                  <span className="absolute inset-x-4 bottom-4 block h-2 overflow-hidden rounded-full bg-white/80">
                    <span className="cs-fill block h-full w-full rounded-full bg-foreground" />
                  </span>
                </div>

                {/* Static at every channel change. */}
                <div className="cs-static pointer-events-none absolute inset-0 z-10 flex flex-col opacity-0">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className={cn("block flex-1", i % 2 ? "bg-white" : "bg-foreground/70")} />
                  ))}
                </div>
                {/* The "live" light. */}
                <span className="cs-blink absolute right-2 top-2 z-20 h-2.5 w-2.5 rounded-full border border-foreground bg-accent" />
              </div>
            </div>

            {/* The control side: two knobs and the speaker. */}
            <div className="flex w-10 shrink-0 flex-col items-center justify-between py-0.5">
              <Knob delay="0s" />
              <Knob delay="-2.4s" />
              <span className="flex w-full flex-col gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-[3px] rounded-full bg-foreground" />
                ))}
              </span>
            </div>
          </div>
          {/* Feet */}
          <span className="absolute -bottom-3 left-9 block h-3 w-5 -skew-x-12 rounded-b-md bg-foreground" />
          <span className="absolute -bottom-3 right-9 block h-3 w-5 skew-x-12 rounded-b-md bg-foreground" />
        </div>
        <div className="h-4" />
      </div>
    </TicketRow>
  );

  if (scale === 1) return <div className={className}>{tv}</div>;
  return (
    <Scaled width={208} height={238} scale={scale} className={className}>
      {tv}
    </Scaled>
  );
}
