import { Barcode, Package, Sparkle, TicketPercent, Truck } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// A drawn shopping cart (no words), 10s loop: five products drop into it one by one (the cart bumps at
// each landing), a barcode chip keeps scanning beside it, and near the end a delivery van drives across the
// road below; then everything fades and restarts. Coordinates are px in a 200 x 150 box (the cart).
// Loops sit under TicketRow, so they pause off screen; with reduced motion the products simply sit in the
// cart and the van stays hidden.
const items = [
  { cls: "cs-item-1", left: 66, top: 70, box: "h-[30px] w-4 rounded-[3px] bg-white", inner: "top-0 h-2.5 w-full bg-accent-2" },
  { cls: "cs-item-2", left: 84, top: 84, box: "h-4 w-7 rounded-xl bg-accent", inner: null },
  { cls: "cs-item-3", left: 112, top: 80, box: "h-5 w-5 rounded-full bg-foreground", inner: "-top-1 left-2 h-2 w-1.5 rotate-45 rounded-full bg-accent" },
  { cls: "cs-item-4", left: 132, top: 74, box: "h-[26px] w-4 rounded-md bg-accent-2", inner: "top-2 h-1.5 w-full bg-white" },
  { cls: "cs-item-5", left: 148, top: 78, box: "h-[22px] w-[22px] rounded-[4px] bg-accent", inner: "top-2 h-1.5 w-full bg-foreground" },
];

function Wheel({ left }: { left: number }) {
  return (
    <span className="absolute top-[123px] block h-[18px] w-[18px] rounded-full border-[3px] border-foreground bg-white" style={{ left }}>
      <span className="cs-wheel absolute inset-0 block">
        <span className="absolute left-1/2 top-0 -ml-px block h-full w-0.5 bg-foreground/60" />
        <span className="absolute left-0 top-1/2 -mt-px block h-0.5 w-full bg-foreground/60" />
      </span>
    </span>
  );
}

export function ShoppingCartHero({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto h-[340px] w-[208px]", className)}>
      <div aria-hidden className="absolute inset-0">
        <FloatingIcon icon={Package} className="-left-7 top-[22px]" rotate={-8} />
        <FloatingIcon icon={TicketPercent} tone="accent-2" className="-right-8 top-[44px]" delay={1.2} rotate={8} />
        <Sparkle className="cs-blink absolute right-3 top-[104px] h-4 w-4 fill-accent-2 text-foreground" />

        {/* The barcode chip with a scan line. */}
        <span className="absolute left-2 top-[62px] grid h-12 w-12 place-items-center overflow-hidden rounded-xl border-2 border-foreground bg-accent-2 text-on-accent-2">
          <Barcode className="h-7 w-7" />
          <span className="cs-beam absolute inset-x-1 top-2 h-0.5 rounded-full bg-accent" />
        </span>

        {/* The cart. */}
        <div className="cs-cart-bump absolute left-1 top-[130px] h-[150px] w-[200px]">
          <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" fill="none">
            <polygon points="46,34 192,34 170,102 62,102" fill="#ffffff" />
          </svg>

          {items.map((it) => (
            <span key={it.cls} className={cn(it.cls, "absolute z-10 block border-2 border-foreground", it.box)} style={{ left: it.left, top: it.top }}>
              {it.inner && <span className={cn("absolute block", it.inner)} />}
            </span>
          ))}

          <svg viewBox="0 0 200 150" className="absolute inset-0 z-20 h-full w-full" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <g className="text-foreground">
              <polyline points="6,12 36,12 52,104" strokeWidth="4.5" />
              <polygon points="46,34 192,34 170,102 62,102" strokeWidth="3.5" />
              <g strokeWidth="2" opacity="0.35">
                <line x1="82.5" y1="34" x2="89" y2="102" />
                <line x1="119" y1="34" x2="116" y2="102" />
                <line x1="155.5" y1="34" x2="143" y2="102" />
                <line x1="51.4" y1="57" x2="184.6" y2="57" />
                <line x1="56.8" y1="80" x2="177.1" y2="80" />
              </g>
              <line x1="70" y1="102" x2="78" y2="123" strokeWidth="3.5" />
              <line x1="164" y1="102" x2="158" y2="123" strokeWidth="3.5" />
            </g>
          </svg>
          <span className="absolute inset-0 z-20">
            <Wheel left={69} />
            <Wheel left={149} />
          </span>
        </div>

        {/* The road and the delivery van. */}
        <span className="absolute inset-x-0 bottom-1 border-t-2 border-dashed border-foreground/25" />
        <span className="cs-van absolute bottom-2 left-0 flex items-center gap-1 opacity-0">
          <span className="flex flex-col gap-1">
            {[10, 16, 8].map((w) => (
              <span key={w} className="block h-0.5 rounded-full bg-foreground/40" style={{ width: w }} />
            ))}
          </span>
          <span className="grid h-9 w-12 place-items-center rounded-lg border-2 border-foreground bg-accent text-foreground">
            <Truck className="h-5 w-5" />
          </span>
        </span>
      </div>
    </TicketRow>
  );
}
