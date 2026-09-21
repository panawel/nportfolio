// A tiny Python tokenizer for the "Automation Example" code panes (single-line tokens only: the shown code has no
// multi-line strings). It only has to colour this one file well, so there is no highlighter library.
export type TokenKind = "kw" | "str" | "num" | "com" | "def" | "bi" | "plain";
export type Token = [text: string, kind: TokenKind];

const KEYWORDS = new Set([
  "import", "from", "as", "def", "return", "with", "while", "if", "else", "for", "in", "not", "and", "or",
  "assert", "lambda", "is", "None", "True", "False", "self", "pass",
]);
const BUILTINS = new Set(["len", "set", "print", "str", "int", "dict", "list"]);

const TOKEN = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let afterDef = false;
  const push = (text: string, kind: TokenKind) => {
    const last = tokens[tokens.length - 1];
    if (last && last[1] === kind) last[0] += text;
    else tokens.push([text, kind]);
  };
  for (const m of line.matchAll(TOKEN)) {
    const [text, com, str, num, word, space] = m;
    if (com) push(text, "com");
    else if (str) push(text, "str");
    else if (num) push(text, "num");
    else if (word) {
      if (afterDef) push(text, "def");
      else if (KEYWORDS.has(text)) push(text, "kw");
      else if (BUILTINS.has(text)) push(text, "bi");
      else push(text, "plain");
      afterDef = text === "def";
    } else if (space) push(text, "plain");
    else push(text, "plain");
  }
  return tokens;
}
