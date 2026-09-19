import { cn } from "@/lib/cn";

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-3 w-full", className)}
    >
      <path
        d="M2 10.5C22 3 40 3 58 9.5C76 16 96 3 116 6C136 9 156 14 176 6.5C186 3 194 3 198 6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
