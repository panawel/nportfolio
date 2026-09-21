import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText, Bug, BarChart3, GitBranch, Video, Image as ImageIcon } from "lucide-react";
import { projects, getProject } from "@/content/projects";
import { BackToProjects } from "@/components/BackToProjects";
import { Pill } from "@/components/Pill";
import { Eyebrow } from "@/components/Eyebrow";
import { StatCard } from "@/components/StatCard";
import { Reveal } from "@/components/Reveal";
import { LogoBadge } from "@/components/LogoBadge";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { TicketRow } from "@/components/TicketRow";
import { VoucherPhone } from "@/components/case-study/VoucherPhone";
import { ScopeArt } from "@/components/case-study/ScopeArt";
import { CheckList } from "@/components/case-study/CheckList";
import { DeviceRow } from "@/components/case-study/DeviceRow";
import { SlotMachine } from "@/components/case-study/SlotMachine";
import { CoinShower } from "@/components/case-study/CoinShower";
import { PopcornHero } from "@/components/case-study/PopcornHero";
import { PhotoStickers } from "@/components/case-study/PhotoStickers";
import { CrmPhone } from "@/components/case-study/CrmPhone";
import { RetroTv } from "@/components/case-study/RetroTv";
import { SecurePhones } from "@/components/case-study/SecurePhones";
import { BalloonPhone } from "@/components/case-study/BalloonPhone";
import { ShoppingCartHero } from "@/components/case-study/ShoppingCartHero";
import { TestimonialStars } from "@/components/case-study/TestimonialStars";
import { AutomationExample } from "@/components/case-study/AutomationExample";
import { ToolTiles } from "@/components/case-study/ToolTiles";
import { ProjectGallery } from "@/components/case-study/ProjectGallery";
import { ScrollProgress } from "@/components/case-study/ScrollProgress";
import { SectionDots, type SectionDot } from "@/components/case-study/SectionDots";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Idan Pnuel`,
    description: project.tagline,
  };
}

// Column classes by number of stats, so a row never ends with a lone block (full class names for Tailwind).
const statColumns: Record<number, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3",
};

const documentIcon = {
  doc: FileText,
  "bug-tracker": Bug,
  report: BarChart3,
  repo: GitBranch,
  video: Video,
};

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // The dots on the side: one per section that exists, labelled with that section's own heading.
  const dots: SectionDot[] = [
    { id: "top", label: project.name },
    { id: "overview", label: "Overview" },
    ...(project.scopeSections.length > 0 ? [{ id: "scope", label: "Project Scope" }] : []),
    ...(project.deviceScope.length > 0 || project.tools.length > 0
      ? [{ id: "device-tools", label: project.deviceScope.length > 0 ? "Device Scope" : "Tools" }]
      : []),
    ...(project.stats.length > 0 ? [{ id: "in-numbers", label: "In Numbers" }] : []),
    { id: "documents", label: "Documents & Gallery" },
    ...(project.results.length > 0 || project.testimonial ? [{ id: "results", label: "Results" }] : []),
  ];

  const documentCards = project.documents.map((doc, i) => {
    const Icon = documentIcon[doc.kind];
    if (doc.href) {
      // A real document: a sticker button (solid border, hard shadow, lime icon square, arrow) that presses in on hover.
      return (
        <Reveal key={doc.label} delay={i * 0.05}>
          <a
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${doc.label} (opens in a new tab)`}
            className="shadow-hard-sm group flex h-full items-center gap-3 rounded-xl border-2 border-foreground bg-white p-3 text-sm font-medium text-foreground transition-[transform,box-shadow,background-color] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-accent hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-on-accent transition-colors group-hover:bg-foreground group-hover:text-accent">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">{doc.label}</span>
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>
      );
    }
    return (
      <Reveal key={doc.label} delay={i * 0.05}>
        <div className="flex h-full items-center gap-3 rounded-xl border-2 border-dashed border-border bg-shell p-4 text-sm text-muted-foreground">
          <Icon className="h-4 w-4 text-foreground" />
          {doc.label}
        </div>
      </Reveal>
    );
  });
  const recordings = project.gallery ?? [];
  const galleryPlaceholders = Array.from({ length: Math.max(0, project.galleryCount - recordings.length) }).map((_, i) => (
    <Reveal key={`gallery-${i}`} delay={(project.documents.length + i) * 0.05}>
      <div className="flex aspect-video items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-shell text-xs text-muted-foreground">
        <ImageIcon className="h-4 w-4" /> Screenshot coming soon
      </div>
    </Reveal>
  ));

  return (
    <>
    {/* A project with its own accent recolours the whole document (menu and footer included) while its
        page is mounted; the style disappears when you navigate away. */}
    {(project.accent || project.accent2) && (
      <style>{`:root{${project.accent ? `--accent:${project.accent};` : ""}${project.accent2 ? `--accent-2:${project.accent2};` : ""}${project.accent2Text ? `--on-accent-2:${project.accent2Text};` : ""}}`}</style>
    )}
    <ScrollProgress />
    <SectionDots sections={dots} />
    <main>
      <section id="top" className="panel relative scroll-mt-24 bg-shell">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-28">
          <div
            className={
              project.heroVisual
                ? `lg:grid lg:items-center lg:gap-14 ${
                    project.heroInline ? "lg:grid-cols-[minmax(0,1fr)_11rem]" : "lg:grid-cols-[minmax(0,1fr)_15.5rem]"
                  }`
                : undefined
            }
          >
          <div>
          <BackToProjects className="inline-flex items-center gap-2 rounded font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> All Projects
          </BackToProjects>

          <Reveal>
            <div className={`mt-6 flex items-center gap-4 ${project.heroInline ? "max-[359px]:gap-3" : ""}`}>
              <LogoBadge src={project.logo} alt={project.name} size={56} tone="white" />
              <h1
                className={`text-4xl font-medium tracking-tight text-foreground sm:text-5xl ${
                  project.heroInline ? "max-[359px]:text-3xl" : ""
                }`}
              >
                {project.name}
              </h1>
              {/* A small copy beside the title on phones and tablets; from lg the picture sits in its own column. */}
              {project.heroInline && project.heroVisual === "popcorn" && (
                <PopcornHero scale={0.3} className="-my-5 ml-auto lg:hidden" />
              )}
              {project.heroInline && project.heroVisual === "retro-tv" && (
                <RetroTv scale={0.3} chips={false} className="-my-1.5 ml-auto lg:hidden" />
              )}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.tagline}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Pill key={tag} tone="white">{tag}</Pill>
              ))}
            </div>
          </Reveal>
          {project.context && (
            <Reveal delay={0.15}>
              <p className="shadow-hard-sm mt-6 -rotate-1 rounded-2xl bg-white p-5 font-mono text-sm text-foreground/80">
                {project.context}
              </p>
            </Reveal>
          )}
          </div>
          {project.heroVisual && (
            <div className={project.heroInline ? "hidden lg:block" : "mt-14 lg:mt-0 lg:pr-9"}>
              {project.heroVisual === "voucher-phone" && <VoucherPhone />}
              {project.heroVisual === "slot-machine" && <SlotMachine />}
              {project.heroVisual === "popcorn" && <PopcornHero scale={project.heroInline ? 0.7 : 1} />}
              {project.heroVisual === "crm-phone" && <CrmPhone />}
              {project.heroVisual === "retro-tv" && <RetroTv scale={project.heroInline ? 0.7 : 1} className="mx-auto" />}
              {project.heroVisual === "phones-lock" && <SecurePhones />}
              {project.heroVisual === "balloon-phone" && <BalloonPhone />}
              {project.heroVisual === "shopping-cart" && <ShoppingCartHero />}
            </div>
          )}
          </div>
        </div>
      </section>

      <section id="overview" className="frame-x scroll-mt-24">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
          </Reveal>
          <div
            className={
              project.overviewPhotos ? "mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-start lg:gap-10" : "mt-4"
            }
          >
            <Reveal delay={0.05}>
              <p className="text-lg leading-relaxed text-foreground/90">{project.overview}</p>
            </Reveal>
            {project.overviewPhotos && <PhotoStickers photos={project.overviewPhotos} className="mt-8 lg:mt-1" />}
          </div>

          {project.servicesOffered.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.servicesOffered.map((service) => (
                  <Pill key={service} tone="accent">
                    {service}
                  </Pill>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {project.scopeSections.length > 0 && (
        <section id="scope" className="panel scroll-mt-24 bg-shell">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Reveal>
              <Eyebrow>Project Scope</Eyebrow>
            </Reveal>
            <TicketRow className="mt-8 grid gap-4 sm:grid-cols-2">
              {project.scopeSections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.05} className={section.wide ? "sm:col-span-2" : undefined}>
                  <div
                    className={`shadow-hard-sm h-full rounded-2xl bg-white p-5 ${
                      // The automation card is never tilted; while a run is open it lets itself grow past its column on wide screens.
                      section.automation
                        ? "transition-[margin] duration-500 motion-reduce:transition-none xl:has-[[data-open=true]]:-mx-32"
                        : i % 2 === 0
                          ? "-rotate-1"
                          : "rotate-1"
                    }`}
                  >
                    {section.art && <ScopeArt kind={section.art} tall={section.wide} />}
                    <h3 className="font-semibold text-foreground">{section.heading}</h3>
                    <CheckList
                      items={section.bullets}
                      lockIndex={section.lockBullet}
                      className="mt-3 space-y-1.5 text-sm text-muted-foreground"
                    />
                    {section.automation && project.automation && <AutomationExample examples={project.automation} />}
                  </div>
                </Reveal>
              ))}
            </TicketRow>
          </div>
        </section>
      )}

      {(project.deviceScope.length > 0 || project.tools.length > 0) && (
        <section id="device-tools" className="frame-x scroll-mt-24">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <TicketRow className={`grid gap-8 ${project.deviceScope.length > 0 && project.tools.length > 0 ? "sm:grid-cols-2" : ""}`}>
              {project.deviceScope.length > 0 && (
                <Reveal>
                  <Eyebrow>Device Scope</Eyebrow>
                  <DeviceRow devices={project.deviceScope} className="mt-4" />
                </Reveal>
              )}
              {project.tools.length > 0 && (
                <Reveal delay={0.05}>
                  <Eyebrow>Tools</Eyebrow>
                  <ToolTiles tools={project.tools} projectLogo={project.logo} />
                </Reveal>
              )}
            </TicketRow>
          </div>
        </section>
      )}

      {project.stats.length > 0 && (
        <section id="in-numbers" className="panel scroll-mt-24 bg-shell">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Reveal>
              <Eyebrow>In Numbers</Eyebrow>
            </Reveal>
            <TicketRow className={`mt-6 grid grid-cols-2 gap-3 ${statColumns[project.stats.length] ?? "sm:grid-cols-3 lg:grid-cols-4"}`}>
              {project.stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  index={i}
                  // An odd last block spans both columns on phones, so no block is left alone.
                  className={project.stats.length % 2 === 1 && i === project.stats.length - 1 ? "max-sm:col-span-2" : undefined}
                />
              ))}
            </TicketRow>
          </div>
        </section>
      )}

      <section id="documents" className="frame-x scroll-mt-24">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Reveal>
            <Eyebrow>Documents &amp; Gallery</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3 text-sm text-muted-foreground">
              As a result of customer privacy agreements, full testing documents can&apos;t always be shared publicly —
              placeholders below mark what&apos;s coming as artifacts are cleared for release.
            </p>
          </Reveal>
          {recordings.length > 0 ? (
            <div className="mt-6">
              <ProjectGallery items={recordings}>
                {documentCards}
                {galleryPlaceholders}
              </ProjectGallery>
            </div>
          ) : (
            documentCards.length + galleryPlaceholders.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documentCards}
                {galleryPlaceholders}
              </div>
            )
          )}
        </div>
      </section>

      {(project.results.length > 0 || project.testimonial) && (
        <section id="results" className="panel relative scroll-mt-24 bg-shell py-16">
          {project.resultsVisual === "coin-shower" && <CoinShower />}
          {project.resultsVisual === "ticket-shower" && <CoinShower variant="tickets" />}
          {project.resultsVisual === "star-shower" && <CoinShower variant="stars" />}
          {project.resultsVisual === "play-shower" && <CoinShower variant="plays" />}
          {project.resultsVisual === "bubble-shower" && <CoinShower variant="bubbles" />}
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <Eyebrow>Results</Eyebrow>
            </Reveal>
            {project.results.length > 0 && (
              <CheckList items={project.results} size="lg" className="mt-6 space-y-3 text-foreground/90" />
            )}

            {project.testimonial && (
              <Reveal delay={0.15}>
                <TestimonialStars className="mt-8 pl-2" />
                <blockquote className="shadow-hard mt-3 rotate-1 rounded-2xl bg-white p-6 text-foreground/90">
                  <p className="text-lg italic">&ldquo;{project.testimonial.quote}&rdquo;</p>
                  <footer className="mt-4 font-mono text-xs uppercase tracking-wide text-foreground/60">
                    — {project.testimonial.author}
                  </footer>
                </blockquote>
              </Reveal>
            )}
          </div>
        </section>
      )}
    </main>
    <SiteFooter>
      <ContactSection compact />
    </SiteFooter>
    </>
  );
}
