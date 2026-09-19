import { KeyRound, Lock, MessageCircle, ShieldCheck, Sparkle } from "lucide-react";
import { FloatingIcon } from "@/components/FloatingIcon";
import { TicketRow } from "@/components/TicketRow";
import { cn } from "@/lib/cn";

// Two drawn phones with a lock between them (no words). 10s loop: a blue message pops on the left phone,
// is locked (end-to-end encrypted) as it leaves, passes the lock badge, arrives on the right phone and
// unlocks into a lime bubble; the right phone types and sends a blue reply that travels back the same way.
// Positions are px inside the 208 x 318 box (see the keyframes in globals.css). Loops sit under TicketRow,
// so they pause off screen; with reduced motion the four bubbles stay put and the packets stay hidden.
const bubble = "absolute grid h-6 place-items-center border-2 border-foreground";

function Phone({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative h-[176px] w-[92px] rounded-[22px] bg-foreground p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-white">
        <span className="absolute left-1/2 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground" />
        <div className="flex h-9 items-end gap-1.5 bg-accent-2 px-2 pb-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-white/80" />
          <span className="h-1.5 w-8 rounded-full bg-foreground/60" />
        </div>
        {children}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1">
          <span className="h-4 flex-1 rounded-full bg-foreground/10" />
          <span className="h-4 w-4 rounded-full bg-accent-2" />
        </div>
      </div>
    </div>
  );
}

function Line({ w }: { w: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-foreground/60", w)} />;
}

function Packet({ kind }: { kind: "fwd" | "back" }) {
  const back = kind === "back";
  return (
    <span
      className={cn(
        "absolute left-0 top-0 z-30 grid h-6 w-6 place-items-center rounded-lg border-2 border-foreground opacity-0",
        back ? "cs-packet-back bg-accent-2 text-on-accent-2" : "cs-packet-fwd bg-accent text-foreground",
      )}
    >
      <MessageCircle className="h-3.5 w-3.5" />
      <span
        className={cn(
          "absolute inset-0 grid place-items-center rounded-md bg-foreground text-accent opacity-0",
          back ? "cs-lockfade-back" : "cs-lockfade-fwd",
        )}
      >
        <Lock className="h-3 w-3" />
      </span>
    </span>
  );
}

export function SecurePhones({ className }: { className?: string }) {
  return (
    <TicketRow className={cn("relative mx-auto h-[318px] w-[208px]", className)}>
      <div aria-hidden className="absolute inset-0">
        <FloatingIcon icon={ShieldCheck} className="-left-8 top-[232px]" rotate={-8} />
        <FloatingIcon icon={KeyRound} tone="accent-2" className="-right-8 top-12" delay={1.2} rotate={8} />
        <Sparkle className="cs-blink absolute right-6 top-1 h-4 w-4 fill-accent-2 text-foreground" />

        {/* The two packets that fly between the phones. */}
        <Packet kind="fwd" />
        <Packet kind="back" />

        {/* Left phone (sends first). */}
        <div className="absolute left-0 top-2 -rotate-6">
          <div className="cs-sway">
            <Phone>
              <span className={cn(bubble, "cs-msg-a-out right-2 top-[44px] w-14 origin-bottom-right rounded-xl rounded-br-sm bg-accent-2")}>
                <Line w="w-8" />
              </span>
              <span className={cn(bubble, "cs-msg-a-in left-2 top-[78px] w-11 origin-bottom-left rounded-xl rounded-bl-sm bg-accent")}>
                <Line w="w-6" />
              </span>
            </Phone>
          </div>
        </div>

        {/* Right phone (receives, then replies). */}
        <div className="absolute right-0 top-[132px] rotate-6">
          <div className="cs-sway" style={{ animationDelay: "-2.5s" }}>
            <Phone>
              <span className={cn(bubble, "cs-msg-b-in left-2 top-[44px] w-14 origin-bottom-left rounded-xl rounded-bl-sm bg-accent")}>
                <Line w="w-8" />
              </span>
              <span className="cs-typing-b absolute right-2 top-[78px] flex h-6 w-11 items-center justify-center gap-1 rounded-xl border-2 border-foreground/30 bg-white opacity-0">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="cs-blink h-1 w-1 rounded-full bg-foreground" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </span>
              <span className={cn(bubble, "cs-msg-b-out right-2 top-[78px] w-11 origin-bottom-right rounded-xl rounded-br-sm bg-accent-2")}>
                <Line w="w-6" />
              </span>
            </Phone>
          </div>
        </div>

        {/* The lock badge between them, with signal rings. */}
        <span className="absolute left-1/2 top-[152px] z-20 -ml-6 h-12 w-12">
          {[0, 1.2].map((d) => (
            <span
              key={d}
              className="cs-wave absolute inset-0 rounded-full border-2 border-accent-2"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
          <span className="cs-lock-snap relative grid h-full w-full place-items-center rounded-full border-2 border-accent bg-foreground text-accent">
            <Lock className="h-5 w-5" />
          </span>
        </span>
      </div>
    </TicketRow>
  );
}
