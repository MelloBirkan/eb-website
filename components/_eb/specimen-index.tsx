'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutGroup, motion } from 'motion/react'

type Skill = {
  id: string
  name: string
  desc: string
  code: string
  href: string
}

type Category = {
  id: string
  label: string
  skills: Skill[]
}

const CATEGORIES: Category[] = [
  {
    id: 'planning',
    label: 'Planejamento e produto',
    skills: [
      {
        id: 'feature',
        name: 'evenbetter-ios-feature',
        desc: 'Workflow em estágios para uma única tela: brief, plano, validação, tickets, execução e revisão.',
        code: '/evenbetter-ios:evenbetter-ios-feature "tela de checkout"',
        href: '/tutorial/plugins/ios#planejamento-ux',
      },
      {
        id: 'epic',
        name: 'evenbetter-ios-epic',
        desc: 'Workflow para apps ou épicos multi-tela com brief, fluxos, plano técnico HIG e validação de arquitetura.',
        code: '/evenbetter-ios:evenbetter-ios-epic "onboarding completo"',
        href: '/tutorial/plugins/ios#planejamento-ux',
      },
      {
        id: 'opportunity-research',
        name: 'evenbetter-app-opportunity-research',
        desc: 'Pesquisa oportunidades de app com análise de mercado, concorrentes e hipóteses priorizadas.',
        code: '/evenbetter-ios:evenbetter-app-opportunity-research "app de hábitos"',
        href: '/tutorial/plugins/ios#planejamento-ux',
      },
      {
        id: 'app-launcher',
        name: 'evenbetter-app-launcher',
        desc: 'Orquestra o ciclo completo: ideação, desenvolvimento, App Store, monetização e pós-lançamento.',
        code: '/evenbetter-ios:evenbetter-app-launcher "lançar app de finanças"',
        href: '/tutorial/plugins/ios#planejamento-ux',
      },
    ],
  },
  {
    id: 'swiftui',
    label: 'Design e SwiftUI',
    skills: [
      {
        id: 'design',
        name: 'evenbetter-design',
        desc: 'Direciona decisões de UI para evitar visual genérico e elevar acabamento de produto.',
        code: '/evenbetter-ios:evenbetter-design "redesenhar onboarding"',
        href: '/tutorial/plugins/ios#swiftui',
      },
      {
        id: 'ui-patterns',
        name: 'evenbetter-swiftui-ui-patterns',
        desc: 'Boas práticas para views, navegação, sheets, formulários, controles, Dynamic Type e composição.',
        code: '/evenbetter-ios:evenbetter-swiftui-ui-patterns ContentView.swift',
        href: '/tutorial/plugins/ios#swiftui',
      },
      {
        id: 'view-refactor',
        name: 'evenbetter-swiftui-view-refactor',
        desc: 'Refatora views grandes em subviews dedicadas, MV-first, com árvore estável e Observation correto.',
        code: '/evenbetter-ios:evenbetter-swiftui-view-refactor HomeScreen.swift',
        href: '/tutorial/plugins/ios#swiftui',
      },
      {
        id: 'liquid-glass',
        name: 'evenbetter-swiftui-liquid-glass',
        desc: 'Implementa e revisa o Liquid Glass do iOS 26+ com containers, shapes consistentes e fallbacks.',
        code: '/evenbetter-ios:evenbetter-swiftui-liquid-glass --target iOS26',
        href: '/tutorial/plugins/ios#swiftui',
      },
    ],
  },
  {
    id: 'audit',
    label: 'Auditoria',
    skills: [
      {
        id: 'analyze',
        name: 'evenbetter-analyze',
        desc: 'Analisa um projeto SwiftUI contra HIG e WCAG 2.2 e grava relatório HTML em .evenbetter/.',
        code: '/evenbetter-ios:evenbetter-analyze projectPath: /Users/me/MyApp',
        href: '/tutorial/plugins/ios#auditoria',
      },
      {
        id: 'validate',
        name: 'evenbetter-validate',
        desc: 'Faz uma segunda passada nas violações de severidade alta para filtrar falsos positivos.',
        code: '/evenbetter-ios:evenbetter-validate projectPath: /Users/me/MyApp',
        href: '/tutorial/plugins/ios#auditoria',
      },
    ],
  },
  {
    id: 'perf',
    label: 'Performance · A11y',
    skills: [
      {
        id: 'perf-audit',
        name: 'evenbetter-swiftui-performance-audit',
        desc: 'Diagnostica scrolling travado, hangs, picos de CPU e re-renderizações excessivas em SwiftUI.',
        code: '@performance-audit FeedView.swift',
        href: '/tutorial/plugins/ios#performance',
      },
      {
        id: 'a11y-ref',
        name: 'evenbetter-swiftui-accessibility',
        desc: 'Skill de referência: carrega cláusulas canônicas de acessibilidade do corpus Apple HIG e WCAG.',
        code: '/evenbetter-ios:evenbetter-swiftui-accessibility --corpus hig+wcag',
        href: '/tutorial/plugins/ios#performance',
      },
      {
        id: 'haptics',
        name: 'evenbetter-ios-haptics',
        desc: 'Projeta feedback tátil com .sensoryFeedback/Core Haptics e fallback acessível.',
        code: '/evenbetter-ios:evenbetter-ios-haptics "feedback em pagamentos"',
        href: '/tutorial/plugins/ios#performance',
      },
    ],
  },
  {
    id: 'system',
    label: 'Sistema',
    skills: [
      {
        id: 'app-intents',
        name: 'evenbetter-ios-app-intents',
        desc: 'Desenha e implementa App Intents, AppEntity e App Shortcuts para Siri, Spotlight, widgets e controles.',
        code: '/evenbetter-ios:app-intents "play song"',
        href: '/tutorial/plugins/ios#sistema',
      },
      {
        id: 'debugger',
        name: 'evenbetter-ios-debugger-agent',
        desc: 'Usa o XcodeBuildMCP para compilar, rodar e inspecionar o app em um simulador iOS conectado.',
        code: '/evenbetter-ios:debugger --target iPhone16',
        href: '/tutorial/plugins/ios#sistema',
      },
    ],
  },
]

