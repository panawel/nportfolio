import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { LogoBadge } from "@/components/LogoBadge";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const COUNT = 5;

// Same small alternating-tilt set the site's other icon tiles use (TechStack, ToolTiles), so this
// grid reads as the same hand-crafted "icon dock" language, just recoloured for the dark footer.
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-2"];

/** A random pick of other projects, computed once per page at build time (this file has no "use
 *  client": project pages are statically generated, so this runs on the server during `next
 *  build`). Each project page gets its own independent shuffle, so the picks differ from page to
 *  page and reshuffle on the next deploy - no client-side JS, no hydration mismatch. */
function pickOthers(current: string): Project[] {
  const others = projects.filter((p) => p.slug !== current);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(COUNT, others.length));
}

/** "More Projects" block in the dark footer panel - case-study pages only (see its one usage in
 *  projects/[slug]/page.tsx, the sole content of that page's `SiteFooter`). Never on the homepage:
 *  its own Projects section already lists all 8. No bottom border of its own: SiteFooter's slim
 *  bottom bar (copyright/social icons) right below it already carries a top divider.
 *
 *  Below `sm` this used to be a horizontal snap-scroll row of chips - swiping left/right felt like
 *  friction the site didn't need. It's now a static, no-scroll "icon dock" row instead: all 5 picks
 *  in one row, logo only, no name (all 8 project logos already read clearly on their own). Tiles are
 *  the largest square (3rem/48px) that still fits 5 of them + gap-1.5 in one row on the narrowest
 *  supported phone (320px, ~272px of content width). From `sm` the layout is a wrapping grid of mini
 *  cards with each project's tagline instead. "View All Projects" sits once, below both grids (each
 *  breakpoint hides the other grid, so it always lands directly under whichever one is visible). */
export function MoreProjects({ current }: { current: string }) {
  const picks = pickOthers(current);
  if (picks.length === 0) return null;

  return (
    <section aria-label="More projects">
      <div className="mx-auto max-w-6xl py-12 sm:px-6 sm:py-16">
        <Reveal>
          <h2 className="px-6 font-mono text-xs uppercase tracking-wide text-ink-foreground/60 sm:px-0">
            More Projects
          </h2>
        </Reveal>

        {/* Mobile icon dock: no scroll, all 5 in one row, logo only. This row uses its own tighter
            side padding (px-2, not the section's usual px-6) so the tiles can be as large as possible
            while still fitting 5 of them + gap-1 in one row on the narrowest supported phone (320px,
            ~304px of content width at px-2). A fixed square (not LogoBadge's aspect-aware "none"
            tone, which is meant for wide horizontal slots and would overflow a square tile) -
            object-contain centres each logo, including wide wordmarks, inside the same tile shape,
            exactly like any app-icon grid. */}
        <div className="mt-6 flex flex-nowrap justify-center gap-1 px-2 sm:hidden">
          {picks.map((p, i) => (
            <Reveal key={p.slug} delay={0.04 * i}>
              <Link
                href={`/projects/${p.slug}`}
                aria-label={p.name}
                className={cn(
                  "flex h-[54px] w-[54px] items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:rotate-0 hover:border-accent/40 hover:bg-white/10 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  tilts[i % tilts.length],
                )}
              >
                <div className="relative h-8 w-8">
                  <Image src={p.logo as string} alt="" aria-hidden fill sizes="64px" className="object-contain" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* sm+ mini cards: logo, name, tagline - unchanged from before. */}
        <div className="mt-6 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {picks.map((p, i) => (
            <Reveal key={p.slug} delay={0.05 * i}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <LogoBadge src={p.logo} alt={p.name} size={36} tone="none" aspect={p.logoAspect} />
                  <span className="min-w-0 truncate text-sm font-semibold text-ink-foreground">{p.name}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-foreground/30 transition-colors group-hover:text-accent" />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-foreground/55 line-clamp-2">{p.tagline}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* One link, placed once after both grids: whichever grid is hidden takes no space, so this
            always lands directly under the visible one, on every breakpoint. Right-aligned to the
            content edge (justify-end), not left like the heading above it. */}
        <Reveal delay={0.04 * picks.length} className="mt-5 flex justify-end px-6 sm:px-0">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 rounded font-mono text-xs uppercase tracking-wide text-ink-foreground/60 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            View All Projects
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
