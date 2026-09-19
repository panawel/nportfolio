import Image from "next/image";
import { TicketRow } from "@/components/TicketRow";
import type { StickerPhoto } from "@/content/projects";
import { cn } from "@/lib/cn";

const tilts = ["-rotate-3", "rotate-3"];

/** Small decorative photos beside a paragraph, set down like stuck-on prints: white border, hard shadow,
 *  a slight tilt and a slow float. Static (not clickable), so they are hidden from assistive tech. */
export function PhotoStickers({ photos, className }: { photos: StickerPhoto[]; className?: string }) {
  return (
    <div aria-hidden className={className}>
    <TicketRow className="flex gap-4 lg:flex-col lg:gap-0">
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          // Side by side they share the row (each up to 160px), so two never overflow a phone; stacked from lg.
          className={cn("animate-float min-w-0 max-w-40 flex-1 lg:w-44 lg:max-w-none lg:flex-none lg:shrink-0", i > 0 && "lg:-mt-3 lg:ml-6")}
          style={{ animationDelay: `${i * -2.2}s`, "--float-rot": i ? "3deg" : "-3deg" } as React.CSSProperties}
        >
          <div className={cn("shadow-hard-sm overflow-hidden rounded-xl border-4 border-white bg-white", tilts[i % 2])}>
            <Image
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes="176px"
              className="h-auto w-full"
            />
          </div>
        </div>
      ))}
    </TicketRow>
    </div>
  );
}
