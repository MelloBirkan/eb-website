/* A tiny highlighter for the guide's code blocks. It returns escaped HTML with
   one span per token; the colors are the .tk-* rules in site.css. */

type Rule = { re: RegExp; cls: string }

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** At each position the earliest match wins, so a comment swallows what is inside it. */
function tokenize(src: string, rules: Rule[]) {
  let i = 0
  let out = ''
  while (i < src.length) {
    let at = -1
    let len = 0
    let cls = ''
    for (const r of rules) {
      r.re.lastIndex = i
      const m = r.re.exec(src)
      if (m && m[0].length && (at === -1 || m.index < at)) {
        at = m.index
        len = m[0].length
        cls = r.cls
      }
    }
    if (at === -1) {
      out += escapeHtml(src.slice(i))
      break
    }
    out += escapeHtml(src.slice(i, at))
    out += `<span class="${cls}">${escapeHtml(src.slice(at, at + len))}</span>`
    i = at + len
  }
  return out
}

const SHELL: Rule[] = [
  { re: /#[^\n]*/g, cls: 'tk-cmt' },
  { re: /"[^"\n]*"/g, cls: 'tk-str' },
  { re: /\$[A-Z_][A-Z0-9_]*/g, cls: 'tk-var' },
  // Slash commands and @ mentions, and the program at the start of a line.
  { re: /(?<=^|\n)(?:[/@][\w:.<>-]+|codex|claude|curl|export|rm|sudo|xcrun|xcode-select|xcodebuild)/g, cls: 'tk-cmd' },
  // Flags only after a space, so the hyphens inside evenbetter-ios stay plain.
  { re: /(?<=\s)--?[A-Za-z][\w-]*/g, cls: 'tk-flag' },
  { re: /(?<=[\s=])\d+\b/g, cls: 'tk-num' },
]

const JSON_RULES: Rule[] = [
  { re: /"(?:[^"\\]|\\.)*"(?=\s*:)/g, cls: 'tk-key' },
  { re: /"(?:[^"\\]|\\.)*"/g, cls: 'tk-str' },
  { re: /\b(?:true|false|null)\b/g, cls: 'tk-num' },
  { re: /-?\d+(?:\.\d+)?/g, cls: 'tk-num' },
]

const TOML: Rule[] = [
  { re: /#[^\n]*/g, cls: 'tk-cmt' },
  { re: /^\[[^\]\n]+\]|(?<=\n)\[[^\]\n]+\]/g, cls: 'tk-key' },
  { re: /"[^"\n]*"/g, cls: 'tk-str' },
  { re: /\b(?:true|false)\b/g, cls: 'tk-num' },
]

export function highlight(code: string, lang: string) {
  const l = lang.toLowerCase()
  if (l.includes('json')) return tokenize(code, JSON_RULES)
  if (l === 'toml') return tokenize(code, TOML)
  if (l === 'url' || l === 'text') return escapeHtml(code)
  return tokenize(code, SHELL)
}
