# QA Engineer Portfolio

The source of my personal portfolio site: an intro, tech stack, certificates and eight real QA case studies (mobile, web, payments, streaming, automation), each with its own page.

Built with Next.js (App Router) and Tailwind CSS. The design is light and hand-crafted: lime `#DBFF00` as the main colour, rounded inset panels, sticker-style shadows and small looping animations that show what each project is about. Every case-study page has its own second colour.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`, no `tailwind.config`)
- **Framer Motion** for entrances, counters and the shared nav highlight (respects `prefers-reduced-motion`)
- **Lucide React** icons, plus a few hand-drawn brand icons
- **Vercel** hosting and Vercel Analytics

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (also prerenders every page)
npx tsc --noEmit   # type-check
npx eslint src --max-warnings=0
```

There is no test suite. A change is "done" when the type-check, the linter and `next build` are all clean, and the page has been checked in a browser at phone, tablet and desktop widths.

## How it is organised

```
src/
  app/                     routes (App Router)
    page.tsx                 the homepage, made of the section components
    projects/[slug]/         one dynamic route renders every case study
    icon.tsx, apple-icon.tsx, opengraph-image.tsx   generated favicon and social image
    sitemap.ts, robots.ts    generated from the project list
  components/              the sections and shared pieces (nav, footer, cards, lightbox...)
    case-study/              the pictures and animations used on the case-study pages
  content/                 all the text and data
    profile.ts               name, about, tech stack, certificates, contact links
    projects.ts              the eight case studies
  lib/                     small helpers (site URL, links, class names, count-up hook)
public/
  images/, videos/         optimised media (logos, project screenshots, certificates, photos)
```

## Editing content

The words live in `src/content/`, not inside components:

- **A project:** edit its entry in `src/content/projects.ts` (the `Project` type at the top of that file lists every option, including the optional pictures, colours and gallery). A new `slug` gets its own `/projects/<slug>` page automatically.
- **Profile, tech stack, certificates, contact:** `src/content/profile.ts`.
- **The site address** used for the sitemap and social previews: `SITE_URL` in `src/lib/site.ts`.

## Deployment

The site is deployed on Vercel: pushing to the `main` branch publishes a new version automatically.

## Licence

The **code** is under the [MIT licence](LICENSE). The **content** (case-study texts, company names and logos, certificates, project screenshots and photos) is personal material and is **not** covered by that licence.
