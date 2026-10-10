import Image from "next/image";
import { Scaled } from "@/components/Scaled";
import { SlotMachine } from "@/components/case-study/SlotMachine";
import { TicketRow } from "@/components/TicketRow";
import type { HeroShowcase } from "@/content/projects";
import { cn } from "@/lib/cn";

/** A real screenshot of the product in a drawn browser window (the window chrome adds no text: three
 *  dots in the page's colours and an empty address pill), with a drawn, animated element (the slot machine)
 *  floating over its bottom-right corner and breaking out of the frame. Its loops sit under `TicketRow`, so
 *  they pause off screen, and are off for reduced motion. The bottom padding leaves room for the part of it
 *  that hangs below the window. */
export function ProductShowcase({
  showcase,
  className,
  priority,
}: {
  showcase: HeroShowcase;
  className?: string;
  /** Load the screenshot eagerly (it is near the top of the page). */
  priority?: boolean;
}) {
  const { desktop, popout } = showcase;

  return (
    <TicketRow className={cn("relative pb-4 sm:pb-12", className)}>
      <div className="shadow-hard overflow-hidden rounded-2xl border-2 border-foreground bg-foreground">
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          <span className="ml-3 hidden h-5 w-56 max-w-[45%] rounded-full bg-white/10 sm:block" />
        </div>
        <Image
          src={desktop.src}
          alt={desktop.alt}
          width={desktop.width}
          height={desktop.height}
          sizes="(min-width: 896px) 848px, 100vw"
          priority={priority}
          className="block h-auto w-full"
        />
      </div>

      {/* The drawn slot machine (the page's hero cabinet again, 220x262 natural) floats over the corner. It
          sways and bobs on its own, so no extra float here. Scaled (not CSS zoom, which older Safari
          ignores): about half size on phones so it does not cover the screenshot, near natural from `sm`.
          Its coins and lever stick out ~30px past the cabinet, so it is set inside the window's edge. The body is
          near-black like the dark screenshot behind it, so it gets a white outline here (the `cs-sway` div is
          the body; a ring follows its rounded corners and stacks with its own shadow). */}
      {popout === "slot-machine" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-3 right-5 sm:bottom-0 sm:right-10 [&_.cs-sway]:ring-[3px] [&_.cs-sway]:ring-white"
        >
          <Scaled width={220} height={262} scale={0.5} className="sm:hidden">
            <SlotMachine />
          </Scaled>
          <Scaled width={220} height={262} scale={0.96} className="hidden sm:block">
            <SlotMachine />
          </Scaled>
        </div>
      )}
    </TicketRow>
  );
}
