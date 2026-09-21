"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Which page this one was reached from, in this document only (client navigations; a fresh load starts empty).
let previousPath: string | null = null;
let currentPath: string | null = null;

/** True when the page in view was reached from the homepage by a client navigation, i.e. the browser's
 *  previous history entry is the homepage. */
export function cameFromHome() {
  return previousPath === "/";
}

/** Mounted once in the root layout: remembers the route we came from (see `cameFromHome`). */
export function RouteMemory() {
  const pathname = usePathname();

  useEffect(() => {
    if (currentPath === pathname) return;
    previousPath = currentPath;
    currentPath = pathname;
  }, [pathname]);

  return null;
}
