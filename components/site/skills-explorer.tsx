'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { CopyButton } from './copy-button'
import { ArrowRight } from './icons'
import { EASE_OUT, SPRING } from './motion'

type Skill = { name: string; text: string; isNew?: boolean }
type Group = { id: string; label: string; href: string; skills: Skill[] }

// The 16 skills of the evenbetter-ios plugin, grouped as in the iOS guide.
const GROUPS: Group[] = [
  {
    id: 'planejamento',
    label: 'Planejamento',
    href: '/tutorial/plugins/ios#planejamento-ux',
    skills: [
      {
        name: 'evenbetter-ios-feature',
        text: 'Planeja e revisa uma tela ou feature pequena: UX, contrato de acessibilidade, Dynamic Type e VoiceOver.',
      },
      {
        name: 'evenbetter-ios-epic',
        text: 'Para apps e fluxos com várias telas: brief, fluxos, navegação, estratégia de acessibilidade e validação.',
      },
      {
        name: 'evenbetter-app-opportunity-research',
        text: 'Procura oportunidades na App Store com fontes citadas: nichos pouco atendidos, brechas dos concorrentes e um brief de MVP.',
      },
      {
        name: 'evenbetter-app-launcher',
        text: 'Acompanha o app da ideia à loja: validação, envio para a App Store, página do app, monetização e divulgação.',
      },
    ],
  },
  {
    id: 'swiftui',
    label: 'Design e SwiftUI',
    href: '/tutorial/plugins/ios#swiftui',
    skills: [
      { name: 'evenbetter-design', text: 'Cria telas SwiftUI com acabamento de produto, longe da cara de app padrão.' },
      {
        name: 'evenbetter-swiftui-ui-patterns',
        text: 'Boas práticas e exemplos para views, navegação, TabView, estado e layouts que se adaptam.',
      },
      {
        name: 'evenbetter-swiftui-view-refactor',
        text: 'Quebra views longas em subviews pequenas, com fluxo de dados simples e Observation bem usado.',
      },
      { name: 'evenbetter-swiftui-liquid-glass', text: 'Adota e revisa o Liquid Glass do iOS 26: uso correto, performance e design.' },
    ],
  },
  {
    id: 'auditoria',
    label: 'Auditoria',
    href: '/tutorial/plugins/ios#auditoria',
    skills: [
      {
        name: 'evenbetter-analyze',
        text: 'Audita o projeto contra o corpus, confere cada achado nas fontes e gera um relatório HTML em .evenbetter/.',
      },
      {
        name: 'evenbetter-validate',
        text: 'Relê cada achado no código e no corpus, confirma o que é real, ajusta a severidade e corrige o relatório.',
      },
      {
        name: 'evenbetter-repair',
        text: 'Aplica as correções de um relatório validado e devolve para você o que é decisão de produto.',
        isNew: true,
      },
    ],
  },
  {
    id: 'acessibilidade',
    label: 'Acessibilidade e performance',
    href: '/tutorial/plugins/ios#performance',
    skills: [
      { name: 'evenbetter-swiftui-accessibility', text: 'Regras de acessibilidade para SwiftUI, com base no HIG e na WCAG.' },
      {
        name: 'evenbetter-swiftui-performance-audit',
        text: 'Encontra renderização lenta, rolagem travada e atualizações em excesso, com um roteiro para o Instruments.',
      },
      {
        name: 'evenbetter-ios-haptics',
        text: 'Liga o feedback tátil ao significado de cada evento, como sucesso, erro e impacto.',
      },
    ],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    href: '/tutorial/plugins/ios#sistema',
    skills: [
      { name: 'evenbetter-ios-app-intents', text: 'Leva ações e conteúdo do app para Atalhos, Siri, Spotlight, widgets e controles.' },
      {
        name: 'evenbetter-ios-debugger-agent',
        text: 'Usa o XcodeBuildMCP para compilar, rodar e inspecionar o app no simulador.',
      },
    ],
  },
]

export function SkillsExplorer() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const group = GROUPS[active]

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = GROUPS.length - 1
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? active === last
          ? 0
          : active + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? active === 0
            ? last
            : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-8 md:mt-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
      <LayoutGroup id={`${uid}-groups`}>
        <div
          role="tablist"
          aria-label="Grupos de skills"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
        >
          {GROUPS.map((g, i) => {
            const on = i === active
            return (
              <button
                key={g.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative flex shrink-0 items-center justify-between gap-4 rounded-full border px-4 py-2.5 text-left text-[15px] font-medium transition-colors lg:rounded-2xl lg:border-transparent lg:px-5 lg:py-4 ${
                  on ? 'border-transparent text-on-pick' : 'border-line-2 text-ink-2 hover:text-ink lg:hover:bg-card'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="skills-pill"
                    className="absolute inset-0 rounded-full bg-pick lg:rounded-2xl"
                    transition={SPRING.ui}
                    aria-hidden
                  />
                )}
                <span className="relative whitespace-nowrap">{g.label}</span>
                <span className={`relative font-mono text-[12.5px] ${on ? 'text-pick-accent' : 'text-ink-3'}`}>
                  {g.skills.length}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="min-h-[380px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={group.id}
            role="list"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            initial="hidden"
            animate="shown"
            exit="gone"
            variants={{
              hidden: {},
              shown: { transition: { staggerChildren: 0.05 } },
              gone: { opacity: 0, transition: { duration: 0.15 } },
            }}
          >
            {group.skills.map((s) => (
              <motion.li
                key={s.name}
                variants={{
                  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
                  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } },
                }}
                className="group flex min-w-0 flex-col rounded-[22px] border border-line bg-card p-5 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_20px_50px_-30px_rgba(15,37,35,.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <code className="min-w-0 font-mono text-[13.5px] font-semibold break-all text-ink">{s.name}</code>
                  {s.isNew && (
                    <span className="shrink-0 rounded-full bg-mint px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-ink">
                      nova
                    </span>
                  )}
                </div>
                <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-paper-2 py-1.5 pr-1.5 pl-3">
                  <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink-2">/evenbetter-ios:{s.name}</code>
                  <CopyButton text={`/evenbetter-ios:${s.name}`} label={`o comando da skill ${s.name}`} className="size-7" />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-[14.5px] text-ink-3">
            Também há o plugin <code className="inline-code">evenbetter-general</code>, com duas skills de planejamento para
            qualquer plataforma.
          </p>
          <Link href={group.href} className="link inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium">
            {group.label} no guia <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
