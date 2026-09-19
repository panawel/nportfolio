"use client";

import { Children, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Maximize2, Play } from "lucide-react";
import type { GalleryMedia } from "@/content/projects";
import { MediaLightbox, type MediaItem } from "@/components/MediaLightbox";
import { cn } from "@/lib/cn";

/** One gallery tile. A recording is muted, loops and plays only while on screen (a still for reduced
 *  motion); a picture is shown whole on a dark stage. Clicking opens the viewer. */
function Tile({
  media,
  className,
  cover,
  onOpen,
  buttonRef,
}: {
  media: GalleryMedia;
  className?: string;
  /** Crop to the tile's box instead of showing the whole item. */
  cover?: boolean;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const image = media.kind === "image";
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <button
      ref={buttonRef}
      onClick={onOpen}
      aria-label={image ? "Open image" : "Play recording"}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        media.tone === "light" ? "bg-white" : "bg-foreground",
        className,
      )}
      style={cover ? undefined : { aspectRatio: `${media.width} / ${media.height}` }}
    >
      {image ? (
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(min-width: 640px) 480px, 90vw"
          className={cn(
            "transition-transform duration-300 group-hover:scale-[1.04]",
            media.fit === "cover" ? "object-cover" : "object-contain p-3",
          )}
          style={media.position ? { objectPosition: media.position } : undefined}
        />
      ) : (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className={cn(
            "pointer-events-none h-full w-full transition-transform duration-300 group-hover:scale-[1.03]",
            cover ? "object-cover" : "object-contain",
          )}
        />
      )}
      <span className="pointer-events-none absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-accent text-on-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {image ? <Maximize2 className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
      </span>
    </button>
  );
}

/** The project's real pictures and screen recordings as a small mosaic: one lead tile on the left (the
 *  portrait recording if there is one, else the first item) and the rest beside it; only tall pictures
 *  make a row of tall tiles. `children` (the document and placeholder slots) sit under the other tiles. */
export function ProjectGallery({
  items: media,
  children,
}: {
  items: GalleryMedia[];
  children?: React.ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const last = useRef(0);

  const viewerItems: MediaItem[] = media.map((m) =>
    m.kind === "image"
      ? { type: "image", src: m.src, caption: "" }
      : { type: "video", src: m.src, caption: "", poster: m.poster },
  );
  const portraitIndex = media.findIndex((m) => m.kind !== "image" && m.height > m.width);
  const leadIndex = portraitIndex >= 0 ? portraitIndex : 0;
  const lead = media[leadIndex];
  const others = media.map((m, i) => ({ m, i })).filter(({ i }) => i !== leadIndex);

  const open = (i: number) => {
    last.current = i;
    setOpenIndex(i);
  };
  const close = () => {
    setOpenIndex(null);
    triggers.current[last.current]?.focus();
  };

  // Only tall pictures (phone screens): a row of tall tiles at their own ratio, two per row on phones.
  // The slots (documents) sit under them in the same centred column.
  if (media.length >= 2 && media.every((m) => m.height > m.width)) {
    const three = media.length === 3;
    return (
      <>
        <div className={cn("mx-auto", media.length === 2 ? "max-w-xl" : three ? "max-w-2xl" : "max-w-3xl")}>
          <div className={cn("grid grid-cols-2 gap-3", three && "sm:grid-cols-3", media.length > 3 && "sm:grid-cols-4")}>
            {media.map((m, i) => (
              <Tile
                key={m.src}
                media={m}
                onOpen={() => open(i)}
                buttonRef={(el) => {
                  triggers.current[i] = el;
                }}
              />
            ))}
          </div>
          {Children.count(children) > 0 && <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>}
        </div>
        {openIndex !== null && (
          <MediaLightbox items={viewerItems} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
        )}
      </>
    );
  }

  // Four or more items: a wider mosaic (a wide lead, a square, then pairs) with the slots under it.
  if (media.length >= 4) {
    const spans = [
      "col-span-2 aspect-[2/1] sm:col-span-4",
      "col-span-2 aspect-[4/3] sm:col-span-2 sm:aspect-square",
    ];
    return (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {media.map((m, i) => (
            <Tile
              key={m.src}
              media={m}
              cover
              className={spans[i] ?? "aspect-[3/2] sm:col-span-3"}
              onOpen={() => open(i)}
              buttonRef={(el) => {
                triggers.current[i] = el;
              }}
            />
          ))}
        </div>
        {children && <div className="mt-3 grid gap-3 sm:grid-cols-3">{children}</div>}
        {openIndex !== null && (
          <MediaLightbox items={viewerItems} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-3",
          portraitIndex >= 0 ? "sm:grid-cols-[9rem_minmax(0,1fr)]" : "sm:grid-cols-[15rem_minmax(0,1fr)]",
        )}
      >
        <Tile
          media={lead}
          className={portraitIndex >= 0 ? "mx-auto w-40 sm:w-full" : "mx-auto w-56 sm:w-full"}
          onOpen={() => open(leadIndex)}
          buttonRef={(el) => {
            triggers.current[leadIndex] = el;
          }}
        />
        <div className="grid grid-cols-2 content-start gap-3">
          {others.map(({ m, i }) => (
            <Tile
              key={m.src}
              media={m}
              cover
              className="aspect-[16/10]"
              onOpen={() => open(i)}
              buttonRef={(el) => {
                triggers.current[i] = el;
              }}
            />
          ))}
          {children}
        </div>
      </div>

      {openIndex !== null && (
        <MediaLightbox items={viewerItems} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
      )}
    </>
  );
}
