import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]",
        tone === "dark" ? "text-foreground/70" : "text-ink-foreground/70",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "dark" ? "bg-foreground" : "bg-ink-foreground")} />
      {children}
    </div>
  );
}
