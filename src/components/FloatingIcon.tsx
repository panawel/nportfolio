import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
  rotate = 0,
  tone = "accent",
}: {
  icon: LucideIcon;
  className?: string;
  delay?: number;
  rotate?: number;
  /** Which page colour the chip uses (`accent-2` is the project's second colour, if it has one). */
  tone?: "accent" | "accent-2";
}) {
  return (
    <div
      className={cn(
        "animate-float absolute flex h-11 w-11 items-center justify-center rounded-xl shadow-lg",
        tone === "accent" ? "bg-accent text-on-accent" : "bg-accent-2 text-on-accent-2",
        className,
      )}
      style={{ animationDelay: `${delay}s`, "--float-rot": `${rotate}deg` } as React.CSSProperties}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
