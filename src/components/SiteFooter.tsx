import { SectionLink } from "@/components/SectionLink";
import { profile } from "@/content/profile";
import { navLinks } from "@/lib/nav-links";
import { getContactLinks } from "@/lib/contact-links";

/** The closing dark panel: page-specific content (children) above a slim shared footer row. */
export function SiteFooter({ children }: { children?: React.ReactNode }) {
  const contactLinks = getContactLinks();

  return (
    <footer className="panel bg-ink text-ink-foreground">
      {children}

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-foreground/60">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide text-ink-foreground/60"
          >
            {navLinks.map((link) => (
              <SectionLink
                key={link.href}
                href={link.href}
                className="rounded transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </SectionLink>
            ))}
          </nav>

          <div className="flex gap-2">
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-ink-foreground transition-colors hover:bg-accent hover:text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
