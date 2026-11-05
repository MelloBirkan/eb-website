'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, stagger } from 'motion/react'
import { ScrambleText } from 'motion-plus/react'
import { Check } from '../icons'
import { EASE_OUT, SPRING } from '../motion'

// Table 2 of the paper. "Na prática" lists where each requirement shows up in the framework.
const REQS = [
  {
    id: 'R1',
    name: 'Consciência de contexto',
    text: 'O comportamento do agente muda conforme a tarefa: planejar, analisar, validar ou corrigir.',
    practice: ['Uma skill para cada etapa', 'Cada skill com seu contrato de saída', 'O agente pergunta o que falta'],
    href: '#framework',
    where: 'Arquitetura',
  },
  {
    id: 'R2',
    name: 'Controle humano',
    text: 'Decisões ambíguas de produto, navegação, texto ou design voltam para quem desenvolve, em vez de virar código em silêncio.',
    practice: ['Entrevista antes do plano', 'Validação como etapa explícita', 'Perguntas quando a correção depende do produto'],
    href: '#comando',
    where: 'Humano no comando',
  },
  {
    id: 'R3',
    name: 'Rastreabilidade',
    text: 'Achados e recomendações guardam evidência, severidade, domínio, cláusula de origem e orientação.',
    practice: ['Arquivo e linha de cada achado', 'Cláusula e fonte oficial com data', 'Achado sem confirmação é descartado'],
    href: '#relatorio',
    where: 'Relatório',
  },
  {
    id: 'R4',
    name: 'Reuso de procedimento',
    text: 'As diretrizes não dependem de prompts longos reescritos a cada uso. Viram skills reutilizáveis e versionadas.',
    practice: ['SKILL.md com referências por etapa', 'Corpus em Markdown com index.json', 'Tudo versionado no Git'],
    href: '#clausulas',
    where: 'Cláusulas',
  },
  {
    id: 'R5',
    name: 'Interpretabilidade',
    text: 'As saídas são feitas primeiro para quem desenvolve ler e aprender, e só depois para o agente executar.',
    practice: ['Relatório HTML para pessoas', 'Severidade e domínio à vista', 'Duas formas de corrigir cada achado'],
    href: '#resultados',
    where: 'Resultados',
  },
]

/** The five design requirements as tabs: pick one to see what it asks and where it shows up. */
export function Requirements() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const r = REQS[active]

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = REQS.length - 1
    const map: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    if (!(e.key in map)) return
    e.preventDefault()
    setActive(map[e.key])
    tabs.current[map[e.key]]?.focus()
  }

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <LayoutGroup id={`${uid}-req`}>
        <div
          role="tablist"
          aria-label="Requisitos de design"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="-mx-6 flex gap-2 overflow-x-auto px-6 no-scrollbar lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
        >
          {REQS.map((q, i) => {
            const on = i === active
            return (
              <button
                key={q.id}
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
                className={`relative flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-[15px] font-medium transition-colors lg:rounded-2xl lg:border-transparent lg:px-5 lg:py-3.5 ${
                  on ? 'border-transparent text-on-pick' : 'border-line-2 text-ink-2 hover:text-ink lg:hover:bg-card'
                }`}
              >
                {on && (
                  <motion.span layoutId="req-pill" className="absolute inset-0 rounded-full bg-pick lg:rounded-2xl" transition={SPRING.ui} aria-hidden />
                )}
                <span className={`relative font-mono text-[13px] font-semibold ${on ? 'text-pick-accent' : 'text-ink-3'}`}>{q.id}</span>
                <span className="relative whitespace-nowrap">{q.name}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="relative min-h-[330px] rounded-[28px] border border-line bg-card p-6 sm:p-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={r.id}
            initial="hidden"
            animate="shown"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
            className="relative"
          >
            {[
              <p key="n" className="flex items-baseline gap-3">
                <span aria-hidden className="font-mono text-[2.6rem] leading-none font-semibold tracking-[-0.04em] text-brand">
                  <ScrambleText key={r.id} duration={0.5} delay={stagger(0.05)} chars="R0123456789">
                    {r.id}
                  </ScrambleText>
                </span>
                <span className="font-mono text-[12.5px] tracking-[0.14em] text-ink-3 uppercase">Requisito {r.id.slice(1)} de 5</span>
              </p>,
              <h3 key="t" className="h3 mt-3">
                {r.name}
              </h3>,
              <p key="p" className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-ink-2">
                {r.text}
              </p>,
              <ul key="l" className="mt-6 grid gap-2 sm:grid-cols-3">
                {r.practice.map((p) => (
                  <li key={p} className="flex items-start gap-2 rounded-2xl bg-paper-2 px-3.5 py-3 text-[14px] leading-snug text-ink">
                    <Check size={15} className="mt-px shrink-0 text-brand" />
                    {p}
                  </li>
                ))}
              </ul>,
              <a key="a" href={r.href} className="link mt-6 inline-block text-[14.5px] font-medium">
                Onde aparece: {r.where}
              </a>,
            ].map((child) => (
              <motion.div
                key={child.key}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: 'blur(5px)' },
                  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } },
                }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
