'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon, Logo } from '../_components/tutorial-primitives'

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
          <Link href="/" className="eb-nav-link">Início</Link>
          <Link href="/#escolha-seu-agente" className="eb-nav-link">Guias</Link>
          <Link href="/about" className="eb-nav-link active">Sobre</Link>
        </div>
        <div className="eb-nav-spacer" />
      </nav>
    </div>
  )
}

/* ── Data ── */
type TeamMember = {
  name: string
  role: string
  bio: string
  email?: string
  mono: string
  photo?: string
}

const TEAM: TeamMember[] = [
  {
    name: 'Valéria F. Martins',
    role: 'Orientadora',
    bio: 'Professora orientadora da FCI/Mackenzie. Pesquisa em Interação Humano-Computador, acessibilidade e UX.',
    email: 'valeria.farinazzo@mackenzie.br',
    mono: 'V',
    photo: '/team/valeria-farinazzo.png',
  },
  {
    name: 'Marcello Birkan',
    role: 'Coautor',
    bio: 'Estudante da FCI/Mackenzie, com foco em iOS e SwiftUI. Lidera a implementação das skills do plugin EvenBetter iOS.',
    email: 'marcello.birkan@mackenzista.com.br',
    mono: 'M',
    photo: '/team/marcello-birkan.png',
  },
  {
    name: 'Daniela Flauto',
    role: 'Coautora',
    bio: 'Estudante da FCI/Mackenzie. Foco em UX, acessibilidade e curadoria do corpus de cláusulas do framework.',
    email: 'daniela.flauto@mackenzista.com.br',
    mono: 'D',
    photo: '/team/daniela-flauto.png',
  },
]

const STATS: { num: ReactNode; text: ReactNode }[] = [
  {
    num: '5 etapas',
    text: (
      <>
        Ciclo coberto pelas skills: <code>plan</code> → execução → <code>analyze</code> → <code>validate</code> →{' '}
        <code>fix</code>, com rastreabilidade entre cada artefato.
      </>
    ),
  },
  {
    num: '12 skills',
    text: (
      <>
        Distribuídas no plugin <code>evenbetter-ios</code> entre planejamento, padrões de SwiftUI, auditoria HIG/WCAG,
        performance e integração com sistema.
      </>
    ),
  },
  {
    num: (
      <>
        31% → <span className="eb-accent">69%</span>
      </>
    ),
    text: (
      <>
        Salto de cobertura quando se troca verificação estrutural por avaliação semântica via LLM em apps mobile
        nativos (Zhong et al., 2025).
      </>
    ),
  },
]

const REFERENCES: { title: string; meta: string; href: string }[] = [
  {
    title: 'Apple HIG',
    meta: 'Apple — 2024. Diretrizes oficiais de UX, UI e acessibilidade para iOS, iPadOS, macOS, watchOS e visionOS.',
    href: 'https://developer.apple.com/design/human-interface-guidelines/',
  },
  {
    title: 'Material Design 3',
    meta: 'Google — 2024. Sistema de design da plataforma Android, com regras de tipografia, cor, componentes e movimento.',
    href: 'https://m3.material.io/',
  },
  {
    title: 'WCAG 2.2',
    meta: 'W3C — 2024. Diretrizes internacionais de acessibilidade web, ainda usadas como baseline em mobile.',
    href: 'https://www.w3.org/TR/WCAG22/',
  },
  {
    title: 'ScreenAudit',
    meta: 'Zhong et al. — 2025 (CHI). Detecção de erros de leitor de tela em apps mobile usando LLMs.',
    href: 'https://scholar.google.com/scholar?q=ScreenAudit+Mobile+Apps+Large+Language+Models+Zhong',
  },
  {
    title: 'AccessGuru',
    meta: 'Fathallah et al. — 2025 (ASSETS). LLMs detectando e corrigindo violações de acessibilidade em HTML.',
    href: 'https://scholar.google.com/scholar?q=AccessGuru+LLMs+Web+Accessibility+HTML+Fathallah',
  },
  {
    title: 'Agent Skills',
    meta: 'Anthropic — 2025. Engineering blog e Claude Docs sobre Agent Skills, progressive disclosure e SKILL.md.',
    href: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
  },
  {
    title: 'SKILL.md spec',
    meta: 'agentskills.io — 2025. Especificação aberta do formato SKILL.md compartilhada entre agentes de IA.',
    href: 'https://agentskills.io/specification',
  },
  {
    title: 'SkillsBench',
    meta: 'Li et al. — 2026. Benchmark comparando skills curadas e skills geradas em tempo de execução.',
    href: 'https://arxiv.org/abs/2602.12670',
  },
  {
    title: 'Global Report on AT',
    meta: 'OMS — 2022. Relatório global sobre tecnologias assistivas e os mais de 2,5 bilhões de pessoas que dependem delas.',
    href: 'https://www.who.int/publications/i/item/9789240049451',
  },
  {
    title: '10 Heurísticas',
    meta: 'Nielsen — 1994. Heurísticas de usabilidade que ainda estruturam a avaliação de UX em produtos digitais.',
    href: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
  },
]

