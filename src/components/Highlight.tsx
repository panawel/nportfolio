import { cn } from "@/lib/cn";

/** Flat lime highlighter band under inline text (solid colour, no gradient). `box-decoration-clone`
 *  keeps the band intact when the text wraps across lines. */
export function Highlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <mark
      className={cn(
        "-mx-1 rounded-sm bg-transparent px-1 text-inherit shadow-[inset_0_-0.4em_0_var(--accent)] box-decoration-clone",
        className,
      )}
    >
      {children}
    </mark>
  );
}
