"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type MediaItem = { type: "image" | "video"; src: string; caption: string; poster?: string };

const roundButton =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:border-accent hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const SWIPE_PX = 50;

/** Full-screen viewer for one credential's documents, photos and video: counter, caption, arrows,
 *  a thumbnail strip, keyboard (Esc, arrows, Tab kept inside) and swipe on touch screens.
 *  The parent owns the open index and returns focus to the trigger when `onClose` runs. */
export function MediaLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: MediaItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const count = items.length;
  const active = items[index];

  const step = (delta: number) => onIndexChange((index + delta + count) % count);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onIndexChange, onClose]);

  // Swipe (touch only, and only on images so a video's own controls keep working).
  const swipeHandlers =
    active.type === "image"
      ? {
          onPointerDown: (e: React.PointerEvent) => {
            swipeStart.current = e.pointerType === "touch" ? e.clientX : null;
          },
          onPointerUp: (e: React.PointerEvent) => {
            if (swipeStart.current === null) return;
            const dx = e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (dx > SWIPE_PX) step(-1);
            else if (dx < -SWIPE_PX) step(1);
          },
        }
      : {};

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${active.caption || "Media"} (${index + 1} of ${count})`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 text-white"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 sm:p-5">
        <span className="font-mono text-xs tracking-wide text-white/70">
          {index + 1} / {count}
        </span>
        <button ref={closeRef} onClick={onClose} className={roundButton} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        {count > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className={cn(roundButton, "absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-black/50 sm:left-5")}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className={cn(roundButton, "absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-black/50 sm:right-5")}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div
          className="flex max-w-full items-center justify-center [touch-action:pan-y]"
          onClick={(e) => e.stopPropagation()}
          {...swipeHandlers}
        >
          {active.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- the viewer needs the image's natural aspect ratio, unknown ahead of time; not an LCP element
            <img
              src={active.src}
              alt={active.caption}
              draggable={false}
              className="max-h-[calc(100svh-15rem)] max-w-full rounded-lg object-contain"
            />
          ) : (
            <video
              key={active.src}
              src={active.src}
              poster={active.poster}
              controls
              autoPlay
              // Small recordings are shown about twice their size, so they are worth opening.
              className="max-h-[calc(100svh-15rem)] min-h-[min(24rem,calc(100svh-15rem))] max-w-full rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-4 pb-4 pt-3 sm:pb-5" onClick={(e) => e.stopPropagation()}>
        {active.caption && (
          <p className="max-w-xl rounded-full bg-white/10 px-4 py-1.5 text-center text-xs text-white/90">
            {active.caption}
          </p>
        )}
        {count > 1 && (
          <div className="flex max-w-full gap-2 overflow-x-auto p-1">
            {items.map((item, i) => (
              <button
                key={item.src}
                onClick={() => onIndexChange(i)}
                aria-label={item.caption ? `Show ${item.caption}` : `Show item ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  i === index ? "opacity-100 ring-2 ring-accent" : "opacity-60 hover:opacity-100",
                )}
              >
                {item.type === "video" ? (
                  <>
                    {item.poster && <Image src={item.poster} alt="" fill sizes="48px" className="object-cover" />}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                  </>
                ) : (
                  <Image src={item.src} alt="" fill sizes="48px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
