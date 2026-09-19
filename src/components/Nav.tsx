"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, FolderKanban, Layers, Mail, Menu, User, X, type LucideIcon } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { getContactLinks } from "@/lib/contact-links";
import { navLinks as links } from "@/lib/nav-links";

const sectionIds = links.map((link) => link.href.split("#")[1]);
// The little icon square in front of each row of the phone menu, by section id.
const menuIcons: Record<string, LucideIcon> = {
  about: User,
  stack: Layers,
  projects: FolderKanban,
  certificates: Award,
  contact: Mail,
};
const contactLinks = getContactLinks();
const photoTextShadow = "[text-shadow:0_1px_12px_rgb(0_0_0/0.5)]";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onScroll() {
      // On the homepage the nav sits over the dark hero photo, so it only turns into a solid pill
      // once the hero is mostly gone; elsewhere it sits over a light panel and turns almost at once.
      setScrolled(window.scrollY > (isHome ? window.innerHeight * 0.8 : 8));

      // Scrollspy: the active section is the last one whose top has crossed 35% of the viewport.
      // Pinned to the final section at the very bottom, where it can't scroll any higher.
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sectionIds[sectionIds.length - 1];
      }
      setSection(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Mobile menu dismissal: Escape (focus goes back to the button), a click anywhere outside the
  // header (this also covers the footer's anchor links, which are not inside the menu), and
  // growing the window past the breakpoint where the menu no longer exists.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 768px)");
    function onBreakpoint(e: MediaQueryListEvent) {
      if (e.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  // While the menu is collapsing the pill keeps its solid, rounded-card look, so the closing menu never
  // spills out of a fully round shape. (State adjusted during render: `exiting` starts when `open` ends.)
  const [prevOpen, setPrevOpen] = useState(open);
  const [exiting, setExiting] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setExiting(!open);
  }
  const expanded = open || exiting;

  const transparent = !scrolled && !expanded;
  const onPhoto = transparent && isHome;
  const activeId = isHome ? section : null;
  const ring = onPhoto ? "focus-visible:ring-white" : "focus-visible:ring-foreground";

  return (
    // Positioning shell only, inset by the same frame as the panels so the nav lines up with the
    // hero content. The inner div below is the actual pill; its geometry is identical in the
    // transparent and solid states, so nothing jumps when it switches.
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-[var(--frame)] top-[var(--frame)] z-50"
    >
      <div
        className={`pointer-events-auto mx-auto max-w-6xl border px-6 transition-[background-color,border-color,box-shadow,border-radius] duration-300 ${
          // A finite radius (not rounded-full): it can animate down to the open card's 24px without the pill
          // staying an ellipse for most of the transition. 40px still clamps to a full round for a 58px pill.
          expanded ? "rounded-3xl" : "rounded-[40px]"
        } ${
          transparent
            ? "border-transparent bg-transparent"
            : `border-border ${
                expanded
                  ? "bg-background shadow-[0_20px_50px_rgb(0_0_0/0.16)]"
                  : "bg-background/90 shadow-[0_8px_30px_rgb(0_0_0/0.08)] backdrop-blur-xl"
              }`
        }`}
      >
        <div className="flex items-center justify-between py-2.5 md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            aria-label="Idan Pnuel, home"
            className={`group flex items-center gap-2.5 justify-self-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${ring}`}
            onClick={(e) => {
              setOpen(false);
              // Already on the homepage: Next does nothing for a link to the page you are on, so scroll to the top
              // ourselves (and drop a #section from the address). From any other page it navigates home as usual.
              if (pathname === "/" && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "auto" });
                if (window.location.hash) window.history.pushState(null, "", "/");
              }
            }}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-foreground font-mono text-[11px] font-bold text-white transition-transform duration-200 group-hover:-rotate-6 ${
                onPhoto ? "ring-1 ring-white/30" : ""
              }`}
            >
              IP<span className="text-accent">.</span>
            </span>
            <span
              className={`text-sm font-semibold md:hidden lg:inline ${
                onPhoto ? `text-white ${photoTextShadow}` : "text-foreground"
              }`}
            >
              Idan Pnuel
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:col-start-2 md:flex">
            {links.map((link, i) => {
              const active = sectionIds[i] === activeId;
              return (
                <SectionLink
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${ring} ${
                    active
                      ? "text-on-accent"
                      : onPhoto
                        ? `text-white hover:bg-white/15 ${photoTextShadow}`
                        : "text-foreground/75 hover:bg-foreground/[0.06] hover:text-foreground"
                  }`}
                >
                  {active && (
                    // One shared element: it slides from link to link as the active section changes.
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </SectionLink>
              );
            })}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 md:hidden ${ring} ${
              onPhoto ? "text-white" : "text-foreground"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                className="block"
                initial={reduced ? false : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.12 }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence initial={false} onExitComplete={() => setExiting(false)}>
          {open && (
            <motion.div
              key="mobile-menu"
              className="-mx-2 overflow-hidden px-2 md:hidden"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: { duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ height: 0, opacity: 0, transition: { duration: reduced ? 0 : 0.18, ease: "easeIn" } }}
            >
              <div className="max-h-[calc(100svh-6.5rem)] overflow-y-auto overscroll-contain border-t border-border pb-3 pt-3">
                <nav id="mobile-menu" aria-label="Primary">
                  <ul className="flex flex-col gap-1">
                    {links.map((link, i) => {
                      const id = sectionIds[i];
                      const active = id === activeId;
                      const Icon = menuIcons[id];
                      return (
                        <motion.li
                          key={link.href}
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: reduced ? 0 : 0.24, delay: reduced ? 0 : 0.08 + i * 0.04 }}
                        >
                          <SectionLink
                            href={link.href}
                            aria-current={active ? "location" : undefined}
                            onClick={() => setOpen(false)}
                            className={`group flex min-h-14 items-center gap-3 rounded-full py-1.5 pl-2 pr-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                              active
                                ? "bg-accent text-on-accent"
                                : "text-foreground hover:bg-foreground/[0.06] active:bg-foreground/[0.06]"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-150 group-active:-rotate-6 ${
                                active ? "bg-foreground text-accent" : "bg-shell text-foreground"
                              }`}
                            >
                              {Icon && <Icon className="h-[18px] w-[18px]" />}
                            </span>
                            <span aria-hidden className={`font-mono text-[11px] ${active ? "text-on-accent/60" : "text-foreground/40"}`}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[22px] font-medium leading-none tracking-tight">{link.label}</span>
                            <ArrowUpRight
                              aria-hidden
                              className="ml-auto h-5 w-5 opacity-40 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </SectionLink>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <div role="group" aria-label="Contact" className="mt-3 border-t-2 border-dashed border-border px-1 pb-1.5 pt-4">
                  <div className="flex gap-2.5">
                    {contactLinks.map(({ label, href, icon: Icon }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={label}
                        onClick={() => setOpen(false)}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: reduced ? 0 : 0.24, delay: reduced ? 0 : 0.08 + (links.length + i) * 0.04 }}
                        className={`shadow-hard-sm flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-2 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                          i % 2 === 0 ? "-rotate-1" : "rotate-1"
                        }`}
                      >
                        <Icon aria-hidden className="h-4 w-4 shrink-0" />
                        <span className="hidden min-[360px]:inline">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
