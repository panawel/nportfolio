import { profile } from "@/content/profile";
import { getContactLinks } from "@/lib/contact-links";

/** The closing dark panel: page-specific content (children) above a slim shared footer row. */
export function SiteFooter({ children }: { children?: React.ReactNode }) {
  const contactLinks = getContactLinks();

  return (
    <footer className="panel bg-ink text-ink-foreground">
      {children}

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-row items-center justify-between gap-3 border-t border-white/10 py-8">
          {/* shrink-0 + whitespace-nowrap: at 320px this text is exactly the tight part of the row (the
              icons below are already at their smallest reasonable size), so it must not be the thing
              that gives and wraps - the icons/gap were sized down instead (see below). */}
          <p className="shrink-0 text-sm whitespace-nowrap text-ink-foreground/60">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>

          <div className="flex gap-1.5">
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-ink-foreground transition-colors hover:bg-accent hover:text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
