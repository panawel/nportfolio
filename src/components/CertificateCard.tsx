"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Play } from "lucide-react";
import type { Certificate } from "@/content/profile";
import { MediaLightbox, type MediaItem } from "@/components/MediaLightbox";
import { cn } from "@/lib/cn";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2";

/** One credential: the framed certificate, its text, and a mosaic of photos and video. Every
 *  picture opens the shared viewer. The featured credential is roomier and gets a big first tile;
 *  the other one is a compact row, so the size difference carries the hierarchy. */
export function CertificateCard({ cert }: { cert: Certificate }) {
  const featured = cert.featured;
  const doc = cert.document;

  // items[0] is the certificate document; the mosaic tiles are items[1..], in the same order.
  const items: MediaItem[] = [
    { type: "image", src: doc.src, caption: doc.caption },
    ...cert.gallery.map((m): MediaItem => ({ type: "image", src: m.src, caption: m.caption })),
    ...(cert.video
      ? [{ type: "video" as const, src: cert.video.src, caption: cert.video.caption, poster: cert.video.poster }]
      : []),
  ];
  const tiles = items.slice(1);
  const bento = featured && tiles.length === 5;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastTrigger = useRef(0);

  const open = (index: number) => {
    lastTrigger.current = index;
    setOpenIndex(index);
  };
  const close = () => {
    setOpenIndex(null);
    triggerRefs.current[lastTrigger.current]?.focus();
  };

  const photoCount = cert.gallery.length;
  const moments = `${photoCount} ${photoCount === 1 ? "photo" : "photos"}${cert.video ? " + video" : ""}`;

  return (
    <article
      className={cn(
        "rounded-3xl border border-border bg-white shadow-sm",
        featured ? "p-6 sm:p-8" : "p-5 sm:p-6",
      )}
    >
      <div
        className={cn(
          "grid gap-6",
          featured ? "lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8" : "md:grid-cols-[9rem_minmax(0,1fr)]",
        )}
      >
        {/* The certificate itself, framed like a document on a mat and shown uncropped. */}
        <div className={featured ? "w-48 lg:w-full" : "w-32 md:w-full"}>
          <button
            ref={(el) => {
              triggerRefs.current[0] = el;
            }}
            onClick={() => open(0)}
            aria-label={`Open ${doc.caption}`}
            className={cn(
              "group relative block w-full rounded-xl border border-border bg-shell p-2.5 shadow-[0_12px_28px_-16px_rgb(0_0_0/0.4)] transition-shadow hover:shadow-[0_16px_34px_-14px_rgb(0_0_0/0.45)]",
              focusRing,
            )}
          >
            <Image
              src={doc.src}
              alt={doc.caption}
              width={doc.width ?? 3}
              height={doc.height ?? 4}
              sizes={featured ? "240px" : "144px"}
              className="h-auto w-full rounded-md"
            />
            <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-wide text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Maximize2 className="h-3 w-3" />
              View
            </span>
          </button>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{doc.caption}</p>
        </div>

        <div className="min-w-0">
          <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-wide text-muted-foreground md:hidden">
            {cert.date}
          </span>
          <h3 className={cn("font-semibold text-foreground", featured ? "text-2xl" : "text-lg")}>{cert.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
          <p className={cn("mt-3 max-w-prose text-foreground/80", featured ? "text-base" : "text-sm")}>
            {cert.description}
          </p>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Moments · {moments}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tiles.map((item, i) => {
              const index = i + 1;
              const big = bento && i === 0;
              const isVideo = item.type === "video";
              return (
                <button
                  key={item.src}
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  onClick={() => open(index)}
                  aria-label={isVideo ? `Play video: ${item.caption}` : `Open ${item.caption}`}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-xl border border-border bg-foreground",
                    big && "col-span-2 row-span-2 sm:aspect-auto",
                    focusRing,
                  )}
                >
                  {isVideo ? (
                    // The video's still frame; the file itself is only fetched when played in the viewer.
                    item.poster && (
                      <Image
                        src={item.poster}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 160px, 45vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    )
                  ) : (
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes={big ? "(min-width: 1024px) 320px, 90vw" : "(min-width: 1024px) 160px, 45vw"}
                      className="object-cover object-[50%_30%] transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}

                  {isVideo && (
                    <>
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-on-accent">
                          <Play className="h-4 w-4 fill-current" />
                        </span>
                      </span>
                      <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-wide text-accent">
                        Video
                      </span>
                    </>
                  )}

                  {/* The big tile always names itself; small tiles do on hover/focus (touch users
                      see the caption in the viewer). */}
                  <span
                    className={cn(
                      "pointer-events-none absolute rounded-md bg-white/90 px-2 py-1 text-left text-[10px] leading-tight text-foreground",
                      big
                        ? "bottom-3 left-3 text-[11px]"
                        : "inset-x-1.5 bottom-1.5 line-clamp-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    )}
                  >
                    {item.caption}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {openIndex !== null && (
        <MediaLightbox items={items} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
      )}
    </article>
  );
}
