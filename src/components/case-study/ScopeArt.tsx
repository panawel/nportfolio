import { Fragment } from "react";
import { Accessibility, Ban, Banknote, Bug, Check, ClipboardCheck, ClipboardList, CreditCard, Cloud, Contrast, Crown, Database, Download, EqualNot, Gift, Globe, History, KeyRound, Languages, Laptop, ListChecks, Lock, MessageCircle, PencilLine, Play, Plus, RefreshCw, Rocket, Ruler, Search, ShoppingBag, ShoppingCart, ShieldCheck, Smartphone, Snowflake, Star, Store, Ticket, TicketPercent, Timer, Trash2, Trophy, Truck, Type, Undo2, User, UserPlus, Users, Wallet, ZoomIn } from "lucide-react";
import type { ScopeArtKey } from "@/content/projects";
import { cn } from "@/lib/cn";

// The little picture at the top of a scope card. Shapes and icons only; each mirrors what its card's
// bullets are about. They live under a TicketRow (see the page), so their loops pause off screen.
const chip = "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-foreground text-accent";
const chipGold = "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-2 text-on-accent-2";
const chipSm = "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-foreground text-accent";
const chipSmLime = "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-foreground";
const chipSmGold = "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-2 text-on-accent-2";
const chipGoldXl = "grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent-2 text-on-accent-2";
const chipLime = "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-foreground";
const chipLarge = "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-foreground text-accent";

/** Number of tiles in the "voucher-grid" scene: the text says the UI was checked on all 22 voucher types. */
export const VOUCHER_TYPES = 22;

function Track({ reverse = false, delays = [0, 1] }: { reverse?: boolean; delays?: number[] }) {
  return (
    <span className="relative mx-2 h-2 flex-1">
      <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-foreground/20" />
      {delays.map((d) => (
        <span
          key={d}
          className="cs-travel absolute top-0 h-2 w-1.5 rounded-full bg-foreground"
          style={{ animationDelay: `${d}s`, animationDirection: reverse ? "reverse" : "normal" }}
        />
      ))}
    </span>
  );
}

