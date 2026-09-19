import { Heart, Play, Smartphone, Star, Tablet, Tv } from "lucide-react";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// Three tiny looping scenes in the order the overview sentence lists them: programs, series and movies
// (poster cards in turn); exclusive influencer content (a phone with hearts and a star); and a large
// library on any device (a wall of posters and three devices lighting in turn). Shapes and icons only.
const tile = "shadow-hard-sm relative h-32 overflow-hidden rounded-2xl bg-white";
const chipBase = "grid h-8 w-8 shrink-0 place-items-center rounded-lg";

const posters = [
  { tone: "bg-accent text-foreground", delay: 0 },
  { tone: "bg-accent-2 text-on-accent-2", delay: -6 },
  { tone: "bg-foreground text-accent", delay: -3 },
];

const hearts = [
  { hx: -14, delay: 0, tone: "fill-accent-2 text-accent-2" },
  { hx: 6, delay: 0.95, tone: "fill-accent text-foreground" },
  { hx: 16, delay: 1.9, tone: "fill-accent-2 text-accent-2" },
];

const devices = [Smartphone, Tablet, Tv];

export function StreamingOverview({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {/* Programs, series and movies: poster cards taking the spotlight in turn */}
      <div aria-hidden className={tile}>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
          {posters.map((p) => (
            <span
              key={p.delay}
              className={cn("cs-card-focus grid h-[72px] w-12 place-items-center rounded-lg border-2 border-foreground", p.tone)}
              style={{ animationDelay: `${p.delay}s` }}
            >
              <Play className="h-5 w-5 fill-current" />
            </span>
          ))}
        </div>
      </div>

      {/* Exclusive influencer content: a phone that collects hearts, and a star badge bursting */}
      <div aria-hidden className={tile}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="relative block h-[88px] w-14 rounded-xl border-2 border-foreground bg-white">
            <span className="absolute inset-x-1.5 top-2 block h-9 rounded-md bg-accent" />
            <span className="absolute left-2 top-14 block h-1.5 w-8 rounded-full bg-foreground/70" />
            <span className="absolute left-2 top-[68px] block h-1.5 w-5 rounded-full bg-foreground/20" />
          </span>
          {hearts.map((h, i) => (
            <Heart
              key={i}
              className={cn("cs-heart absolute left-1/2 top-1/2 -ml-2 h-4 w-4 opacity-0", h.tone)}
              style={{ animationDelay: `${h.delay}s`, "--hx": `${h.hx}px` } as React.CSSProperties}
            />
          ))}
          <span className="cs-pop-in absolute -right-5 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-foreground bg-accent-2 text-on-accent-2">
            <Star className="h-3.5 w-3.5 fill-current" />
          </span>
        </div>
      </div>

      {/* A large library on any device: a wall of posters and the devices it plays on */}
      <div aria-hidden className={tile}>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4">
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={cn("h-8 w-6 rounded-[5px] border-2 border-foreground bg-black/10", i % 2 ? "cs-lit-2" : "cs-lit")}
                style={{ animationDelay: `${((i * 7) % 12) * 0.3}s` }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {devices.map((Icon, i) => (
              <span
                key={i}
                className={cn(chipBase, "cs-lit bg-black/10 text-foreground")}
                style={{ animationDelay: `${i * 1.2}s` }}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </TicketRow>
  );
}
