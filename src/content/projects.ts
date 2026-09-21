import { paymentFlowExamples, type AutomationExample } from "./automation";

export type Stat = {
  value: string;
  label: string;
  /** Shown on the project's card in the homepage grid (up to three; otherwise the first three). */
  highlight?: boolean;
};

/** The stats a project card shows: highlighted ones first (max 3), else the first three. */
export function cardStats(stats: Stat[]): Stat[] {
  const highlighted = stats.filter((s) => s.highlight);
  return (highlighted.length > 0 ? highlighted : stats).slice(0, 3);
}

/** Which little animated scene a scope card shows in its header strip (see ScopeArt). Pictures only. */
export type ScopeArtKey =
  | "carousel"
  | "wallet"
  | "screens"
  | "api-flow"
  | "voucher-grid"
  | "database"
  | "sync"
  | "purchase-flow"
  | "explore"
  | "gateways"
  | "leaderboard"
  | "event-stream"
  | "toggles"
  | "shield-stars"
  | "team"
  | "seat-map"
  | "accessibility"
  | "compat"
  | "load"
  | "language"
  | "round-1"
  | "round-2"
  | "e2e-flow"
  | "integration"
  | "gateway-plans"
  | "locales"
  | "backup-restore"
  | "security"
  | "signup"
  | "playback"
  | "profiles"
  | "components"
  | "bridge"
  | "encrypted-chat"
  | "explode"
  | "ui-resize"
  | "lifecycle"
  | "regress-loop"
  | "automation"
  | "goodies-flow"
  | "regress-areas"
  | "approach";

export type ScopeSection = {
  heading: string;
  bullets: string[];
  /** Optional picture for the card's header strip. */
  art?: ScopeArtKey;
  /** Optional index into `bullets`: that line gets a small lock icon that shakes and shuts. */
  lockBullet?: number;
  /** Span both columns of the scope grid (a highlighted card). */
  wide?: boolean;
  /** Show the project's `automation` example as an expandable drawer inside this card. */
  automation?: boolean;
};

/** A gallery item: a muted looping screen recording (an MP4 made from a GIF, with a still as `poster`)
 *  or, with `kind: "image"`, a picture. */
export type GalleryMedia = {
  src: string;
  poster?: string;
  width: number;
  height: number;
  kind?: "image" | "video";
  /** How an image fills its tile (default: cover). Use "contain" (with `tone: "light"`) for screenshots that must not be cropped. */
  fit?: "cover" | "contain";
  tone?: "light";
  /** CSS object-position for a cropped image (default: centred), e.g. to keep a logo in the corner in frame. */
  position?: string;
};

/** A small decorative photo shown beside the overview text (static: not clickable, no viewer). */
export type StickerPhoto = { src: string; width: number; height: number };

export type Testimonial = {
  quote: string;
  author: string;
};

export type DocumentSlot = {
  label: string;
  kind: "doc" | "bug-tracker" | "report" | "repo" | "video";
  /** When set, the card is a real link (opens in a new tab); without it it stays a dashed "coming soon" slot. */
  href?: string;
};

export type Project = {
  slug: string;
  name: string;
  logo: string | null;
  /** Width / height of the logo image (it is trimmed to its visible part), when it is not square: the homepage
   *  cards give a wide logo a wider box so it is not shown tiny. */
  logoAspect?: number;
  tagline: string;
  tags: string[];
  featured: boolean;
  context: string;
  overview: string;
  servicesOffered: string[];
  scopeSections: ScopeSection[];
  deviceScope: string[];
  tools: string[];
  stats: Stat[];
  documents: DocumentSlot[];
  galleryCount: number;
  /** Real recordings that fill the first gallery slots (the rest of `galleryCount` stay placeholders). */
  gallery?: GalleryMedia[];
  /** Optional story pictures for this project's page (pictures only; they add no text). */
  /** Show the hero picture small: beside the title on phones (and a smaller column from `lg`). Popcorn and retro TV only. */
  heroInline?: boolean;
  heroVisual?: "voucher-phone" | "slot-machine" | "popcorn" | "crm-phone" | "retro-tv" | "phones-lock" | "balloon-phone" | "shopping-cart";
  overviewVisual?: "streaming-flow";
  /** A code pane that "runs" in step with a screen recording (the Automation Example section). */
  automation?: AutomationExample[];
  /** Small static photos placed beside the overview text. */
  overviewPhotos?: StickerPhoto[];
  /** Replaces the site's lime accent (--accent) on this project's page only, e.g. a brand colour. Text on it
   *  stays black, so pick a colour that black is readable on. */
  accent?: string;
  /** An optional second brand colour for the same page (--accent-2), for secondary touches. */
  accent2?: string;
  /** Text and icon colour on `accent2` (default black; use white when the second colour is dark). */
  accent2Text?: string;
  /** Coins that fall once when the Results section scrolls into view. */
  resultsVisual?: "coin-shower" | "ticket-shower" | "star-shower" | "play-shower" | "bubble-shower";
  results: string[];
  testimonial?: Testimonial;
};

