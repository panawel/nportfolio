import { Coins, Gift, Store } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A phone with a voucher carousel inside (drawn, no words): cards slide left in turn, the centred one
// is full size, the dots follow, a points bar fills, and coins arc in from the side. One loop is 9s;
// keep CYCLE and the px steps in the cs-carousel-track keyframes (globals.css) in step with the card
// width (150px) plus gap (12px).
const CYCLE = 9;

const cards = [
  { tone: "lime", bars: "bg-foreground/70", dot: "bg-foreground" },
  { tone: "blue", bars: "bg-foreground/60", dot: "bg-foreground" },
  { tone: "dark", bars: "bg-accent", dot: "bg-accent" },
  // Clone of the first card, so the loop restarts on an identical frame.
  { tone: "lime", bars: "bg-foreground/70", dot: "bg-foreground" },
] as const;

const cardTone = {
  lime: "bg-accent",
  blue: "bg-accent-2",
  dark: "bg-foreground",
};

/** Negative delay that puts card/dot `i` at the right point of the 9s loop (the clone shares card 0's). */
const phase = (i: number) => (i % 3 === 0 ? 0 : -(CYCLE - 3 * (i % 3)));

export function VoucherPhone({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto w-[208px]", className)}>
      <div aria-hidden>
        <FloatingIcon icon={Gift} tone="accent-2" className="-left-9 top-10" rotate={-8} />
        <FloatingIcon icon={Coins} className="-right-8 top-44" delay={1.2} rotate={8} />
        <FloatingIcon icon={Store} tone="accent-2" className="-left-7 bottom-16" delay={2.1} rotate={-6} />

        {[0, 1.5, 3].map((delay, i) => (
          <span
            key={delay}
            className={cn(
              "cs-coin absolute bottom-6 left-0 z-20 h-5 w-5 rounded-full border-2 border-foreground",
              i === 1 ? "bg-accent-2" : "bg-accent",
            )}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        <div className="cs-sway relative h-[420px] w-[208px] rounded-[36px] bg-foreground p-2 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]">
          <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white">
            <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground" />

            <div className="mt-10 flex items-center gap-2 px-4">
              <span className="h-6 w-6 rounded-full bg-foreground/10" />
              <span className="h-2 w-16 rounded-full bg-foreground/10" />
            </div>

            <div className="mt-4 overflow-hidden">
              <div className="cs-carousel-track flex w-max gap-3 pl-[21px]">
                {cards.map((card, i) => (
                  <div
                    key={i}
                    className={cn("cs-card-focus relative h-24 w-[150px] shrink-0 rounded-2xl p-3", cardTone[card.tone])}
                    style={{ animationDelay: `${phase(i)}s` }}
                  >
                    <span className={cn("block h-5 w-5 rounded-full", card.dot)} />
                    <span className={cn("mt-3 block h-3 w-20 rounded-full", card.bars)} />
                    <span className={cn("mt-2 block h-2 w-12 rounded-full opacity-60", card.bars)} />
                    <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white" />
                    <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="cs-dot h-1.5 rounded-full"
                  style={{
                    animationDelay: `${phase(i)}s`,
                    width: i === 0 ? 14 : 6,
                    backgroundColor: i === 0 ? "var(--foreground)" : "rgb(0 0 0 / 0.15)",
                  }}
                />
              ))}
            </div>

            <div className="mt-6 space-y-3 px-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full", i === 1 ? "bg-accent-2" : "bg-accent")}>
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  </span>
                  <span className="h-2 flex-1 rounded-full bg-foreground/10" />
                </div>
              ))}
              <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <span className="cs-fill block h-full w-full rounded-full bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TicketRow>
  );
}