function Scene({ kind }: { kind: ScopeArtKey }) {
  switch (kind) {
    case "carousel":
      // A small copy of the hero phone's swiping voucher cards: the same 9s loop (cards slide left in turn,
      // the centred one is full size, the others shrink and fade, the dots follow). Keep the card width plus
      // gap (104 + 8 = 112px) equal to --step, and the delays equal to VoucherPhone's phase().
      return (
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-[200px] overflow-hidden">
            <div className="cs-carousel-track-mini flex w-max gap-2 pl-12" style={{ "--step": "112px" } as React.CSSProperties}>
              {[
                ["bg-accent", "bg-foreground", "bg-foreground/70"],
                ["bg-accent-2", "bg-foreground", "bg-foreground/60"],
                ["bg-foreground", "bg-accent", "bg-accent"],
                // A clone of the first card, so the loop restarts on an identical frame.
                ["bg-accent", "bg-foreground", "bg-foreground/70"],
              ].map(([tone, dot, bars], i) => (
                <div
                  key={i}
                  className={cn("cs-card-focus relative h-[54px] w-[104px] shrink-0 rounded-xl p-2", tone)}
                  style={{ animationDelay: `${i % 3 === 0 ? 0 : -(9 - 3 * (i % 3))}s` }}
                >
                  <span className={cn("block h-3.5 w-3.5 rounded-full", dot)} />
                  <span className={cn("mt-2 block h-2 w-12 rounded-full", bars)} />
                  <span className={cn("mt-1.5 block h-1.5 w-8 rounded-full opacity-60", bars)} />
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-shell" />
                  <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-shell" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="cs-dot h-1.5 rounded-full"
                style={{
                  animationDelay: `${i === 0 ? 0 : -(9 - 3 * i)}s`,
                  width: i === 0 ? 14 : 6,
                  backgroundColor: i === 0 ? "var(--foreground)" : "rgb(0 0 0 / 0.15)",
                }}
              />
            ))}
          </div>
        </div>
      );
    case "wallet":
      return (
        <div className="flex items-center gap-3">
          <span className={chip}>
            <Wallet className="h-5 w-5" />
          </span>
          <div className="w-32 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
              <span className="cs-fill block h-full w-full rounded-full bg-foreground" />
            </div>
            <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
          </div>
        </div>
      );
    case "screens":
      return (
        <div className="relative h-16 w-24">
          {[0, -2].map((delay, i) => (
            <span
              key={delay}
              className="cs-swap absolute left-1/2 top-0 -ml-6 h-16 w-12 rounded-lg border-2 border-foreground bg-white"
              style={{ animationDelay: `${delay}s` }}
            >
              <span className="mx-auto mt-2 block h-1.5 w-6 rounded-full bg-foreground/15" />
              <span className={cn("mx-auto mt-2 block h-6 w-8 rounded", i ? "bg-accent-2" : "bg-accent")} />
            </span>
          ))}
        </div>
      );
    case "api-flow":
      return (
        <div className="flex w-56 items-center">
          <span className={chip}>
            <Store className="h-5 w-5" />
          </span>
          <Track delays={[0, 1.5]} />
          <span className={chipGold}>
            <Cloud className="h-5 w-5" />
          </span>
          {/* The way back: refunds and cancels are reverted. */}
          <Track reverse delays={[0.7, 2.2]} />
          <span className={chip}>
            <Smartphone className="h-5 w-5" />
          </span>
        </div>
      );
    case "voucher-grid":
      return (
        <div className="grid w-[184px] grid-cols-11 gap-1">
          {Array.from({ length: VOUCHER_TYPES }).map((_, i) => (
            <span
              key={i}
              data-voucher-tile
              className="cs-scan h-3.5 rounded-[3px] bg-foreground/[0.09]"
              style={{ animationDelay: `${(i % 11) * 0.16 + Math.floor(i / 11) * 0.3}s` }}
            />
          ))}
        </div>
      );
    case "database":
      return (
        <div className="relative grid h-14 w-40 place-items-center">
          <span className={chipLarge}>
            <Database className="h-6 w-6" />
          </span>
          <span className="cs-orbit absolute grid h-8 w-8 place-items-center rounded-full bg-accent-2 text-on-accent-2">
            <Search className="h-4 w-4" />
          </span>
        </div>
      );
    case "sync":
      return (
        <div className="flex items-center gap-3">
          <span className={chip}>
            <Ticket className="h-5 w-5" />
          </span>
          <RefreshCw className="h-6 w-6 text-foreground motion-safe:animate-spin [animation-duration:3s]" />
          <span className={chip}>
            <Database className="h-5 w-5" />
          </span>
        </div>
      );
    case "purchase-flow":
      // Purchases turn into coins and then money.
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 items-center">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-accent">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="relative mx-3 h-6 flex-1">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-foreground/20" />
              {[0, 0.7, 1.4].map((d) => (
                <span
                  key={d}
                  className="cs-travel absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-foreground bg-accent"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-foreground">
              <Banknote className="h-5 w-5" />
            </span>
          </div>
        </div>
      );
    case "gateways":
      // Payment cards slide toward a shield (3DS), which pulses; a lock shuts.
      return (
        <div className="flex w-60 items-center">
          <span className="relative mr-2 h-10 w-14 shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="cs-slide-r absolute h-6 w-9 rounded-md border-2 border-foreground bg-white"
                style={{ top: i * 5, left: i * 4, animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </span>
          <Track delays={[0, 1]} />
          <span className={cn(chipLime, "cs-ring")}>
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="cs-shake ml-3 inline-flex text-foreground">
            <Lock className="h-4 w-4" />
          </span>
        </div>
      );
    case "leaderboard":
      // Podium bars that re-sort, a trophy, and a pop-up window that bounces in and closes.
      return (
        <div className="flex items-end gap-5">
          <span className={chip}>
            <Trophy className="h-5 w-5" />
          </span>
          <div className="flex h-12 items-end gap-1.5">
            <span className="cs-rank-a h-12 w-5 rounded-t-md border-2 border-foreground bg-accent" />
            <span className="cs-rank-b h-12 w-5 rounded-t-md bg-foreground" />
            <span className="cs-rank-c h-12 w-5 rounded-t-md border-2 border-foreground bg-accent-2" />
          </div>
          <span className="cs-popup relative block h-11 w-16 overflow-hidden rounded-lg border-2 border-foreground bg-white">
            <span className="block h-3 border-b-2 border-foreground bg-accent-2" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="mx-1.5 mt-1.5 block h-1.5 rounded-full bg-foreground/15" />
            <span className="mx-1.5 mt-1 block h-1.5 w-8 rounded-full bg-foreground/15" />
          </span>
        </div>
      );
    case "event-stream":
      // Log lines scrolling, events flowing into a snowflake, and a heartbeat line (server health).
      return (
        <div className="flex w-64 items-center gap-2">
          <div className="h-11 w-14 shrink-0 overflow-hidden rounded-md bg-white">
            <div className="cs-log flex flex-col gap-1.5 p-1.5">
              {[0, 1].flatMap((set) =>
                ["w-10", "w-7", "w-9", "w-5"].map((w, i) => (
                  <span key={`${set}-${i}`} className={cn("block h-1.5 rounded-full bg-foreground/25", w)} />
                )),
              )}
            </div>
          </div>
          <Track delays={[0, 1.2]} />
          <span className={chipLime}>
            <Snowflake className="h-5 w-5" />
          </span>
          <svg viewBox="0 0 80 40" className="ml-1 h-9 w-16 shrink-0" fill="none">
            <path
              className="cs-ecg text-foreground"
              d="M0 20 H22 L28 6 L36 34 L42 14 L46 20 H80"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "toggles":
      // Feature toggles flipping one after another, a database, and a release lifting off.
      return (
        <div className="flex items-center gap-5">
          <div className="space-y-1.5">
            {[0, 0.9, 1.8].map((d) => (
              <span
                key={d}
                className="cs-toggle-bg relative block h-4 w-9 rounded-full"
                style={{ animationDelay: `${d}s` }}
              >
                <span
                  className="cs-toggle-knob absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white"
                  style={{ animationDelay: `${d}s` }}
                />
              </span>
            ))}
          </div>
          <span className={chip}>
            <Database className="h-5 w-5" />
          </span>
          <span className={cn(chipGold, "cs-launch")}>
            <Rocket className="h-5 w-5" />
          </span>
        </div>
      );
    case "shield-stars":
      // A shield that a scan line sweeps across, with a row of stars twinkling under it.
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-foreground text-accent">
            <ShieldCheck className="h-6 w-6" />
            <span className="cs-sweep absolute inset-y-0 left-1/2 w-0.5 bg-accent/80" />
          </span>
          <span className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="cs-blink h-2.5 w-2.5 fill-accent-2 text-foreground"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </span>
        </div>
      );
    case "team":
      // Three engineers (lime) and their manager (orange, bigger), linked by a pulsing line.
      return (
        <div className="flex items-end gap-2">
          {[0, 0.5, 1].map((d) => (
            <span key={d} className="cs-head flex flex-col items-center" style={{ animationDelay: `${d}s` }}>
              <span className="block h-4 w-4 rounded-full border-2 border-foreground bg-white" />
              <span className="-mt-px block h-3 w-8 rounded-t-full border-2 border-foreground bg-accent" />
            </span>
          ))}
          <span className="mb-4 h-0.5 w-8 rounded-full bg-foreground/25 cs-blink" />
          <span className="cs-head flex flex-col items-center" style={{ animationDelay: "1.5s" }}>
            <span className="block h-5 w-5 rounded-full border-2 border-foreground bg-white" />
            <span className="-mt-px block h-4 w-11 rounded-t-full border-2 border-foreground bg-accent-2" />
          </span>
        </div>
      );
    case "seat-map": {
      // The seating plan vs reality: the second plan is missing seats, and an orange circle draws itself
      // around the difference.
      const grid = (missing: number[]) => (
        <div className="grid grid-cols-6 gap-[3px]">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-3 rounded-t-[4px] rounded-b-[1px]",
                missing.includes(i) ? "border border-dashed border-foreground/25" : "bg-foreground/30",
              )}
            />
          ))}
        </div>
      );
      return (
        <div className="flex origin-center scale-[0.85] items-center gap-4 sm:scale-100">
          {grid([])}
          <EqualNot className="h-5 w-5 shrink-0 text-foreground/70" />
          <div className="relative">
            {grid([16, 17, 23])}
            <svg viewBox="-8 -8 103 68" className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]" fill="none">
              <path
                className="cs-circle text-accent-2"
                d="M46 24 C 56 8, 92 14, 92 32 C 92 50, 62 52, 50 42 C 42 35, 42 27, 50 22"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      );
    }
    case "accessibility":
      // An accessibility toolbar whose options light up one after another.
      return (
        <div className="flex items-center gap-1.5 rounded-xl border-2 border-foreground bg-white p-1.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-2 text-on-accent-2">
            <Accessibility className="h-5 w-5" />
          </span>
          {[Type, Contrast, ZoomIn].map((Icon, i) => (
            <span
              key={i}
              className="cs-lit grid h-9 w-9 place-items-center rounded-lg bg-black/10 text-foreground"
              style={{ animationDelay: `${i * 0.9}s` }}
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}
        </div>
      );
    case "compat":
      // Laptops and phones lighting in turn, over three browser dots.
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {[Laptop, Laptop, Smartphone, Smartphone].map((Icon, i) => (
              <span
                key={i}
                className="cs-lit grid h-9 w-9 place-items-center rounded-lg bg-black/10 text-foreground"
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {["bg-accent", "bg-accent-2", "bg-foreground"].map((tone, i) => (
              <span
                key={i}
                className={cn("cs-blink h-2.5 w-2.5 rounded-full border border-foreground", tone)}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>
      );
    case "load":
      // Users streaming into a gauge whose needle sweeps to the peak and back, and two benchmark bars.
      return (
        <div className="flex items-center gap-3">
          <span className={chip}>
            <Users className="h-5 w-5" />
          </span>
          <span className="flex w-12">
            <Track delays={[0, 0.5, 1]} />
          </span>
          <div className="relative h-14 w-24">
            <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round">
              <path d="M10 56 A40 40 0 0 1 50 16" stroke="var(--accent)" strokeWidth="9" />
              <path d="M50 16 A40 40 0 0 1 90 56" stroke="var(--accent-2)" strokeWidth="9" />
            </svg>
            <span className="cs-needle absolute bottom-1 left-1/2 -ml-px h-9 w-[3px] rounded bg-foreground" />
            <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-foreground" />
          </div>
          <div className="hidden w-14 space-y-1.5 sm:block">
            <span className="block h-2 overflow-hidden rounded-full bg-foreground/10">
              <span className="cs-fill block h-full w-full rounded-full bg-accent-2" />
            </span>
            <span className="block h-2 overflow-hidden rounded-full bg-foreground/10">
              <span className="cs-fill block h-full w-2/3 rounded-full bg-foreground/40" style={{ animationDelay: "0.4s" }} />
            </span>
          </div>
        </div>
      );
    case "language":
      // The language switch slides one way and snaps back by itself (the bug), with an alert dot; two
      // mirrored speech bubbles trade places.
      return (
        <div className="flex origin-center scale-[0.9] items-center gap-3 sm:scale-100">
          <span className="cs-blink block w-14 space-y-1 rounded-lg border-2 border-foreground bg-white p-1.5">
            <span className="block h-1.5 w-full rounded-full bg-foreground/25" />
            <span className="block h-1.5 w-2/3 rounded-full bg-foreground/25" />
          </span>
          <span className="relative block h-6 w-11 rounded-full bg-foreground">
            <span className="cs-lang-knob absolute left-1 top-1 block h-4 w-4 rounded-full bg-accent" />
            <span className="cs-alert absolute -right-1.5 -top-1.5 block h-3.5 w-3.5 rounded-full border-2 border-foreground bg-accent-2" />
          </span>
          <Languages className="h-5 w-5 text-foreground/70" />
          <span className="cs-blink block w-14 space-y-1 rounded-lg border-2 border-foreground bg-accent p-1.5" style={{ animationDelay: "1s" }}>
            <span className="ml-auto block h-1.5 w-full rounded-full bg-foreground/40" />
            <span className="ml-auto block h-1.5 w-2/3 rounded-full bg-foreground/40" />
          </span>
        </div>
      );
    case "round-1":
    case "round-2": {
      // The two test rounds: a row of nodes (7 areas, then 8) lighting one after another, lime then gold.
      const gold = kind === "round-2";
      const count = gold ? 8 : 7;
      return (
        <div className="flex origin-center scale-[0.9] items-center sm:scale-100">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="flex items-center">
              <span
                data-round-node
                className={cn("h-4 w-4 rounded-md border-2 border-foreground bg-black/10", gold ? "cs-lit-2" : "cs-lit")}
                style={{ animationDelay: `${i * 0.42}s` }}
              />
              {i < count - 1 && <span className="mx-1.5 h-0.5 w-1.5 rounded-full bg-foreground/25" />}
            </span>
          ))}
        </div>
      );
    }
    case "e2e-flow":
      // A lead is added, a message is sent, a subscription is bought, and the limits are pushed.
      return (
        <div className="flex w-60 origin-center scale-[0.85] items-center sm:scale-100">
          <span className={chipSm}>
            <UserPlus className="h-4 w-4" />
          </span>
          <Track delays={[0, 1]} />
          <span className={chipSmLime}>
            <MessageCircle className="h-4 w-4" />
          </span>
          <Track delays={[0.5, 1.5]} />
          <span className={chipSmGold}>
            <Crown className="h-4 w-4" />
          </span>
          <Track delays={[1, 2]} />
          <span className={chipSm}>
            <Ruler className="h-4 w-4" />
          </span>
        </div>
      );
    case "integration":
      // A browser, a chat service and a cloud service, with data flowing both ways.
      return (
        <div className="flex w-56 origin-center scale-[0.9] items-center sm:scale-100">
          <span className={chip}>
            <Globe className="h-5 w-5" />
          </span>
          <Track delays={[0, 1.3]} />
          <span className={chipLime}>
            <MessageCircle className="h-5 w-5" />
          </span>
          <Track reverse delays={[0.6, 1.9]} />
          <span className={chipGold}>
            <Cloud className="h-5 w-5" />
          </span>
        </div>
      );
    case "gateway-plans":
      // Three plans (the longer, the cheaper per month), each picked in turn, leading to the store.
      return (
        <div className="flex items-end gap-2">
          {[26, 20, 14].map((h, i) => (
            <span
              key={i}
              className="cs-select flex h-16 w-9 flex-col items-center justify-end rounded-lg border-2 border-foreground bg-white p-1"
              style={{ animationDelay: `${i * 2}s` }}
            >
              <span className="w-full rounded-sm bg-foreground" style={{ height: h }} />
            </span>
          ))}
          <span className="flex w-8 self-center">
            <Track delays={[0.6]} />
          </span>
          <span className={cn(chipSm, "self-center")}>
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
      );
    case "locales":
      // A screen that mirrors left/right between locales, with a floating widget that follows the layout.
      return (
        <div className="flex items-center gap-3">
          <span className={chip}>
            <Globe className="h-5 w-5" />
          </span>
          <div className="cs-mirror relative h-14 w-28 overflow-hidden rounded-lg border-2 border-foreground bg-white p-2">
            <span className="block h-1.5 w-16 rounded-full bg-foreground/25" />
            <span className="mt-1.5 block h-1.5 w-20 rounded-full bg-foreground/25" />
            <span className="mt-1.5 block h-1.5 w-12 rounded-full bg-foreground/25" />
            <span className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-2 border-foreground bg-accent-2" />
          </div>
        </div>
      );
    case "backup-restore":
      // A phone crashes, the data goes to the cloud and comes back to a second device.
      return (
        <div className="flex w-60 origin-center scale-[0.9] items-center sm:scale-100">
          <span className={cn(chip, "cs-shake")}>
            <Smartphone className="h-5 w-5" />
          </span>
          <Track delays={[0, 1.2]} />
          <span className={chipGold}>
            <Cloud className="h-5 w-5" />
          </span>
          <Track reverse delays={[0.6, 1.8]} />
          <span className="cs-lit-2 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black/10 text-foreground">
            <Smartphone className="h-5 w-5" />
          </span>
        </div>
      );
    case "security":
      // Intruders run at a shield and bounce off; a key blinks (encryption).
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16">
            {[0, 0.7, 1.4].map((d, i) => (
              <span
                key={d}
                className="cs-bounce absolute h-2.5 w-2.5 rounded-full bg-foreground"
                style={{ top: 6 + i * 16, left: 0, animationDelay: `${d}s` }}
              />
            ))}
          </div>
          <span className={cn(chipGoldXl, "cs-ring-2")}>
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span className="flex flex-col items-center gap-1.5 text-foreground">
            <Lock className="h-4 w-4" />
            <KeyRound className="cs-blink h-4 w-4" />
          </span>
        </div>
      );
    case "signup":
      // Registration and login: a four-step path lighting up (the last step is the log-in), two fields
      // and a switch turning on.
      return (
        <div className="flex origin-center scale-[0.9] items-center gap-4 sm:scale-100">
          <div className="flex items-center">
            {[0, 1, 2, 3].map((i) => (
              <Fragment key={i}>
                {i > 0 && <span className="block h-0.5 w-4 bg-foreground/25" />}
                <span
                  data-step-node
                  className={cn(
                    "block h-5 w-5 rounded-full border-2 border-foreground bg-white",
                    i === 3 ? "cs-step-2" : "cs-step",
                  )}
                  style={{ animationDelay: `${i * 1}s` }}
                />
              </Fragment>
            ))}
          </div>
          <div className="space-y-1.5">
            <span className="block h-3 w-16 rounded-full border-2 border-foreground/30 bg-white" />
            <span className="block h-3 w-16 rounded-full border-2 border-foreground/30 bg-white" />
            <span className="cs-toggle-bg relative block h-3.5 w-8 rounded-full">
              <span className="cs-toggle-knob absolute left-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          </div>
        </div>
      );
    case "playback":
      // Three little players: a live one (blinking light), a free one and a paid one (a flipping coin),
      // each with a progress bar filling in turn.
      return (
        <div className="flex origin-center scale-[0.9] items-center gap-2 sm:scale-100">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="relative block h-12 w-16 rounded-lg border-2 border-foreground bg-white"
            >
              <span className="absolute inset-x-1.5 top-1.5 grid h-6 place-items-center rounded-md bg-shell">
                {i === 0 && <span className="cs-blink block h-2.5 w-2.5 rounded-full bg-accent-2" />}
                {i === 1 && <Play className="h-3.5 w-3.5 fill-foreground text-foreground" />}
                {i === 2 && <span className="cs-flip block h-3.5 w-3.5 rounded-full border-2 border-foreground bg-accent-2" />}
              </span>
              <span className="absolute inset-x-1.5 bottom-1.5 block h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <span
                  className={cn("cs-fill block h-full w-full rounded-full", i === 1 ? "bg-accent" : "bg-foreground")}
                  style={{ animationDelay: `${i * 1.4}s` }}
                />
              </span>
            </span>
          ))}
        </div>
      );
    case "profiles":
      // A new profile pops in with a plus, another shrinks away, and a language chip blinks.
      return (
        <div className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-foreground bg-accent">
            <User className="h-5 w-5" />
          </span>
          <span className="cs-avatar-out grid h-11 w-11 place-items-center rounded-full border-2 border-foreground bg-white">
            <User className="h-5 w-5" />
          </span>
          <span className="relative block h-11 w-11">
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-foreground/25" />
            <span className="cs-avatar-in absolute inset-0 grid place-items-center rounded-full border-2 border-foreground bg-accent-2 text-on-accent-2">
              <User className="h-5 w-5" />
              <span className="absolute -right-1.5 -top-1.5 grid h-4.5 w-4.5 place-items-center rounded-full border-2 border-foreground bg-accent text-foreground">
                <Plus className="h-2.5 w-2.5" strokeWidth={4} />
              </span>
            </span>
          </span>
          <span className={cn(chipSm, "ml-1")}>
            <Languages className="cs-blink h-4 w-4" />
          </span>
        </div>
      );
    case "components":
      // Thirteen components (7 + 6), lighting one by one in the two colours.
      return (
        <div className="flex flex-col items-center gap-1">
          {[7, 6].map((count, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: count }).map((_, i) => {
                const n = row * 7 + i;
                return (
                  <span
                    key={i}
                    data-component-tile
                    className={cn(
                      "block h-6 w-6 rounded-[6px] border-2 border-foreground bg-black/10",
                      n % 2 ? "cs-lit-2" : "cs-lit",
                    )}
                    style={{ animationDelay: `${n * 0.25}s` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );
    case "bridge":
      // The app and a locked box slide together, click, and a check pops (no functionality lost).
      return (
        <div className="relative flex items-center">
          <span className={cn(chipGold, "cs-bridge-l relative z-10")}>
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="-mx-1 block h-1.5 w-4 bg-foreground" />
          <span className={cn(chip, "cs-bridge-r relative z-10")}>
            <Lock className="h-5 w-5" />
          </span>
          <span className="cs-bridge-check absolute -top-3 left-1/2 -ml-3 z-20 grid h-6 w-6 place-items-center rounded-full border-2 border-foreground bg-accent text-foreground">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>
      );
    case "encrypted-chat":
      // A message is locked on its way to the other phone: a bubble, a pulsing lock and a bubble that lights
      // up when the message arrives, with dots travelling between them.
      return (
        <div className="relative h-full w-full">
          <div className="absolute inset-x-4 top-1/2 max-sm:inset-x-3 flex -translate-y-1/2 items-center">
            <span className="relative block h-10 w-12 shrink-0 max-sm:w-8 max-sm:p-1.5 rounded-xl border-2 border-foreground bg-accent-2 p-2">
              <span className="block h-1.5 w-full rounded-full bg-foreground/60" />
              <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-foreground/60" />
            </span>
            <Track />
            <span className="cs-ring-2 grid h-9 w-9 shrink-0 max-sm:h-8 max-sm:w-8 place-items-center rounded-full border-2 border-accent bg-foreground text-accent">
              <Lock className="h-4 w-4" />
            </span>
            <Track delays={[0.6, 1.8]} />
            <span className="cs-lit-2 relative block h-10 w-12 shrink-0 max-sm:w-8 max-sm:p-1.5 rounded-xl border-2 border-foreground bg-black/10 p-2">
              <span className="block h-1.5 w-full rounded-full bg-foreground/60" />
              <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-foreground/60" />
            </span>
          </div>
        </div>
      );
    case "explode":
      // A screen drawn as parts that float apart and snap back while a magnifier passes over; a report pops out.
      return (
        <div className="flex items-center gap-5">
          <div className="relative h-14 w-11">
            {[
              ["inset-x-0 top-0 rounded-t-md bg-accent-2", "0px", "-8px"],
              ["inset-x-0 top-4 rounded-sm bg-white", "-10px", "0px"],
              ["inset-x-0 top-8 rounded-sm bg-white", "10px", "0px"],
              ["inset-x-1 bottom-0 rounded-full bg-accent", "0px", "8px"],
            ].map(([cls, px, py], i) => (
              <span
                key={i}
                className={cn("cs-part absolute block h-3 border-2 border-foreground", cls)}
                style={{ "--px": px, "--py": py } as React.CSSProperties}
              />
            ))}
            <span className="cs-orbit absolute left-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-foreground text-accent">
              <Search className="h-3 w-3" />
            </span>
          </div>
          <span className="cs-pop-in block h-12 w-10 rounded-md border-2 border-foreground bg-white p-1.5">
            <span className="block h-4 rounded-sm bg-accent-2" />
            <span className="mt-1 block h-1.5 rounded-full bg-foreground/30" />
            <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-foreground/30" />
          </span>
        </div>
      );
    case "ui-resize":
      // A screen that stretches from phone to tablet width while its bars reflow, a language chip and a
      // line of text that mirrors.
      return (
        <div className="flex origin-center scale-[0.9] items-center gap-3 sm:scale-100">
          <div className="flex h-14 w-24 items-center justify-center">
            <span className="cs-resize block h-14 overflow-hidden rounded-lg border-2 border-foreground bg-white p-1.5" style={{ width: 40 }}>
              <span className="block h-2 rounded-full bg-foreground/30" />
              <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-foreground/30" />
              <span className="mt-1.5 block h-3 rounded-md bg-accent-2" />
            </span>
          </div>
          <span className={chipSm}>
            <Languages className="cs-blink h-4 w-4" />
          </span>
          <span className="cs-mirror block w-14 space-y-1.5">
            <span className="block h-1.5 w-12 rounded-full bg-foreground/30" />
            <span className="block h-1.5 w-8 rounded-full bg-foreground/30" />
          </span>
        </div>
      );
    case "lifecycle":
      // Install, update, uninstall: three steps lighting in turn while the app tile arrives, pulses and shrinks away.
      return (
        <div className="flex items-center gap-5">
          <div className="flex gap-2">
            {[Download, RefreshCw, Trash2].map((Icon, i) => (
              <span
                key={i}
                className="cs-chip-on grid h-9 w-9 place-items-center rounded-lg bg-black/10 text-foreground"
                style={{ animationDelay: `${i * 2}s` }}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
          <span className="cs-app grid h-12 w-12 place-items-center rounded-2xl border-2 border-foreground bg-accent-2 text-on-accent-2">
            <MessageCircle className="h-6 w-6" />
          </span>
        </div>
      );
    case "regress-loop":
      // The regression grid turning green tile by tile, a circular arrow (every version, every fix) and a magnifier.
      return (
        <div className="flex origin-center scale-90 items-center gap-3 sm:scale-100">
          <span className={chipSm}>
            <RefreshCw className="cs-spin-8 h-4 w-4" />
          </span>
          <div className="grid grid-cols-8 gap-[3px]">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                data-regress-tile
                className="cs-pass h-3 w-3 rounded-[3px] bg-black/10"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <span className={cn(chipSmGold, "cs-orbit")}>
            <Search className="h-4 w-4" />
          </span>
        </div>
      );
    case "automation":
      // Code that types itself, a phone getting taps, results turning green with one failure that flies to
      // a report chip (direct Jira reporting), and a bar that shrinks (a shorter regression).
      return (
        // Laid out absolutely so its 380px natural width never widens the card on phones (it is scaled down).
        <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 flex w-[380px] -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.55] flex-col items-center gap-3 min-[400px]:scale-[0.7] sm:scale-100 md:scale-110">
          <div className="flex items-center">
            <span className="block w-[72px] shrink-0 overflow-hidden rounded-lg border-2 border-foreground bg-white">
              <span className="flex gap-1 bg-foreground px-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-1.5 w-1.5 rounded-full bg-accent" />
                ))}
              </span>
              <span className="block space-y-1.5 p-1.5">
                {["w-full", "w-2/3", "w-4/5", "w-1/2"].map((w, i) => (
                  <span
                    key={i}
                    className={cn("cs-type block h-1.5 rounded-full bg-foreground/50", w)}
                    style={{ animationDelay: `${i * 0.35}s` }}
                  />
                ))}
              </span>
            </span>
            <span className="w-10">
              <Track delays={[0, 1.2]} />
            </span>
            <span className="relative grid h-14 w-8 place-items-center overflow-hidden rounded-lg border-2 border-foreground bg-white">
              {[0, 1.2].map((d) => (
                <span
                  key={d}
                  className="cs-wave absolute h-5 w-5 rounded-full border-2 border-accent-2"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
              <span className="block h-2 w-2 rounded-full bg-foreground" />
            </span>
            <span className="w-10">
              <Track delays={[0.4, 1.6]} />
            </span>
            <div className="grid grid-cols-3 gap-[3px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  data-result-tile
                  className={cn("h-3 w-3 rounded-[3px] bg-black/10", i === 4 ? "cs-fail" : "cs-pass")}
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ))}
            </div>
            <span className="relative mx-2 block h-4 w-12">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-foreground/20" />
              <Bug className="cs-travel absolute top-0 h-4 w-4 text-foreground" />
            </span>
            <span className={chipGold}>
              <ClipboardList className="h-5 w-5" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-foreground" />
            <span className="block h-2 w-40 overflow-hidden rounded-full bg-foreground/10">
              <span className="cs-shrink block h-full w-full rounded-full bg-foreground" />
            </span>
          </div>
        </div>
        </div>
      );
    case "goodies-flow":
      // One chip per bullet (home & search, benefits, payment, cancellation, profile, wallet) joined by a
      // track with a travelling dot, lighting one after another. Absolute and scaled so its 480px width
      // never widens the card on phones.
      return (
        <div className="relative h-full w-full">
          <div className="absolute left-1/2 top-1/2 flex w-[480px] -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.42] items-center min-[400px]:scale-[0.58] sm:scale-100 md:scale-110">
            {[Search, Gift, CreditCard, Undo2, User, Wallet].map((Icon, i, all) => (
              <Fragment key={i}>
                <span
                  data-flow-chip
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-black/10 text-foreground",
                    i % 2 ? "cs-lit-2" : "cs-lit",
                  )}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {i < all.length - 1 && <Track delays={[i * 0.5]} />}
              </Fragment>
            ))}
          </div>
        </div>
      );
    case "regress-areas": {
      // Nine regression areas (sign-up / login, delivery, cart, order editing, cancellation, search, previous
      // orders, coupons, purchase lists) lit one after another like a regression pass.
      const rows = [
        [UserPlus, Truck, ShoppingCart, PencilLine, Ban],
        [Search, History, TicketPercent, ListChecks],
      ];
      return (
        <div className="flex flex-col items-center gap-1">
          {rows.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((Icon, i) => {
                const n = r * 5 + i;
                return (
                  <span
                    key={i}
                    data-area-chip
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-lg border-2 border-foreground bg-black/10 text-foreground",
                      n % 2 ? "cs-lit-2" : "cs-lit",
                    )}
                    style={{ animationDelay: `${n * 0.4}s` }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
    case "approach":
      // Follow the given test cases (a checklist), explore beyond them (a magnifier drifting), and report bugs
      // clearly (a bug that lands on a report card).
      return (
        <div className="flex w-56 origin-center scale-[0.92] items-center sm:scale-100">
          <span className={chip}>
            <ClipboardCheck className="h-5 w-5" />
          </span>
          <Track delays={[0, 1.4]} />
          <span className={cn(chipGold, "cs-orbit")}>
            <Search className="h-5 w-5" />
          </span>
          <Track delays={[0.7, 2]} />
          <span className="cs-pop-in block h-11 w-9 shrink-0 rounded-md border-2 border-foreground bg-white p-1">
            <Bug className="mx-auto h-4 w-4 text-foreground" />
            <span className="mt-1 block h-1.5 rounded-full bg-foreground/30" />
            <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-foreground/30" />
          </span>
        </div>
      );
    case "explore":
      return (
        <div className="relative h-14 w-[200px]">
          <svg viewBox="0 0 200 56" className="absolute inset-0 h-full w-full" fill="none">
            <path
              d="M6 40 C 36 8, 66 52, 100 28 S 164 8, 194 34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 7"
              className="text-foreground/40"
            />
          </svg>
          <span className="cs-wander absolute left-1 top-6 grid h-8 w-8 place-items-center rounded-full bg-accent-2 text-on-accent-2">
            <Search className="h-4 w-4" />
          </span>
        </div>
      );
  }
}

export function ScopeArt({ kind, tall = false }: { kind: ScopeArtKey; tall?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn("mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-shell", tall ? "h-28" : "h-20")}
    >
      <Scene kind={kind} />
    </div>
  );
}
