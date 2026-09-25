import { getContactLinks } from "@/lib/contact-links";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { Squiggle } from "@/components/Squiggle";

/** Content of the closing dark panel; the panel itself (and the footer row) lives in SiteFooter.
 *  Homepage only: project pages dropped this in favor of `MoreProjects` plus the footer's own slim
 *  bottom bar, which already carries the same social links. */
export function ContactSection() {
  const links = getContactLinks();

  return (
    <section id="contact" className="scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <Eyebrow className="justify-center" tone="light">
            05. Contact
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-6xl">
            Let&apos;s Connect
            <Squiggle className="mx-auto mt-2 w-40! text-accent" />
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-ink-foreground/70">
            Open to new opportunities and collaborations.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {links.map(({ label, href, icon: Icon }, i) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className={`shadow-hard inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