export const projects: Project[] = [
  {
    slug: "paybox",
    name: "Paybox",
    logo: "/images/logos/paybox.png",
    tagline:
      "Comprehensive QA support for Paybox — a leading mobile payment app with 3.2 billion ILS transferred in 2021.",
    tags: ["FinTech", "Mobile App", "QA Engineering", "API Testing"],
    featured: true,
    context:
      "Developed and executed test plans for the \"Voucher Carousel\" component. Using Postman, I ran API tests that prevented critical bugs which could have caused financial losses for over 1.5 million users.",
    overview:
      "The voucher carousel is the part of the app that lets users earn points with every purchase and convert them into money, send vouchers as gifts to friends who also use the app, and pay with accumulated vouchers at selected supermarkets, stores, and brands.",
    servicesOffered: ["API", "CRUD", "Exploratory", "E2E", "UI", "Integration"],
    scopeSections: [
      {
        heading: "\"Voucher Carousel\" section",
        art: "carousel",
        bullets: [
          "Adding a new voucher",
          "Splitting vouchers (> 1,500 ILS)",
          "Activating a voucher",
          "Locked voucher behavior",
          "Deleting a voucher",
          "Redemption & refund processes",
          "Voucher details",
          "Sending / canceling to a friend",
          "Action history",
          "List of accepting networks",
        ],
      },
      {
        heading: "Vouchers section (main)",
        art: "wallet",
        bullets: ["Total amount of all vouchers", "Action history"],
      },
      {
        heading: "Secondary screens",
        art: "screens",
        bullets: ["\"Terms of use\" approval screen", "Updating the network database"],
      },
      {
        heading: "API testing",
        art: "api-flow",
        bullets: [
          "In production, actions like redeeming a voucher, refunding, or canceling a send are API calls triggered at the store checkout counter",
          "Used the SDK version of the app with Postman to simulate these calls and replicate real-world scenarios",
          "Verified voucher redemption correctly updates the system and processes payment",
          "Tested refund and cancel-to-friend flows to confirm changes were reverted accurately",
        ],
      },
      {
        heading: "UI testing",
        art: "voucher-grid",
        bullets: [
          "Covered every scenario and screen where vouchers are displayed",
          "Verified correct rendering of all 22 voucher types with no distortion or overlapping elements",
        ],
      },
      {
        heading: "CRUD & database integration",
        art: "database",
        bullets: [
          "Traced customer-reported issues through the production database during the app's maintenance phase",
          "Integrated across several databases to identify and confirm the root cause of failures before handing off to developers",
        ],
      },
      {
        heading: "Integration testing",
        art: "sync",
        bullets: [
          "Verified every user operation (purchases, transactions) was accurately and consistently reflected in the database",
          "Confirmed data was correctly written, updated, and retrieved without discrepancies",
        ],
      },
      {
        heading: "End-to-end & boundary value analysis",
        art: "purchase-flow",
        lockBullet: 1,
        bullets: [
          "Confirmed vouchers split correctly once amounts exceeded the 1,500 ILS boundary — e.g. 3,000 ILS → two 1,500 ILS vouchers; 3,100 ILS → two 1,500 ILS vouchers + one 100 ILS voucher",
          "Tested the voucher activation code: three incorrect attempts correctly blocks the voucher",
        ],
      },
      {
        heading: "Exploratory testing",
        art: "explore",
        bullets: [
          "Interacted with the app in creative, unconventional ways to surface issues formal test cases wouldn't catch",
        ],
      },
    ],
    deviceScope: ["Pixel 5", "Pixel 6 Pro", "iPhone 13"],
    tools: ["JIRA + AIO Test", "Postman", "Paybox SDK"],
    stats: [
      { value: "2", label: "QA Engineers" },
      { value: "4", label: "Test Environments", highlight: true },
      { value: "100+", label: "Defects Detected", highlight: true },
      { value: "800+", label: "Total Tests", highlight: true },
      { value: "24/7", label: "Support Availability" },
    ],
    documents: [
      { label: "API test collection (Postman)", kind: "doc" },
      { label: "Bug reports (Jira)", kind: "bug-tracker" },
    ],
    galleryCount: 3,
    gallery: [
      { src: "/images/projects/paybox/phone-screen.mp4", poster: "/images/projects/paybox/phone-screen-poster.jpg", width: 236, height: 512 },
      { src: "/images/projects/paybox/voucher-card.mp4", poster: "/images/projects/paybox/voucher-card-poster.jpg", width: 318, height: 188 },
      { src: "/images/projects/paybox/in-hand.mp4", poster: "/images/projects/paybox/in-hand-poster.jpg", width: 640, height: 316 },
    ],
    accent2: "#4BA4DD", // the blue of the Paybox logo; the lime accent stays
    heroVisual: "voucher-phone",
    results: [
      "Enhanced \"Voucher Carousel\" quality and delivered a detailed testing report with all findings to the client.",
      "Provided support and quick response during the app's maintenance phase — addressing every request until a complete fix was found.",
    ],
  },
  {
    slug: "baba-casino",
    name: "Baba Casino",
    logo: "/images/logos/baba-casino.webp",
    tagline:
      "Premier social sweepstakes platform for the US market, with a dual-currency system and a cross-platform gaming experience.",
    tags: ["Desktop", "Mobile", "Python", "Playwright", "MongoDB", "Kibana"],
    featured: true,
    context:
      "Currently working here. Managing end-to-end QA for a high-traffic gaming ecosystem, ensuring seamless integration between frontend features and complex backend services.",
    overview:
      "Baba Casino is a premier social sweepstakes platform tailored for the US market. The application features a dual-currency system (Gold Coins and Sweeps Coins) and provides a legally compliant, cross-platform gaming experience across Web, Mobile Web (WebView), and Native environments.",
    servicesOffered: ["Functional", "Compliance", "LiveOps", "Data Validation", "Automation"],
    scopeSections: [
      {
        heading: "Payment & compliance",
        art: "gateways",
        bullets: [
          "Validated 3rd-party payment gateways (Nuvei, GIDX, Skrill) and KYC flows",
          "Executed 3DS verification tests",
          "Ensured secure transaction handling compliant with US regulations",
        ],
      },
      {
        heading: "LiveOps & engagement",
        art: "leaderboard",
        bullets: [
          "Verified real-time features including leaderboards, tournaments, and mini-games",
          "Tested promotional systems (coupons, daily rewards)",
          "Validated dynamic pop-up system logic",
        ],
      },
      {
        heading: "Data & analytics",
        art: "event-stream",
        bullets: [
          "Performed deep-dive validation of event logging using Snowflake (SQL)",
          "Monitored server health and logs via Kibana",
          "Ensured data integrity across all environments",
        ],
      },
      {
        heading: "Infrastructure",
        art: "toggles",
        bullets: [
          "Validated database persistence (MongoDB, Redis)",
          "Managed feature configurations via admin environments using JSON/CSV",
          "Coordinated release deployments",
        ],
      },
      {
        heading: "The \"plus\" side: self-taught automation",
        art: "shield-stars",
        wide: true,
        automation: true,
        bullets: [
          "Developed a custom automated smoke and regression suite using Python and Playwright with the Pytest framework",
          "Leveraged AI tools (Gemini, Antigravity) to build small Python utilities that speed up daily manual workflows",
          "Reduced manual time for release-day sanity checks and enabled faster verification of core gameplay flows",
        ],
      },
    ],
    deviceScope: [
      "iOS (iPhone XS through 11+)",
      "Android (Samsung tablets/handsets)",
      "Native wrapper & WebView",
      "Windows & macOS — Chrome, Safari, Firefox",
    ],
    tools: ["Python", "Playwright", "Pytest", "MongoDB", "Redis", "Kibana", "Snowflake"],
    stats: [
      { value: "8", label: "Payment Gateways" },
      { value: "50+", label: "Automated Regression Tests" },
      { value: "24/7", label: "LiveOps Coverage" },
    ],
    documents: [
      { label: "Bug reports (Jira)", kind: "bug-tracker" },
    ],
    galleryCount: 3,
    gallery: [{ src: "/images/projects/baba-casino/slot-phone.webp", width: 812, height: 750, kind: "image" }],
    accent: "#F246EE", // the pink of the Baba Casino logo
    accent2: "#FCED22", // and its yellow
    heroVisual: "slot-machine",
    automation: paymentFlowExamples,
    resultsVisual: "coin-shower",
    results: [
      "Reduced manual release-day sanity-check time by self-building a Python + Playwright regression suite.",
      "Ensured compliant, seamless payment and KYC flows across three third-party gateways.",
    ],
  },
  {
    slug: "signal",
    name: "Signal",
    logo: "/images/logos/signal.png",
    tagline: "Increasing the number of tests by 50% within a given timeframe using self-taught mobile automation.",
    tags: ["Python", "Appium", "Maestro", "Mobile Automation", "Privacy"],
    featured: false,
    context:
      "In my first year as a QA engineer, I self-learned the AI-assisted automation tool Maestro and combined it with Appium to automate mobile testing for an internal build of the Signal app — increasing the number of tests completed in the same timeframe alongside manual testing.",
    overview:
      "Signal is a messaging app focused on privacy. It's free, easy to use, open-source, and features strong end-to-end encryption to keep communications completely private. I tested an internal build with unique integration features before it rolled out to customers worldwide.",
    servicesOffered: [
      "Mobile Automation",
      "E2E",
      "Exploratory",
      "Installation",
      "Component",
      "UI",
      "Regression",
      "Integration",
    ],
    scopeSections: [
      {
        heading: "Integration features",
        art: "bridge",
        bullets: [
          "Focused on new integration between Signal and internal classified products",
          "Tested unique features unavailable in the Play Store version",
          "Ensured no functionality loss during integration",
        ],
      },
      {
        heading: "End-to-end tests",
        art: "encrypted-chat",
        bullets: [
          "User registration, OTP verification, messaging",
          "Audio/video calls, groups, media sharing",
          "Verified app scalability in split-screen and landscape modes",
        ],
      },
      {
        heading: "Component testing",
        art: "explode",
        bullets: [
          "Screen-by-screen element breakdown",
          "Detailed Jira reports with reproduction steps & media",
          "Verified functional behavior of individual UI components",
        ],
      },
      {
        heading: "UI testing",
        art: "ui-resize",
        bullets: [
          "Buttons, text fields, and layout correctness",
          "Validated display across different languages (i18n)",
          "Ensured responsiveness across diverse devices",
        ],
      },
      {
        heading: "Installation testing",
        art: "lifecycle",
        bullets: [
          "Install, update, and uninstall lifecycle",
          "Verified stability across different OS versions and device types",
        ],
      },
      {
        heading: "Regression & exploratory",
        art: "regress-loop",
        bullets: [
          "600+ regression test cases run per new version/fix",
          "Creative exploratory usage to uncover edge-case defects",
          "Ensured new features didn't break existing core functions",
        ],
      },
      {
        heading: "Automation",
        art: "automation",
        wide: true,
        bullets: [
          "Automated repetitive test cases with Maestro + Appium — message sending/receiving, calls, groups, registration",
          "Wrote Python scripts to simulate end-user scenarios and confirm updates didn't break functionality",
          "Shortened regression testing periods, letting new builds be checked faster",
          "Automated Android testing with direct Jira failure reporting",
        ],
      },
    ],
    deviceScope: ["Pixel 5", "Pixel 6 Pro", "Samsung Galaxy S22 Ultra"],
    tools: ["JIRA + AIO Test", "Appium", "Python + PyCharm", "Maestro"],
    stats: [
      { value: "5", label: "Months Running" },
      { value: "10+", label: "Builds" },
      { value: "100+", label: "Defects Detected" },
      { value: "600+", label: "Total Tests" },
    ],
    documents: [{ label: "Automation files", kind: "repo", href: "https://github.com/panawel/SignalAutomation" }],
    galleryCount: 2,
    gallery: [
      { src: "/images/projects/signal/phone-on-desk.mp4", poster: "/images/projects/signal/phone-on-desk-poster.jpg", width: 480, height: 640 },
      { src: "/images/projects/signal/code-run.mp4", poster: "/images/projects/signal/code-run-poster.jpg", width: 480, height: 640 },
    ],
    accent2: "#3976EF", // Signal's blue; the lime accent stays (black text on it is 5.0:1)
    heroVisual: "phones-lock",
    overviewPhotos: [{ src: "/images/projects/signal/phone-handheld.jpg", width: 800, height: 533 }],
    resultsVisual: "bubble-shower",
    results: [
      "Automation tests caught critical bugs before builds were released to customer devices.",
      "Detailed documentation of 100+ bugs helped the team fix issues quickly, improving the app's reliability.",
    ],
  },
  {
    slug: "smart-crm",
    name: "Smart CRM",
    logo: "/images/logos/smart-crm.png",
    logoAspect: 0.88,
    tagline: "Boosting quality for a Customer Relationship Management mobile app ahead of a Play Store release.",
    tags: ["Data Integrity", "Workflow Testing", "Automation", "B2B Application"],
    featured: false,
    context:
      "Provided testing support and design QA to help the startup identify and fix critical bugs before releasing a new version to the Play Store.",
    overview:
      "The Smart CRM company and its development team provided a pre-release APK for testing, aiming to ship new features with fewer defects, avoid expensive post-release fixes, and protect the end-user experience.",
    servicesOffered: ["E2E", "Exploratory", "Interruption", "CRUD", "Security", "Backup & Restore", "Integration"],
    scopeSections: [
      {
        heading: "Round 1 — functional testing",
        art: "round-1",
        bullets: ["Localization", "GUI", "Compatibility", "End-to-end", "Usability", "Exploratory", "CRUD"],
      },
      {
        heading: "Round 2 — non-functional testing",
        art: "round-2",
        bullets: [
          "Integration",
          "Authorization",
          "Network",
          "I18N",
          "Interruption",
          "Installation",
          "Backup & restore",
          "Security",
        ],
      },
      {
        heading: "End-to-end",
        art: "e2e-flow",
        bullets: [
          "Adding/editing leads",
          "Sending WhatsApp messages without saving the contact",
          "Purchasing subscriptions and checking plan limitations",
          "Challenging system behavior at its boundaries",
        ],
      },
      {
        heading: "Integration",
        art: "integration",
        bullets: [
          "Browser integration",
          "External WhatsApp template messaging",
          "Verified correct data flow between the system and third parties",
        ],
      },
      {
        heading: "Gateway & payments",
        art: "gateway-plans",
        bullets: [
          "Premium plan calculations, discounts, and promotions",
          "Aligned purchase flow with Play Store billing",
        ],
      },
      {
        heading: "I18N (global)",
        art: "locales",
        bullets: [
          "Filter and subscription screen adaptation",
          "Floating widget layout across locales",
          "Validated menus & contacts across languages",
        ],
      },
      {
        heading: "Backup & restore",
        art: "backup-restore",
        bullets: [
          "Verified cloud data transmission integrity",
          "Confirmed recovery after crash or device switch",
          "Tested across accounts and devices to mitigate data loss",
        ],
      },
      {
        heading: "Security",
        art: "security",
        bullets: [
          "Tested resilience against unauthorized access",
          "Checked for data leak prevention",
          "Verified encryption on secure backup & transfer",
        ],
      },
    ],
    deviceScope: ["OnePlus Nord CE 2", "Samsung Galaxy S22 Ultra", "Redmi Note 7", "Samsung DEX"],
    tools: ["JIRA + Xray", "MEmu Play", "Fiddler"],
    stats: [
      { value: "2", label: "Weeks Duration" },
      { value: "2", label: "QA Engineers" },
      { value: "4", label: "Test Environments" },
      { value: "48", label: "Defects Detected" },
      { value: "6", label: "Critical Defects" },
      { value: "620+", label: "Total Tests" },
    ],
    documents: [
      {
        label: "STP document",
        kind: "doc",
        href: "https://docs.google.com/document/d/1FdG3eTan7XD_xlk-hrDJ2ctbsWfQw39pTwLuF4bzE_w/edit?usp=sharing",
      },
      {
        label: "STR document",
        kind: "report",
        href: "https://docs.google.com/presentation/d/1ppRLioak4nNha0YNADaPnTD9OCKdHuFW/edit?usp=sharing&ouid=118407128876216779267&rtpof=true&sd=true",
      },
    ],
    galleryCount: 1,
    gallery: [{ src: "/images/projects/smart-crm/premium-plans.jpg", width: 1296, height: 972, kind: "image", fit: "cover" }],
    accent2: "#CC9C1C", // the gold of the Smart CRM app; the lime accent stays
    heroVisual: "crm-phone",
    resultsVisual: "star-shower",
    results: [
      "QA testing successfully identified critical bugs before the Play Store release.",
      "Significantly enhanced overall app quality and user experience, aligning with business objectives.",
    ],
    testimonial: {
      quote:
        "Wow! I skimmed through your STD document in Jira to see your bug reports — you did an amazing job! It looks really impressive, detailed, and understandable! Well done! I will definitely go through all the bugs systematically and make sure to fix them before the next release. Truly, hats off to you!",
      author: "CEO, Smart CRM",
    },
  },
  {
    slug: "planet",
    name: "Planet",
    logo: "/images/logos/planet.png",
    logoAspect: 4,
    tagline: "Premier cinema chain's online ticketing platform — seating, purchasing, and accessibility.",
    tags: ["Ticketing Services", "Web Application", "Accessibility"],
    featured: false,
    context:
      "As part of a QA course, our team was asked to perform professional tests ensuring bug-free operation of an online ticket-purchasing application.",
    overview:
      "PLANET offers a world-class cinema experience — giant screens, advanced sound systems, luxurious seating, and one of the most advanced ticketing services available, with maximum accessibility for disabled persons. The web application runs on HTML5 across devices and browsers, with a seating-management system letting customers choose and pay for their seats in advance.",
    servicesOffered: ["Functional", "Compatibility", "Load", "I18N", "Accessibility"],
    scopeSections: [
      {
        heading: "Team structure",
        art: "team",
        bullets: ["A team of 3 QA engineers and 1 manager responsible for the product's quality level"],
      },
      {
        heading: "Functional testing",
        art: "seat-map",
        bullets: [
          "Scope: GUI, E2E, accessibility",
          "Verified the annual ticket-purchasing flow end-to-end (positive & negative)",
          "Found a critical defect in Venue 13 — a seating plan mismatch vs. reality, with potential revenue impact",
        ],
      },
      {
        heading: "Accessibility",
        art: "accessibility",
        bullets: [
          "Used an accessibility toolbar to test all options for compliance with Israeli Internet Association standards",
        ],
      },
      {
        heading: "Compatibility testing",
        art: "compat",
        bullets: ["Executed E2E flows across devices/browsers to detect cross-platform defects"],
      },
      {
        heading: "Load testing",
        art: "load",
        bullets: [
          "Used JMeter to simulate concurrent users and find capacity peaks",
          "Benchmarked performance against competitor cinema websites",
        ],
      },
      {
        heading: "I18N testing",
        art: "language",
        bullets: [
          "Languages: Hebrew & English",
          "Found a medium-priority defect where the interface language reverted from EN to HE automatically when navigating pages",
        ],
      },
    ],
    deviceScope: [
      "Microsoft Surface Book (Win 10 Pro)",
      "Lenovo Yoga (Win 11)",
      "Galaxy S22 Ultra (Android 13)",
      "iPhone 12 (iOS 16)",
      "Chrome, Firefox, Opera",
    ],
    tools: ["JIRA + Xray", "JMeter"],
    stats: [
      { value: "3", label: "QA Engineers" },
      { value: "2", label: "Months Duration" },
      { value: "112", label: "Tests in Total" },
      { value: "10", label: "Defects Detected" },
    ],
    documents: [
      {
        label: "STP document",
        kind: "doc",
        href: "https://docs.google.com/document/d/1vlIZK8mEth4kbjR6vOErbhC0TMLPTBq5/edit?usp=sharing&ouid=118407128876216779267&rtpof=true&sd=true",
      },
      { label: "STD (Jira)", kind: "bug-tracker", href: "https://panawel.atlassian.net/issues/?filter=10002" },
      {
        label: "STR document",
        kind: "report",
        href: "https://docs.google.com/presentation/d/1UwXk9olrP9YOevqtbAeRtbp-MaAmy_gExiznoLx2yGw/edit?usp=sharing",
      },
    ],
    galleryCount: 2,
    gallery: [
      { src: "/images/projects/planet/website-home.jpg", width: 1600, height: 804, kind: "image", fit: "cover" },
      { src: "/images/projects/planet/seating-plan-bug.jpg", width: 1080, height: 812, kind: "image", fit: "contain", tone: "light" },
      { src: "/images/projects/planet/hall-purple.jpg", width: 1200, height: 800, kind: "image", fit: "cover" },
      { src: "/images/projects/planet/hall-red.jpg", width: 960, height: 502, kind: "image", fit: "cover", position: "0% center" },
    ],
    accent2: "#F48422", // Planet's orange; the lime accent stays
    heroVisual: "popcorn",
    heroInline: true,
    overviewPhotos: [
      { src: "/images/projects/planet/hall-vip.jpg", width: 310, height: 207 },
      { src: "/images/projects/planet/lobby-rishon.jpg", width: 310, height: 207 },
    ],
    resultsVisual: "ticket-shower",
    results: ["Enhanced ticketing-service quality and delivered a detailed usability testing report with all findings."],
  },
  {
    slug: "bigi",
    name: "BIGi",
    logo: "/images/logos/bigi.png",
    tagline: "A VOD and live-streaming content app for kids and teenagers, tested via uTest.",
    tags: ["Mobile App", "VOD/Streaming", "Functional", "Compatibility", "Load Testing"],
    featured: false,
    context:
      "As a QA tester on uTest's platform, I was invited to perform professional tests ensuring a bug-free experience for users watching VOD and live-stream content within the app.",
    overview:
      "BIGi is a content app designed for kids and teenagers, offering television programs, series, and movies — including exclusive content from social media influencers and thousands of hours of content from Israel and abroad. Users can enjoy the children's channel, the LOGI channel, and a massive VOD library on any device, at any time.",
    servicesOffered: ["Functional", "Compatibility", "Load", "I18N"],
    scopeSections: [
      {
        heading: "Registration & login",
        art: "signup",
        bullets: [
          "Registration process and choosing a free plan",
          "Login with existing and free accounts",
          "Forgot password → reset → create new password → log in",
        ],
      },
      {
        heading: "Playback",
        art: "playback",
        bullets: ["Play live channel", "Play free VOD asset", "Play paid VOD asset"],
      },
      {
        heading: "Miscellaneous",
        art: "profiles",
        bullets: ["Add new profile", "Delete a profile", "Change platform language"],
      },
      {
        heading: "Components in scope",
        art: "components",
        bullets: [
          "Categories, contact & support, countdown feature, design, live shows, main page, menu, player functionality, search, series, settings, social media links, splash screen",
        ],
      },
    ],
    deviceScope: ["Android — Galaxy S22 Ultra, 5G, Android 13, One UI 5.1"],
    tools: [],
    stats: [
      { value: "2", label: "Hours Duration" },
      { value: "9", label: "Functional Defects" },
      { value: "11", label: "Exploratory Defects" },
      { value: "40", label: "Tests Total" },
    ],
    documents: [],
    galleryCount: 3,
    gallery: [
      { src: "/images/projects/bigi/plan.jpg", width: 720, height: 1544, kind: "image", fit: "cover" },
      { src: "/images/projects/bigi/signup.jpg", width: 720, height: 1544, kind: "image", fit: "cover" },
      { src: "/images/projects/bigi/details.jpg", width: 720, height: 1544, kind: "image", fit: "cover" },
      { src: "/images/projects/bigi/details-filled.jpg", width: 720, height: 1544, kind: "image", fit: "cover" },
    ],
    accent2: "#6926F5", // BIGI's purple; the lime accent stays
    accent2Text: "#ffffff", // black on this purple is too weak (3.2:1), white is 6.6:1
    heroVisual: "retro-tv",
    heroInline: true,
    overviewVisual: "streaming-flow",
    overviewPhotos: [{ src: "/images/projects/bigi/banner.jpg", width: 512, height: 250 }],
    resultsVisual: "play-shower",
    results: [
      "20 bugs were found, including 9 high-priority issues that could lead to financial loss.",
      "Clear reproduction steps were provided to speed up resolution.",
      "Good communication with the development team helped ensure high quality and user satisfaction.",
    ],
  },
  {
    slug: "carrefour",
    name: "Carrefour",
    logo: "/images/logos/carrefour.png",
    logoAspect: 1.25,
    tagline: "A functional regression cycle for the new Carrefour e-commerce website.",
    tags: ["E-commerce", "Functional", "Regression"],
    featured: false,
    context:
      "Invited to participate in a functional testing cycle for the new Carrefour website, focused on a convenient, user-friendly shopping experience with secure payment options and reliable delivery.",
    overview:
      "Carrefour's e-commerce platform needed a regression pass across the core shopping journey ahead of release — from account access through checkout and post-purchase management.",
    servicesOffered: ["E2E", "Exploratory", "Regression"],
    scopeSections: [
      {
        heading: "Regression focus areas",
        art: "regress-areas",
        bullets: [
          "Sign-up / login",
          "Delivery",
          "Checkout / cart",
          "Order editing",
          "Cancellation",
          "Search / filter",
          "Previous orders",
          "Coupons",
          "Purchase lists",
        ],
      },
      {
        heading: "Approach",
        art: "approach",
        bullets: [
          "Followed provided instructions and claimed test cases",
          "Performed additional exploratory testing on top of the assigned scope",
          "Reported bugs with clear reproduction steps",
        ],
      },
    ],
    deviceScope: ["Microsoft Surface Book — Windows 10 Pro, 22H2"],
    tools: [],
    stats: [
      { value: "4", label: "Hours Duration" },
      { value: "3", label: "Functional Defects" },
      { value: "1", label: "Exploratory Defect" },
      { value: "1", label: "Visual Defect" },
    ],
    documents: [],
    galleryCount: 0,
    accent2: "#014E9F", // Carrefour's blue; the lime accent stays
    accent2Text: "#ffffff", // black on this dark blue is only 2.6:1, white is 8.1:1
    heroVisual: "shopping-cart",
    overviewPhotos: [{ src: "/images/projects/carrefour/store.jpg", width: 958, height: 508 }],
    results: [],
  },
  {
    slug: "leumi-goodies",
    name: "Leumi Goodies",
    logo: "/images/logos/leumi-goodies.png",
    tagline: "QA support for the \"Leumi Goodies\" mobile app, rewarding credit card purchases with redeemable benefits.",
    tags: ["Integration Testing", "Mobile App", "Real-time Updates"],
    featured: false,
    context:
      "As a QA tester on uTest's platform, I was invited to perform professional tests ensuring a bug-free experience for users redeeming their accumulated \"Goodies\".",
    overview:
      "Leumi Goodies is a program that lets Bank Leumi customers accumulate \"Goodies\" on credit card purchases — accumulation begins once monthly card spend reaches 2,000 ILS, up to 8,000 ILS. The app lets customers redeem accumulated Goodies for benefits across movies, concerts, shows, food, fashion, beauty, vacations, gyms, and more.",
    servicesOffered: ["E2E", "Functional", "Performance"],
    scopeSections: [
      {
        heading: "Core components in scope",
        art: "goodies-flow",
        wide: true,
        bullets: [
          "Home page, search, Goodies balance & reset date",
          "Gift card & benefit display, valid details, total payment display",
          "Payment selection, purchase confirmation, transaction cancellation",
          "Benefit cancellation & cancellation confirmation",
          "Profile: picture, credit card details, mobile number, settings",
          "Wallet: purchases, history, repeat-purchase option, transaction cancellation",
        ],
      },
    ],
    deviceScope: ["Android — Galaxy S22 Ultra, 5G, Android 13, One UI 5.1"],
    tools: [],
    stats: [
      { value: "2", label: "Hours Duration" },
      { value: "2", label: "Functional Defects" },
      { value: "1", label: "Performance Defect" },
    ],
    documents: [],
    galleryCount: 0,
    accent2: "#08C8FC", // the cyan of Leumi Goodies; the lime accent stays
    heroVisual: "balloon-phone",
    overviewPhotos: [{ src: "/images/projects/leumi-goodies/banner.jpg", width: 700, height: 356 }],
    results: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
