import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { Bug, ClipboardCheck } from "lucide-react";
import { HERO_TICK_MS, heroCounters, heroStatement, heroTestRun } from "@/content/profile";
import { projects } from "@/content/projects";
import { LiveCount } from "@/components/HeroStatValue";
import { TestRunPanel } from "@/components/TestRunPanel";
import { TicketRow } from "@/components/TicketRow";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

/** Distinct items, most frequent first (ties keep first-appearance order). */
function rank(items: string[]) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!);
}

// Everything on the cards is derived from the project data, so nothing here is invented.
const testTypes = rank(projects.flatMap((p) => p.servicesOffered));
const defectTypes = rank(
  projects.flatMap((p) =>
    p.stats.flatMap((s) => {
      const type = s.label.match(/^([A-Za-z]+) Defects?$/)?.[1];
      return type ? [type] : [];
    }),
  ),
);
// The footer of the statement card: the project stat about automated tests (read from the data, so it
// stays true if that data changes).
const automatedStat = projects.flatMap((p) => p.stats).find((s) => /automated/i.test(s.label));

type CardConfig = {
  icon: LucideIcon;
  /** Ticket-key prefix; the key is this plus the counter's starting number, e.g. BUG-44. */
  prefix: string;
  status: string;
  /** `lime` is the highlighted ticket (the bug); `light` is payouts' off-white card. */
  tone: "lime" | "light";
  /** Which tiny looping animation the type icon gets (see the `ticket-*` classes in globals.css). */
  motion: "tick" | "wiggle";
  tilt: string;
  chips: string[];
};

// One entry per item of `heroCounters`, in the same order (label and starting value come from there).
// The look is generic issue-tracker ticket anatomy (type icon, key, status tag, labels) in the
// site's lime/black/off-white palette; it deliberately borrows no branding or colors from any real product.
const cards: CardConfig[] = [
  { icon: ClipboardCheck, prefix: "QA", status: "Live", tone: "light", motion: "tick", tilt: "-rotate-[1.5deg]", chips: testTypes },
  { icon: Bug, prefix: "BUG", status: "Live", tone: "lime", motion: "wiggle", tilt: "rotate-1", chips: defectTypes },
];

// Sizes, radii and shadows follow payouts.com's hero widget cards (measured from their CSS).
const frame = {
  lime: "border-black/[0.08] bg-accent shadow-[0_18px_40px_-20px_rgb(8_16_30/0.7)]",
  light:
    "border-foreground/10 bg-[linear-gradient(160deg,#fbfbf9,#eaeae8)] shadow-[0_18px_40px_-22px_rgb(40_55_80/0.4)]",
};

const ringMask = "radial-gradient(closest-side, transparent 67%, #000 69%)";

/** payouts' two decorative donut rings in a light card's bottom-right corner (clipped by the card),
 *  turning slowly in opposite directions. Neutral ink instead of payouts' slate blue, so the palette
 *  stays lime / black / off-white. Positions and start angles are measured from payouts' CSS. */
function Rings() {
  return (
    <>
      <span
        aria-hidden
        className="ticket-ring pointer-events-none absolute left-[147px] top-[83px] h-[176px] w-[176px] rounded-full"
        style={
          {
            "--r0": "158deg",
            "--dur": "10s",
            background: "conic-gradient(rgb(19 19 19 / 0.5), rgb(19 19 19 / 0) 55%)",
            mask: ringMask,
            WebkitMask: ringMask,
          } as React.CSSProperties
        }
      />
      <span
        aria-hidden
        className="ticket-ring ticket-ring--reverse pointer-events-none absolute left-[183px] top-[119px] h-[103px] w-[103px] rounded-full"
        style={
          {
            "--r0": "196deg",
            "--dur": "14s",
            background: "conic-gradient(from 180deg, rgb(19 19 19 / 0.3), rgb(19 19 19 / 0) 60%)",
            mask: ringMask,
            WebkitMask: ringMask,
          } as React.CSSProperties
        }
      />
    </>
  );
}

// Like payouts' cards, chips stay on a single row. Show as many as fit in the card's 236px of
// content width, then a "+N" chip for the rest. Widths are a slightly conservative estimate for
// 11px Geist medium plus the chip's horizontal padding.
const CHIP_ROW_WIDTH = 236;
const CHIP_GAP = 6;
const chipWidth = (label: string) => label.length * 6.3 + 21;

function fitChips(chips: string[]) {
  let used = 0;
  let count = 0;
  for (const chip of chips) {
    const rest = chips.length - (count + 1);
    const moreChip = rest > 0 ? CHIP_GAP + chipWidth(`+${rest}`) : 0;
    const next = used + (count > 0 ? CHIP_GAP : 0) + chipWidth(chip);
    if (next + moreChip > CHIP_ROW_WIDTH) break;
    used = next;
    count++;
  }
  count = Math.max(count, 1);
  return { shown: chips.slice(0, count), extra: chips.length - count };
}

