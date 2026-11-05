'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Count } from './count'
import { EASE_OUT, SPRING } from './motion'
import { RevealGroup, RevealItem } from './reveal'

function DotGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} aria-hidden className="grid w-fit grid-cols-10 gap-[5px]">
      {Array.from({ length: 100 }, (_, i) => {
        const fails = i < 96
        return (
          <span
            key={i}
            className={`size-[13px] rounded-[4px] transition-[background-color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
              inView ? (fails ? 'bg-crit' : 'scale-110 bg-brand') : 'bg-line-2'
            }`}
            style={{ transitionDelay: `${200 + i * 12}ms` }}
          />
        )
      })}
    </div>
  )
}

function Bars() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const rows = [
    { label: 'Verificador tradicional', value: 31.3, tone: 'bg-ink-3' },
    { label: 'Auditoria com LLM', value: 69.2, tone: 'bg-brand' },
  ]
  return (
    <div ref={ref} className="w-full space-y-4">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="text-ink-2">{r.label}</span>
            <span className="num font-semibold text-ink">{r.value.toLocaleString('pt-BR')}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-line">
            <motion.div
              className={`h-full origin-left rounded-full ${r.tone}`}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: r.value / 100 } : undefined}
              transition={{ ...SPRING.gentle, delay: 0.2 + i * 0.25 }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Ring() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <svg ref={ref} width="124" height="124" viewBox="0 0 100 100" aria-hidden className="-rotate-90">
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--s-line)" strokeWidth="10" />
      <motion.circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--s-brand)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 0.84 } : undefined}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
      />
    </svg>
  )
}

const CARDS = [
  {
    visual: <DotGrid />,
    value: 95.9,
    decimals: 1,
    text: 'das um milhão de páginas iniciais mais visitadas da web têm falhas de WCAG detectáveis.',
    source: 'WebAIM Million, 2026',
  },
  {
    visual: <Bars />,
    value: 69.2,
    decimals: 1,
    text: 'dos erros de leitor de tela em apps foram achados por uma auditoria com LLM. Um verificador muito usado achou 31,3%.',
    source: 'Zhong et al., ScreenAudit, CHI 2025',
  },
  {
    visual: <Ring />,
    value: 84,
    decimals: 0,
    text: 'dos devs usam ou planejam usar IA. A confiança na precisão ainda é baixa, e corrigir código quase certo toma tempo.',
    source: 'Stack Overflow Developer Survey, 2025',
  },
]

export function ProblemStats() {
  return (
    <RevealGroup className="mt-14 grid gap-4 md:mt-16 lg:grid-cols-3" stagger={0.12}>
      {CARDS.map((c) => (
        <RevealItem
          key={c.source}
          className="flex flex-col rounded-[28px] border border-line bg-card p-7 shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_20px_50px_-35px_rgba(15,37,35,.35)] md:p-8"
        >
          <div className="flex min-h-[120px] items-center lg:h-[176px]">{c.visual}</div>
          <p className="mt-8 text-[56px] leading-none font-semibold tracking-[-0.05em] md:text-[64px]">
            <Count value={c.value} decimals={c.decimals} suffix="%" />
          </p>
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-2">{c.text}</p>
          <p className="mt-auto pt-6 font-mono text-[12.5px] text-ink-3">{c.source}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
