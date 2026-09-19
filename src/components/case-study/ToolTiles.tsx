import Image from "next/image";
import { Gauge, MonitorSmartphone, Network, type LucideIcon } from "lucide-react";
import { techStack } from "@/content/profile";
import { Pill } from "@/components/Pill";
import { cn } from "@/lib/cn";

const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
const stackItems = techStack.flatMap((group) => group.items);

/** Finds a logo for a tool name: the longest tech-stack label it contains ("JIRA + AIO Test" -> Jira),
 *  or the project's own logo for an SDK. */
type Logo = { src: string; invert?: boolean; zoom?: number };

function logoFor(tool: string, projectLogo: string | null): Logo | null {
  const name = tool.toLowerCase();
  if (projectLogo && /\bsdk\b/.test(name)) return { src: projectLogo };
  const match = stackItems
    .filter((item) => item.icon && name.includes(item.label.toLowerCase()))
    .sort((a, b) => b.label.length - a.label.length)[0];
  return match ? { src: match.icon!, invert: match.invert, zoom: match.zoom } : null;
}

// Tools that have no logo file but a recognisable job get a generic icon tile instead of a text pill.
const iconTiles: { test: RegExp; Icon: LucideIcon }[] = [
  { test: /jmeter/i, Icon: Gauge },
  { test: /memu|emulator/i, Icon: MonitorSmartphone },
  { test: /fiddler|proxy/i, Icon: Network },
];

/** Tools as logo tiles like the homepage Tech Stack (tool names unchanged); a tool with no logo keeps
 *  its text pill. */
export function ToolTiles({ tools, projectLogo }: { tools: string[]; projectLogo: string | null }) {
  return (
    <ul className="mt-4 flex flex-wrap items-start gap-x-3 gap-y-4">
      {tools.map((tool, i) => {
        const logo = logoFor(tool, projectLogo);
        if (!logo) {
          const generic = iconTiles.find((t) => t.test.test(tool));
          if (!generic) {
            return (
              <li key={tool}>
                <Pill>{tool}</Pill>
              </li>
            );
          }
          return (
            <li key={tool} className="group flex w-20 flex-col items-center gap-2">
              <div
                className={cn(
                  "shadow-hard-sm flex h-12 w-12 items-center justify-center rounded-xl bg-white transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:rotate-0",
                  tilts[i % tilts.length],
                )}
              >
                <generic.Icon className="h-6 w-6 text-foreground" strokeWidth={1.75} />
              </div>
              <span className="rounded-sm px-1 text-center text-xs font-medium leading-tight text-foreground/80 transition-[color,box-shadow] duration-200 group-hover:text-foreground group-hover:shadow-[inset_0_-0.4em_0_var(--accent)]">
                {tool}
              </span>
            </li>
          );
        }
        const icon = logo;
        return (
          <li key={tool} className="group flex w-20 flex-col items-center gap-2">
            <div
              className={cn(
                "shadow-hard-sm flex h-12 w-12 items-center justify-center rounded-xl bg-white transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:rotate-0",
                tilts[i % tilts.length],
              )}
            >
              <Image
                src={icon.src}
                alt=""
                aria-hidden
                width={40}
                height={40}
                loading="eager"
                className={cn("h-7 w-7 object-contain", icon.invert && "invert")}
                style={icon.zoom ? { scale: icon.zoom } : undefined}
              />
            </div>
            <span className="rounded-sm px-1 text-center text-xs font-medium leading-tight text-foreground/80 transition-[color,box-shadow] duration-200 group-hover:text-foreground group-hover:shadow-[inset_0_-0.4em_0_var(--accent)]">
              {tool}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
