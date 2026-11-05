'use client'

import { useId, useRef, useState, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import Link from 'next/link'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  type MotionValue,
} from 'motion/react'
import { AnalyzeVisual, PlanVisual, RepairVisual, ValidateVisual } from './workflow-visuals'
import { ArrowRight, PauseGlyph, PlayGlyph, Person } from './icons'
import { EASE_OUT, SPRING } from './motion'

type Step = {
  id: string
  label: string
  skills: string[]
  title: string
  text: string
  human: string
  href: string
  alt: string
  Visual: (props: { paused: boolean }) => React.ReactElement
}

const STEPS: Step[] = [
  {
    id: 'planejar',
    label: 'Planejar',
    skills: ['evenbetter-ios-feature', 'evenbetter-ios-epic'],
    title: 'O pedido vira entrevista.',
    text: 'Antes do código, o agente pergunta sobre público, fluxos, estados vazios e acessibilidade. As opções são fechadas, então dá para comparar e escolher rápido.',
    human: 'Você define a direção, as restrições e os critérios de aceite.',
    href: '/tutorial/plugins/ios#planejamento-ux',
    alt: 'Exemplo: o agente pergunta quem vai usar um app de limpeza da casa e o que a lista mostra quando está vazia, e monta um plano com critérios de acessibilidade.',
    Visual: PlanVisual,
  },
  {
    id: 'analisar',
    label: 'Analisar',
    skills: ['evenbetter-analyze'],
    title: 'Cada achado aponta a fonte.',
    text: 'O agente lê o projeto SwiftUI e liga cada problema a um arquivo, uma linha e uma cláusula do corpus. Cada achado vem com duas formas de corrigir.',
    human: 'Você escolhe por onde começar, com severidade e domínio à vista.',
    href: '/tutorial/plugins/ios#auditoria',
    alt: 'Exemplo: a análise percorre um arquivo SwiftUI e marca três linhas, cada uma ligada a uma cláusula do corpus.',
    Visual: AnalyzeVisual,
  },
  {
    id: 'validar',
    label: 'Validar',
    skills: ['evenbetter-validate'],
    title: 'Uma segunda leitura antes de confiar.',
    text: 'O agente relê o relatório. A evidência sustenta o achado? A severidade está certa? O que não se confirma sai do relatório.',
    human: 'Você confere a evidência antes de aceitar um achado.',
    href: '/tutorial/plugins/ios#auditoria',
    alt: 'Exemplo: a validação confirma dois achados, ajusta a severidade de um terceiro e remove um achado sem evidência.',
    Visual: ValidateVisual,
  },
  {
    id: 'corrigir',
    label: 'Corrigir',
    skills: ['evenbetter-repair'],
    title: 'O agente corrige o técnico. O resto volta para você.',
    text: 'Só roda sobre um relatório já validado. Aplica a correção mínima ou a recomendada nos ajustes técnicos e devolve texto, navegação e design visual como pergunta.',
    human: 'Você decide tudo que depende da intenção do produto.',
    href: '/tutorial/plugins/ios#auditoria',
    alt: 'Exemplo: o agente troca uma fonte fixa por um estilo do sistema e um gesto por um botão, e pergunta a você o que o VoiceOver deve ler.',
    Visual: RepairVisual,
  },
]

/** Seconds each step stays on screen while the pipeline plays by itself. */
const STEP_SECONDS = 9

type Mode = 'auto' | 'manual' | 'paused'

/** Pause or resume the pipeline. The ring fills while a step plays. */
function PlayToggle({
  mode,
  setMode,
  progress,
  className = '',
}: {
  mode: Mode
  setMode: Dispatch<SetStateAction<Mode>>
  progress: MotionValue<number>
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => setMode((m) => (m === 'auto' ? 'paused' : 'auto'))}
      aria-label={mode === 'auto' ? 'Pausar a troca automática das etapas' : 'Tocar as etapas em sequência'}
      className={`relative size-11 shrink-0 place-items-center rounded-full border border-line bg-card text-ink transition-colors hover:border-line-2 sm:size-[3.75rem] ${className}`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--s-brand)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: progress }}
          animate={{ opacity: mode === 'auto' ? 1 : 0 }}
        />
      </svg>
      {mode === 'auto' ? <PauseGlyph size={12} /> : <PlayGlyph size={12} />}
    </button>
  )
}

