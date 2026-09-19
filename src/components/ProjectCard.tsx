import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cardStats, type Project } from "@/content/projects";
import { Pill } from "@/components/Pill";
import { StatCard } from "@/components/StatCard";
import { Reveal } from "@/components/Reveal";
import { LogoBadge } from "@/components/LogoBadge";
import { cn } from "@/lib/cn";

// Soft cards: a gray panel, no outline, a shadow only on hover. The focus ring is dark because a
// lime ring is almost invisible on gray.
const cardBase =
  "group flex h-full flex-col bg-shell transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0_0_0/0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2";

/** The round arrow in a card's corner: white at rest, lime when the card is hovered. */
function ArrowButton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white text-foreground transition-colors duration-200 group-hover:bg-accent",
        className,
      )}
    >
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  );
}

export function FeaturedProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/projects/${project.slug}`} className={cn(cardBase, "rounded-3xl p-6 sm:p-8")}>
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex -rotate-2 items-center rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-on-accent">
            Featured Project
          </span>
          <ArrowButton className="h-11 w-11" />
        </div>

        <div className="mt-6">
          <LogoBadge src={project.logo} alt={project.name} size={84} tone="none" aspect={project.logoAspect} />
        </div>
        <h3 className="mt-4 text-3xl font-semibold text-foreground">{project.name}</h3>
        <p className="mt-3 text-muted-foreground">{project.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Pill key={tag} tone="white">
              {tag}
            </Pill>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="grid grid-cols-3 gap-4 border-t border-foreground/10 pt-6">
            {cardStats(project.stats).map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} variant="plain" />
            ))}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const extraTags = project.tags.length - 2;

  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/projects/${project.slug}`} className={cn(cardBase, "rounded-2xl p-6")}>
        <div className="flex items-start justify-between gap-3">
          <LogoBadge src={project.logo} alt={project.name} size={68} tone="none" aspect={project.logoAspect} />
          <ArrowButton className="h-9 w-9" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-foreground">{project.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tags.slice(0, 2).map((tag) => (
            <Pill key={tag} tone="white" className="text-[11px]">
              {tag}
            </Pill>
          ))}
          {extraTags > 0 && (
            <Pill tone="white" className="text-[11px]">
              +{extraTags}
            </Pill>
          )}
        </div>
      </Link>
    </Reveal>
  );
}
