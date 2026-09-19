import { TicketRow } from "@/components/TicketRow";

// A drawn popcorn bucket (no words) on its own: striped orange and white, a lime rim, fluffy popcorn on
// top and kernels popping up and falling back, all in the project's two colours. The loop sits under
// TicketRow, so it pauses off screen; kernels are hidden until their pop starts.
const kernels = [
  { x: -40, y: -84, delay: 0 },
  { x: 22, y: -104, delay: 0.35 },
  { x: -14, y: -96, delay: 0.7 },
  { x: 40, y: -80, delay: 1.05 },
  { x: -28, y: -108, delay: 1.4 },
  { x: 8, y: -90, delay: 1.75 },
  { x: 30, y: -100, delay: 2.1 },
  { x: -46, y: -76, delay: 2.45 },
];

/** `scale` shrinks the whole drawing (1 = 200 x 228px): the bucket, the kernels and how far they fly. */
export function PopcornHero({ className, scale = 1 }: { className?: string; scale?: number }) {
  const w = 200 * scale;
  const h = 228 * scale;
  return (
    <div aria-hidden className={className}>
      <TicketRow className="mx-auto w-fit">
        <div className="relative" style={{ width: w, height: h }}>
        {kernels.map((k) => (
          <span
            key={k.delay}
            className="cs-kernel absolute left-1/2 rounded-full border-foreground bg-white opacity-0"
            style={
              {
                top: 48 * scale,
                width: 16 * scale,
                height: 16 * scale,
                borderWidth: Math.max(1, 2 * scale),
                "--kx": `${k.x * 1.3 * scale}px`,
                "--ky": `${k.y * 1.3 * scale}px`,
                animationDelay: `${k.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
        <div className="cs-sway">
          <svg viewBox="0 0 84 96" width={w} height={h} fill="none" strokeLinejoin="round">
            {/* fluffy popcorn on top */}
            {[
              [24, 32, 9],
              [39, 23, 11],
              [56, 25, 10],
              [67, 34, 8],
              [46, 34, 9],
            ].map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.2" />
            ))}
            {/* striped bucket */}
            <path d="M14 42 H70 L62 92 H22 Z" fill="#ffffff" />
            <path d="M22.5 42 H33.5 L30 92 H26 Z" fill="var(--accent-2)" />
            <path d="M44.5 42 H56 L52 92 H48.5 Z" fill="var(--accent-2)" />
            <path d="M14 42 H70 L62 92 H22 Z" stroke="#0a0a0a" strokeWidth="2.2" />
            <rect x="11" y="38" width="62" height="8" rx="4" fill="var(--accent)" stroke="#0a0a0a" strokeWidth="2.2" />
          </svg>
        </div>
        </div>
      </TicketRow>
    </div>
  );
}
