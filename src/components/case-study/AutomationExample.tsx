import type { AutomationExample as AutomationData } from "@/content/automation";
import { prepareExample } from "@/lib/automation-prepare";
import { AutomationPlayer } from "@/components/case-study/AutomationPlayer";

/** The "Automation Example" section: resolves the code and cues at build time, then hands them to the client player. */
export function AutomationExample({ examples }: { examples: AutomationData[] }) {
  return <AutomationPlayer examples={examples.map(prepareExample)} />;
}
