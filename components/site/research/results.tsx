'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ButtonLink } from '../button'
import { Person } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { SusChart } from '../sus-chart'
import { Cite } from './cite'

/* ───── SUS ───── */

export function SusResults() {
  return (
    <div className="mt-12 rounded-[32px] border border-line bg-card p-6 shadow-[0_30px_90px_-50px_rgba(15,37,35,.4)] sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="font-mono text-[12px] tracking-[0.14em] text-ink-3 uppercase">System Usability Scale · 0 a 100</p>
          <p className="mt-2 text-[17px] font-medium text-ink">Uma bolinha por participante</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[12.5px] sm:grid-cols-4">
          {[
            ['Média', '79,5'],
            ['Mediana', '81,25'],
            ['Desvio padrão', '15,1'],
            ['Faixa', '57,5 a 100'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-ink-3">{k}</dt>
              <dd className="mt-0.5 text-[15px] font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <SusChart className="mt-8" summary={false} />
      <div className="mt-8 grid gap-4 border-t border-line pt-6 md:grid-cols-2">
        <p className="text-[15px] leading-relaxed text-ink-2">
          A média fica acima dos cerca de 70 pontos de uma avaliação do SUS em larga escala <Cite n={20} />. Na escala de
          adjetivos de Bangor e colegas <Cite n={21} />, foram quatro notas Excelente, três Bom e três OK.
        </p>
        <p className="text-[15px] leading-relaxed text-ink-2">
          Os três OK vieram de quem tinha pouca experiência com skills. Três dos quatro Excelente já tinham usado skills no
          Claude Code, e um participante sem experiência com agentes também chegou a Excelente. A amostra não permite
          inferência.
        </p>
      </div>
    </div>
  )
}

/* ───── Journey ───── */

type Stage = {
  label: string
  stats?: { n: number; text: string }[]
  styles?: string[]
  good: string
  hard: string
}

const STAGES: Stage[] = [
  {
    label: 'Site',
    stats: [
      { n: 5, text: 'elogiaram a tipografia e a hierarquia' },
      { n: 4, text: 'usaram o chat do site para escolher uma skill' },
    ],
    good: 'Entenderam a proposta e encontraram as skills.',
    hard: 'O vocabulário: skill curada, site, marketplace, plugin e agente se confundiam no começo.',
  },
  {
    label: 'Planejar',
    stats: [
      { n: 4, text: 'chamaram a evenbetter-ios-epic direto para planejar um app de séries de TV' },
      { n: 2, text: 'hesitaram entre feature e epic antes de decidir' },
    ],
    good: 'Gostaram da organização do app planejado, das convenções de acessibilidade e dos casos que deixariam passar.',
    hard: 'Visual minimalista, idioma inconsistente em algumas telas e profundidade técnica alta para quem começa em SwiftUI acessível.',
  },
  {
    label: 'Auditar',
    stats: [
      { n: 8, text: 'seguiram a ordem esperada: analisar e depois validar' },
      { n: 10, text: 'acharam os 55 achados, sendo 15 críticos e 40 altos' },
    ],
    good: 'Usaram severidade, domínio e orientação para decidir por onde começar. O relatório virou ferramenta de prioridade.',
    hard: 'Dois participantes inverteram a ordem ou pularam a validação.',
  },
  {
    label: 'Corrigir',
    styles: [
      'Prompt específico, com contexto, arquivo, linha e comportamento esperado',
      'Um achado copiado com uma instrução genérica',
      'Pensar sozinho antes de pedir a edição ao agente',
    ],
    good: 'Ler o relatório funcionou. Entregar a correção ao agente é outro problema de interação.',
    hard: 'A passagem da auditoria para a correção precisa de mais apoio.',
  },
]

function Dots({ n, label }: { n: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          className={`grid size-[22px] place-items-center rounded-full border ${
            i < n ? 'border-brand bg-brand text-on-brand' : 'border-line-2 bg-card text-ink-3/60'
          }`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING.lively, delay: 0.1 + i * 0.035 }}
        >
          <Person size={11} />
        </motion.span>
      ))}
    </span>
  )
}

