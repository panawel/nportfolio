import { Bell, Cherry, Clover, Crown, Gem, Sparkle, Star } from "lucide-react";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A drawn slot machine (no words). 8s loop: the lever pulls, three reels spin and stop one after another
// on the same icon (a win), the window flashes and coins pop out of the tray. Each reel is a tall strip
// of icons that repeats every 6 items, with the Star first; the reel keyframes (cs-reel-1..3 in
// globals.css) end at item 12 / 18 / 24, which are all Stars, and the strip starts at item 0, also a
// Star, so the loop restarts on an identical frame. Keep ITEM_H, REEL_ITEMS and those keyframes in step.
const ITEM_H = 60;
const REEL_ITEMS = 26;
const reelIcons = [Star, Gem, Cherry, Crown, Bell, Clover];

function Coin({ variant, className, delay = 0 }: { variant: "gold" | "pink" | "black"; className?: string; delay?: number }) {
  return (
    <span className={cn("cs-bob absolute", className)} style={{ animationDelay: `${delay}s` }}>
      <span
        className={cn(
          "cs-flip grid h-7 w-7 place-items-center rounded-full border-2",
          variant === "gold" && "border-foreground bg-accent-2",
          variant === "pink" && "border-foreground bg-accent",
          variant === "black" && "border-accent bg-foreground",
        )}
        style={{ animationDelay: `${delay * 0.7}s` }}
      >
        <span className={cn("h-3 w-3 rounded-full border-2", variant === "black" ? "border-accent/70" : "border-foreground/60")} />
      </span>
    </span>
  );
}

function Reel({ n }: { n: 1 | 2 | 3 }) {
  return (
    <div className="relative w-[52px] overflow-hidden rounded-lg bg-shell" style={{ height: ITEM_H }}>
      <div className={`cs-reel-${n} flex flex-col`}>
        {Array.from({ length: REEL_ITEMS }).map((_, i) => {
          const Icon = reelIcons[i % reelIcons.length];
          return (
            <span key={i} className="grid shrink-0 place-items-center" style={{ height: ITEM_H }}>
              <Icon className={cn("h-7 w-7", i % 6 === 0 ? "fill-accent-2 text-foreground" : "text-foreground/80")} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SlotMachine({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto w-[220px]", className)}>
      <div aria-hidden>
        <Coin variant="gold" className="-left-9 top-6" />
        <Coin variant="black" className="-right-8 top-40" delay={1.1} />
        <Coin variant="pink" className="-right-6 -top-4" delay={2} />
        <Coin variant="gold" className="-left-7 bottom-14" delay={2.8} />
        <Sparkle className="cs-blink absolute -right-4 top-2 h-4 w-4 fill-accent-2 text-foreground" />
        <Sparkle className="cs-blink absolute -left-5 top-44 h-3 w-3 fill-accent-2 text-foreground" style={{ animationDelay: "0.7s" }} />

        <div className="cs-sway relative h-[262px] w-[220px] rounded-[28px] bg-foreground p-3 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]">
          {/* Marquee lights chasing along the top. */}
          <div className="flex h-6 items-center justify-center gap-2 rounded-full bg-white/5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="cs-chase h-1.5 w-1.5 rounded-full bg-white/20"
                style={
                  { animationDelay: `${i * 0.18}s`, "--chase": i % 2 ? "var(--accent-2)" : "var(--accent)" } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="cs-win mt-3 rounded-2xl bg-accent p-1.5">
            <div className="flex gap-1.5 rounded-xl bg-white p-1.5">
              <Reel n={1} />
              <Reel n={2} />
              <Reel n={3} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 px-1">
            <span className="h-4 w-4 rounded-full bg-accent" />
            <span className="h-4 w-4 rounded-full bg-accent-2" />
            <span className="h-4 w-4 rounded-full bg-white/80" />
            <span className="ml-auto h-2 w-16 rounded-full bg-white/15" />
          </div>

          {/* The coin tray: coins pop out on a win. */}
          <div className="relative mt-3 h-14 overflow-visible rounded-xl bg-white/10">
            {[0, 0.12, 0.24].map((d, i) => (
              <span
                key={d}
                className={cn(
                  "cs-tray absolute bottom-2 h-6 w-6 rounded-full border-2",
                  i === 1 ? "border-accent bg-foreground" : i === 0 ? "border-foreground bg-accent-2" : "border-foreground bg-accent",
                )}
                style={{ left: 40 + i * 30, animationDelay: `${d}s` }}
              />
            ))}
          </div>

          {/* The lever on the right side. */}
          <span className="absolute -right-5 top-16 block h-[72px] w-3">
            <span className="cs-lever relative mx-auto block h-full w-1.5 rounded-full bg-foreground">
              <span className="absolute -top-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-foreground bg-accent-2" />
            </span>
          </span>
        </div>
      </div>
    </TicketRow>
  );
}