export function Workflow() {
  const [index, setIndex] = useState(0)
  // auto: advances by itself. manual: the visitor picked a step. paused: everything holds.
  const [mode, setMode] = useState<Mode>('auto')
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inView = useInView(rootRef, { amount: 0.3 })
  const progress = useMotionValue(0)
  const uid = useId()

  const advancing = mode === 'auto' && inView

  useAnimationFrame((_, delta) => {
    if (!advancing) return
    const next = progress.get() + delta / 1000 / STEP_SECONDS
    if (next >= 1) {
      progress.set(0)
      setIndex((i) => (i + 1) % STEPS.length)
    } else {
      progress.set(next)
    }
  })

  function pick(i: number, focus = false) {
    setIndex(i)
    setMode('manual')
    progress.set(0)
    if (focus) tabRefs.current[i]?.focus()
  }

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = STEPS.length - 1
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    if (!(e.key in moves)) return
    e.preventDefault()
    pick(moves[e.key], true)
  }

  const step = STEPS[index]
  const Visual = step.Visual

  return (
    <div ref={rootRef} className="mt-14 md:mt-16">
      <div className="flex items-center gap-3">
        <LayoutGroup id={`${uid}-tabs`}>
          <div
            role="tablist"
            aria-label="Etapas do EvenBetter"
            onKeyDown={onTabKey}
            className="grid min-w-0 flex-1 grid-cols-4 gap-1 rounded-full border border-line bg-card p-1.5 shadow-[0_1px_2px_rgba(15,37,35,.04)]"
          >
            {STEPS.map((s, i) => {
              const active = i === index
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  id={`${uid}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${uid}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => pick(i)}
                  className={`relative flex h-11 min-w-0 items-center justify-center gap-2 rounded-full px-1 text-[13.5px] font-medium transition-colors duration-200 sm:h-12 sm:px-2 sm:text-[15px] ${
                    active ? 'text-on-pick' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="wf-pill" className="absolute inset-0 rounded-full bg-pick" transition={SPRING.ui} aria-hidden />
                  )}
                  <span className={`relative hidden font-mono text-[11.5px] sm:inline ${active ? 'text-pick-accent' : 'text-ink-3'}`}>
                    0{i + 1}
                  </span>
                  <span className="relative truncate">{s.label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <PlayToggle mode={mode} setMode={setMode} progress={progress} className="hidden sm:grid" />
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${index}`}
        className="mt-8 grid items-center gap-10 md:mt-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16"
      >
        <div className="min-h-[300px] md:min-h-[360px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial="hidden"
              animate="shown"
              exit="gone"
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.06 } },
                gone: { opacity: 0, y: -8, filter: 'blur(6px)', transition: { duration: 0.18 } },
              }}
            >
              {[
                <div key="n" className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[12.5px] tracking-[0.14em] text-ink-3 uppercase">Etapa 0{index + 1} de 04</p>
                  <PlayToggle mode={mode} setMode={setMode} progress={progress} className="grid sm:hidden" />
                </div>,
                <h3 key="t" className="h3 mt-4 max-w-[22ch]">
                  {step.title}
                </h3>,
                <p key="p" className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-ink-2">
                  {step.text}
                </p>,
                <div key="h" className="mt-6 flex max-w-[40ch] items-start gap-3 rounded-2xl border border-brand/20 bg-mint/50 p-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
                    <Person size={16} />
                  </span>
                  <p className="text-[15px] leading-snug text-ink">
                    <span className="block font-mono text-[11.5px] font-semibold tracking-[0.12em] text-brand-ink uppercase">
                      Você decide
                    </span>
                    {step.human}
                  </p>
                </div>,
                <div key="s" className="mt-6 flex flex-wrap items-center gap-2">
                  {step.skills.map((skill) => (
                    <code key={skill} className="rounded-full border border-line-2 bg-card px-3 py-1 font-mono text-[12.5px] text-ink-2">
                      {skill}
                    </code>
                  ))}
                  <Link href={step.href} className="link ml-1 inline-flex items-center gap-1 text-[14.5px] font-medium">
                    Como usar <ArrowRight size={14} />
                  </Link>
                </div>,
              ].map((child) => (
                <motion.div
                  key={child.key}
                  variants={{
                    hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
                    shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } },
                  }}
                >
                  {child}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_60%_40%,var(--s-mint),transparent_70%)] opacity-70"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              role="img"
              aria-label={step.alt}
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985, transition: { duration: 0.18 } }}
              transition={SPRING.gentle}
            >
              <Visual paused={mode === 'paused' || !inView} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-8 text-[13.5px] text-ink-3">
        Exemplos ilustrativos. Analisar, validar e corrigir leem e escrevem o mesmo relatório, salvo em{' '}
        <code className="inline-code">.evenbetter/</code> no seu projeto.
      </p>
    </div>
  )
}
