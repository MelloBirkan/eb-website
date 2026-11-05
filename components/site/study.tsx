'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { SusChart } from './sus-chart'
import { ButtonLink } from './button'
import { Person } from './icons'
import { SPRING } from './motion'
import { Reveal, RevealGroup, RevealItem } from './reveal'

/** Ten figures, `filled` of them highlighted in sequence as the card scrolls into view. */
function People({ filled, label, tones }: { filled: number; label: string; tones?: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <div ref={ref} role="img" aria-label={label} className="grid w-fit grid-cols-10 gap-1">
      {Array.from({ length: 10 }, (_, i) => {
        const on = i < filled
        return (
          <motion.span
            key={i}
            className={`grid size-[26px] place-items-center rounded-full border transition-colors duration-500 ${
              on && inView ? (tones?.[i] ?? 'border-brand bg-brand text-on-brand') : 'border-line-2 bg-card text-ink-3'
            }`}
            style={{ transitionDelay: inView ? `${0.25 + i * 0.07}s` : '0s' }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : undefined}
            transition={{ ...SPRING.lively, delay: i * 0.04 }}
          >
            <Person size={13} />
          </motion.span>
        )
      })}
    </div>
  )
}

const FACTS = [
  {
    value: '10 de 10',
    filled: 10,
    text: 'encontraram no relatório os 55 achados, sendo 15 críticos e 40 altos.',
    label: 'Dez de dez participantes',
  },
  {
    value: '8 de 10',
    filled: 8,
    text: 'seguiram a ordem esperada na auditoria: analisar e depois validar.',
    label: 'Oito de dez participantes',
  },
  {
    value: '4 · 3 · 3',
    filled: 10,
    tones: [
      ...Array(4).fill('border-brand bg-brand text-on-brand'),
      ...Array(3).fill('border-transparent bg-brand/55 text-on-brand'),
      ...Array(3).fill('border-med bg-med text-white'),
    ],
    text: 'notas nas faixas Excelente, Bom e OK. Ninguém ficou abaixo de OK.',
    label: 'Quatro notas excelentes, três boas e três OK',
  },
]

export function StudyHighlight() {
  return (
    <div className="mt-14 md:mt-16">
      <Reveal>
        <div className="rounded-[32px] border border-line bg-card p-6 shadow-[0_30px_90px_-50px_rgba(15,37,35,.4)] sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="font-mono text-[12px] tracking-[0.14em] text-ink-3 uppercase">System Usability Scale · 0 a 100</p>
              <p className="mt-2 text-[17px] font-medium text-ink">Uma bolinha por participante</p>
            </div>
            <dl className="flex gap-6 font-mono text-[12.5px]">
              <div>
                <dt className="text-ink-3">Desvio padrão</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">15,1</dd>
              </div>
              <div>
                <dt className="text-ink-3">Faixa</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">57,5 a 100</dd>
              </div>
            </dl>
          </div>
          <SusChart className="mt-8" />
        </div>
      </Reveal>

      <RevealGroup className="mt-6 grid gap-4 md:grid-cols-3" stagger={0.1}>
        {FACTS.map((f) => (
          <RevealItem key={f.value} className="rounded-[24px] border border-line bg-card p-6">
            <p className="num text-[2rem] leading-none font-semibold tracking-[-0.03em] text-ink">{f.value}</p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{f.text}</p>
            <div className="mt-5">
              <People filled={f.filled} label={f.label} tones={'tones' in f ? f.tones : undefined} />
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[24px] border border-dashed border-line-2 p-6 sm:flex-row sm:items-center">
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
          É um estudo formativo, sem grupo de comparação, então os números descrevem este grupo e não provam efeito. O
          artigo detalha o método, os limites e o que vem a seguir.
        </p>
        <ButtonLink href="/pesquisa#resultados" variant="secondary">
          Ver os resultados completos
        </ButtonLink>
      </Reveal>
    </div>
  )
}
