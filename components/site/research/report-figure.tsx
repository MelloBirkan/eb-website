'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'motion/react'
import { EASE_OUT, SPRING } from '../motion'
import { TiltOnScroll } from '../tilt-on-scroll'

// Positions are percentages of public/research/relatorio-aroma-care.jpg (1340 × 1035).
const SPOTS = [
  { x: 10, y: 19.5, title: 'Total de achados', text: '55 no app Aroma Care. Os dez participantes acharam esse número.' },
  { x: 29.3, y: 33.5, title: 'Severidade', text: '15 críticos e 40 altos. Os cartões filtram a lista por nível.' },
  { x: 87.7, y: 66, title: 'Prompts de correção', text: 'Um prompt pronto por achado, para entregar ao agente.' },
  { x: 29, y: 76, title: 'Cláusula, arquivo e linha', text: 'Cada achado cita a cláusula do corpus e aponta onde está no código.' },
]

/** The audit report participants read, with numbered spots that zoom into each part. */
export function ReportFigure() {
  const [active, setActive] = useState<number | null>(null)
  const spot = active === null ? null : SPOTS[active]
  // The hotspots hide while zoomed and the close button unmounts on close, so
  // focus is handed between them instead of dropping to the page.
  const spotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const focusClose = useRef(false)

  useEffect(() => {
    if (spot && focusClose.current) closeRef.current?.focus({ preventScroll: true })
    focusClose.current = false
  }, [spot])

  function close() {
    const i = active
    setActive(null)
    if (i !== null) requestAnimationFrame(() => spotRefs.current[i]?.focus({ preventScroll: true }))
  }

  return (
    <div className="mt-12">
      <TiltOnScroll>
        <figure className="overflow-hidden rounded-[22px] border border-white/10 bg-night shadow-[0_40px_100px_-40px_rgba(5,14,13,.6)]">
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="ml-2 truncate font-mono text-[11.5px] text-on-night-3">
              .evenbetter/aroma-care/evenbetter-analyze-report.html
            </span>
          </div>
          <div className="relative aspect-[1340/1035] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{
                scale: spot ? 1.9 : 1,
                originX: spot ? spot.x / 100 : 0.5,
                originY: spot ? spot.y / 100 : 0.5,
              }}
              transition={{ ...SPRING.gentle, stiffness: 90 }}
            >
              <Image
                src="/research/relatorio-aroma-care.jpg"
                alt="Relatório HTML do EvenBetter para o app Aroma Care: 55 achados no total, 15 críticos e 40 altos, uma seção de prompts de correção prontos para copiar e a lista de achados com cláusula, arquivo e linha."
                fill
                sizes="(min-width: 1280px) 900px, (min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
            </motion.div>
            {SPOTS.map((s, i) => {
              const hidden = active !== null
              return (
                <motion.button
                  key={s.title}
                  ref={(el) => {
                    spotRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => {
                    focusClose.current = true
                    setActive(i)
                  }}
                  aria-label={`Ampliar: ${s.title}`}
                  tabIndex={hidden ? -1 : 0}
                  className="hit absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-glow font-mono text-[12.5px] font-semibold text-night shadow-[0_0_0_4px_rgba(182,239,217,.25)]"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, pointerEvents: hidden ? 'none' : 'auto' }}
                  initial={false}
                  animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.5 : 1 }}
                  transition={{ ...SPRING.lively, delay: hidden ? 0 : 0.25 + i * 0.05 }}
                >
                  <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-glow/50 [animation-duration:2.2s] [animation-iteration-count:3]" />
                  <span className="relative">{i + 1}</span>
                </motion.button>
              )
            })}
            {spot && (
              <motion.button
                ref={closeRef}
                type="button"
                onClick={close}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING.ui}
                className="absolute top-3 right-3 rounded-full bg-night/85 px-3.5 py-2 text-[13px] font-medium text-on-night backdrop-blur"
              >
                Ver o relatório inteiro
              </motion.button>
            )}
          </div>
        </figure>
      </TiltOnScroll>

      <div className="mt-6">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Toque num número para ampliar</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {SPOTS.map((s, i) => {
            const on = active === i
            return (
              <li key={s.title}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(on ? null : i)}
                  className={`flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-300 ${
                    on ? 'border-brand/40 bg-mint/50' : 'border-line bg-card hover:border-line-2'
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12.5px] font-semibold ${
                      on ? 'bg-brand text-on-brand' : 'bg-paper-2 text-ink-2'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{s.title}</span>
                    <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{s.text}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const PARTS = [
  'Arquivo e linha',
  'Evidência',
  'Domínio',
  'Severidade',
  'Cláusula do corpus',
  'Impacto esperado',
  'Correção mínima',
  'Correção recomendada',
  'Prompt de correção',
]

/** What every finding carries. */
export function FindingParts() {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <ul ref={ref} className="flex flex-wrap gap-2">
      {PARTS.map((p, i) => (
        <motion.li
          key={p}
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ ...SPRING.lively, delay: i * 0.05 }}
          className={`rounded-full border px-3.5 py-1.5 text-[14px] ${
            i >= 6 ? 'border-brand/35 bg-mint/50 text-brand-ink' : 'border-line-2 bg-card text-ink'
          }`}
        >
          {p}
        </motion.li>
      ))}
    </ul>
  )
}

const FROM = [
  { label: 'Erro', tone: 'bg-crit' },
  { label: 'Aviso', tone: 'bg-high' },
  { label: 'Info', tone: 'bg-med' },
]
const TO = [
  { label: 'Crítica', tone: 'border-crit/40 text-crit' },
  { label: 'Alta', tone: 'border-high/40 text-high' },
  { label: 'Média', tone: 'border-med/40 text-med' },
  { label: 'Baixa', tone: 'border-low/40 text-low' },
]
const LINKS: [number, number][] = [
  [0, 0],
  [1, 1],
  [1, 2],
  [2, 3],
]
const R = 40
const G = 10
const yTo = (i: number) => i * (R + G) + R / 2
const HT = 4 * R + 3 * G
// The three corpus rows are centred against the four report rows.
const yFrom = (i: number) => (HT - (3 * R + 2 * G)) / 2 + i * (R + G) + R / 2

/** Corpus severities (3 levels) map to the report's four. */
export function SeverityMap() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <div ref={ref} className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
      <div className="grid grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] items-start gap-0">
        <div>
          <p className="mb-3 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">No corpus</p>
          <div className="relative" style={{ height: HT }}>
            {FROM.map((f, i) => (
              <p
                key={f.label}
                className="absolute inset-x-0 flex h-10 items-center gap-2 rounded-xl bg-paper-2 px-3 text-[14px] font-medium text-ink"
                style={{ top: yFrom(i) - R / 2 }}
              >
                <span className={`size-2.5 rounded-[3px] ${f.tone}`} aria-hidden />
                {f.label}
              </p>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 64 ${HT}`} width="64" height={HT} className="mt-[30px] overflow-visible" aria-hidden>
          {LINKS.map(([a, b], i) => (
            <motion.path
              key={i}
              d={`M0 ${yFrom(a)} C 32 ${yFrom(a)}, 32 ${yTo(b)}, 64 ${yTo(b)}`}
              fill="none"
              stroke="var(--s-line-2)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
            />
          ))}
        </svg>
        <div>
          <p className="mb-3 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">No relatório</p>
          <div className="grid gap-[10px]">
            {TO.map((t) => (
              <p key={t.label} className={`flex h-10 items-center rounded-xl border bg-card px-3 text-[14px] font-semibold ${t.tone}`}>
                {t.label}
              </p>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 text-[14px] leading-relaxed text-ink-2">
        Um aviso vira alta quando a regra é firme e o impacto é claro, e média quando o sinal no código é mais fraco. A
        validação reajusta a severidade de cada achado.
      </p>
    </div>
  )
}
