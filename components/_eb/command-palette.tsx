'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { SPRING } from '../site/motion'
import { Search } from '../site/icons'

type Item = {
  id: string
  kind: 'página' | 'pesquisa' | 'skill' | 'guia'
  title: string
  section: string
  href: string
}

const ITEMS: Item[] = [
  { id: 'home', kind: 'página', title: 'Início', section: 'Páginas', href: '/' },
  { id: 'pesquisa', kind: 'página', title: 'Pesquisa: o artigo da JIIHC 2026', section: 'Páginas', href: '/pesquisa' },
  { id: 'about', kind: 'página', title: 'Sobre o projeto e a equipe', section: 'Páginas', href: '/about' },
  { id: 'about-historia', kind: 'página', title: 'História: da linha de comando ao plugin', section: 'Sobre', href: '/about#historia' },
  { id: 'about-equipe', kind: 'página', title: 'Equipe', section: 'Sobre', href: '/about#equipe' },
  { id: 'install', kind: 'página', title: 'Instalar o plugin', section: 'Início', href: '/#comecar' },
  { id: 'corpus', kind: 'página', title: 'Corpus: 49 cláusulas', section: 'Início', href: '/#corpus' },

  { id: 'p-contexto', kind: 'pesquisa', title: 'Contexto e perguntas de pesquisa', section: 'Pesquisa', href: '/pesquisa#contexto' },
  { id: 'p-comando', kind: 'pesquisa', title: 'Humano no comando', section: 'Pesquisa', href: '/pesquisa#comando' },
  { id: 'p-requisitos', kind: 'pesquisa', title: 'Requisitos R1 a R5', section: 'Pesquisa', href: '/pesquisa#requisitos' },
  { id: 'p-framework', kind: 'pesquisa', title: 'Arquitetura e camadas de contexto', section: 'Pesquisa', href: '/pesquisa#framework' },
  { id: 'p-metodo', kind: 'pesquisa', title: 'Método e participantes', section: 'Pesquisa', href: '/pesquisa#metodo' },
  { id: 'p-resultados', kind: 'pesquisa', title: 'Resultados: SUS 79,5', section: 'Pesquisa', href: '/pesquisa#resultados' },
  { id: 'p-limites', kind: 'pesquisa', title: 'Limites e próximos passos', section: 'Pesquisa', href: '/pesquisa#limites' },
  { id: 'p-citar', kind: 'pesquisa', title: 'Como citar', section: 'Pesquisa', href: '/pesquisa#citar' },
  { id: 'p-referencias', kind: 'pesquisa', title: 'As 25 referências do artigo', section: 'Pesquisa', href: '/pesquisa#referencias' },

  { id: 'codex', kind: 'guia', title: 'Guia: Codex', section: 'Guias', href: '/tutorial/codex' },
  { id: 'anthropic', kind: 'guia', title: 'Guia: Claude Code', section: 'Guias', href: '/tutorial/anthropic' },
  { id: 'ios', kind: 'guia', title: 'Guia: plugin iOS', section: 'Guias', href: '/tutorial/plugins/ios' },

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
  { id: 's-rp', kind: 'skill', title: 'evenbetter-repair', section: 'Auditoria', href: '/tutorial/plugins/ios#auditoria' },
  { id: 's-pa', kind: 'skill', title: 'evenbetter-swiftui-performance-audit', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-a11y', kind: 'skill', title: 'evenbetter-swiftui-accessibility', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-haptics', kind: 'skill', title: 'evenbetter-ios-haptics', section: 'Performance', href: '/tutorial/plugins/ios#performance' },
  { id: 's-ai', kind: 'skill', title: 'evenbetter-ios-app-intents', section: 'Sistema', href: '/tutorial/plugins/ios#sistema' },
  { id: 's-dbg', kind: 'skill', title: 'evenbetter-ios-debugger-agent', section: 'Sistema', href: '/tutorial/plugins/ios#sistema' },
]

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function score(query: string, item: Item): number {
  if (!query) return 1
  const q = normalize(query)
  const fields = normalize([item.title, item.section, item.kind].join(' '))
  if (normalize(item.title).startsWith(q)) return 3
  if (fields.includes(q)) return 2
  let i = 0
  for (const ch of fields) {
    if (ch === q[i]) i++
    if (i === q.length) return 1
  }
  return 0
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && <Palette key="palette" onClose={onClose} />}
    </AnimatePresence>
  )
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const t = setTimeout(() => inputRef.current?.focus(), 20)
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  const results = useMemo(
    () =>
      ITEMS.map((i) => ({ i, s: score(q, i) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 12)
        .map((r) => r.i),
    [q],
  )

  const choose = useCallback(
    (item: Item) => {
      router.push(item.href)
      onClose()
    },
    [router, onClose],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
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
    } else if (e.key === 'Tab') {
      // Keep focus on the search field while the dialog is open.
      e.preventDefault()
      inputRef.current?.focus()
    }
  }

  const activeId = results[active] ? `${listId}-${results[active].id}` : undefined

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-start justify-center bg-night/45 px-4 pt-[12vh] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no site"
        className="w-[600px] max-w-full overflow-hidden rounded-[28px] border border-line-2 bg-card text-ink shadow-[0_40px_120px_-30px_rgba(5,14,13,.55)]"
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={SPRING.ui}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Search size={18} className="text-ink-3" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            placeholder="Buscar páginas, seções e skills…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Buscar"
            className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="rounded-full border border-line px-2 py-0.5 font-mono text-xs text-ink-3">esc</kbd>
        </div>
        <div id={listId} role="listbox" aria-label="Resultados" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[15px] text-ink-3">Nada encontrado para &ldquo;{q}&rdquo;.</p>
          ) : (
            results.map((item, i) => (
              <div
                key={item.id}
                id={`${listId}-${item.id}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(item)}
                className="relative flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3"
              >
                {i === active && (
                  <motion.span
                    layoutId="palette-active"
                    className="absolute inset-0 rounded-2xl bg-mint"
                    transition={SPRING.snap}
                    aria-hidden
                  />
                )}
                <span className="relative w-[74px] shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {item.kind}
                </span>
                <span className="relative truncate text-[15px] font-medium">{item.title}</span>
                <span className="relative ml-auto hidden shrink-0 font-mono text-xs text-ink-3 sm:block">{item.section}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
