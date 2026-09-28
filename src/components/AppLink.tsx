"use client";

import NextLink, { useLinkStatus } from "next/link";
import { useEffect } from "react";
import type { ComponentProps } from "react";
import { reportPending } from "@/lib/nav-loading";

/** Next's `useLinkStatus` must be called from a descendant of the `<Link>` it tracks, so this is
 *  rendered as an (invisible) child rather than called directly in `Link` below. Reports this link's
 *  real pending-navigation state to the shared counter `NavLoadingBar` reads: `pending` is true only
 *  while Next is actually still fetching this route (skipped entirely when the route was already
 *  prefetched, which is most clicks on this fully static site - so this stays silent for them, which
 *  is correct, not a bug). The cleanup decrements on either a normal pending -> false transition or an
 *  unmount (the link's own page can unmount mid-navigation), so the counter can never get stuck. */
function PendingReporter() {
  const { pending } = useLinkStatus();
  useEffect(() => {
    if (!pending) return;
    reportPending(true);
    return () => reportPending(false);
  }, [pending]);
  return null;
}

/** Drop-in replacement for `next/link`'s `Link` - identical behaviour, and it feeds `NavLoadingBar` a
 *  real pending signal for this link's navigation. Every file that imports `Link` from "next/link"
 *  imports it from here instead; nothing else about the call sites changes. */
export function Link(props: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {props.children}
      <PendingReporter />
    </NextLink>
  );
}
