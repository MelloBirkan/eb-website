'use client'

import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, stagger } from 'motion/react'
import { ScrambleText } from 'motion-plus/react'
import { CORPUS, CLAUSE_COUNT, type Clause, type Severity } from './corpus-data'
import { ArrowUpRight } from './icons'
import { SPRING } from './motion'

const SEVERITY: Record<Severity, { label: string; tile: string; solid: string; chip: string }> = {
  error: {
    label: 'Erro',
    tile: 'bg-crit/12 text-crit border-crit/25',
    solid: 'bg-crit text-white border-crit',
    chip: 'text-crit border-crit/35 bg-crit/8',
  },
  warning: {
    label: 'Aviso',
    tile: 'bg-high/12 text-high border-high/25',
    solid: 'bg-high text-white border-high',
    chip: 'text-high border-high/35 bg-high/8',
  },
  info: {
    label: 'Info',
    tile: 'bg-med/12 text-med border-med/25',
    solid: 'bg-med text-white border-med',
    chip: 'text-med border-med/35 bg-med/8',
  },
}

const DIMENSION: Record<Clause['dimension'], string> = { ui: 'UI', ux: 'UX', accessibility: 'Acessibilidade' }

type Filter = 'all' | Severity

const ROWS = CORPUS.map((d) => ({ ...d, clauses: d.clauses }))
const FLAT = ROWS.flatMap((d, row) => d.clauses.map((c, col) => ({ clause: c, domain: d.name, row, col })))
const COUNTS = FLAT.reduce(
  (acc, { clause }) => ({ ...acc, [clause.severity]: acc[clause.severity] + 1 }),
  { error: 0, warning: 0, info: 0 } as Record<Severity, number>,
)

