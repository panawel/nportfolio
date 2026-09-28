/** Used to wrap section/card content across the site. Used to fade + slide the content in once it
 *  scrolled into view (framer-motion `whileInView`, one instance per wrapped element - 45+ of them
 *  across the site). Removed: with that many scroll-triggered observers and animations firing during
 *  a scroll, it was the main cause of laggy scrolling, and for a site this size the staggered-reveal
 *  effect wasn't worth that cost. This is now a plain, unanimated wrapper - content renders at its
 *  final state immediately, so every call site above still compiles unchanged (`delay` is accepted
 *  but unused). No "use client": it no longer needs framer-motion, so it can render on the server. */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
