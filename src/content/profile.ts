export const profile = {
  name: "Idan Pnuel",
  role: "QA Engineer",
  startDate: "2023-09-01",
  heroPhoto: "/images/hero/idan-desk.jpg",
  about: {
    lead: "I specialize in reducing bug life cycles and optimizing workflows with AI tools.",
    /** Phrases inside `lead` that get the lime highlighter band; must match the text exactly. */
    highlights: ["reducing bug life cycles", "AI tools"],
    /** Supporting lines under the lead, in order: learning, then what I do off the clock. */
    details: [
      "Always eager to master new technologies and tackle dynamic challenges.",
      "When I'm not testing, I'm exploring new tech & gaming.",
    ],
  },
  contact: {
    linkedin: "https://www.linkedin.com/in/idanpnuel",
    email: "panawel@gmail.com",
    // The URL given was the old GitHub Pages site (panawel.github.io/Portfolio);
    // that Pages URL is served from github.com/panawel, so linking the profile itself.
    github: "https://github.com/panawel",
  },
};

export type StackItem = {
  label: string;
  icon?: string;
  /** For logos drawn in pure white: renders them black so they stay visible on a white tile. */
  invert?: boolean;
  /** For logos whose artwork sits small inside its own canvas: scales the icon up inside its tile.
   *  Picked from measured artwork size (1 = artwork fills the icon box). */
  zoom?: number;
};

export const techStack: { category: string; items: StackItem[] }[] = [
  {
    category: "Test Docs & Bug Tracking",
    items: [
      { label: "STP", icon: "/images/stack/stp.svg" },
      { label: "STD", icon: "/images/stack/std.svg" },
      { label: "STR", icon: "/images/stack/str.svg" },
      { label: "Jira", icon: "/images/stack/jira.svg" },
      { label: "Notion", icon: "/images/stack/notion.svg" },
      { label: "Asana", icon: "/images/stack/asana.svg" },
    ],
  },
  {
    category: "Automation Tools",
    items: [
      // Wide 4:3 artwork, so it reads small next to the square logos.
      { label: "Playwright", icon: "/images/stack/playwright.svg", zoom: 1.25 },
      // Artwork fills only ~61% of its canvas.
      { label: "Pytest", icon: "/images/stack/pytest.svg", zoom: 1.6 },
      { label: "Appium", icon: "/images/stack/appium.svg" },
      { label: "Maestro", icon: "/images/stack/maestro.svg", invert: true },
    ],
  },
  {
    category: "Programming",
    items: [
      { label: "Python", icon: "/images/stack/python.svg" },
      { label: "JavaScript", icon: "/images/stack/javascript.svg" },
      { label: "HTML", icon: "/images/stack/html.svg" },
      { label: "CSS", icon: "/images/stack/css3.svg" },
      { label: "Git", icon: "/images/stack/git.svg" },
      { label: "Sourcetree", icon: "/images/stack/sourcetree.svg" },
    ],
  },
  {
    category: "Backend Observability",
    items: [
      { label: "Postman", icon: "/images/stack/postman.svg" },
      { label: "MongoDB", icon: "/images/stack/mongodb.svg" },
      { label: "Redis", icon: "/images/stack/redis.svg" },
      // Artwork fills only ~73% of its canvas.
      { label: "SSMS", icon: "/images/stack/sql.svg", zoom: 1.3 },
      { label: "Kibana", icon: "/images/stack/kibana.svg" },
      { label: "TrackJS", icon: "/images/stack/js-error-monitor.svg" },
      { label: "Snowflake", icon: "/images/stack/snowflake.svg" },
    ],
  },
];

/** Shown as floating stickers in the About section (not in the Tech Stack grid). */
export const aiTools: StackItem[] = [
  { label: "Gemini", icon: "/images/stack/gemini.svg" },
  { label: "Antigravity", icon: "/images/stack/antigravity.webp" },
  { label: "ChatGPT", icon: "/images/stack/chatgpt.svg" },
  { label: "Codex", icon: "/images/stack/codex.svg" },
  { label: "Claude", icon: "/images/stack/claude.svg" },
  { label: "NotebookLM", icon: "/images/stack/notebooklm.svg" },
];

