'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

/* ── html escape & syntax highlight ── */
export function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function tokenize(src: string, rules: { re: RegExp; cls: string }[]) {
  let i = 0, out = ''
  while (i < src.length) {
    let bestIdx = -1, bestLen = 0, bestCls = ''
    for (const r of rules) {
      r.re.lastIndex = i
      const m = r.re.exec(src)
      if (m && (bestIdx === -1 || m.index < bestIdx)) { bestIdx = m.index; bestLen = m[0].length; bestCls = r.cls }
    }
    if (bestIdx === -1) { out += escHtml(src.slice(i)); break }
    if (bestIdx > i) out += escHtml(src.slice(i, bestIdx))
    out += `<span class="${bestCls}">${escHtml(src.slice(bestIdx, bestIdx + bestLen))}</span>`
    i = bestIdx + bestLen
  }
  return out
}

export const hlBash = (s: string) => tokenize(s, [
  { re: /#[^\n]*/g, cls: 'eb-tk-cmt' },
  { re: /"[^"\n]*"/g, cls: 'eb-tk-str' },
  { re: /\$[A-Z_][A-Z0-9_]*/g, cls: 'eb-tk-var' },
  { re: /\bcurl\b/g, cls: 'eb-tk-cmd' },
  { re: /--?[A-Za-z][\w-]*/g, cls: 'eb-tk-flag' },
  { re: /\b\d+\b/g, cls: 'eb-tk-num' },
])

export const hlJson = (s: string) => tokenize(s, [
  { re: /"(?:[^"\\]|\\.)*"(?=\s*:)/g, cls: 'eb-tk-key' },
  { re: /"(?:[^"\\]|\\.)*"/g, cls: 'eb-tk-str' },
  { re: /\b(?:true|false|null)\b/g, cls: 'eb-tk-num' },
  { re: /-?\d+(?:\.\d+)?/g, cls: 'eb-tk-num' },
])

/* ── Icon ── */
export function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
    case 'arrow':  return <svg {...p}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>
    case 'chevron': return <svg {...p}><path d="m6 9 6 6 6-6" /></svg>
    case 'copy':   return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    case 'check':  return <svg {...p}><path d="M20 6 9 17l-5-5" /></svg>
    case 'play':   return <svg {...p} fill="currentColor" stroke="none"><path d="M5 3v18l15-9z" /></svg>
    case 'tip':    return <svg {...p}><path d="M12 2 L13.4 8.6 L20 10 L13.4 11.4 L12 18 L10.6 11.4 L4 10 L10.6 8.6 Z" /></svg>
    case 'warn':   return <svg {...p}><path d="M12 2 2 20h20z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    case 'note':   return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    default: return null
  }
}

/* ── Logo ── */
export const Logo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 19 L11 13 L13 15 L19 7" stroke="#1f4e4a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7 L19 7 L19 12" stroke="#1f4e4a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── CodeBlock ── */
export function CodeBlock({ lang = 'bash', code }: { lang?: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(code) } catch {
      const ta = document.createElement('textarea')
      ta.value = code; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 1400)
  }, [code])
  const html = lang.toLowerCase().includes('json') ? hlJson(code) : hlBash(code)
  return (
    <div className="eb-code">
      <div className="eb-code-head">
        <span className="eb-code-lang">{lang}</span>
        <button className={`eb-copy${copied ? ' copied' : ''}`} onClick={onCopy}>
          <Icon name={copied ? 'check' : 'copy'} size={11} />
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  )
}

/* ── Callout ── */
export function Callout({ kind = 'tip', title, children }: { kind?: string; title?: string; children: React.ReactNode }) {
  return (
    <div className={`eb-callout ${kind}`}>
      <div className="eb-callout-icon"><Icon name={kind} size={14} /></div>
      <div className="eb-callout-body">
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  )
}

/* ── SegmentedControl ── */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; hint?: string }[]
}) {
  return (
    <div className="eb-segmented" role="tablist" aria-label="Modo do tutorial">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`eb-segmented-opt${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <span className="eb-segmented-label">{opt.label}</span>
          {opt.hint && <span className="eb-segmented-hint">{opt.hint}</span>}
        </button>
      ))}
    </div>
  )
}

/* ── TutorialNav ── */
export function TutorialNav() {
  return (
    <div className="eb-nav-wrap">
      <nav className="eb-nav">
        <Link href="/" className="eb-brand">
          <span className="eb-brand-mark"><Logo /></span>
          EVENBETTER
        </Link>
        <div className="eb-nav-links">
          <Link href="/" className="eb-nav-link">Início</Link>
          <Link href="/tutorial/plugins/ios" className="eb-nav-link active">Guias</Link>
          <Link href="/about" className="eb-nav-link">Sobre</Link>
        </div>
        <div className="eb-nav-spacer" />
      </nav>
    </div>
  )
}