/** One ticket: a card sized and shadowed like payouts' widget cards, pinned at a slight angle. */
function HeroStatCard({
  label,
  start,
  config,
  index,
}: {
  label: string;
  start: number;
  config: CardConfig;
  index: number;
}) {
  const { icon: Icon, prefix, status, tone, motion, tilt, chips } = config;
  const light = tone === "light";
  const { shown, extra } = fitChips(chips);
  const ticketKey = `${prefix}-${start}`;
  const chipClass = cn(
    "inline-flex h-[25px] items-center rounded-full px-2.5 text-[11px] font-medium text-foreground",
    light ? "bg-foreground/5" : "bg-foreground/10",
  );

  return (
    <Reveal delay={0.3 + index * 0.08} className="shrink-0 snap-start">
      <div
        className={cn(
          "relative flex h-full min-h-[208px] w-[272px] flex-col rounded-[22px] border p-[18px] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0",
          light && "overflow-hidden",
          frame[tone],
          tilt,
        )}
      >
        {light && <Rings />}

        {/* Ticket line: issue-type square + key on the left, status tag on the right. Decorative
            metadata, so it is hidden from screen readers (they get the label and the value). */}
        <div aria-hidden className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <span
              className={cn(
                "flex h-[26px] w-[26px] items-center justify-center rounded-[9px] bg-foreground text-accent",
                motion === "tick" && "ticket-tick",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  motion === "wiggle" && "ticket-wiggle",
                )}
              />
            </span>
            <span className="font-mono text-[12.5px] font-semibold text-foreground/80">{ticketKey}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-wide text-accent">
            {/* Live dot with an expanding, fading ring (payouts' status ping). */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="ticket-ping absolute inset-0 rounded-full bg-accent" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {status}
          </span>
        </div>

        <div className="relative z-10 mt-3">
          <p className="text-[15px] font-semibold leading-tight text-foreground">{label}</p>
          <div className="mt-3">
            <LiveCount
              id={label}
              start={start}
              tickMs={HERO_TICK_MS}
              offsetMs={index * (HERO_TICK_MS / 2)}
              flash={light ? "rgb(219 255 0 / 0.9)" : "rgb(255 255 255 / 0.6)"}
            />
          </div>
        </div>

        {/* Labels row, set off by a dashed "ticket stub" divider. */}
        <div className="relative z-10 mt-auto pt-2">
          <div
            className={cn(
              "flex gap-1.5 border-t border-dashed pt-2.5",
              light ? "border-black/20" : "border-black/25",
            )}
          >
            {shown.map((chip) => (
              <span key={chip} className={chipClass}>
                {chip}
              </span>
            ))}
            {extra > 0 && <span className={chipClass}>+{extra}</span>}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** payouts' "say" card: a short statement with dimmed connector words and an inline orb, over a
 *  mini test-runner readout, a counting stat line and a progress bar that follows the run. */
function HeroSayCard({ index }: { index: number }) {
  return (
    <Reveal delay={0.3 + index * 0.08} className="shrink-0 snap-start">
      <div
        className={cn(
          "relative flex h-full min-h-[208px] w-[272px] -rotate-1 flex-col gap-2 rounded-[22px] border p-[18px] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0",
          frame.light,
        )}
      >
        <p className="text-[16.6px] font-semibold leading-[21.6px] tracking-[-0.02em] text-foreground">
          {heroStatement.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              {"orb" in part ? (
                <span
                  aria-hidden
                  className="mx-[1.6px] inline-block h-4 w-4 rounded-full bg-accent align-middle shadow-[0_0_0_1.5px_#0a0a0a,0_0_9.6px_rgb(219_255_0/0.9)]"
                />
              ) : (
                <span className={part.muted ? "text-foreground/[0.58]" : undefined}>{part.text}</span>
              )}
            </Fragment>
          ))}
        </p>

        {automatedStat && heroTestRun.length > 0 && <TestRunPanel lines={heroTestRun} stat={automatedStat} />}
      </div>
    </Reveal>
  );
}

/** The ticket row that peeks up over the hero's bottom edge (normal flow with a negative margin, not
 *  absolute positioning, so it can never collide with the logo strip below). From `lg` the three cards
 *  sit in a row; below that the row is a swipeable snap strip that bleeds to the screen edge. */
export function HeroStatCards() {
  return (
    <div className="frame-x relative z-20 -mt-14 sm:-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <TicketRow className="-mx-6 -mb-10 -mt-3 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 pb-10 pt-3 [scrollbar-width:none] lg:mx-0 lg:mb-0 lg:mt-0 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0 [&::-webkit-scrollbar]:hidden">
          {heroCounters.slice(0, cards.length).map((counter, i) => (
            <HeroStatCard
              key={counter.label}
              label={counter.label}
              start={counter.start}
              config={cards[i]}
              index={i}
            />
          ))}
          <HeroSayCard index={cards.length} />
        </TicketRow>
      </div>
    </div>
  );
}
