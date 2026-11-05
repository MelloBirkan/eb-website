'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'motion/react'
import { Person } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { Segmented } from './segmented'

/* ───── Design Science Research steps ───── */

const DSR = [
  { name: 'Curar', text: 'diretrizes da Apple, da WCAG e da literatura' },
  { name: 'Modelar', text: 'skills e cláusulas rastreáveis' },
  { name: 'Implementar', text: 'nos agentes, como plugins' },
  { name: 'Verificar', text: 'o comportamento das skills, internamente' },
  { name: 'Avaliar', text: 'com devs iOS, de forma exploratória' },
]

/** The five steps of the process; the line fills as the row scrolls through the screen. */
export function DsrSteps() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })
  return (
    <ol ref={ref} className="relative mt-10 grid gap-4 sm:grid-cols-5 sm:gap-3">
      <span aria-hidden className="absolute top-[15px] right-[10%] left-[10%] hidden h-[2px] rounded-full bg-line sm:block" />
      <motion.span
        aria-hidden
        className="absolute top-[15px] right-[10%] left-[10%] hidden h-[2px] origin-left rounded-full bg-brand sm:block"
        style={{ scaleX: fill }}
      />
      {DSR.map((d, i) => (
        <motion.li
          key={d.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...SPRING.gentle, delay: i * 0.08 }}
          className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center"
        >
          <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 border-brand bg-card font-mono text-[12.5px] font-semibold text-brand-ink">
            {i + 1}
          </span>
          <span>
            <span className="block text-[16px] font-semibold text-ink">{d.name}</span>
            <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{d.text}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  )
}

/* ───── Participants ───── */

type Facet = 'ios' | 'agente' | 'a11y'

// Counts from the paper. The figures are recoloured per facet; they do not track individuals.
const FACETS: Record<Facet, { groups: { label: string; n: number; tone: string; dot: string }[] }> = {
  ios: {
    groups: [
      { label: 'Menos de 1 ano de iOS', n: 4, tone: 'border-mint-2 bg-mint text-brand-ink', dot: 'bg-mint-2' },
      { label: '1 a 2 anos', n: 3, tone: 'border-brand/60 bg-brand/60 text-on-brand', dot: 'bg-brand/60' },
      { label: '3 a 5 anos', n: 3, tone: 'border-brand bg-brand text-on-brand', dot: 'bg-brand' },
    ],
  },
  agente: {
    groups: [
      { label: 'Claude Code', n: 6, tone: 'border-brand bg-brand text-on-brand', dot: 'bg-brand' },
      { label: 'GitHub Copilot', n: 3, tone: 'border-med bg-med text-white', dot: 'bg-med' },
      { label: 'Nunca usou um agente', n: 1, tone: 'border-line-2 bg-card text-ink-3', dot: 'bg-line-2' },
    ],
  },
  a11y: {
    groups: [
      { label: 'Aplica no dia a dia', n: 4, tone: 'border-brand bg-brand text-on-brand', dot: 'bg-brand' },
      { label: 'Experiência com VoiceOver, HIG e WCAG', n: 1, tone: 'border-brand-ink bg-brand-ink text-on-brand', dot: 'bg-brand-ink' },
      { label: 'Já pesquisou o tema', n: 3, tone: 'border-mint-2 bg-mint text-brand-ink', dot: 'bg-mint-2' },
      { label: 'Contato superficial ou nenhum', n: 2, tone: 'border-line-2 bg-card text-ink-3', dot: 'bg-line-2' },
    ],
  },
}

/** Ten developers, recoloured by the facet you pick. */
export function Participants() {
  const [facet, setFacet] = useState<Facet>('ios')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const groups = FACETS[facet].groups
  const tones = groups.flatMap((g) => Array<string>(g.n).fill(g.tone))
  const summary = groups.map((g) => `${g.n}: ${g.label.toLowerCase()}`).join('; ')

  return (
    <div ref={ref} className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
      <div className="grid gap-4">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">10 participantes</p>
        <Segmented<Facet>
          label="Ver participantes por"
          value={facet}
          onChange={setFacet}
          stretch
          options={[
            { id: 'ios', label: 'iOS' },
            { id: 'agente', label: 'Agente' },
            { id: 'a11y', label: 'Acessibilidade' },
          ]}
        />
      </div>
      <div role="img" aria-label={`Dez participantes. ${summary}.`} className="mt-6 grid w-fit grid-cols-5 gap-2 sm:grid-cols-10">
        {tones.map((tone, i) => (
          <motion.span
            key={i}
            className={`grid size-9 place-items-center rounded-full border-2 transition-colors duration-500 sm:size-10 ${tone}`}
            style={{ transitionDelay: `${i * 0.04}s` }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : undefined}
            transition={{ ...SPRING.lively, delay: i * 0.05 }}
          >
            <Person size={17} />
          </motion.span>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={facet}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="mt-5 grid gap-2 sm:grid-cols-2"
        >
          {groups.map((g) => (
            <li key={g.label} className="flex items-center gap-2.5 text-[14.5px] text-ink-2">
              <span className={`size-3 shrink-0 rounded-full ${g.dot}`} aria-hidden />
              <span className="num font-mono text-[14px] font-semibold text-ink">{g.n}</span>
              {g.label}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <p className="mt-5 border-t border-line pt-4 text-[13.5px] leading-snug text-ink-3">
        Todos maiores de 18 anos e com experiência em SwiftUI, recrutados por conveniência. As cores mostram contagens,
        não acompanham pessoas.
      </p>
    </div>
  )
}

/* ───── Session protocol ───── */

const TASKS = [
  {
    name: 'Perfil',
    what: 'A experiência de cada pessoa com iOS, agentes, acessibilidade e skills.',
    data: 'Questionário.',
    material: null,
  },
  {
    name: 'Site',
    what: 'Se a pessoa descobre o framework e entende a proposta.',
    data: 'Pensar em voz alta e observação.',
    material: 'Site de descoberta do EvenBetter',
  },
  {
    name: 'Planejar',
    what: 'A escolha da skill e o planejamento de um app iOS novo com o agente.',
    data: 'Observação e comentários.',
    material: 'Agente com o plugin instalado',
  },
  {
    name: 'Auditar',
    what: 'Se a pessoa entende a sequência analisar e validar e consegue ler o relatório.',
    data: 'Sequência observada, leitura do relatório e prompt de correção escolhido.',
    material: 'App Aroma Care, de busca de óleos essenciais, e o relatório HTML gerado para ele',
  },
  {
    name: 'Pós-teste',
    what: 'A usabilidade percebida e a opinião de cada um.',
    data: 'SUS e perguntas abertas.',
    material: null,
  },
]

/** About 30 minutes per session, in five tasks. Pick one to see what it measured. */
export function SessionStrip() {
  const [active, setActive] = useState(3)
  const t = TASKS[active]
  return (
    <div className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Uma sessão</p>
        <p className="font-mono text-[12.5px] font-semibold text-ink">≈ 30 min</p>
      </div>
      <div className="mt-4 grid gap-1.5 sm:grid-cols-5" role="group" aria-label="Tarefas da sessão">
        {TASKS.map((task, i) => {
          const on = i === active
          return (
            <button
              key={task.name}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(i)}
              className={`relative flex min-h-11 min-w-0 items-center gap-3 rounded-xl border px-3.5 text-left transition-colors duration-200 sm:min-h-16 sm:flex-col sm:items-start sm:justify-end sm:gap-0 sm:px-2 sm:pb-2 ${
                on ? 'border-transparent text-on-pick' : 'border-line bg-paper-2/70 text-ink-2 hover:border-line-2'
              }`}
            >
              {on && <motion.span layoutId="session-on" className="absolute inset-0 rounded-xl bg-pick" transition={SPRING.ui} aria-hidden />}
              <span className={`relative font-mono text-[11px] ${on ? 'text-pick-accent' : 'text-ink-3'}`}>0{i + 1}</span>
              <span className="relative text-[12.5px] leading-tight font-medium break-words sm:text-[13.5px]">{task.name}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.dl
          key={t.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="mt-5 grid gap-x-5 gap-y-3 text-[14.5px] leading-snug sm:grid-cols-[110px_minmax(0,1fr)]"
        >
          <dt className="text-ink-3">O que avaliou</dt>
          <dd className="text-ink">{t.what}</dd>
          <dt className="text-ink-3">Dados</dt>
          <dd className="text-ink">{t.data}</dd>
          {t.material && (
            <>
              <dt className="text-ink-3">Material</dt>
              <dd className="text-ink">{t.material}</dd>
            </>
          )}
        </motion.dl>
      </AnimatePresence>
      <p className="mt-5 border-t border-line pt-4 text-[13.5px] leading-snug text-ink-3">
        O ambiente já vinha pronto, com repositório, dependências, agente e plugin instalados. Assim, a sessão focou na
        interação.
      </p>
    </div>
  )
}