export function SpecimenIndex() {
  const [active, setActive] = useState(CATEGORIES[0].id)
  const cat = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0]

  return (
    <div>
      <LayoutGroup id="specimen-tabs">
        <div className="eb-specimen-tabs" role="tablist" aria-label="Categorias de skills">
          {CATEGORIES.map((c) => {
            const isActive = c.id === active
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`specimen-${c.id}`}
                className={`eb-specimen-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="specimen-tab-bg"
                    className="eb-specimen-tab-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{c.label}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <div className="eb-skills-cta">
        <Link href="/tutorial/plugins/ios#visao-geral" className="eb-skills-cta-link">
          Saber mais sobre as skills
        </Link>
      </div>

      <div
        id={`specimen-${cat.id}`}
        role="tabpanel"
        className="eb-specimen-grid eb-fade-page"
        key={cat.id}
      >
        {cat.skills.map((s, i) => (
          <SpecimenCard key={s.id} skill={s} index={i} total={cat.skills.length} />
        ))}
      </div>
    </div>
  )
}

function SpecimenCard({
  skill,
  index,
  total,
}: {
  skill: Skill
  index: number
  total: number
}) {
  const num = String(index + 1).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  return (
    <Link href={skill.href} className="eb-skill-card">
      <span className="eb-skill-card-num">SKILL {num} / {totalStr}</span>
      <h4>{skill.name}</h4>
      <p>{skill.desc}</p>
      <div className="eb-specimen-snippet" aria-hidden>
        <span className="eb-specimen-prompt">$</span>
        <code>{skill.code}</code>
      </div>
    </Link>
  )
}
