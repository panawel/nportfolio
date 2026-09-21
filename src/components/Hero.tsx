import Image from "next/image";
import { Bug, CheckCircle2 } from "lucide-react";
import { profile } from "@/content/profile";
import { ExperienceCounter } from "@/components/ExperienceCounter";
import { Reveal } from "@/components/Reveal";
import { RotatingText } from "@/components/RotatingText";
import { FloatingIcon } from "@/components/FloatingIcon";
import { SectionLink } from "@/components/SectionLink";
import { Squiggle } from "@/components/Squiggle";
import { LogoMarquee } from "@/components/LogoMarquee";
import { HeroStatCards } from "@/components/HeroStatCards";

const roles = ["QA Engineer", "Bug Hunter", "Automation Tinkerer", "Release-Day Sanity Checker", "Pixel Nitpicker"];

// Progressive blur behind the hero text, so the text stays readable over the busy photo without a
// hard-edged panel. It is a stack of backdrop-blur layers plus a flat dark tint, each masked so it
// fades out over `--fade`. Each layer blurs the layers below it, so the blur builds up where all four
// overlap and drops out one layer at a time toward the edge. `t` and `s` place each layer's fade, as
// fractions of `--fade` measured from the outer end (transparent at `t`, solid from `s`).
// On desktop it is a soft-edged box around the text (BlurBox); on phones and tablets, where the text
// sits at the bottom under the photo, it is a band that fades in from the tag downward (BlurBand).
const blurLayers = [
  { blur: "8px", t: 0.55, s: 1 },
  { blur: "5px", t: 0.3, s: 0.85 },
  { blur: "3px", t: 0.1, s: 0.7 },
  { blur: "2px", t: 0, s: 0.55 },
];

function BlurLayers() {
  return (
    <>
      {blurLayers.map(({ blur, t, s }) => (
        <span key={blur} className="hero-blur-layer" style={{ "--b": blur, "--t": t, "--s": s } as React.CSSProperties} />
      ))}
      <span className="hero-blur-layer hero-blur-tint" style={{ "--t": 0, "--s": 1 } as React.CSSProperties} />
    </>
  );
}

function BlurBand() {
  return (
    <div aria-hidden className="hero-blur">
      <BlurLayers />
    </div>
  );
}

function BlurBox() {
  return (
    <div aria-hidden className="hero-blur-box">
      <BlurLayers />
    </div>
  );
}

export function Hero() {
  return (
    <div>
      {/* clip-path makes the section a backdrop root: the blur layers then only sample the photo and
          the hero's own background, not the white page around the rounded panel (which bleached the
          panel's edges). */}
      <section className="panel relative flex flex-col bg-foreground [--hero-photo:clamp(21rem,56vw,31rem)] [clip-path:inset(0)] lg:min-h-[calc(100svh-2*var(--frame))] lg:justify-center">
        {/* Photo + scrim. Below `lg` the photo gets its own box (--hero-photo tall) at the top of the
            hero, so the crop is not zoomed all the way in on the face (the photo is a wide desk shot and
            the face is a third of its height; filling a tall phone screen scales it up ~2x). The text
            starts at 72% of the box (where the tag is) and the photo fades to the dark hero background
            from there. From `lg` the box fills the whole hero, as before.
            object-position selects the crop window (shifted right, less so on wide screens, since Idan
            sits on the right third of the source photo, which is already mirrored so his face lands on
            the right of the frame, clear of the left-aligned text). */}
        <div className="absolute inset-x-0 top-0 h-[var(--hero-photo)] [mask-image:linear-gradient(to_bottom,#000_72%,rgb(0_0_0/0.6)_82%,rgb(0_0_0/0.25)_92%,transparent)] lg:inset-0 lg:h-auto lg:[mask-image:none]">
          <Image
            src={profile.heroPhoto}
            alt={profile.name}
            fill
            sizes="100vw"
            priority
            className="object-cover object-[88%_center] sm:object-[82%_center] lg:object-[74%_center]"
          />
          {/* A very soft glow: a blurred, brightened copy of the same photo (same crop, a little larger so the
              blur never shows an edge) screened over it at low opacity, like light blooming off the monitors and the
              window. Not a gradient. It sits under the scrim, so the text contrast is set by the scrim as before. */}
          <Image
            src={profile.heroPhoto}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover object-[88%_center] opacity-[0.22] mix-blend-screen blur-[26px] brightness-[1.35] saturate-[1.15] scale-[1.12] sm:object-[82%_center] lg:object-[74%_center]"
          />
          {/* Flat scrim (not a gradient) so white text stays legible over a busy photo. */}
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <BlurBand />

        <FloatingIcon icon={Bug} className="right-10 top-28 hidden sm:flex" rotate={-8} />
        <FloatingIcon icon={CheckCircle2} className="right-24 top-56 hidden sm:flex" delay={1.2} rotate={10} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-[calc(var(--hero-photo)*0.72)] lg:py-0">
          <div className="relative sm:max-w-[26rem]">
            <BlurBox />
            <Reveal>
              <span className="inline-flex -rotate-1 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-wide text-white">
                {profile.role}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-7xl">
                Idan Pnuel
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              {/* The rotating word always takes its own line, so the text block keeps one height
                  however long the current word is. */}
              <p className="mt-3 text-base text-white/75 min-[360px]:text-xl sm:text-3xl">
                also known as your friendly
                <span className="block">
                  <RotatingText words={roles} />
                </span>
                <Squiggle className="mt-1 text-accent" />
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
                <SectionLink
                  href="/#projects"
                  className="shadow-hard rounded-full bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-on-accent sm:px-6 transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  View Projects
                </SectionLink>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              {/* Never wraps: the text shrinks with the width (about 10px at 320, 14px from about 410) so it always fits. */}
              <div className="mt-7 inline-flex max-w-full rotate-1 flex-nowrap items-center gap-x-2 whitespace-nowrap rounded-3xl border border-white/20 bg-black/40 px-3 py-2 text-[length:min(14px,calc((100vw_-_80px)*0.042))] text-white/80 min-[360px]:px-4">
                <span className="whitespace-nowrap">Celebrating</span>
                <span className="whitespace-nowrap font-mono font-semibold text-white">
                  <ExperienceCounter startDate={profile.startDate} />
                </span>
                <span className="whitespace-nowrap">as a QA Engineer</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <HeroStatCards />

      <LogoMarquee />
    </div>
  );
}
