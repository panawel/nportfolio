"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cameFromHome } from "@/components/RouteMemory";

/** The "All Projects" link on a case-study page. Reached from the homepage it goes back in history, so the
 *  homepage returns to exactly where it was scrolled (a plain `/#projects` link jumped to the top of the
 *  Projects section instead); reached any other way (a direct link, a reload) it is the normal `/#projects`
 *  link. Modified clicks (new tab, etc.) keep their normal behaviour. */
export function BackToProjects({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Link
      href="/#projects"
      className={className}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!cameFromHome()) return;
        e.preventDefault();
        router.back();
      }}
    >
      {children}
    </Link>
  );
}
