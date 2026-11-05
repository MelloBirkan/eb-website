'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { CORPUS, type Severity } from '../corpus-data'
import { EASE_OUT, SPRING } from '../motion'

type Field = 'id' | 'meta' | 'source' | 'check' | 'why' | 'correct'

const CRITERIA: { name: string; text: string; fields: Field[] }[] = [
  { name: 'Observável', text: 'Aparece no código SwiftUI ou no comportamento da interface.', fields: ['check'] },
  { name: 'Rastreável', text: 'Aponta para uma fonte pública e estável, com data de consulta.', fields: ['source'] },
  { name: 'Verificável', text: 'Vira uma checagem concreta, com justificativa e orientação de correção.', fields: ['why', 'correct'] },
]

const LABELS: Record<Field, string> = {
  id: 'ID estável',
  meta: 'Severidade e dimensão',
  source: 'Fonte e data',
  check: 'Verificação',
  why: 'Justificativa',
  correct: 'Código correto',
}

function Row({ field, lit, dim, children }: { field: Field; lit: boolean; dim: boolean; children: React.ReactNode }) {
  return (
    <div className="relative grid gap-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4">
      <p
        className={`pt-0.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors duration-300 ${
          lit ? 'text-brand' : 'text-ink-3'
        }`}
      >
        {LABELS[field]}
      </p>
      <motion.div
        animate={{ opacity: dim ? 0.38 : 1 }}
        transition={{ duration: 0.3 }}
        className={`relative rounded-xl px-3 py-2 transition-[background-color,box-shadow] duration-300 ${
          lit ? 'bg-mint/60 shadow-[inset_0_0_0_1.5px_var(--s-brand)]' : ''
        }`}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** A real corpus clause with the admission criteria linked to the parts that satisfy them. */
export function ClauseAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  // -1: nothing picked. The tour walks the criteria once, then waits for clicks.
  const [picked, setPicked] = useState(-1)
  const [checked, setChecked] = useState(0)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!inView || touched || checked >= CRITERIA.length) return
    const t = setTimeout(
      () => {
        setPicked(checked)
        setChecked((c) => c + 1)
      },
      checked === 0 ? 500 : 1700,
    )
    return () => clearTimeout(t)
  }, [inView, touched, checked])

  useEffect(() => {
    if (touched || checked < CRITERIA.length) return
    const t = setTimeout(() => setPicked(-1), 1900)
    return () => clearTimeout(t)
  }, [checked, touched])

  const lit = picked >= 0 ? CRITERIA[picked].fields : []
  const anyLit = lit.length > 0
  const row = (f: Field) => ({ field: f, lit: lit.includes(f), dim: anyLit && !lit.includes(f) })

  return (
    <div ref={ref} className="mt-12 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
      <div>
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Entra no corpus se for</p>
        <ul className="mt-4 grid gap-2">
          {CRITERIA.map((c, i) => {
            const on = picked === i
            const done = touched || checked > i
            return (
              <li key={c.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setTouched(true)
                    setPicked(on ? -1 : i)
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-300 ${
                    on ? 'border-brand/40 bg-mint/50' : 'border-line bg-card hover:border-line-2'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300 ${
                      done ? 'border-brand bg-brand text-on-brand' : 'border-line-2'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden>
                      <motion.path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: done ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-semibold text-ink">{c.name}</span>
                    <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{c.text}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-[13.5px] leading-snug text-ink-3">
          Orientação só aspiracional vira justificativa de outra cláusula ou fica de fora.
        </p>
      </div>

      <figure className="rounded-[28px] border border-line bg-card p-4 shadow-[0_30px_80px_-45px_rgba(15,37,35,.4)] sm:p-6">
        <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="font-mono text-[12px] text-ink-3">corpus/ios/accessibility.md</span>
          <span className="text-[12.5px] text-ink-3">Cláusula real, como está no corpus</span>
        </figcaption>
        <div lang="en" className="grid gap-2.5">
          <Row {...row('id')}>
            <p className="font-mono text-[15px] font-semibold text-ink">A11Y-UI-001</p>
            <p className="text-[15px] font-medium text-ink">Label meaningful images and icon buttons</p>
          </Row>
          <Row {...row('meta')}>
            <p className="flex flex-wrap gap-1.5 font-mono text-[12px]">
              <span className="rounded-full border border-crit/35 bg-crit/8 px-2 py-0.5 text-crit">error</span>
              <span className="rounded-full border border-line-2 px-2 py-0.5 text-ink-2">ui</span>
              <span className="rounded-full border border-line-2 px-2 py-0.5 text-ink-2">ios</span>
            </p>
          </Row>
          <Row {...row('source')}>
            <a
              href="https://developer.apple.com/documentation/swiftui/view/accessibilitylabel(_:)"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-[14.5px] font-medium"
            >
              Apple Developer: accessibilityLabel
            </a>
            <p className="font-mono text-[12px] text-ink-3">Retrieved 2026-05-02</p>
          </Row>
          <Row {...row('check')}>
            <p className="text-[14.5px] leading-relaxed text-ink">
              Flag <code className="inline-code">Image(systemName:)</code>, image-only <code className="inline-code">Button</code>,
              toolbar icon controls, or custom icon controls that lack a visible text label and lack{' '}
              <code className="inline-code">.accessibilityLabel(...)</code>.
            </p>
          </Row>
          <Row {...row('why')}>
            <p className="text-[14.5px] leading-relaxed text-ink">
              VoiceOver users need a meaningful name for non-text controls and images.
            </p>
          </Row>
          <Row {...row('correct')}>
            <pre className="overflow-x-auto rounded-xl bg-night p-3.5 font-mono text-[12.5px] leading-[1.7] text-on-night">
              <code>
                <span className="text-glow">Button</span>(action: close) {'{'}
                {'\n'}
                {'    '}
                <span className="text-glow">Image</span>(systemName: <span className="text-[#ffd59e]">&quot;xmark&quot;</span>)
                {'\n'}
                {'}'}
                {'\n'}.<span className="text-glow">accessibilityLabel</span>(<span className="text-[#ffd59e]">&quot;Close&quot;</span>)
              </code>
            </pre>
          </Row>
        </div>
      </figure>
    </div>
  )
}

const SEV_ORDER: Severity[] = ['error', 'warning', 'info']
const SEV_TONE: Record<Severity, string> = { error: 'bg-crit', warning: 'bg-high', info: 'bg-med' }
const SEV_LABEL: Record<Severity, string> = { error: 'Erro', warning: 'Aviso', info: 'Info' }
const MAX = Math.max(...CORPUS.map((d) => d.clauses.length))

/** Clauses per domain, split by severity. */
export function DomainBars() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <div ref={ref} className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Cláusulas por domínio</p>
        <p className="flex gap-3 text-[12.5px] text-ink-2">
          {SEV_ORDER.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`size-2.5 rounded-[3px] ${SEV_TONE[s]}`} aria-hidden />
              {SEV_LABEL[s]}
            </span>
          ))}
        </p>
      </div>
      <ul className="mt-5 grid gap-3">
        {CORPUS.map((d, row) => {
          const counts = SEV_ORDER.map((s) => d.clauses.filter((c) => c.severity === s).length)
          return (
            <li key={d.id} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_24px] items-center gap-3">
              <span className="text-[14px] leading-tight text-ink">{d.name}</span>
              <span
                className="flex h-3 overflow-hidden rounded-full bg-paper-2"
                role="img"
                aria-label={`${d.name}: ${d.clauses.length} cláusulas, ${counts[0]} de erro, ${counts[1]} de aviso e ${counts[2]} de info`}
              >
                <motion.span
                  className="flex h-full origin-left"
                  style={{ width: `${(d.clauses.length / MAX) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 + row * 0.07 }}
                >
                  {counts.map((n, i) =>
                    n ? <span key={SEV_ORDER[i]} className={`h-full ${SEV_TONE[SEV_ORDER[i]]}`} style={{ flex: n }} /> : null,
                  )}
                </motion.span>
              </span>
              <motion.span
                className="num text-right font-mono text-[13px] font-semibold text-ink"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ ...SPRING.ui, delay: 0.5 + row * 0.07 }}
              >
                {d.clauses.length}
              </motion.span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
