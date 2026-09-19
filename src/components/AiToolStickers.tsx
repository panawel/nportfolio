"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aiTools } from "@/content/profile";

// Hand-placed, deliberately uneven positions (percent of the board) rather than a grid, so it
// reads as stickers pressed onto a pinboard. One entry per tool, in the order of `aiTools`;
// extra tools wrap around via modulo.
const spots = [
  { left: 5, top: 7, tilt: -8, size: "h-16 w-16 sm:h-20 sm:w-20" },
  { left: 66, top: 8, tilt: 6, size: "h-16 w-16 sm:h-20 sm:w-20" },
  { left: 32, top: 12, tilt: -3, size: "h-20 w-20 sm:h-24 sm:w-24" },
  { left: 38, top: 61, tilt: 5, size: "h-16 w-16 sm:h-20 sm:w-20" },
  { left: 6, top: 52, tilt: 7, size: "h-16 w-16 sm:h-20 sm:w-20" },
  { left: 68, top: 56, tilt: -6, size: "h-16 w-16 sm:h-20 sm:w-20" },
];

export function AiToolStickers() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md sm:aspect-[6/5]">
      <motion.div
        aria-hidden
        className="absolute inset-0 -rotate-2 rounded-[2rem] bg-shell"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <ul aria-label="AI tools I work with" className="absolute inset-0">
        {aiTools.map((tool, i) => {
          const spot = spots[i % spots.length];
          return (
            <li
              key={tool.label}
              tabIndex={0}
              className="group absolute rounded-2xl outline-none hover:z-20 focus-visible:z-20"
              style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
            >
              {/* Three nested layers so the transforms never fight: scroll pop-in (motion) ->
                  float + tilt (CSS keyframes) -> hover scale (CSS transition). */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + i * 0.08 }}
              >
                <div
                  className="animate-float"
                  style={
                    {
                      animationDelay: `${i * 0.7}s`,
                      "--float-rot": `${spot.tilt}deg`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`shadow-hard-sm relative flex items-center justify-center rounded-2xl bg-white transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-foreground group-focus-visible:ring-offset-2 ${spot.size}`}
                  >
                    {tool.icon && (
                      <Image
                        src={tool.icon}
                        alt={tool.label}
                        width={96}
                        height={96}
                        className="h-[72%] w-[72%] object-contain"
                      />
                    )}
                    {/* Name label: revealed on hover/keyboard focus; always shown on touch devices,
                        where hover doesn't exist. Screen readers get the name from the image alt. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 font-mono text-[11px] text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      {tool.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
