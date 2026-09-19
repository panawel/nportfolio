import { Cloud, Crown, Play, Sparkle, Users } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A drawn CRM phone (no words). 9s loop: a test package (the APK) drops in with a bounce, the lead cards
// slide in one after another, one lead's status turns lime and a chat bubble pops out of it and floats
// away, then a store badge pops (the release). Loops sit under TicketRow, so they pause off screen.
const leads = [
  { avatar: "bg-accent", lines: ["w-20", "w-12"] },
  { avatar: "bg-accent-2", lines: ["w-16", "w-14"] },
  { avatar: "bg-foreground/15", lines: ["w-24", "w-10"] },
  { avatar: "bg-accent", lines: ["w-14", "w-16"] },
];

export function CrmPhone({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto w-[208px]", className)}>
      <div aria-hidden>
        <FloatingIcon icon={Users} className="-left-9 top-10" rotate={-8} />
        <FloatingIcon icon={Crown} tone="accent-2" className="-right-9 top-44" delay={1.2} rotate={8} />
        <FloatingIcon icon={Cloud} tone="accent-2" className="-left-7 bottom-16" delay={2.1} rotate={-6} />
        <Sparkle className="cs-blink absolute -right-3 top-4 h-4 w-4 fill-accent-2 text-foreground" />

        {/* The test package dropping in. */}
        <span className="cs-drop absolute left-1/2 top-[64px] z-20 -ml-5 grid h-10 w-10 place-items-center rounded-xl border-2 border-foreground bg-accent-2 text-on-accent-2 opacity-0">
          <span className="h-4 w-4 rotate-45 border-2 border-foreground/80" />
        </span>

        {/* The chat bubble that pops out of the second lead. */}
        <span className="cs-bubble absolute -right-3 top-[192px] z-20 opacity-0">
          <span className="relative flex h-7 w-12 items-center justify-center gap-1 rounded-2xl border-2 border-foreground bg-accent">
            {[0, 1, 2].map((i) => (
              <span key={i} className="cs-blink h-1.5 w-1.5 rounded-full bg-foreground" style={{ animationDelay: `${i * 0.25}s` }} />
            ))}
            <span className="absolute -bottom-1.5 left-2 h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-foreground bg-accent" />
          </span>
        </span>

        {/* The store badge that appears at the end (the release). */}
        <span className="cs-release absolute -bottom-4 -right-5 z-20 grid h-12 w-12 place-items-center rounded-2xl border-2 border-accent-2 bg-foreground text-accent">
          <Play className="h-5 w-5 fill-current" />
        </span>

        <div className="cs-sway relative h-[420px] w-[208px] rounded-[36px] bg-foreground p-2 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]">
          <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white">
            <span className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground" />

            {/* Gold header */}
            <div className="flex h-[76px] items-end justify-between bg-accent-2 px-4 pb-3">
              <span className="h-2.5 w-20 rounded-full bg-foreground/70" />
              <span className="h-6 w-6 rounded-full border-2 border-foreground/70 bg-white/60" />
            </div>

            {/* Lead cards */}
            <div className="mt-4 space-y-2.5 px-3">
              {leads.map((lead, i) => (
                <div
                  key={i}
                  className="cs-lead-in flex items-center gap-2.5 rounded-xl border-2 border-foreground/10 bg-white p-2.5"
                  style={{ animationDelay: `${0.5 + i * 0.45}s` }}
                >
                  <span className={cn("h-8 w-8 shrink-0 rounded-full border-2 border-foreground", lead.avatar)} />
                  <span className="flex-1 space-y-1.5">
                    <span className={cn("block h-2 rounded-full bg-foreground/70", lead.lines[0])} />
                    <span className={cn("block h-1.5 rounded-full bg-foreground/20", lead.lines[1])} />
                  </span>
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", i === 1 ? "cs-status bg-foreground/15" : "bg-foreground/15")}
                  />
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="absolute inset-x-6 bottom-4 flex justify-between">
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn("h-5 w-5 rounded-full", i === 0 ? "bg-foreground" : "bg-foreground/15")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </TicketRow>
  );
}
