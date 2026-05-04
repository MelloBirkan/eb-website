'use client'

import Link from 'next/link'
import { Icon, Logo } from './_components/tutorial-primitives'

/* ── SVG illustrations ── */
const HeroIllo = () => (
  <svg viewBox="0 0 460 360" fill="none">
    <ellipse cx="230" cy="180" rx="200" ry="130" fill="#a9d4c4" opacity="0.18" />
    <g>
      <rect x="120" y="80" width="240" height="200" rx="22" fill="white" opacity="0.88" />
      <rect x="120" y="80" width="240" height="200" rx="22" stroke="#a9d4c4" strokeWidth="1" opacity="0.5" />
      <rect x="138" y="100" width="60" height="10" rx="5" fill="#1f4e4a" />
      <rect x="138" y="118" width="180" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="130" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="150" width="180" height="62" rx="14" fill="#a9d4c4" opacity="0.45" />
      <rect x="152" y="164" width="120" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="178" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="192" width="80" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="138" y="226" width="92" height="32" rx="16" fill="#1f4e4a" />
      <rect x="156" y="238" width="42" height="6" rx="3" fill="#b6efd9" />
      <circle cx="216" cy="242" r="3" fill="#b6efd9" />
    </g>
    <g transform="translate(40 100)">
      <rect width="92" height="40" rx="14" fill="#0f2825" stroke="#a9d4c4" strokeOpacity="0.2" />
      <text x="14" y="25" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#b6efd9" fontWeight="600">@eb</text>
      <rect x="52" y="16" width="28" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.7" />
      <rect x="52" y="23" width="18" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.4" />
    </g>
    <g transform="translate(330 240)">
      <rect width="96" height="36" rx="18" fill="#b6efd9" stroke="white" />
      <circle cx="18" cy="18" r="5" fill="#1f4e4a" />
      <text x="30" y="23" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#1f4e4a" fontWeight="700">✓ pronto</text>
    </g>
    <circle cx="230" cy="180" r="160" stroke="#a9d4c4" strokeWidth="1.5" strokeDasharray="2 7" opacity="0.4" />
    <circle cx="60" cy="200" r="8" fill="#1f4e4a" opacity="0.3" />
    <circle cx="60" cy="200" r="3" fill="#1f4e4a" />
    <circle cx="410" cy="100" r="4" fill="#1f4e4a" opacity="0.5" />
    <circle cx="380" cy="320" r="3" fill="#1f4e4a" opacity="0.5" />
    <circle cx="100" cy="60" r="2" fill="#1f4e4a" opacity="0.6" />
  </svg>
)

