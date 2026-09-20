import { Scaled } from "@/components/Scaled";
import { cn } from "@/lib/cn";

type Kind = "iphone" | "android" | "pixel" | "native" | "browser" | "laptop" | "dex";

/** Picks a silhouette from the words of a device line (the line itself stays as text next to it). */
function kindOf(name: string): Kind | null {
  if (/\bdex\b/i.test(name)) return "dex";
  if (/native|webview/i.test(name)) return "native";
  if (/iphone|ios/i.test(name)) return "iphone";
  if (/pixel|galaxy|oneplus|redmi|nord|xiaomi|poco|motorola/i.test(name)) return "pixel";
  if (/tablet|samsung|android/i.test(name)) return "android";
  if (/surface|yoga|laptop|macbook/i.test(name)) return "laptop";
  if (/windows|macos|chrome|safari|firefox|opera/i.test(name)) return "browser";
  return null;
}

const shell = "relative border-2 border-foreground bg-white shadow-hard-sm";

function Phone({ big, notch, delay, wrapper }: { big?: boolean; notch?: boolean; delay: number; wrapper?: boolean }) {
  return (
    <div className={cn(shell, "rounded-[12px]", big ? "h-28 w-14" : "h-24 w-12")}>
      {notch ? (
        <span className="absolute left-1/2 top-0 h-1.5 w-5 -translate-x-1/2 rounded-b-md bg-foreground" />
      ) : (
        <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-foreground" />
      )}
      <span
        className="cs-screen-on absolute inset-x-1.5 bottom-1.5 top-4 rounded-md bg-foreground/[0.08]"
        style={{ animationDelay: `${delay}s` }}
      />
      {wrapper && (
        // A native wrapper around an embedded web view.
        <span
          className="cs-blink absolute inset-x-3 bottom-3 top-7 rounded-[5px] border-2 border-dashed border-foreground/70"
          style={{ animationDelay: `${delay}s` }}
        />
      )}
    </div>
  );
}

/** How much smaller than drawn the silhouettes are shown (see `Scaled`; not CSS `zoom`, older Safari ignores it). */
const DEVICE_SCALE = 0.5;

/** Natural size (px) of each silhouette as drawn below, needed to size the scaled box. */
const SIZES: Record<Kind, [number, number]> = {
  pixel: [56, 112],
  iphone: [48, 96],
  native: [48, 96],
  android: [152, 96],
  browser: [128, 80],
  dex: [136, 82],
  laptop: [112, 76],
};

function Silhouette({ kind, i }: { kind: Kind; i: number }) {
  const delay = i * 1.4;
  switch (kind) {
    case "iphone":
      return <Phone notch delay={delay} />;
    case "pixel":
      return <Phone big delay={delay} />;
    case "native":
      return <Phone notch wrapper delay={delay} />;
    case "android":
      // Samsung tablet and handset side by side.
      return (
        <div className="flex items-end gap-2">
          <div className={cn(shell, "h-16 w-24 rounded-[12px]")}>
            <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground" />
            <span
              className="cs-screen-on absolute inset-y-1.5 left-4 right-1.5 rounded-md bg-foreground/[0.08]"
              style={{ animationDelay: `${delay}s` }}
            />
          </div>
          <Phone delay={delay + 0.6} />
        </div>
      );
    case "dex":
      // Samsung DEX: a phone driving a desktop-style monitor over a cable.
      return (
        <div className="relative flex flex-col items-center pb-1 pl-6">
          <div className={cn(shell, "h-[64px] w-28 rounded-lg")}>
            <span
              className="cs-screen-on absolute inset-1.5 rounded-md bg-foreground/[0.08]"
              style={{ animationDelay: `${delay}s` }}
            />
          </div>
          <span className="block h-2 w-8 bg-foreground" />
          <span className="block h-1.5 w-16 rounded-full bg-foreground" />
          <span className="absolute bottom-0 left-0 block h-11 w-7 rounded-lg border-2 border-foreground bg-white shadow-hard-sm">
            <span className="cs-screen-on absolute inset-1 rounded bg-foreground/[0.08]" style={{ animationDelay: `${delay + 0.6}s` }} />
          </span>
        </div>
      );
    case "laptop":
      // A laptop: screen on a base.
      return (
        <div className="flex flex-col items-center">
          <div className={cn(shell, "h-[68px] w-24 rounded-t-lg")}>
            <span
              className="cs-screen-on absolute inset-1.5 rounded-md bg-foreground/[0.08]"
              style={{ animationDelay: `${delay}s` }}
            />
          </div>
          <span className="block h-2 w-28 rounded-b-xl bg-foreground" />
        </div>
      );
    case "browser":
      // A desktop browser window.
      return (
        <div className={cn(shell, "h-20 w-32 rounded-lg")}>
          <div className="flex h-4 items-center gap-1 border-b-2 border-foreground px-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
            <span className="ml-1 h-1.5 flex-1 rounded-full bg-foreground/15" />
          </div>
          <span
            className="cs-screen-on absolute inset-x-1.5 bottom-1.5 top-6 rounded-md bg-foreground/[0.08]"
            style={{ animationDelay: `${delay}s` }}
          />
        </div>
      );
  }
}

/** One tile per device line, like the Tools tiles: the silhouette on top (phones with a notch for iPhone / iOS or a
 *  punch-hole for Pixel / Galaxy, a laptop for Surface / Yoga, a tablet and handset for Android / Samsung, a phone
 *  with a web-view frame for Native wrapper & WebView, a browser window for Windows & macOS) and the device's own
 *  text underneath. Screens light up in turn and the silhouettes sway gently. A line that matches none of
 *  these still shows its text (with an empty space above it). */
export function DeviceRow({ devices, className }: { devices: string[]; className?: string }) {
  if (devices.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-start gap-x-5 gap-y-5", className)}>
      {devices.map((device, i) => {
        const kind = kindOf(device);
        return (
          <li key={`${device}-${i}`} className="flex w-fit min-w-16 flex-col items-center gap-3">
            {/* A fixed-height stage (the tallest silhouette at DEVICE_SCALE), bottom aligned, so the labels line up. */}
            <div aria-hidden className="flex h-14 items-end justify-center">
              {kind && (
                <Scaled width={SIZES[kind][0]} height={SIZES[kind][1]} scale={DEVICE_SCALE}>
                  <div
                    className="cs-sway"
                    style={{ animationDelay: `${i * -1.3}s`, "--screen": i % 2 ? "var(--accent-2)" : "var(--accent)" } as React.CSSProperties}
                  >
                    <Silhouette kind={kind} i={i} />
                  </div>
                </Scaled>
              )}
            </div>
            <span className="max-w-[8.5rem] rounded-sm px-1 text-center text-xs font-medium leading-tight text-foreground/80">
              {device}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