/** Site, planning, audit and repair: what happened at each step of the session. */
export function Journey() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const s = STAGES[active]

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = STAGES.length - 1
    const map: Record<string, number> = {
      ArrowRight: Math.min(last, active + 1),
      ArrowLeft: Math.max(0, active - 1),
      Home: 0,
      End: last,
    }
    if (!(e.key in map)) return
    e.preventDefault()
    setActive(map[e.key])
    tabs.current[map[e.key]]?.focus()
  }

  return (
    <div ref={ref} className="mt-8 rounded-[32px] border border-line bg-card p-6 sm:p-9">
      <div role="tablist" aria-label="Etapas da sessão" onKeyDown={onKey} className="relative grid grid-cols-4">
        <span aria-hidden className="absolute top-[13px] right-[12.5%] left-[12.5%] h-[2px] rounded-full bg-line" />
        <motion.span
          aria-hidden
          className="absolute top-[13px] left-[12.5%] h-[2px] origin-left rounded-full bg-brand"
          style={{ width: '75%' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? active / (STAGES.length - 1) : 0 }}
          transition={SPRING.gentle}
        />
        {STAGES.map((st, i) => {
          const on = i === active
          const done = i <= active
          return (
            <button
              key={st.label}
              ref={(el) => {
                tabs.current[i] = el
              }}
              id={`${uid}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className="relative flex flex-col items-center gap-2"
            >
              <motion.span
                animate={{ scale: on ? 1.15 : 1 }}
                transition={SPRING.lively}
                className={`relative z-10 grid size-7 place-items-center rounded-full border-2 font-mono text-[11.5px] font-semibold transition-colors duration-300 ${
                  done ? 'border-brand bg-brand text-on-brand' : 'border-line-2 bg-card text-ink-3'
                }`}
              >
                {i + 1}
              </motion.span>
              <span className={`text-[13.5px] font-medium sm:text-[15px] ${on ? 'text-ink' : 'text-ink-3'}`}>{st.label}</span>
            </button>
          )
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="mt-8 min-h-[300px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 16, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -12, filter: 'blur(5px)', transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
          >
            <div className="grid content-start gap-5">
              {s.stats?.map((st) => (
                <div key={st.text}>
                  <p className="flex items-baseline gap-2">
                    <span className="num text-[2.6rem] leading-none font-semibold tracking-[-0.04em] text-ink">{st.n}</span>
                    <span className="font-mono text-[13px] text-ink-3">de 10</span>
                  </p>
                  <p className="mt-1.5 text-[15.5px] leading-snug text-ink-2">{st.text}</p>
                  <div className="mt-3">
                    <Dots n={st.n} label={`${st.n} de 10 participantes`} />
                  </div>
                </div>
              ))}
              {s.styles && (
                <div>
                  <p className="font-mono text-[11.5px] tracking-[0.12em] text-ink-3 uppercase">Três jeitos de pedir a correção</p>
                  <ol className="mt-3 grid gap-2">
                    {s.styles.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING.gentle, delay: 0.1 + i * 0.1 }}
                        className="flex items-start gap-3 rounded-2xl bg-paper-2 px-4 py-3 text-[15px] leading-snug text-ink"
                      >
                        <span className="font-mono text-[12px] text-ink-3">0{i + 1}</span>
                        {p}
                      </motion.li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <div className="grid content-start gap-3">
              <div className="rounded-2xl border border-brand/25 bg-mint/45 p-4">
                <p className="font-mono text-[11px] tracking-[0.12em] text-brand-ink uppercase">Funcionou</p>
                <p className="mt-1.5 text-[15px] leading-snug text-ink">{s.good}</p>
              </div>
              <div className="rounded-2xl border border-high/30 bg-high/[0.07] p-4">
                <p className="font-mono text-[11px] tracking-[0.12em] text-high uppercase">Atrito</p>
                <p className="mt-1.5 text-[15px] leading-snug text-ink">{s.hard}</p>
              </div>
              {s.styles && (
                <div className="rounded-2xl bg-night p-4 text-on-night">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-glow uppercase">Depois do estudo</p>
                  <p className="mt-1.5 text-[15px] leading-snug">
                    Em setembro de 2026, a correção ganhou uma skill própria, a evenbetter-repair. Ela só roda sobre um
                    relatório validado e devolve para você o que é decisão de produto.
                  </p>
                  <ButtonLink href="/#como-funciona" variant="mint" className="mt-4" size="md">
                    Ver as quatro etapas
                  </ButtonLink>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const WORDS = ['direto', 'útil para decidir por onde começar', 'um artefato para aprender']

/** How participants described the report, and where the friction came from. */
export function Qualitative() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Como descreveram o relatório</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {WORDS.map((w, i) => (
            <motion.li
              key={w}
              initial={{ opacity: 0, scale: 0.8, rotate: i % 2 ? 2 : -2 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
              transition={{ ...SPRING.lively, delay: 0.1 + i * 0.12 }}
              className="serif rounded-full bg-mint px-4 py-2 text-[1.35rem] leading-tight text-brand-ink"
            >
              {w}
            </motion.li>
          ))}
        </ul>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
          As respostas abertas elogiaram a utilidade das correções e a integração com ferramentas que as pessoas já usam.
        </p>
      </div>
      <div className="rounded-[28px] border border-dashed border-line-2 p-6 sm:p-7">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">De onde veio o atrito</p>
        <p className="mt-4 text-[15.5px] leading-relaxed text-ink">
          Quem tinha menos experiência com agentes atribuiu o atrito ao Claude Code, ao terminal e à expectativa de uma
          experiência de IDE, como a do Xcode.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
          Site, plugin, terminal, agente e relatório apareceram na mesma sessão, então o estudo não separa o que veio de
          cada parte.
        </p>
      </div>
    </div>
  )
}
