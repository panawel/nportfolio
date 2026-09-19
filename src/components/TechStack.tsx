import Image from "next/image";
import { techStack } from "@/content/profile";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

// Small alternating tilts so the tiles read as stickers set down by hand, not a ruled grid.
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

const total = techStack.reduce((sum, group) => sum + group.items.length, 0);
const areas = techStack.length;

export function TechStack() {
  return (
    <section id="stack" className="panel scroll-mt-24 bg-shell">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>02. Tech Stack</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
              <Highlight>
                {total} {total === 1 ? "tool" : "tools"}
              </Highlight>{" "}
              across {areas} {areas === 1 ? "area" : "areas"}.
            </h2>
          </Reveal>
        </div>

        <div className="space-y-10">
          {techStack.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.08}>
              <section aria-label={group.category}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-mono text-xs uppercase tracking-wide text-foreground/70">
                    {group.category}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Phones: an even 3-column grid (tiles centered in equal cells). From 640px up: a
                    wrapping row of 72px cells with 10px gaps, which fits a 7-tool shelf on one row
                    (7 x 72 + 6 x 10 = 564px) without an orphan tile. */}
                <ul className="mt-5 grid grid-cols-3 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-2.5">
                  {group.items.map((item, i) => (
                    <li key={item.label} className="group flex w-full flex-col items-center gap-2.5 sm:w-[72px]">
                      <div
                        className={cn(
                          "shadow-hard-sm flex h-16 w-16 items-center justify-center rounded-2xl bg-white transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:rotate-0",
                          tilts[i % tilts.length],
                        )}
                      >
                        {item.icon ? (
                          <Image
                            src={item.icon}
                            alt=""
                            aria-hidden
                            width={40}
                            height={40}
                            // Eager: these are tiny files and the tile is nothing but the icon, so a
                            // lazily-loaded one would show as an empty white square until it arrives.
                            loading="eager"
                            className={cn("h-10 w-10 object-contain", item.invert && "invert")}
                            style={item.zoom ? { scale: item.zoom } : undefined}
                          />
                        ) : (
                          <span className="font-mono text-sm font-semibold text-foreground/70">
                            {item.label.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className="whitespace-nowrap rounded-sm px-1 text-center text-xs font-medium leading-tight text-foreground/80 transition-[color,box-shadow] duration-200 group-hover:text-foreground group-hover:shadow-[inset_0_-0.4em_0_var(--accent)]">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* The shelf: a soft, drawn-looking line (rounded ends, a hair off level) under the row. */}
                <div aria-hidden className="mt-5 h-0.5 w-full -rotate-[0.3deg] rounded-full bg-foreground/15" />
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
