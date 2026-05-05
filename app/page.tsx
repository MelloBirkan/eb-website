import Link from 'next/link'
import dynamic from 'next/dynamic'
import { SiteNav } from './_components/site-nav'
import { SiteFooter } from './_components/site-footer'
import { ScrollToAgentsButton } from './_components/scroll-to-agents-button'
import { HeroIllo, AgentIllo } from './_components/hero-illustrations'
import { Icon } from './_components/icons'
import { SpecimenIndex } from '../components/_eb/specimen-index'

// Heavy scroll component — only loaded when needed.
const AuditTheater = dynamic(
  () => import('../components/_eb/audit-theater').then((m) => m.AuditTheater),
  { ssr: true }
)

const STEPS = [
  {
    title: 'Escolha o agente',
    desc: 'Selecione o ambiente onde você já trabalha. EvenBetter é compatível com agentes que suportam instruções estruturadas, como Codex e Claude Code.',
  },
  {
    title: 'Instale as skills',
    desc: 'Copie o comando de instalação e execute no diretório do seu projeto. Isso adiciona as skills do EvenBetter ao repositório.',
  },
  {
    title: 'Execute a análise',
    desc: 'Use o agente para rodar a análise no projeto. As skills carregam automaticamente e o relatório aparece com base nas guidelines.',
  },
]

const INSTALL_AGENTS = [
  {
    href: '/tutorial/codex',
    kind: 'codex' as const,
    tag: 'OpenAI',
    title: 'Codex',
    desc: 'Agente de terminal da OpenAI. Compatível com projetos que já usam o ecossistema OpenAI.',
    cta: 'Ver instalação',
    dark: false,
  },
  {
    href: '/tutorial/anthropic',
    kind: 'claude' as const,
    tag: 'Anthropic',
    title: 'Claude Code',
    desc: 'Agente de terminal da Anthropic. Ideal para quem já usa Claude no fluxo de desenvolvimento.',
    cta: 'Ver instalação',
    dark: true,
  },
]

const PLUGIN_AGENTS = [
  {
    href: '/tutorial/plugins/ios',
    kind: 'ios' as const,
    tag: 'Plugin',
    title: 'EvenBetter iOS',
    desc: '12 skills para iOS e SwiftUI: planejamento, padrões, auditoria HIG/WCAG, performance e integração com sistema.',
    cta: 'Ver guia',
    dark: false,
  },
]

type AgentCardData = {
  href: string
  kind: 'codex' | 'claude' | 'ios'
  tag: string
  title: string
  desc: string
  cta: string
  dark: boolean
}

function AgentCard({ a }: { a: AgentCardData }) {
  return (
    <Link
      href={a.href}
      className={`eb-provider${a.dark ? ' dark' : ''}`}
    >
      <div className="eb-provider-illo"><AgentIllo kind={a.kind} dark={a.dark} /></div>
      <div className="eb-provider-tag">{a.tag}</div>
      <h3>{a.title}</h3>
      <p>{a.desc}</p>
      <span className="eb-provider-cta">{a.cta} <Icon name="arrow" size={12} /></span>
    </Link>
  )
}

export default function Home() {
  return (
    <div className="eb-root">
      <SiteNav />
      <main id="main" className="eb-home eb-fade-page">
        {/* ───── Hero ───── */}
        <div className="eb-hero-frame">
          <div className="eb-hero">
            <div className="eb-hero-left">
              <div>
                <div className="eb-hero-badge">
                  <span className="eb-dot" /> iOS · SwiftUI · 2026
                </div>
                <h1>
                  Skills curadas para <span className="eb-accent">acessibilidade</span> em iOS{' '}
                  <span className="eb-stroke">em 3 passos</span>.
                </h1>
                <div className="eb-hero-text-block">
                  <div className="eb-rule" />
                  <p>
                    EvenBetter fornece skills estruturadas que orientam a leitura de código, boas
                    práticas de UX e a geração de recomendações — direto no agente que você já usa.
                  </p>
                </div>
              </div>
              <div className="eb-hero-actions">
                <ScrollToAgentsButton />
                <Link href="/about" className="eb-btn eb-btn-secondary">
                  Sobre o trabalho <Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>
            <div className="eb-hero-right">
              <div className="eb-hero-illo-stage"><HeroIllo /></div>
              <div className="eb-hero-chips">
                <span className="eb-hero-chip"><span className="eb-dot" /> 12 skills</span>
                <span className="eb-hero-chip"><span className="eb-dot" /> 5 etapas</span>
                <span className="eb-hero-chip"><span className="eb-dot" /> 31 → 69%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Audit Theater (signature scrollytelling) ───── */}
        <section className="eb-section" aria-labelledby="theater-h2">
          <div className="eb-section-head">
            <h2 id="theater-h2">
              Veja a auditoria <span className="eb-accent">em ação</span>.
            </h2>
            <p className="eb-lede">
              Role para baixo e veja seis violações reais de acessibilidade emergirem de uma tela
              de SwiftUI — exatamente como o agente as identificaria.
            </p>
          </div>
          <AuditTheater />
        </section>

        {/* ───── Three steps ───── */}
        <div id="passos" className="eb-steps-frame">
          {STEPS.map((s, i) => (
            <div key={i} className="eb-step">
              <div className="eb-step-num">{`0${i + 1}`}</div>
              <div className="eb-step-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ───── Agents — 2 groups: Instalação + Plugin ───── */}
        <section id="escolha-seu-agente" style={{ scrollMarginTop: 90 }} aria-labelledby="agents-h2">
          <div className="eb-section-head">
            <h2 id="agents-h2">Por onde começar.</h2>
            <p className="eb-lede">
              Primeiro instale o agente. Depois use o plugin para rodar a análise no seu projeto iOS.
            </p>
          </div>

          {/* Instalação */}
          <div className="eb-group-label">
            <span className="eb-group-num">01</span>
            <span>Instalação</span>
            <span className="eb-group-desc">Escolha o agente de IA onde você já trabalha.</span>
          </div>
          <div className="eb-providers" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {INSTALL_AGENTS.map((a) => <AgentCard key={a.href} a={a} />)}
          </div>

          {/* Plugin */}
          <div className="eb-group-label" style={{ marginTop: 56 }}>
            <span className="eb-group-num">02</span>
            <span>Como usar o plugin</span>
            <span className="eb-group-desc">Com o agente instalado, rode as análises com as skills.</span>
          </div>
          <div className="eb-providers" style={{ gridTemplateColumns: '1fr' }}>
            {PLUGIN_AGENTS.map((a) => <AgentCard key={a.href} a={a} />)}
          </div>
        </section>

        {/* ───── Skills (SpecimenIndex) ───── */}
        <section id="skills" className="eb-skills-section" aria-labelledby="skills-h2">
          <div className="eb-section-head">
            <h2 id="skills-h2">
              <span className="eb-accent">12</span> skills do plugin iOS.
            </h2>
            <p className="eb-lede">
              Filtradas por categoria. Passe o cursor sobre um card para ver a invocação correspondente.
            </p>
          </div>
          <SpecimenIndex />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
