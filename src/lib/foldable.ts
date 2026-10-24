import { useSyncExternalStore } from "react";

/** Is this a foldable iPhone (the iPhone Duo)? Safari 27.1 on it can expose the Device Posture API
 *  (`navigator.devicePosture`) and the Viewport Segments API (`window.viewport`), both behind feature flags
 *  for now, and Apple asks sites to use feature detection rather than user-agent or size sniffing. So this is
 *  "Apple WebKit on an iPhone that exposes one of those two foldable APIs"; Android foldables are left out on
 *  purpose, and a plain phone or a desktop never matches, whatever its window size.
 *
 *  Testing without a Duo: open any page with `?device=duo` (remembered for the tab's session) and
 *  `?device=off` to forget it again. Same `subscribe`/`getSnapshot` shape as `LiveCount`; the answer cannot
 *  change during a visit, so there is nothing to subscribe to. */
let cached: boolean | null = null;

function detect(): boolean {
  try {
    const flag = new URLSearchParams(window.location.search).get("device");
    if (flag === "duo") window.sessionStorage.setItem("device", "duo");
    else if (flag === "off") window.sessionStorage.removeItem("device");
    if (window.sessionStorage.getItem("device") === "duo") return true;
  } catch {
    // Storage can be blocked (private window): the detection below still works without the override.
  }
  const iphone = /iPhone/.test(navigator.userAgent);
  return iphone && ("devicePosture" in navigator || "viewport" in window);
}

const subscribe = () => () => {};
const getSnapshot = () => (cached ??= detect());
const getServerSnapshot = () => false;

export function useFoldableIphone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
