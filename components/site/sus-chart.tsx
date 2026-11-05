'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { AnimateNumber } from 'motion-plus/react'
import { EASE_OUT, SPRING } from './motion'

/** Individual SUS scores from the JIIHC 2026 study (Fig. 3 of the paper). */
export const SUS_SCORES = [57.5, 60, 62.5, 77.5, 80, 82.5, 87.5, 92.5, 95, 100]
export const SUS_MEAN = 79.5
export const SUS_MEDIAN = 81.25
export const SUS_SD = 15.1
export const SUS_BENCHMARK = 68

// Adjective ranges of Bangor et al. (2009), as drawn in the paper.
const BANDS = [
  { label: 'OK', range: '52–71', from: 52, to: 72, tone: 'bg-med/[0.07]', dot: 'bg-med border-med', chip: 'border-med bg-med text-white' },
  { label: 'Bom', range: '72–84', from: 72, to: 85, tone: 'bg-brand/[0.07]', dot: 'bg-brand/60 border-brand', chip: 'border-brand bg-card text-brand-ink' },
  { label: 'Excelente', range: '≥ 85', from: 85, to: 100, tone: 'bg-brand/[0.14]', dot: 'bg-brand border-brand', chip: 'border-brand bg-brand text-on-brand' },
]

const MIN = 50
const MAX = 100
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100
const fmt = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
const bandOf = (v: number) => BANDS.find((b) => v >= b.from && v < b.to + (b.to === MAX ? 1 : 0)) ?? BANDS[0]

export function SusChart({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })

  return (
    <figure className={className}>
      <SusCompact />
      <div ref={ref} aria-hidden className="relative mx-3.5 hidden select-none sm:block">
        {/* Bands with their labels */}
        <div className="relative h-[170px] sm:h-[180px]">
          {BANDS.map((b, i) => (
            <motion.div
              key={b.label}
              className={`absolute inset-y-0 border-r border-line/60 ${b.tone}`}
              style={{ left: `${pct(b.from)}%`, width: `${pct(b.to) - pct(b.from)}%`, originX: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.12 }}
            >
              <p className="pt-3 text-center text-[12.5px] leading-tight font-semibold text-ink sm:text-[13.5px]">
                {b.label}
                <span className="block font-mono text-[11px] font-normal text-ink-3">{b.range}</span>
              </p>
            </motion.div>
          ))}

          {/* Benchmark line */}
          <motion.div
            className="absolute inset-y-0 w-px border-l border-dashed border-ink/40"
            style={{ left: `${pct(SUS_BENCHMARK)}%` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ delay: 0.6, duration: 0.5 }}
          />

          {/* One dot per participant. Labels alternate above and below so neighbours never touch. */}
          {SUS_SCORES.map((score, i) => {
            const below = i % 2 === 1
            return (
              <motion.div
                key={i}
                className="absolute bottom-[46px] -translate-x-1/2"
                style={{ left: `${pct(score)}%` }}
                initial={{ opacity: 0, y: -46 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ ...SPRING.lively, delay: 0.55 + i * 0.07 }}
              >
                <span className={`block size-3.5 rounded-full border-2 sm:size-4 ${bandOf(score).dot}`} />
                <span
                  className={`absolute left-1/2 -translate-x-1/2 font-mono text-[11px] leading-none font-medium whitespace-nowrap text-ink-2 ${
                    below ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
                  }`}
                >
                  {fmt(score)}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Axis */}
        <div className="relative h-7 border-t border-ink/70">
          {[50, 60, 70, 80, 90, 100].map((t) => (
            <span
              key={t}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center font-mono text-[11px] text-ink-3"
              style={{ left: `${pct(t)}%` }}
            >
              <span className="h-1.5 w-px bg-ink/70" />
              <span className="mt-1">{t}</span>
            </span>
          ))}
        </div>

        {/* Markers: benchmark, mean and median */}
        <div className="relative mt-3 h-12">
          <Marker at={SUS_BENCHMARK} side="left" glyph="diamond" inView={inView} delay={0.7}>
            <span className="text-ink-3">Referência</span>
            <span className="font-semibold text-ink">68</span>
          </Marker>
          <motion.div
            className="absolute inset-x-0 top-0"
            initial={{ x: `${pct(SUS_BENCHMARK)}%`, opacity: 0 }}
            animate={inView ? { x: `${pct(SUS_MEAN)}%`, opacity: 1 } : undefined}
            transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.9 }}
          >
            <div className="absolute top-0 left-0 flex -translate-x-full items-start gap-1.5 pr-0">
              <span className="text-right font-mono text-[11.5px] leading-tight">
                <span className="block text-brand-ink">Média</span>
                <AnimateNumber
                  className="font-semibold text-brand-ink"
                  locales="pt-BR"
                  format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                  transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.9 }}
                >
                  {inView ? SUS_MEAN : SUS_BENCHMARK}
                </AnimateNumber>
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" className="mt-0.5 -mr-1.5 text-brand">
                <path d="M6 1 11 10H1Z" fill="currentColor" />
              </svg>
            </div>
          </motion.div>
          <Marker at={SUS_MEDIAN} side="right" glyph="diamond" inView={inView} delay={1.9}>
            <span className="text-ink-3">Mediana</span>
            <span className="font-semibold text-ink">81,25</span>
          </Marker>
        </div>
      </div>

      <figcaption className="sr-only">
        Notas individuais do SUS dos dez participantes: {SUS_SCORES.map(fmt).join('; ')}. Média {fmt(SUS_MEAN)}, mediana{' '}
        {fmt(SUS_MEDIAN)}, desvio padrão {fmt(SUS_SD)}. Quatro notas na faixa Excelente, três na faixa Bom e três na faixa
        OK. Referência de {SUS_BENCHMARK} pontos.
      </figcaption>
    </figure>
  )
}

