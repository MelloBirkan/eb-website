'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  id: string
  kind: 'rota' | 'skill' | 'ref'
  title: string
  section: string
  href: string
}

const ITEMS: Item[] = [
  { id: 'home', kind: 'rota', title: 'Início', section: 'Páginas', href: '/' },
  { id: 'about', kind: 'rota', title: 'Sobre o EvenBetter', section: 'Páginas', href: '/about' },
  { id: 'codex', kind: 'rota', title: 'Guia · Codex', section: 'Tutoriais', href: '/tutorial/codex' },
  { id: 'anthropic', kind: 'rota', title: 'Guia · Claude Code', section: 'Tutoriais', href: '/tutorial/anthropic' },
  { id: 'ios', kind: 'rota', title: 'Guia · Plugin iOS', section: 'Tutoriais', href: '/tutorial/plugins/ios' },

  { id: 's-feature', kind: 'skill', title: 'evenbetter-ios-feature', section: 'Planejamento', href: '/tutorial/plugins/ios#planejamento-ux' },
  { id: 's-epic', kind: 'skill', title: 'evenbetter-ios-epic', section: 'Planejamento', href: '/tutorial/plugins/ios#planejamento-ux' },
  { id: 's-op', kind: 'skill', title: 'evenbetter-app-opportunity-research', section: 'Planejamento', href: '/tutorial/plugins/ios#planejamento-ux' },
  { id: 's-launch', kind: 'skill', title: 'evenbetter-app-launcher', section: 'Planejamento', href: '/tutorial/plugins/ios#planejamento-ux' },
  { id: 's-design', kind: 'skill', title: 'evenbetter-design', section: 'SwiftUI', href: '/tutorial/plugins/ios#swiftui' },
  { id: 's-ui', kind: 'skill', title: 'evenbetter-swiftui-ui-patterns', section: 'SwiftUI', href: '/tutorial/plugins/ios#swiftui' },
  { id: 's-vr', kind: 'skill', title: 'evenbetter-swiftui-view-refactor', section: 'SwiftUI', href: '/tutorial/plugins/ios#swiftui' },
  { id: 's-lg', kind: 'skill', title: 'evenbetter-swiftui-liquid-glass', section: 'SwiftUI', href: '/tutorial/plugins/ios#swiftui' },
  { id: 's-an', kind: 'skill', title: 'evenbetter-analyze', section: 'Auditoria', href: '/tutorial/plugins/ios#auditoria' },
  { id: 's-vd', kind: 'skill', title: 'evenbetter-validate', section: 'Auditoria', href: '/tutorial/plugins/ios#auditoria' },
  { id: 's-pa', kind: 'skill', title: 'evenbetter-swiftui-performance-audit', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-a11y', kind: 'skill', title: 'evenbetter-swiftui-accessibility', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-haptics', kind: 'skill', title: 'evenbetter-ios-haptics', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-ai', kind: 'skill', title: 'evenbetter-ios-app-intents', section: 'Sistema', href: '/tutorial/plugins/ios#sistema' },
  { id: 's-dbg', kind: 'skill', title: 'evenbetter-ios-debugger-agent', section: 'Sistema', href: '/tutorial/plugins/ios#sistema' },

  { id: 'r-hig', kind: 'ref', title: 'Apple HIG', section: 'Referências', href: '/about#referencias' },
  { id: 'r-wcag', kind: 'ref', title: 'WCAG 2.2', section: 'Referências', href: '/about#referencias' },
]

function fuzzyMatch(query: string, item: Item): number {
  if (!query) return 1
  const q = query.toLowerCase()
  const fields = [item.title, item.section, item.kind].join(' ').toLowerCase()
  if (fields.includes(q)) return 2
  // sequential-letter fallback
  let i = 0
  for (const ch of fields) {
    if (ch === q[i]) i++
    if (i === q.length) return 1
  }
  return 0
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Component is unmounted when closed (return null below), so opening
  // remounts with fresh state — no manual reset needed. Just focus the input.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [])

  const results = useMemo(() => {
    return ITEMS
      .map((i) => ({ i, score: fuzzyMatch(q, i) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.i)
  }, [q])

  // Reset selection on every query change. Single targeted setState — fine.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActive(0) }, [q])

  const choose = useCallback(
    (item: Item) => {
      router.push(item.href)
      onClose()
    },
    [router, onClose]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(results.length - 1, a + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(0, a - 1))
      } else if (e.key === 'Enter') {
        const item = results[active]
        if (item) {
          e.preventDefault()
          choose(item)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, active, choose, onClose])

  if (!open) return null

  return (
    <div className="eb-overlay" onClick={onClose} role="presentation">
      <div className="eb-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Buscar">
        <div className="eb-modal-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--eb-ink-3)' }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar páginas, skills, referências…"
            aria-label="Buscar"
          />
          <span className="eb-kbd">esc</span>
        </div>
        <div className="eb-results" role="listbox">
          {results.length === 0 ? (
            <div className="eb-empty-results">Nada encontrado para &ldquo;{q}&rdquo;</div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={i === active}
                className={`eb-result ${i === active ? 'active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(item)}
              >
                <span className="eb-result-kind">{item.kind}</span>
                <span className="eb-result-title">{item.title}</span>
                <span className="eb-result-section">{item.section}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
