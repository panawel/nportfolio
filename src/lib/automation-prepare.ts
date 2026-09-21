import type { AutomationExample, CueKind, VideoSpec } from "@/content/automation";
import { tokenizeLine, type Token } from "@/lib/python-highlight";

export type PreparedCue = {
  t: number;
  /** First line of the statement (0-based) and its last line (a statement can continue over several lines). */
  start: number;
  end: number;
  /** api cues: the last line of the `with` body; the response wait is shown until the run leaves it. */
  blockEnd: number;
  kind: CueKind;
  label: string;
  chip?: string;
};

export type PreparedExample = {
  id: AutomationExample["id"];
  title: string;
  viewport: string;
  fn: string;
  file: string;
  lines: Token[][];
  /** Lines that get a check mark once run (not blank, not comment-only). */
  executable: boolean[];
  video: VideoSpec;
  cues: PreparedCue[];
};

const indentOf = (line: string) => line.length - line.trimStart().length;

/** Bracket balance of a line, ignoring strings and comments. */
function balance(line: string): number {
  const bare = line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""').replace(/#.*$/, "");
  let depth = 0;
  for (const ch of bare) {
    if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
  }
  return depth;
}

/** Resolves the text-anchored cues to line numbers. Runs at build time (server component); a cue whose text
 *  cannot be found throws, so a typo in the data fails the build instead of silently highlighting nothing. */
export function prepareExample(ex: AutomationExample): PreparedExample {
  const raw = ex.code.split("\n");
  let from = 0;
  const cues: PreparedCue[] = ex.cues.map((cue) => {
    const start = raw.findIndex((line, i) => i >= from && line.includes(cue.at));
    if (start < 0) throw new Error(`Automation cue not found in ${ex.id} code: "${cue.at}" (after line ${from + 1})`);

    // A statement continues while brackets are open or the line ends with a backslash.
    let end = start;
    let depth = balance(raw[start]);
    while (end + 1 < raw.length && (depth > 0 || raw[end].trimEnd().endsWith("\\"))) {
      end++;
      depth += balance(raw[end]);
    }

    let blockEnd = end;
    if (cue.kind === "api") {
      const base = indentOf(raw[start]);
      while (blockEnd + 1 < raw.length && raw[blockEnd + 1].trim() !== "" && indentOf(raw[blockEnd + 1]) > base) blockEnd++;
    }

    from = start;
    return { t: cue.t, start, end, blockEnd, kind: cue.kind, label: cue.label, chip: cue.chip };
  });

  return {
    id: ex.id,
    title: ex.title,
    viewport: ex.viewport,
    fn: ex.fn,
    file: ex.file,
    lines: raw.map(tokenizeLine),
    executable: raw.map((line) => line.trim() !== "" && !line.trim().startsWith("#")),
    video: ex.video,
    cues,
  };
}
