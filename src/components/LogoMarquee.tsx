import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";

const logos = projects.filter((p) => p.logo);

// The track holds this many copies of the set and slides by exactly one of them (see the
// `marquee` keyframes). Enough copies that the strip never runs out of logos on wide screens:
// one set is ~1200px, so 4 covers viewports up to ~3500px.
const COPIES = 4;

export function LogoMarquee() {
  return (
    <div className="panel group bg-shell py-6">
      {/* Pauses while the pointer is anywhere over the strip (or a finger is pressed on it), so the
          project you are aiming at holds still. Reduced motion: no scrolling at all, so show one
          static, wrapped, centered set instead of a track with most projects clipped away. */}
      <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:px-6">
        {Array.from({ length: COPIES }).flatMap((_, copy) =>
          logos.map((p) => (
            // Margin (not flex gap) so every item carries its own trailing space and the track
            // width is an exact multiple of one set, which keeps the loop seamless. Links are not
            // in the tab order: they are pointer/touch shortcuts to pages that the Projects
            // section below already exposes to keyboard users, and tabbing into a moving,
            // half-clipped strip would strand focus on an invisible item. Copies are aria-hidden
            // so screen readers don't hear each project four times.
            <Link
              key={`${copy}-${p.slug}`}
              href={`/projects/${p.slug}`}
              tabIndex={-1}
              aria-hidden={copy > 0 ? true : undefined}
              className={`group/item mr-12 flex shrink-0 items-center gap-2 opacity-70 grayscale transition-[filter,opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 motion-reduce:mr-0 motion-reduce:px-5 ${
                copy > 0 ? "motion-reduce:hidden" : ""
              }`}
            >
              {/* No tile behind the logo (same bare, aspect-true treatment as LogoBadge's tone="none",
                  not reused here directly since this image stays decorative/aria-hidden - the visible
                  name text next to it is what a screen reader gets). */}
              <div className="relative h-8 shrink-0" style={{ width: Math.min(32 * (p.logoAspect ?? 1), 32 * 1.8) }}>
                <Image src={p.logo as string} alt="" aria-hidden fill sizes="64px" className="object-contain object-left" />
              </div>
              {/* Flat lime highlighter band, same technique as the About headline (no gradient). */}
              <span className="font-mono text-xs uppercase tracking-wide text-foreground/70 transition-[color,box-shadow] duration-200 group-hover/item:text-foreground group-hover/item:shadow-[inset_0_-0.35em_0_var(--accent)]">
                {p.name}
              </span>
            </Link>
          )),
        )}
      </div>
    </div>
  );
}
