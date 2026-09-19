"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** A link to a homepage section (`/#projects`). Next's own hash navigation does nothing when the address
 *  already ends in that hash, so after one click, scrolling away and clicking the same link again did not
 *  respond. On the homepage this scrolls to the section itself every time (and keeps the address in step);
 *  from any other page it is a normal link, which navigates home and scrolls there. Modified clicks
 *  (new tab, etc.) keep their normal behaviour. */
export function SectionLink({ onClick, ...props }: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      onClick={(e) => {
        onClick?.(e);
        const href = typeof props.href === "string" ? props.href : null;
        const hash = href?.split("#")[1];
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!hash || pathname !== "/") return;
        const target = document.getElementById(hash);
        if (!target) return;
        e.preventDefault();
        // An instant jump (as Next's own hash links do): it always lands, even if the page is still loading images.
        target.scrollIntoView({ behavior: "auto", block: "start" });
        if (window.location.hash !== `#${hash}`) window.history.pushState(null, "", `/#${hash}`);
      }}
    />
  );
}