const AgentIllo = ({ kind, dark }: { kind: string; dark?: boolean }) => {
  const stroke = dark ? '#a9d4c4' : '#266b65'
  const fill = dark ? '#a9d4c4' : '#266b65'
  const centerFill = dark ? '#1f4e4a' : 'white'
  if (kind === 'codex') return (
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 30 L162 42 L162 66 L140 78 L118 66 L118 42 Z" fill={fill} />
      <path d="M140 30 L162 42 L140 54 L118 42 Z" fill={fill} opacity="0.7" />
      <circle cx="140" cy="54" r="5" fill={centerFill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 56 L142 60 L140 64 L138 60 Z" fill={fill} />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
  if (kind === 'ios') return (
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <rect x="116" y="36" width="44" height="44" rx="10" fill={fill} opacity="0.3" />
      <rect x="122" y="44" width="44" height="44" rx="10" fill={fill} opacity="0.6" />
      <rect x="128" y="52" width="44" height="44" rx="10" fill={fill} />
      <path d="M142 72 L149 79 L162 64" stroke={centerFill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
  return (
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 28 L148 52 L172 60 L148 68 L140 92 L132 68 L108 60 L132 52 Z" fill={fill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 52 L144 58 L140 64 L136 58 Z" fill={fill} opacity="0.8" />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
}

/* ── Nav ── */
function Nav() {
  return (
    <div className="eb-nav-wrap">
      <nav className="eb-nav">
        <Link href="/" className="eb-brand">
          <span className="eb-brand-mark"><Logo /></span>
          EVENBETTER
        </Link>
        <div className="eb-nav-links">
          <Link href="/" className="eb-nav-link active">Início</Link>
          <Link href="/#escolha-seu-agente" className="eb-nav-link">Guias</Link>
          <Link href="/about" className="eb-nav-link">Sobre</Link>
        </div>
        <div className="eb-nav-spacer" />
      </nav>
    </div>
  )
}

/* ── Home ── */
export default function Home() {
  const scrollToAgents = () => {
    document.getElementById('escolha-seu-agente')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="eb-root">
      <Nav />
      <div className="eb-home eb-fade-page">

        {/* Hero */}
        <div className="eb-hero-frame">
          <div className="eb-hero">
            <div className="eb-hero-left">
              <div>
                <div className="eb-hero-badge">iOS / SwiftUI</div>
                <h1 style={{ fontSize: 'clamp(36px,4.5vw,55px)' }}>
                  Use Agentes de <span className="eb-accent">IA</span> para analisar acessibilidade do seu app{' '}
                  <span className="eb-stroke">EM</span> <span className="eb-accent">3 PASSOS</span>
                </h1>
                <div className="eb-hero-text-block">
                  <div className="eb-rule" />
                  <p>EvenBetter fornece skills estruturadas que orientam a leitura de código, boas práticas de UX e a geração de recomendações.</p>
                </div>
              </div>
              <div className="eb-hero-actions">
                <button className="eb-btn eb-btn-primary" onClick={scrollToAgents}>
                  Começar agora <Icon name="arrow" size={13} />
                </button>
              </div>
            </div>
            <div className="eb-hero-right">
              <div className="eb-hero-illo-stage"><HeroIllo /></div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="eb-steps-frame">
          {[
            { title: 'Escolha o agente de IA', desc: 'Selecione o ambiente onde você já trabalha. EvenBetter é compatível com agentes que suportam instruções estruturadas, como Codex e Claude Code.' },
            { title: 'Instale as skills no seu projeto', desc: 'Copie o comando de instalação correspondente e execute no diretório do seu projeto. Isso adiciona as skills do EvenBetter ao repositório.' },
            { title: 'Execute a análise', desc: 'Use o agente para rodar a análise no projeto. As skills serão carregadas automaticamente e o relatório será gerado com base nas guidelines.' },
          ].map((s, i) => (
            <div key={i} className="eb-step">
              <div className="eb-step-num">{`0${i + 1}`}</div>
              <div className="eb-step-body"><h4>{s.title}</h4><p>{s.desc}</p></div>
            </div>
          ))}
        </div>

        {/* Choose Agent */}
        <div id="escolha-seu-agente" style={{ scrollMarginTop: 90 }}>
          <div className="eb-section-head">
            <h2>POR ONDE COMEÇAR</h2>
          </div>
          <p className="eb-section-sub">Instale o EvenBetter no seu agente de terminal, ou pule direto para o guia dos plugins.</p>
          <div className="eb-providers" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Link href="/tutorial/codex" className="eb-provider">
              <div className="eb-provider-illo"><AgentIllo kind="codex" /></div>
              <div className="eb-provider-tag">OpenAI</div>
              <h3>Codex</h3>
              <p>Agente de terminal da OpenAI. Compatível com projetos que já usam o ecossistema OpenAI.</p>
              <span className="eb-provider-cta">Ver instalação <Icon name="arrow" size={12} /></span>
            </Link>
            <Link href="/tutorial/anthropic" className="eb-provider dark">
              <div className="eb-provider-illo"><AgentIllo kind="claude" dark /></div>
              <div className="eb-provider-tag">Anthropic</div>
              <h3>Claude Code</h3>
              <p>Agente de terminal da Anthropic. Ideal para quem já usa Claude no fluxo de desenvolvimento.</p>
              <span className="eb-provider-cta">Ver instalação <Icon name="arrow" size={12} /></span>
            </Link>
            <Link href="/tutorial/plugins/ios" className="eb-provider">
              <div className="eb-provider-illo"><AgentIllo kind="ios" /></div>
              <div className="eb-provider-tag">Plugin</div>
              <h3>EvenBetter iOS</h3>
              <p>12 skills para iOS e SwiftUI: planejamento, padrões, auditoria HIG/WCAG, performance e integração com sistema.</p>
              <span className="eb-provider-cta">Ver guia <Icon name="arrow" size={12} /></span>
            </Link>
          </div>
        </div>

        {/* Skills */}
        <div id="skills" className="eb-skills-section">
          <div className="eb-section-head">
            <h2>CONHEÇA AS SKILLS</h2>
          </div>
          <p className="eb-section-sub">12 skills do plugin EvenBetter iOS. Clique em qualquer card para abrir o guia de uso.</p>
          <div className="eb-skills-grid">
            {[
              { title: 'evenbetter-ios-feature',   desc: 'Workflow em estágios para uma única tela: brief, plano, validação, tickets, execução e revisão.', href: '/tutorial/plugins/ios#planejamento-ux' },
              { title: 'evenbetter-ios-epic',      desc: 'Workflow para apps ou épicos multi-tela com brief, fluxos, plano técnico HIG e validação de arquitetura.', href: '/tutorial/plugins/ios#planejamento-ux' },
              { title: 'evenbetter-swiftui-ui-patterns',      desc: 'Boas práticas para views, navegação, sheets, formulários, controles, Dynamic Type e composição.', href: '/tutorial/plugins/ios#swiftui' },
              { title: 'evenbetter-swiftui-view-refactor',    desc: 'Refatora views grandes em subviews dedicadas, MV-first, com árvore estável e Observation correto.', href: '/tutorial/plugins/ios#swiftui' },
              { title: 'evenbetter-swiftui-liquid-glass',     desc: 'Implementa e revisa o Liquid Glass do iOS 26+ com containers, shapes consistentes e fallbacks.', href: '/tutorial/plugins/ios#swiftui' },
              { title: 'evenbetter-ios-analyze',   desc: 'Analisa um projeto SwiftUI contra HIG e WCAG 2.2 e grava um relatório JSON em .evenbetter/.', href: '/tutorial/plugins/ios#auditoria' },
              { title: 'evenbetter-validate',      desc: 'Faz uma segunda passada nas violações de severidade alta para filtrar falsos positivos.', href: '/tutorial/plugins/ios#auditoria' },
              { title: 'evenbetter-fix',           desc: 'Orquestra a remediação a partir dos relatórios, prioriza correções e atualiza o estado do manifesto.', href: '/tutorial/plugins/ios#auditoria' },
              { title: 'evenbetter-swiftui-performance-audit', desc: 'Diagnostica scrolling travado, hangs, picos de CPU e re-renderizações excessivas em SwiftUI.', href: '/tutorial/plugins/ios#performance' },
              { title: 'evenbetter-swiftui-accessibility',    desc: 'Skill de referência: carrega cláusulas canônicas de acessibilidade do corpus Apple HIG e WCAG.', href: '/tutorial/plugins/ios#performance' },
              { title: 'evenbetter-ios-app-intents',          desc: 'Desenha e implementa App Intents, AppEntity e App Shortcuts para Siri, Spotlight, widgets e controles.', href: '/tutorial/plugins/ios#sistema' },
              { title: 'evenbetter-ios-debugger-agent',       desc: 'Usa o XcodeBuildMCP para compilar, rodar e inspecionar o app em um simulador iOS conectado.', href: '/tutorial/plugins/ios#sistema' },
            ].map((skill) => (
              <Link key={skill.title} href={skill.href} className="eb-skill-card">
                <h4>{skill.title}</h4>
                <p>{skill.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="eb-footer">
        <div className="eb-footer-inner">
          <span className="eb-footer-brand">
            <span className="eb-brand-mark" style={{ width: 22, height: 22 }}><Logo /></span>
            EvenBetter
          </span>
          <span className="eb-footer-sep">·</span>
          <a href="https://github.com/MelloBirkan/EvenBetterFramework" target="_blank" rel="noopener noreferrer" className="eb-footer-link">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