/** Phones: one row per adjective range, so no label ever has to share space. */
function SusCompact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const rows = [...BANDS].reverse()
  return (
    <div ref={ref} aria-hidden className="sm:hidden">
      <ul className="space-y-2.5">
        {rows.map((b, r) => {
          const scores = SUS_SCORES.filter((v) => bandOf(v) === b)
          return (
            <li key={b.label} className={`rounded-2xl px-4 py-3 ${b.tone}`}>
              <p className="flex items-baseline justify-between text-[14px] leading-tight font-semibold text-ink">
                {b.label}
                <span className="font-mono text-[11px] font-normal text-ink-3">{b.range}</span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {scores.map((v, i) => (
                  <motion.span
                    key={v}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ ...SPRING.lively, delay: 0.15 + (r * 4 + i) * 0.06 }}
                    className={`grid h-8 min-w-11 place-items-center rounded-full border-2 px-2 font-mono text-[12.5px] font-semibold ${b.chip}`}
                  >
                    {fmt(v)}
                  </motion.span>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <dl className="mt-5 grid grid-cols-3 gap-2 text-center font-mono">
        {[
          { k: 'Média', v: <AnimateNumber locales="pt-BR" format={{ minimumFractionDigits: 1 }}>{inView ? SUS_MEAN : SUS_BENCHMARK}</AnimateNumber>, tone: 'text-brand-ink' },
          { k: 'Mediana', v: '81,25', tone: 'text-ink' },
          { k: 'Referência', v: '68', tone: 'text-ink' },
        ].map((m) => (
          <div key={m.k} className="rounded-2xl border border-line px-2 py-3">
            <dt className="text-[11.5px] text-ink-3">{m.k}</dt>
            <dd className={`mt-1 text-[17px] font-semibold ${m.tone}`}>{m.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Marker({
  at,
  side,
  glyph,
  inView,
  delay,
  children,
}: {
  at: number
  side: 'left' | 'right'
  glyph: 'diamond'
  inView: boolean
  delay: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      className={`absolute top-0 flex items-start gap-1.5 ${side === 'left' ? '-translate-x-full flex-row' : 'flex-row-reverse'}`}
      style={{ left: `calc(${pct(at)}% + ${side === 'left' ? 6 : -6}px)` }}
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ ...SPRING.gentle, delay }}
    >
      <span className={`flex flex-col font-mono text-[11.5px] leading-tight ${side === 'left' ? 'text-right' : 'text-left'}`}>
        {children}
      </span>
      {glyph === 'diamond' && (
        <svg width="12" height="12" viewBox="0 0 12 12" className="mt-0.5 text-ink">
          <path d="M6 .8 11.2 6 6 11.2.8 6Z" fill="currentColor" />
        </svg>
      )}
    </motion.div>
  )
}
