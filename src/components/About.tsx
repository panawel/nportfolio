import { Gamepad2, Rocket, Sparkles } from "lucide-react";
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { AiToolStickers } from "@/components/AiToolStickers";
import { Highlight } from "@/components/Highlight";

// One icon per supporting line, in the order of `profile.about.details`.
const detailIcons = [Rocket, Gamepad2];

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Splits the lead around the highlight phrases and wraps those in a flat lime highlighter band. */
function renderLead(lead: string, highlights: string[]) {
  if (highlights.length === 0) return lead;
  // A capture group makes split() keep the matches, at the odd indexes.
  const parts = lead.split(new RegExp(`(${highlights.map(escapeRegExp).join("|")})`));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Highlight key={i}>{part}</Highlight>
    ) : (
      part
    ),
  );
}

export function About() {
  const { lead, highlights, details } = profile.about;

  return (
    <section id="about" className="frame-x scroll-mt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div>
          <Reveal>
            <Eyebrow>01. About Me</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
              {renderLead(lead, highlights)}
            </h2>
          </Reveal>

          <div className="mt-9 space-y-4">
            {details.map((line, i) => {
              const Icon = detailIcons[i] ?? Sparkles;
              return (
                <Reveal key={line} delay={0.12 + i * 0.07}>
                  <p className="flex items-start gap-4 text-lg text-muted-foreground sm:text-xl">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent ${
                        i % 2 === 0 ? "-rotate-3" : "rotate-3"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="pt-0.5">{line}</span>
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>

        <AiToolStickers />
      </div>
    </section>
  );
}
