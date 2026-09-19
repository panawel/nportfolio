"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { BarChart3, Bug, CalendarDays, ClipboardCheck, Clock, CreditCard, Layers, Package, Radio, Timer, TriangleAlert, Users, type LucideIcon } from "lucide-react";
import type { Stat } from "@/content/projects";
import { useCountUp } from "@/lib/use-count-up";
import { cn } from "@/lib/cn";

// A still icon for a stat, picked from its label. The order matters: "Critical Defects" must match before
// "Defects", and "Test Environments" before "Total Tests".
const statIcons: { test: RegExp; Icon: LucideIcon }[] = [
  { test: /critical/i, Icon: TriangleAlert },
  { test: /defect|bug/i, Icon: Bug },
  { test: /environment/i, Icon: Layers },
  { test: /engineer|team/i, Icon: Users },
  { test: /support|availab/i, Icon: Clock },
  { test: /gateway|payment/i, Icon: CreditCard },
  { test: /liveops|coverage/i, Icon: Radio },
  { test: /hour/i, Icon: Timer },
  { test: /month|week|running/i, Icon: CalendarDays },
  { test: /build/i, Icon: Package },
  { test: /test/i, Icon: ClipboardCheck },
];

function statIcon(label: string) {
  return statIcons.find((s) => s.test.test(label)) ?? { Icon: BarChart3 };
}

// The sticker blocks are colour-blocked by position (white, lime, the page's second colour, black, then
// again), so a row reads as a set. Text on each uses that colour's own "on" token, with label opacities
// chosen so the small labels stay at 4.5:1 or better on every page's colours.
const tones = [
  { card: "bg-white", value: "text-foreground", label: "text-foreground/60", icon: "bg-foreground text-accent" },
  { card: "bg-accent", value: "text-on-accent", label: "text-on-accent/85", icon: "bg-foreground text-accent" },
  { card: "bg-accent-2", value: "text-on-accent-2", label: "text-on-accent-2", icon: "bg-white text-foreground" },
  { card: "bg-foreground", value: "text-white", label: "text-white/70", icon: "bg-accent text-on-accent" },
];

/** `sticker`: white tilted card with the hard shadow (case-study pages). `plain`: just the number and
 *  its label, for use inside another card (homepage project cards). */
export function StatCard({
  stat,
  index = 0,
  variant = "sticker",
  className,
}: {
  stat: Stat;
  index?: number;
  variant?: "sticker" | "plain";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();

  const match = stat.value.match(/^(\d+(?:\.\d+)?)/);
  const numeric = match ? parseFloat(match[1]) : null;
  const suffix = match ? stat.value.slice(match[1].length) : "";
  const animated = useCountUp(numeric ?? 0, inView && numeric !== null && !reducedMotion);
  const display = reducedMotion ? numeric ?? stat.value : animated;

  const plain = variant === "plain";
  const { Icon } = statIcon(stat.label) as { Icon: LucideIcon };
  const tone = tones[index % tones.length];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: reducedMotion ? "0ms" : `${index * 60}ms` }}
      className={cn(
        "transition-all duration-500",
        !plain && `shadow-hard-sm rounded-2xl p-5 max-sm:p-4 ${tone.card} ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`,
        inView || reducedMotion ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {!plain && (
        <span aria-hidden className={cn("mb-5 grid h-10 w-10 place-items-center rounded-xl", tone.icon)}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div
        className={cn(
          "font-mono font-semibold",
          plain ? "text-2xl text-foreground" : `text-3xl tracking-tight sm:text-4xl ${tone.value}`,
        )}
      >
        {numeric !== null ? `${display}${suffix}` : stat.value}
      </div>
      <div
        className={cn(
          "uppercase tracking-wide",
          plain ? "mt-1 text-[11px] leading-tight text-muted-foreground" : `mt-1.5 text-xs max-sm:text-[10.5px] max-sm:tracking-normal ${tone.label}`,
        )}
      >
        {stat.label}
      </div>
    </div>
  );
}
