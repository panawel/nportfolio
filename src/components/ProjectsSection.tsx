import { featuredProjects, otherProjects } from "@/content/projects";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { FeaturedProjectCard, ProjectCard } from "@/components/ProjectCard";

export function ProjectsSection() {
  return (
    <section id="projects" className="frame-x scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <Eyebrow>03. Projects</Eyebrow>
        </Reveal>
        {/* No visible headline (the cards speak for themselves), but keep the heading for screen readers. */}
        <h2 className="sr-only">Projects</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <FeaturedProjectCard key={project.slug} project={project} delay={i * 0.1} />
          ))}
        </div>

        <div className="mt-6 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