function shortLabel(id: string) {
  // TYPO-A11Y-001 → ["A11Y", "001"]
  const [, dim, n] = id.split('-')
  return [dim, n] as const
}

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MONTHS[m - 1]} de ${y}`
}

export function CorpusExplorer() {
  const [selected, setSelected] = useState('A11Y-UI-001')
  const [filter, setFilter] = useState<Filter>('all')
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())

  const current = useMemo(() => FLAT.find((f) => f.clause.id === selected) ?? FLAT[0], [selected])

  function move(e: KeyboardEvent<HTMLDivElement>) {
    const i = FLAT.findIndex((f) => f.clause.id === selected)
    const { row, col } = FLAT[i]
    let next: (typeof FLAT)[number] | undefined
    if (e.key === 'ArrowRight') next = FLAT[Math.min(FLAT.length - 1, i + 1)]
    else if (e.key === 'ArrowLeft') next = FLAT[Math.max(0, i - 1)]
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const target = ROWS[row + (e.key === 'ArrowDown' ? 1 : -1)]
      if (target) next = FLAT.find((f) => f.domain === target.name && f.col === Math.min(col, target.clauses.length - 1))
    } else if (e.key === 'Home') next = FLAT[0]
    else if (e.key === 'End') next = FLAT[FLAT.length - 1]
    if (!next) return
    e.preventDefault()
    setSelected(next.clause.id)
    tileRefs.current.get(next.clause.id)?.focus()
  }

  const { clause } = current
  const sev = SEVERITY[clause.severity]

  return (
    <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por severidade">
          {(['all', 'error', 'warning', 'info'] as Filter[]).map((f) => {
            const on = filter === f
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f)}
                className={`relative inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[14px] font-medium transition-colors ${
                  on ? 'border-ink bg-ink text-paper' : 'border-line-2 text-ink-2 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {f !== 'all' && (
                  <span
                    aria-hidden
                    className={`size-2.5 rounded-[3px] ${f === 'error' ? 'bg-crit' : f === 'warning' ? 'bg-high' : 'bg-med'}`}
                  />
                )}
                {f === 'all' ? `Todas · ${CLAUSE_COUNT}` : `${SEVERITY[f].label} · ${COUNTS[f]}`}
              </button>
            )
          })}
        </div>

        <LayoutGroup id="corpus">
          <motion.div
            role="group"
            aria-label="Cláusulas do corpus por domínio. Use as setas para navegar."
            onKeyDown={move}
            className="mt-8 space-y-3.5 sm:space-y-3"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
          >
            {ROWS.map((d, row) => (
              <div key={d.id} className="grid items-center gap-x-5 gap-y-1.5 sm:grid-cols-[168px_minmax(0,1fr)]">
                <p className="flex items-baseline justify-between gap-2 text-[14.5px] font-medium text-ink sm:block">
                  {d.name}
                  <span className="ml-2 font-mono text-[12px] text-ink-3">{d.clauses.length}</span>
                </p>
                <div className="grid grid-cols-9 gap-1 sm:flex sm:flex-wrap sm:gap-1.5">
                  {d.clauses.map((c, col) => {
                    const on = c.id === selected
                    const dim = filter !== 'all' && c.severity !== filter
                    const [kind, n] = shortLabel(c.id)
                    const s = SEVERITY[c.severity]
                    return (
                      <motion.div
                        key={c.id}
                        className="aspect-square sm:size-12"
                        variants={{
                          hidden: { opacity: 0, scale: 0.4 },
                          shown: { opacity: 1, scale: 1, transition: { ...SPRING.lively, delay: (row + col) * 0.03 } },
                        }}
                      >
                        <button
                          ref={(el) => {
                            if (el) tileRefs.current.set(c.id, el)
                            else tileRefs.current.delete(c.id)
                          }}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${c.id}: ${c.title}. ${s.label}.`}
                          tabIndex={on ? 0 : -1}
                          onClick={() => setSelected(c.id)}
                          className={`relative grid size-full place-items-center rounded-[10px] border font-mono leading-[1.15] font-semibold transition-[opacity,background-color,color,translate,scale] duration-200 hover:-translate-y-0.5 active:scale-95 sm:rounded-[12px] ${
                            on ? s.solid : s.tile
                          } ${dim ? 'opacity-20' : ''}`}
                        >
                          {on && (
                            <motion.span
                              layoutId="corpus-ring"
                              transition={SPRING.ui}
                              aria-hidden
                              className="absolute -inset-[4px] rounded-[13px] border-2 border-ink sm:rounded-[15px]"
                            />
                          )}
                          <span aria-hidden className="hidden text-[10px] sm:block">
                            {kind}
                            <br />
                            {n}
                          </span>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </LayoutGroup>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[28px] border border-line bg-card p-6 shadow-[0_30px_80px_-40px_rgba(15,37,35,.35)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] tracking-[0.14em] text-ink-3 uppercase">{current.domain}</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={clause.severity}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={SPRING.lively}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[12px] font-semibold ${sev.chip}`}
              >
                {sev.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="mt-5 font-mono text-[22px] font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
            <span className="sr-only">{clause.id}</span>
            <ScrambleText
              key={clause.id}
              aria-hidden
              duration={0.5}
              delay={stagger(0.025)}
              interval={0.04}
              chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"
            >
              {clause.id}
            </ScrambleText>
          </p>

          <div className="min-h-[124px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={clause.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)', transition: { duration: 0.12 } }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="mt-3 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-ink">{clause.title}</h3>
                <p lang="en" className="mt-2 text-[14.5px] text-ink-3 italic">
                  {clause.titleEn}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 border-t border-line pt-5 text-[14.5px]">
            <dt className="text-ink-3">Dimensão</dt>
            <dd className="text-ink">{DIMENSION[clause.dimension]}</dd>
            <dt className="text-ink-3">Fonte</dt>
            <dd className="min-w-0">
              <a
                href={clause.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link font-medium [overflow-wrap:anywhere]"
              >
                {clause.source}
                <ArrowUpRight size={14} className="ml-1 inline-block align-[-2px]" />
              </a>
            </dd>
            <dt className="text-ink-3">Consultada</dt>
            <dd className="text-ink">{formatDate(clause.retrieved)}</dd>
          </dl>

          <p className="mt-6 rounded-2xl bg-paper-2 p-4 text-[14px] leading-relaxed text-ink-2">
            No corpus, cada cláusula também traz a verificação que o agente faz no código, a justificativa e um exemplo de
            código correto.
          </p>
        </div>
      </div>
    </div>
  )
}
