"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";

/** Wraps the ticket row and tells the CSS whether it is on screen (`data-live`), so the looping
 *  ticket animations pause while it is scrolled out of view (see `.ticket-row` in globals.css). */
export function TicketRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { margin: "100px" });

  return (
    <div ref={ref} data-live={live} className={cn("ticket-row", className)}>
      {children}
    </div>
  );
}
