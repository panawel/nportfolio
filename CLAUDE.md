# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev                          # dev server (Turbopack), http://localhost:3000 (preview config: `portfolio-dev` in .claude/launch.json)
./node_modules/.bin/tsc --noEmit     # type-check only
./node_modules/.bin/eslint src --max-warnings=0
npm run build                        # production build; also prerenders every route, so it is the main correctness gate
```

There is no test suite and no single-test command. "Done" means `tsc`, `eslint --max-warnings=0` and `next build` all clean, plus a real look in the browser (viewport matrix 320/375/768/1024/1440/1920 for layout work). `npm run lint` is plain `eslint` without `--max-warnings=0`.

## Architecture

**Content is data, not JSX.** All copy lives in `src/content/profile.ts` and `projects.ts`, typed and rendered by presentational components. Edit the data file, don't hunt for strings in components. The user supplies the copy: don't invent claims, numbers or wording (e.g. project pages are decorated with pictures only, never new text).

**One dynamic route renders every case study** (`src/app/projects/[slug]/page.tsx`, `generateStaticParams` from `projects`). Per-project extras are optional data keys, so other projects render unchanged: `accent` (recolours `--accent` for that page via a `<style>` in the page), `heroVisual`, `overviewVisual`, `overviewPhotos`, `resultsVisual`, `heroInline`, `ScopeSection.art` / `lockBullet` / `wide`, `gallery` (recordings or images) (see `Project` in `projects.ts`); Paybox has a voucher set (blue second colour), Baba Casino a casino set (pink + yellow), Planet a cinema set (orange second colour), Smart CRM a CRM set (gold second colour), BIGI a streaming set (retro TV, purple second colour), Signal a messaging set (two phones + lock, blue second colour), Leumi Goodies a balloons set (cyan second colour), Carrefour a shopping-cart set (dark blue second colour, white text via `accent2Text`); `accent2` sets `--accent-2`, usable as `bg-accent-2` etc. Text/icons on it use `text-on-accent-2` (`--on-accent-2`, default black; `accent2Text` overrides it, BIGI sets white because black on that purple is only 3.2:1), never `text-foreground`. The pictures themselves are `src/components/case-study/*` (`ScopeArt` maps an `art` key to a scene). Shared upgrades (animated `CheckList`, `StatCard` icons, `DeviceRow`, `ToolTiles`, `ScrollProgress`, `SectionDots`) apply to all projects.

**Automation Example** (Baba Casino only: optional `Project.automation`, rendered inside the scope card that sets `ScopeSection.automation`). Closed, the card shows a typing peek of each test (Desktop | Mobile side by side; one peek with both buttons on top below `sm`), each with an "Execute Desktop/Mobile" button. Pressing one runs `standby → launching (2 s spinner/bar) → starting → running → passed (2.5 s) → standby`: the card opens (it is never tilted, unlike the other scope cards; it widens from `xl` via `has-[[data-open=true]]` in `page.tsx`) at one shared stage height (`--stage-h`) for both tests, the browser/phone pops in beside the code, and after PASSED the card closes again. All height changes are eased by `AutoHeight`. `content/automation.ts` holds the two Python + Playwright tests as code strings, a screen recording each (`public/videos/baba/`, originals in git-ignored `assets/originals/`) and `cues` (time → the first code line containing `at`, resolved at build time by `lib/automation-prepare.ts`; a typo fails the build). `AutomationPlayer.tsx` (client) is the state machine; during the run its only clock is `video.currentTime`, so code and video start, stall and end together; the video has no controls and is force-resumed if the browser pauses it. **The code shown uses fictional names unrelated to the real suite: never derive a name from the real code.** The recording's preview box takes its aspect ratio from the file's real size (no black edges). No resolution text is shown.

**Design system** (light theme modeled on payouts.com; exact lime `#DBFF00`, Geist/Geist Mono). Tokens are CSS variables in `src/app/globals.css` under Tailwind v4 `@theme inline` (no `tailwind.config`). Layout vocabulary is defined there too: `panel` (rounded inset section: `--frame` 12px margin, `--panel-radius` 24px, `overflow: clip`), `frame-x` (same side inset for non-panel sections), `shadow-hard(-sm)` (sticker shadow). No colour gradients (a mask fade is fine); the Certificates section is deliberately straight-edged. `design-system/.../MASTER.md` predates this re-theme; don't trust it for colours.

**Motion has three layers; keep them straight:**
- `Reveal` / framer-motion `whileInView` for one-shot entrances; `MotionProvider` sets `reducedMotion="user"`, which only strips transforms. Anything animating opacity, `pathLength`, timers or CSS must check `useReducedMotion()` or be listed in the `prefers-reduced-motion` block at the end of its section in `globals.css`.
- CSS keyframe loops (`ticket-*`, `counter-*`, `cs-*` in `globals.css`). Wrap them in `TicketRow` (despite the name it is the generic wrapper): it sets `data-live` via `useInView` and a CSS rule pauses every animation under `data-live="false"`.
- JS state machines with timers only while in view: `TestRunPanel` (hero test-runner), `LiveCount` in `HeroStatValue.tsx` (simulated "today" counters that tick every 5s, persisted in `sessionStorage` through `useSyncExternalStore`).

**Hero specifics** (`Hero.tsx`, `HeroStatCards.tsx`). The hero `<section>` has `clip-path: inset(0)` on purpose: it makes it a backdrop root, so the `backdrop-filter` blur layers (`BlurBox` on desktop, `BlurBand` below `lg`, CSS in `.hero-blur*`) don't sample the white page around the rounded panel. Below `lg` the photo lives in its own box (`--hero-photo`) so the face isn't zoomed in, and text starts at 72% of it. `heroStats` (real totals, also read by `opengraph-image.tsx`) and `heroCounters` (simulated live numbers shown on the tickets) are different data on purpose. The nav is a fixed pill with scrollspy, transparent over the hero only on `/`.

**Generated metadata:** `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx` render with `next/og`; `sitemap.ts`/`robots.ts` derive from `projects`. `SITE_URL` in `src/lib/site.ts` is a placeholder until the real Vercel URL exists.

**Certificates:** `CertificateCard` per credential + the shared `MediaLightbox` (also used by the case-study gallery; an empty caption hides the caption pill).

## Gotchas

- `cn()` in `src/lib/cn.ts` is a plain class join (no tailwind-merge): conflicting utilities both apply, so pass variants instead of overriding.
- Never use the `animation` shorthand in unlayered CSS on something that also needs `animation-play-state` utilities: it resets it (the marquee uses longhands for this reason).
- Asset names must be lowercase, no spaces (Vercel is case-sensitive, macOS is not). Ad blockers can block URLs containing "trackjs"; that logo is `js-error-monitor.svg`.
- Images live under `public/images/` by purpose. Raw originals go in git-ignored `assets/originals/` (keep a copy before compressing). Every project's media is already optimized under `public/images/projects/<slug>/` (no raw dump is left in `public`). There is no ffmpeg/Homebrew here; GIFs were turned into MP4 with a small Swift/AVFoundation script.
- Browser preview pane: animations, `IntersectionObserver` and rAF only advance when a frame is painted (take a small screenshot first); `Reveal` content stays invisible until painted in view; screenshots taken after scrolling can misplace content.
- Don't scale drawings with CSS `zoom`: older Safari (18.x) ignores it, so the drawings stayed full size and overlapped their labels. Use `src/components/Scaled.tsx` (a `transform: scale()` inside a box of the scaled size; give it the drawing's natural px size). Safari can't be tested here.
- GitHub/LinkedIn icons are hand-rolled in `components/icons/BrandIcons.tsx` (lucide has no brand icons).

## Working agreements

- Design changes: plan first (plan mode + short questions), then build. Small asks: just do them.
- Do not create/push the public GitHub repo, set up Vercel, or commit unless explicitly asked. English only. MIT covers code only, not the case-study content, logos or photos.
- `README.md` was rewritten for the current light design and deployment (Vercel). `design-system/` is old local notes and is git-ignored (not published).
