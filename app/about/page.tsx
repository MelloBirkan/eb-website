import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { SiteNav } from '../_components/site-nav'
import { SiteFooter } from '../_components/site-footer'
import { Icon } from '../_components/icons'
import { MetricCounter } from '../../components/_eb/metric-counter'

import valeriaPhoto from '../../public/team/valeria-farinazzo.png'
import marcelloPhoto from '../../public/team/marcello-birkan.png'
import danielaPhoto from '../../public/team/daniela-flauto.png'

export const metadata = {
  title: 'Sobre',
  description:
    'TCC II da FCI/Mackenzie — um framework de skills curadas para levar UX e acessibilidade ao dia zero do desenvolvimento mobile.',
}

type TeamMember = {
  name: string
  role: string
  bio: string
  email?: string
  mono: string
  photo: typeof valeriaPhoto
}

const TEAM: TeamMember[] = [
  {
    name: 'Valéria F. Martins',
    role: 'Orientadora',
    bio: 'Professora orientadora da FCI/Mackenzie. Pesquisa em Interação Humano-Computador, acessibilidade e UX.',
    email: 'valeria.farinazzo@mackenzie.br',
    mono: 'V',
    photo: valeriaPhoto,
  },
  {
    name: 'Marcello Birkan',
    role: 'Coautor',
    bio: 'Estudante da FCI/Mackenzie, com foco em iOS e SwiftUI. Lidera a implementação das skills do plugin EvenBetter iOS.',
    email: 'marcello.birkan@mackenzista.com.br',
    mono: 'M',
    photo: marcelloPhoto,
  },
  {
    name: 'Daniela Flauto',
    role: 'Coautora',
    bio: 'Estudante da FCI/Mackenzie. Foco em UX, acessibilidade e curadoria do corpus de cláusulas do framework.',
    email: 'daniela.flauto@mackenzista.com.br',
    mono: 'D',
    photo: danielaPhoto,
  },
]

const STATS: { num: ReactNode; text: ReactNode }[] = [
  {
    num: '5 etapas',
    text: (
      <>
        Ciclo coberto pelas skills: <code>plan</code> → execução → <code>analyze</code> →{' '}
        <code>validate</code> → <code>fix</code>, com rastreabilidade entre cada artefato.
      </>
    ),
  },
  {
    num: '15 skills',
    text: (
      <>
        Distribuídas no plugin <code>evenbetter-ios</code> entre planejamento, design, padrões de
        SwiftUI, auditoria HIG/WCAG, performance, haptics e integração com sistema.
      </>
    ),
  },
  {
    num: 'Open · Aberto',
    text: (
      <>
        Skills no padrão aberto <code>SKILL.md</code>, executadas dentro dos agentes que o
        desenvolvedor já usa — Codex, Claude Code, e o plugin direto.
      </>
    ),
  },
]

