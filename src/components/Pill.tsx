import { cn } from "@/lib/cn";

export function Pill({
  children,
  className,
  tone = "shell",
}: {
  children: React.ReactNode;
  className?: string;
  /** Background tone; use "white" when the pill sits on a shell-gray surface. */
  tone?: "shell" | "white" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs text-foreground/80 transition-transform hover:-translate-y-0.5 hover:bg-accent hover:text-on-accent",
        tone === "white" && "bg-white",
        tone === "shell" && "bg-shell",
        tone === "accent" && "bg-accent text-on-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
