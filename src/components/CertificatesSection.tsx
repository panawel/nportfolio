import { certificates } from "@/content/profile";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { CertificateCard } from "@/components/CertificateCard";

/** Two credentials on a vertical date rail (from `md`; below that the date moves into the card).
 *  Deliberately straight-edged and calm compared with the rest of the site: this section's job is
 *  proving credentials. */
export function CertificatesSection() {
  return (
    <section id="certificates" className="panel scroll-mt-24 bg-shell">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <Eyebrow>04. Certificates &amp; Events</Eyebrow>
        </Reveal>
        {/* No visible headline (the credentials are the content), but keep the heading for screen readers. */}
        <h2 className="sr-only">Certificates &amp; Events</h2>

        <ol className="mt-10 space-y-8">
          {certificates.map((cert, i) => {
            const first = i === 0;
            const last = i === certificates.length - 1;
            // Vertical position (px) of the rail dot: level with the top of the card's content.
            const dotTop = cert.featured ? 42 : 32;
            return (
              <li key={cert.slug} className="relative md:pl-[9rem]">
                <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[9rem] md:block">
                  <span
                    className="absolute left-0 w-[6rem] text-right font-mono text-xs uppercase leading-3 tracking-wide text-foreground/70"
                    style={{ top: dotTop }}
                  >
                    {cert.date}
                  </span>
                  {!first && (
                    <span className="absolute left-[7.5rem] top-[-2rem] w-px bg-foreground/20" style={{ height: `calc(2rem + ${dotTop}px)` }} />
                  )}
                  {!last && (
                    <span
                      className="absolute left-[7.5rem] w-px bg-foreground/20"
                      style={{ top: dotTop + 12, bottom: "-2rem" }}
                    />
                  )}
                  <span
                    className="absolute left-[7.5rem] h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-2 ring-foreground"
                    style={{ top: dotTop }}
                  />
                </div>

                <Reveal delay={i * 0.1}>
                  <CertificateCard cert={cert} />
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