const REFERENCES = [
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

const RESEARCH_UPDATES = [
  {
    title: 'Escopo implementado',
    text: (
      <>
        A versão do artigo consolida <strong>2 plugins</strong> (<code>evenbetter-ios</code> e{' '}
        <code>evenbetter-general</code>), <strong>17 skills instaláveis</strong>,{' '}
        <strong>49 cláusulas iOS</strong> em sete domínios e geração de artefatos em{' '}
        <code>.evenbetter/</code>.
      </>
    ),
  },
  {
    title: 'Avaliação com desenvolvedores',
    text: (
      <>
        Avaliação exploratória com <strong>10 desenvolvedores iOS</strong> em ambiente controlado,
        cobrindo descoberta no site, planejamento com skill, leitura de relatório e percepção de uso.
      </>
    ),
  },
  {
    title: 'Resultado SUS',
    text: (
      <>
        A pontuação média foi <strong>79,5</strong> (mediana 81,25; desvio padrão 15,1; mínimo 57,5;
        máximo 100), acima do benchmark 68 usado como referência em estudos de usabilidade.
      </>
    ),
  },
  {
    title: 'Achados de auditoria no estudo',
    text: (
      <>
        No protocolo com o app Aroma Care, os participantes leram corretamente um relatório com{' '}
        <strong>55 achados</strong> (15 críticos e 40 altos). O corpus de 49 cláusulas funciona como
        base normativa; múltiplos achados podem surgir para a mesma cláusula em telas diferentes.
      </>
    ),
  },
  {
    title: 'Maturidade do fluxo',
    text: (
      <>
        A verificação interna estabilizou o uso em fases separadas (
        <code>plan → analyze → validate → fix</code>), com rastreabilidade por evidência, domínio,
        severidade e referência de diretriz.
      </>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="eb-root">
      <SiteNav />

      <main id="main" className="eb-home eb-fade-page">
        {/* ───── Hero — centered ───── */}
        <div className="eb-hero-frame">
          <div className="eb-hero-centered">
            <div className="eb-hero-badge">
              <span className="eb-dot" /> TCC II · Mackenzie · 2026
            </div>
            <h1>
              Um framework de <span className="eb-accent">skills curadas</span> para levar UX e
              acessibilidade ao <span className="eb-stroke">dia zero</span> do desenvolvimento mobile.
            </h1>
            <p className="eb-hero-centered-lede">
              EvenBetter é o trabalho de conclusão de curso de <strong>Marcello Birkan</strong> e{' '}
              <strong>Daniela Flauto</strong> na Faculdade de Computação e Informática da
              Universidade Presbiteriana Mackenzie, sob orientação da{' '}
              <strong>Prof.ª Dr.ª Valéria Farinazzo Martins</strong>.
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
              <Link href="/#escolha-seu-agente" className="eb-btn eb-btn-secondary">
                Voltar para os guias <Icon name="arrow" size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ───── Big stat — 31 → 69% ───── */}
        <section aria-labelledby="bigstat-h2" className="eb-bigstat">
          <span id="bigstat-h2" className="eb-bigstat-eyebrow">
            <span>O salto que motiva o trabalho</span>
          </span>
          <div className="eb-bigstat-grid">
            <div className="eb-bigstat-num" aria-hidden>
              <span className="eb-from">
                <MetricCounter value={31} suffix="%" />
              </span>
              <span className="eb-arrow"> → </span>
              <span className="eb-to">
                <MetricCounter value={69} suffix="%" />
              </span>
            </div>
            <div className="eb-bigstat-bars">
              <div className="eb-bigstat-bar-row">
                <span className="eb-bigstat-bar-label">Estrutural</span>
                <div className="eb-bigstat-bar-track">
                  <div
                    className="eb-bigstat-bar-fill muted"
                    style={{ width: '31%' }}
                  />
                </div>
                <span className="eb-bigstat-bar-val">31%</span>
              </div>
              <div className="eb-bigstat-bar-row">
                <span className="eb-bigstat-bar-label">LLM-driven</span>
                <div className="eb-bigstat-bar-track">
                  <div
                    className="eb-bigstat-bar-fill"
                    style={{ width: '69%' }}
                  />
                </div>
                <span className="eb-bigstat-bar-val">69%</span>
              </div>
              <p className="eb-bigstat-cite">
                Cobertura de violações de acessibilidade em apps mobile nativos quando se troca a
                verificação estrutural por avaliação semântica conduzida por modelos de linguagem.
                <br />— Zhong et al. (2025), <em>ScreenAudit</em>, CHI&apos;25.
              </p>
            </div>
          </div>
        </section>

        {/* ───── Stats — heading + description + 3 cards ───── */}
        <section className="eb-stats-block" aria-labelledby="about-evenbetter">
          <div className="eb-stats-head">
            <h3 id="about-evenbetter">
              Sobre o <span className="eb-accent">EvenBetter</span>
            </h3>
            <div className="eb-stats-desc">
              <p>
                EvenBetter parte de uma lacuna prática: ferramentas estruturais convencionais cobrem
                cerca de 31% das violações de acessibilidade em mobile, enquanto abordagens com LLMs
                sobem para 69%.
              </p>
              <p>
                Em vez de inserir mais um app ou agente proprietário no fluxo de trabalho, o framework
                distribui <em>skills</em> curadas que rodam dentro dos agentes que o desenvolvedor já
                usa, no padrão aberto de <code>SKILL.md</code>.
              </p>
              <p>
                O ciclo cobre planejamento, execução, análise, validação e correção, com
                rastreabilidade entre cláusula, achado, alteração e revalidação. O foco operacional
                inicial é SwiftUI/iOS, validado por <em>precision</em>, <em>recall</em> e{' '}
                <em>F1</em>, com comparação ao Xcode Accessibility Audit.
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

        {/* ───── Testimonial ───── */}
        <figure className="eb-testimonial">
          <blockquote>
            guidelines não como auditoria final, mas como restrição de projeto desde a concepção da
            funcionalidade
          </blockquote>
          <figcaption>
            <div className="eb-testimonial-avatar" aria-hidden>EB</div>
            <p className="eb-testimonial-name">Artigo de TCC II</p>
            <p className="eb-testimonial-byline">Marcello, Daniela &amp; Valéria — FCI/Mackenzie, 2026</p>
          </figcaption>
        </figure>

        {/* ───── Team ───── */}
        <section className="eb-team-block" aria-labelledby="quem-esta-por-tras">
          <div className="eb-section-head">
            <h2 id="quem-esta-por-tras">Quem está por trás.</h2>
            <p className="eb-lede">
              Três pessoas trabalhando em torno do mesmo recorte: UX e acessibilidade no ciclo de
              vida de aplicações mobile nativas.
            </p>
          </div>
          <ul role="list" className="eb-team">
            {TEAM.map((m) => {
              const Inner = (
                <>
                  <div className="eb-team-photo">
                    <Image
                      src={m.photo}
                      alt={m.name}
                      placeholder="blur"
                      sizes="(max-width: 940px) 220px, 33vw"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
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
                      {Inner}
                    </a>
                  ) : (
                    <div className="eb-team-card">{Inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* ───── Research updates ───── */}
        <section className="eb-skills-section" id="atualizacoes-artigo" aria-labelledby="atualizacoes-h2">
          <div className="eb-section-head">
            <h2 id="atualizacoes-h2">Atualizações do artigo.</h2>
            <p className="eb-lede">
              Pontos adicionados a partir da versão consolidada do TCC, mantendo o conteúdo atual do
              site e ampliando o contexto de avaliação.
            </p>
          </div>
          <ol className="eb-refs">
            {RESEARCH_UPDATES.map((item) => (
              <li key={item.title}>
                <div className="eb-ref">
                  <p className="eb-ref-title">{item.title}</p>
                  <p className="eb-ref-meta">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ───── References ───── */}
        <section className="eb-skills-section" id="referencias" aria-labelledby="referencias-h2">
          <div className="eb-section-head">
            <h2 id="referencias-h2">Referências.</h2>
            <p className="eb-lede">
              Recorte das fontes que sustentam o trabalho. A bibliografia completa está no artigo
              de TCC II.
            </p>
          </div>
          <ol className="eb-refs">
            {REFERENCES.map((r) => (
              <li key={r.title}>
                <a className="eb-ref" href={r.href} target="_blank" rel="noopener noreferrer">
                  <p className="eb-ref-title">{r.title}</p>
                  <p className="eb-ref-meta">{r.meta}</p>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* ───── CTA ───── */}
        <section className="eb-cta" aria-labelledby="cta-h2">
          <div>
            <h2 id="cta-h2">
              Quer ver o EvenBetter <span className="eb-accent">em ação</span>?
            </h2>
            <p style={{ marginTop: 12 }}>
              Os guias mostram como instalar as skills no Codex, no Claude Code ou direto no plugin
              EvenBetter iOS, em poucos passos.
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
              className="eb-btn eb-btn-secondary"
            >
              Ver no GitHub <Icon name="arrow" size={13} />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