export const heroStats = [
  { label: "Tests Executed", value: "2,100+", tone: "accent" as const },
  { label: "Defects Caught", value: "280+", tone: "destructive" as const },
  { label: "Projects Shipped", value: "8", tone: "accent" as const },
];

/** The two hero tickets' "today" counters, in card order. Decorative, not measured: each starts at
 *  `start` and goes up by one every `HERO_TICK_MS` while the visitor is looking at it. `heroStats`
 *  above stays the real cumulative totals (the social-preview image reads those). */
export const heroCounters = [
  { label: "Tests Executed Today", start: 2125 },
  { label: "Defects Caught Today", start: 44 },
];

export const HERO_TICK_MS = 5000;

/** A piece of the hero statement card's sentence (payouts-style): plain text, dimmed connector words,
 *  or the small inline orb. Parts are joined with single spaces. */
export type StatementPart = { text: string; muted?: boolean } | { orb: true };

export const heroStatement: StatementPart[] = [
  { text: "Regression" },
  { orb: true },
  { text: "that", muted: true },
  { text: "runs, reports" },
  { text: "&", muted: true },
  { text: "repeats itself." },
];

/** One line of the statement card's test-runner readout and how it resolves. */
export type TestRunLine = { name: string; result: "pass" | "fail" };

/** The readout's lines, resolved in order. Keep names short (about 20 characters) so each fits the
 *  strip on one line. */
export const heroTestRun: TestRunLine[] = [
  { name: "UX/UI Tests", result: "pass" },
  { name: "Payment Tests", result: "fail" },
  { name: "API Tests", result: "pass" },
];

export type CertificateMedia = {
  src: string;
  caption: string;
  /** Pixel size of the file. Set on the certificate documents so they are shown at their true
   *  aspect ratio (uncropped); the photos are cropped into square tiles and don't need it. */
  width?: number;
  height?: number;
  /** For the video: a still frame shown as its thumbnail (so nothing has to be downloaded or decoded
   *  until it is played). */
  poster?: string;
};

export type Certificate = {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  featured: boolean;
  /** First entry is always the certificate document itself — given distinct visual treatment. */
  document: CertificateMedia;
  gallery: CertificateMedia[];
  video: CertificateMedia | null;
};

export const certificates: Certificate[] = [
  {
    slug: "hackeru",
    title: "QA Engineer Certification",
    issuer: "HackerU College",
    date: "July 2023",
    description:
      "A 355-academic-hour QA program covering manual testing fundamentals through automation — completed July 2023.",
    featured: true,
    document: {
      src: "/images/certificates/hackeru/hackeru-1.jpg",
      width: 1890,
      height: 2805,
      caption: "Certificate of Achievement — QA, 355 academic hours",
    },
    gallery: [
      { src: "/images/certificates/hackeru/hackeru-2.jpg", caption: "Graduating cohort" },
      { src: "/images/certificates/hackeru/hackeru-3.jpg", caption: "Receiving the certificate" },
      { src: "/images/certificates/hackeru/hackeru-4.jpg", caption: "With a classmate at HackerU" },
      { src: "/images/certificates/hackeru/hackeru-5.jpg", caption: "Presenting the final QA project" },
    ],
    video: {
      src: "/videos/hackeru-presenting.mp4",
      poster: "/images/certificates/hackeru/hackeru-video-poster.jpg",
      caption: "Presenting the final QA project to the class",
    },
  },
  {
    slug: "channel-13",
    title: "Certificate of Excellence",
    issuer: "Channel 13 — News",
    date: "2023",
    description:
      "Recognized as an outstanding video editor for dedication, creativity, and reliability — a role unrelated to QA, but the same work ethic carries over.",
    featured: false,
    document: {
      src: "/images/certificates/channel13/channel13-1.jpg",
      width: 3000,
      height: 4000,
      caption: "Certificate of Excellence — for outstanding work as a video editor",
    },
    gallery: [
      { src: "/images/certificates/channel13/channel13-2.jpg", caption: "On-air tribute during the appreciation ceremony" },
      { src: "/images/certificates/channel13/channel13-3.jpg", caption: "Group photo with fellow honorees" },
      { src: "/images/certificates/channel13/channel13-4.jpg", caption: "Receiving the award on the studio floor" },
      { src: "/images/certificates/channel13/channel13-5.jpg", caption: "With the team at the award ceremony" },
    ],
    video: null,
  },
];
