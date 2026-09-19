import Image from "next/image";

export function LogoBadge({
  src,
  alt,
  size = 40,
  tone = "shell",
  aspect = 1,
}: {
  src: string | null;
  alt: string;
  size?: number;
  /** Use "white" when the badge sits on a shell-gray surface. "none" shows the logo alone: no tile behind it,
   *  no padding (the logos are transparent PNGs, most with their own rounded app-icon shape). */
  tone?: "shell" | "white" | "none";
  /** Width / height of the (trimmed) logo, for `tone="none"`: a wide wordmark gets a wider box (up to 1.8 x `size`)
   *  instead of shrinking into a square. */
  aspect?: number;
}) {
  if (!src) return null;

  if (tone === "none") {
    return (
      <div
        className="relative shrink-0 transition-transform hover:rotate-3"
        style={{ width: Math.min(size * aspect, size * 1.8), height: size }}
      >
        <Image src={src} alt={`${alt} logo`} fill sizes={`${Math.round(size * 2 * 1.8)}px`} className="object-contain object-left" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl p-1.5 transition-transform hover:rotate-3 ${tone === "white" ? "bg-white" : "bg-shell"}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${alt} logo`}
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
