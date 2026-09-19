"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type SectionDot = { id: string; label: string };

/** A column of dots at the right edge (wide screens): the one for the section you are in is lime and
 *  larger, hovering or focusing one shows that section's own heading, and clicking jumps there. */
export function SectionDots({ sections }: { sections: SectionDot[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const current = sections.find((s) => seen.get(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          aria-current={active === s.id ? "location" : undefined}
          className="group relative flex h-5 w-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        >
          <span
            className={cn(
              "rounded-full border-2 border-foreground transition-all duration-200",
              active === s.id ? "h-3.5 w-3.5 bg-accent" : "h-2 w-2 bg-white group-hover:bg-accent",
            )}
          />
          <span className="pointer-events-none absolute right-7 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 font-mono text-[10px] uppercase leading-none tracking-wide text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
