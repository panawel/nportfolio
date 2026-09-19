import { Clapperboard, Gift, Plane, Sparkle, Star, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A drawn phone (no words), 10s loop: a lime credit card swipes up into it, the balance ring fills, then
// three balloons rise from behind the phone in turn, sway, and pop into benefit icons (a movie, food, a
// holiday) that hold and fade. The balloons rise 84px, which is exactly where each icon chip sits.
// Loops sit under TicketRow, so they pause off screen; with reduced motion the ring stays full and the
// card, balloons and chips stay hidden.
const lanes: { left: number; delay: number; balloon: string; chip: string; Icon: LucideIcon }[] = [
  { left: 18, delay: 1.6, balloon: "bg-accent-2 border-foreground", chip: "bg-accent text-foreground", Icon: Clapperboard },
  { left: 90, delay: 3, balloon: "bg-accent border-foreground", chip: "bg-accent-2 text-on-accent-2", Icon: UtensilsCrossed },
  { left: 162, delay: 4.4, balloon: "bg-foreground border-accent", chip: "bg-foreground text-accent", Icon: Plane },
];

function Balloon({ tone }: { tone: string }) {
  return (
    <span className="relative block h-9 w-7">
      <span className={cn("absolute inset-x-0 top-0 h-8 rounded-[50%_50%_50%_50%/58%_58%_42%_42%] border-2", tone)} />
      <span className="absolute left-1.5 top-1.5 h-2.5 w-1 rotate-12 rounded-full bg-white/70" />
      <span className={cn("absolute bottom-0.5 left-1/2 -ml-[3px] h-2 w-2 rotate-45 border-b-2 border-r-2", tone)} />
      <span className="absolute left-1/2 top-full h-6 w-px bg-foreground/50" />
    </span>
  );
}

const tiles = ["bg-accent", "bg-accent-2", "bg-shell", "bg-foreground"];

export function BalloonPhone({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto h-[340px] w-[208px]", className)}>
      <div aria-hidden className="absolute inset-0">
        <FloatingIcon icon={Gift} className="-left-8 top-[226px]" rotate={-8} />
        <FloatingIcon icon={Star} tone="accent-2" className="-right-8 top-[160px]" delay={1.2} rotate={8} />
        <Sparkle className="cs-blink absolute left-3 top-[112px] h-4 w-4 fill-accent-2 text-foreground" />

        {/* Balloons and the icons they turn into (behind the phone). */}
        {lanes.map((l) => (
          <span key={l.left}>
            <span className="cs-balloon absolute top-[82px] block opacity-0" style={{ left: l.left, animationDelay: `${l.delay}s` }}>
              <Balloon tone={l.balloon} />
            </span>
            <span
              className={cn(
                "cs-goodie-chip absolute top-0 grid h-8 w-8 place-items-center rounded-xl border-2 border-foreground opacity-0",
                l.chip,
              )}
              style={{ left: l.left - 2, animationDelay: `${l.delay}s` }}
            >
              <l.Icon className="h-4 w-4" />
            </span>
          </span>
        ))}

        {/* The phone. */}
        <div className="cs-sway absolute bottom-0 left-1/2 z-10 -ml-16 h-[236px] w-32 rounded-[30px] bg-foreground p-2 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]">
          <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white">
            <span className="absolute left-1/2 top-2 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-foreground" />
            <div className="flex h-9 items-end justify-between bg-accent-2 px-3 pb-1.5">
              <span className="h-2 w-12 rounded-full bg-foreground/70" />
              <span className="h-4 w-4 rounded-full border-2 border-foreground/70 bg-white/60" />
            </div>
            <div className="relative mx-auto mt-2 h-16 w-16">
              <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" fill="none">
                <circle cx="32" cy="32" r="22" stroke="rgb(0 0 0 / 0.1)" strokeWidth="7" />
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="138.2"
                  strokeDashoffset="30"
                  className="cs-ring-fill text-foreground"
                />
              </svg>
              <span className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-accent text-foreground">
                <Gift className="h-4 w-4" />
              </span>
            </div>
            <div className="mx-2.5 mt-2 grid grid-cols-2 gap-1.5">
              {tiles.map((t) => (
                <span key={t} className={cn("block h-10 rounded-xl border-2 border-foreground/15", t)} />
              ))}
            </div>
          </div>
        </div>

        {/* The credit card that swipes up into the phone. */}
        <span className="cs-card-swipe absolute bottom-12 left-1 z-20 block h-11 w-[72px] rounded-lg border-2 border-foreground bg-accent opacity-0">
          <span className="mt-2 block h-2 bg-foreground" />
          <span className="ml-1.5 mt-1.5 block h-2 w-3 rounded-[3px] bg-foreground/60" />
        </span>
      </div>
    </TicketRow>
  );
}