/* ── Team photo (with placeholder) ── */
function TeamPhoto({ member }: { member: TeamMember }) {
  return (
    <div className="eb-team-photo">
      {member.photo ? (
        <img src={member.photo} alt={member.name} />
      ) : (
        <>
          <div className="eb-team-photo-empty">
            <div className="eb-team-mono" aria-hidden>{member.mono}</div>
          </div>
          <span className="eb-team-photo-tag">Foto em breve</span>
        </>
      )}
    </div>
  )
}

/* ── Page ── */
export default function AboutPage() {
  return (
    <div className="eb-root">
      <Nav />

      <div className="eb-home eb-fade-page">

        {/* Hero — centered */}
        <div className="eb-hero-frame">
          <div className="eb-hero-centered">
            <div className="eb-hero-badge">TCC II · Mackenzie · 2026</div>
            <h1>
              Um framework de <span className="eb-accent">skills curadas</span> para levar UX e acessibilidade ao{' '}
              <span className="eb-stroke">DIA ZERO</span> do desenvolvimento mobile.
            </h1>
            <p className="eb-hero-centered-lede">
              EvenBetter é o trabalho de conclusão de curso de Marcello Birkan e Daniela Flauto na Faculdade de
              Computação e Informática (FCI) da Universidade Presbiteriana Mackenzie, sob orientação da
              Prof.ª Dr.ª Valéria Farinazzo Martins.
            </p>
            <div className="eb-hero-actions">
              <a
                href="https://github.com/MelloBirkan/EvenBetterFramework"
                target="_blank"
                rel="noopener noreferrer"
                className="eb-btn eb-btn-primary"
              >
                Ver no GitHub <Icon name="arrow" size={13} />
              </a>
              <Link
                href="/#escolha-seu-agente"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1f4e4a',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                }}
              >
                Voltar para os guias →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats — heading + description + 3 stats (mirrors StatsThreeColumnWithDescription) */}
        <section className="eb-stats-block" aria-labelledby="about-evenbetter">
          <div className="eb-stats-head">
            <h3 id="about-evenbetter">Sobre o EvenBetter</h3>
            <div className="eb-stats-desc">
              <p>
                EvenBetter parte de uma lacuna prática: ferramentas estruturais convencionais cobrem cerca de 31% das
                violações de acessibilidade em mobile, enquanto abordagens com LLMs sobem para 69%.
              </p>
              <p>
                Em vez de inserir mais um app ou agente proprietário no fluxo de trabalho, o framework distribui{' '}
                <em>skills</em> curadas que rodam dentro dos agentes que o desenvolvedor já usa, no padrão aberto de{' '}
                <code>SKILL.md</code>.
              </p>
              <p>
                O ciclo cobre planejamento, execução, análise, validação e correção, com rastreabilidade entre
                cláusula, achado, alteração e revalidação. O foco operacional inicial é SwiftUI/iOS, validado por{' '}
                <em>precision</em>, <em>recall</em> e <em>F1</em>, com comparação ao Xcode Accessibility Audit.
              </p>
            </div>
          </div>
          <div className="eb-stats">
            {STATS.map((s, i) => (
              <div key={i} className="eb-stat">
                <div className="eb-stat-num">{s.num}</div>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial — large quote (mirrors TestimonialLargeQuote) */}
        <figure className="eb-testimonial">
          <blockquote>
            guidelines não como auditoria final, mas como restrição de projeto desde a concepção da funcionalidade
          </blockquote>
          <figcaption>
            <div className="eb-testimonial-avatar" aria-hidden>EB</div>
            <p className="eb-testimonial-name">Artigo de TCC II</p>
            <p className="eb-testimonial-byline">Marcello, Daniela & Valéria — FCI/Mackenzie, 2026</p>
          </figcaption>
        </figure>

        {/* Team — grid with photos */}
        <section className="eb-team-block" aria-labelledby="quem-esta-por-tras">
          <div className="eb-section-head">
            <h2 id="quem-esta-por-tras">QUEM ESTÁ POR TRÁS</h2>
          </div>
          <p className="eb-section-sub">
            Três pessoas trabalhando em torno do mesmo recorte: UX e acessibilidade no ciclo de vida de aplicações
            mobile nativas.
          </p>
          <ul role="list" className="eb-team">
            {TEAM.map((m) => {
              const inner = (
                <>
                  <TeamPhoto member={m} />
                  <div>
                    <p className="eb-team-role">{m.role}</p>
                    <p className="eb-team-name">{m.name}</p>
                    <p className="eb-team-bio">{m.bio}</p>
                  </div>
                </>
              )
              return (
                <li key={m.name}>
                  {m.email ? (
                    <a className="eb-team-card" href={`mailto:${m.email}`}>
                      {inner}
                    </a>
                  ) : (
                    <div className="eb-team-card">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* References */}
        <section className="eb-skills-section" id="referencias" aria-labelledby="referencias-h2">
          <div className="eb-section-head">
            <h2 id="referencias-h2">REFERÊNCIAS</h2>
          </div>
          <p className="eb-section-sub">
            Recorte das fontes que sustentam o trabalho. A bibliografia completa está no artigo de TCC II.
          </p>
          <div className="eb-skills-grid">
            {REFERENCES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eb-skill-card"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <h4>{r.title}</h4>
                <p>{r.meta}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA — centered (mirrors CallToActionSimpleCentered) */}
        <section className="eb-cta" aria-labelledby="cta-h2">
          <div>
            <h2 id="cta-h2">Quer ver o EvenBetter em ação?</h2>
            <p style={{ marginTop: 12 }}>
              Os guias mostram como instalar as skills no Codex, no Claude Code ou direto no plugin EvenBetter iOS, em
              poucos passos.
            </p>
          </div>
          <div className="eb-cta-actions">
            <Link href="/#escolha-seu-agente" className="eb-btn eb-btn-primary">
              Ver os guias <Icon name="arrow" size={13} />
            </Link>
            <a
              href="https://github.com/MelloBirkan/EvenBetterFramework"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1f4e4a',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              }}
            >
              Ver no GitHub →
            </a>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="eb-footer">
        <div className="eb-footer-inner">
          <span className="eb-footer-brand">
            <span className="eb-brand-mark" style={{ width: 22, height: 22 }}><Logo /></span>
            EvenBetter
          </span>
          <span className="eb-footer-sep">·</span>
          <a
            href="https://github.com/MelloBirkan/EvenBetterFramework"
            target="_blank"
            rel="noopener noreferrer"
            className="eb-footer-link"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
