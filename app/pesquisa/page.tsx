import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteNav } from '../_components/site-nav'
import { SiteFooter } from '../_components/site-footer'
import { ButtonLink } from '../../components/site/button'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '../../components/site/icons'
import { Reveal, RevealGroup, RevealItem } from '../../components/site/reveal'
import { SectionHeader } from '../../components/site/section-header'
import { SplitHeading } from '../../components/site/split-heading'
import { Architecture } from '../../components/site/research/architecture'
import { Cite } from '../../components/site/research/cite'
import { Citation } from '../../components/site/research/citation'
import { ClauseAnatomy, DomainBars } from '../../components/site/research/clause-anatomy'
import { ContextLayers, Evolution } from '../../components/site/research/framework-extras'
import { GapDemo } from '../../components/site/research/gap-demo'
import { DsrSteps, Participants, SessionStrip } from '../../components/site/research/method'
import { Oversight } from '../../components/site/research/oversight'
import { AUTHORS, PAPER, REFERENCES, sectionNumber, type SectionId } from '../../components/site/research/paper'
import { FindingParts, ReportFigure, SeverityMap } from '../../components/site/research/report-figure'
import { Requirements } from '../../components/site/research/requirements'
import { ResearchHero } from '../../components/site/research/research-hero'
import { ResearchToc } from '../../components/site/research/research-toc'
import { Journey, Qualitative, SusResults } from '../../components/site/research/results'

const DESCRIPTION =
  'O artigo do EvenBetter aceito na JIIHC 2026: skills curadas que levam o HIG, a acessibilidade da Apple e a WCAG 2.2 para agentes de IA, com um estudo com dez devs iOS e SUS médio de 79,5.'

export const metadata: Metadata = {
  title: 'Pesquisa',
  description: DESCRIPTION,
  alternates: { canonical: '/pesquisa' },
  openGraph: {
    type: 'article',
    title: 'A pesquisa do EvenBetter · JIIHC 2026',
    description: DESCRIPTION,
    url: '/pesquisa',
  },
  twitter: { card: 'summary_large_image', title: 'A pesquisa do EvenBetter · JIIHC 2026', description: DESCRIPTION },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: PAPER.title,
  inLanguage: 'en',
  author: AUTHORS.map((a) => ({ '@type': 'Person', name: a.name, sameAs: `https://orcid.org/${a.orcid}` })),
  sourceOrganization: { '@type': 'CollegeOrUniversity', name: 'Universidade Presbiteriana Mackenzie' },
  datePublished: '2026',
  about: ['Agent skills', 'Accessibility', 'SwiftUI', 'Human-AI interaction', 'Context-aware systems'],
  isPartOf: { '@type': 'Event', name: PAPER.venueLong, location: 'Universidad de Talca, Talca, Chile', startDate: '2026-11-10' },
  codeRepository: PAPER.code,
}

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: SectionId
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-20 first:border-t-0 md:py-24">
      <SectionHeader id={`${id}-title`} eyebrow={`${sectionNumber(id)} · ${eyebrow}`} title={title} lede={lede} />
      {children}
    </section>
  )
}

function SubHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <SplitHeading as="h3" id={id} className="h3 mt-20 max-w-[30ch]">
      {children}
    </SplitHeading>
  )
}

const WHY_NOW = [
  { value: '95,9%', text: 'das home pages do WebAIM Million 2026 tinham falhas de WCAG detectáveis.', cite: 4 },
  {
    value: '69,2% × 31,3%',
    text: 'dos erros de leitor de tela em apps: uma auditoria com LLM contra um verificador muito usado.',
    cite: 9,
  },
  { value: '84%', text: 'dos devs usam ou pretendem usar IA, mas confiam pouco na precisão do que ela entrega.', cite: 5 },
]

const RQS = [
  {
    id: 'RQ1',
    q: 'Como skills curadas podem codificar diretrizes de UX e acessibilidade como conhecimento procedural para agentes que entendem o contexto, no desenvolvimento SwiftUI?',
    a: 'Respondida pelo design do artefato',
    href: '#framework',
  },
  {
    id: 'RQ2',
    q: 'Como devs iOS percebem, entendem e usam um fluxo com skills para planejar apps e auditar acessibilidade?',
    a: 'Respondida pelo estudo com dez devs',
    href: '#metodo',
  },
]

const IMPLICATIONS = [
  {
    t: 'O pedido abre a conversa.',
    d: 'Ferramentas com agentes devem tratar o prompt como o começo da interação, não como uma especificação completa.',
  },
  { t: 'Relatório é para gente ler.', d: 'A saída de uma auditoria deve ser um artefato legível, com evidência e severidade à vista.' },
  {
    t: 'A incerteza aparece no fluxo.',
    d: 'Separar análise de validação e perguntar quando a correção depende da intenção do produto deixa a dúvida visível.',
  },
  {
    t: 'O onboarding faz parte do sistema.',
    d: 'Nomes, exemplos, documentação e integração com a IDE decidem se as pessoas conseguem aproveitar as skills.',
  },
]

const THREATS = [
  { k: 'Validade interna', d: 'O ambiente veio pronto. Ninguém instalou o framework do zero nem rodou a análise completa na sessão.' },
  { k: 'Validade de construto', d: 'A tarefa mediu se as pessoas entendiam o relatório, não se cada achado estava tecnicamente certo.' },
  { k: 'Validade externa', d: 'Dez participantes recrutados por conveniência, todos com SwiftUI, avaliando um único app.' },
  { k: 'Confiabilidade', d: 'Mesmo com as skills fixas, versões futuras dos modelos podem gerar saídas diferentes.' },
  { k: 'Sem comparação', d: 'Não houve linha de base, então os ganhos ainda não podem ser creditados às skills em vez de a um agente sem elas.' },
]

const NEXT: { text: string; cite?: number }[] = [
  { text: 'Comparar com agentes sem skills curadas e com verificadores determinísticos nos mesmos apps, com métricas objetivas.' },
  { text: 'Medir a precisão dos achados com especialistas em acessibilidade: verdadeiros e falsos positivos e cobertura.' },
  { text: 'Avaliar vários apps iOS, com interfaces diferentes, equipes maiores e ambientes industriais.' },
  {
    text: 'Medir a eficácia das correções e o uso ao longo do tempo, inclusive se a validação ativa mantém a detecção de erros.',
    cite: 24,
  },
]

export default function ResearchPage() {
  return (
    <div className="site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <SiteNav />
      <main id="main">
        <ResearchHero />

        <div className="wrap lg:grid lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[210px_minmax(0,1fr)] xl:gap-16">
          <ResearchToc />

          <div className="min-w-0">
            {/* 01 */}
            <Section
              id="contexto"
              eyebrow="Contexto"
              title={
                <>
                  O agente preenche as <span className="serif">lacunas</span> sozinho.
                </>
              }
              lede="Quando o pedido não diz quem vai usar, como se navega e que regras valem, o agente completa o resto com suposições plausíveis. Em acessibilidade, a omissão vira código antes de alguém pensar nela."
            >
              <GapDemo />

              <RevealGroup className="mt-8 grid gap-3 md:grid-cols-3" stagger={0.08}>
                {WHY_NOW.map((w) => (
                  <RevealItem key={w.value} className="rounded-[24px] border border-line bg-card p-5">
                    <p className="num text-[1.7rem] leading-none font-semibold tracking-[-0.03em] text-ink">{w.value}</p>
                    <p className="mt-3 text-[14.5px] leading-snug text-ink-2">
                      {w.text} <Cite n={w.cite} />
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal className="mt-8">
                <div className="grid gap-6 rounded-[28px] bg-night p-6 text-on-night sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    <p className="font-mono text-[11.5px] tracking-[0.14em] text-glow uppercase">A aposta</p>
                    <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed">
                      Uma skill é um pacote versionado que diz quando se aplica, o que perguntar, o que consultar, que passos
                      seguir e como entregar o resultado <Cite n={[6, 7]} className="text-on-night-3" />. As do EvenBetter
                      são curadas antes, a partir das fontes oficiais. O agente não inventa o procedimento enquanto trabalha.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:max-w-[260px]">
                    <p className="num text-[2.4rem] leading-none font-semibold tracking-[-0.04em] text-glow">+16,6</p>
                    <p className="mt-2 text-[14px] leading-snug text-on-night-2">
                      pontos percentuais na taxa média de acerto com skills curadas no SkillsBench. Skills geradas pelo próprio
                      agente ficaram abaixo de não usar nenhuma <Cite n={15} className="text-on-night-3" />.
                    </p>
                  </div>
                </div>
              </Reveal>

              <RevealGroup className="mt-8 grid gap-3 md:grid-cols-2" stagger={0.1}>
                {RQS.map((r) => (
                  <RevealItem key={r.id} className="flex flex-col rounded-[24px] border border-line bg-card p-6">
                    <p className="font-mono text-[13px] font-semibold text-brand">{r.id}</p>
                    <p className="mt-2 flex-1 text-[16.5px] leading-snug font-medium text-ink">{r.q}</p>
                    <a href={r.href} className="link mt-4 w-fit text-[14px] font-medium">
                      {r.a}
                    </a>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Section>

            {/* 02 */}
            <Section
              id="comando"
              eyebrow="Humano no comando"
              title={
                <>
                  Você decide antes de o agente <span className="serif">agir</span>.
                </>
              }
              lede={
                <>
                  Automação alta e controle humano alto podem andar juntos <Cite n={23} />. No EvenBetter, a direção, as
                  restrições e os critérios de aceite vêm de quem desenvolve. Escolha um modo para comparar.
                </>
              }
            >
              <Oversight />
            </Section>

            {/* 03 */}
            <Section
              id="requisitos"
              eyebrow="Requisitos"
              title={
                <>
                  Cinco requisitos guiaram o <span className="serif">design</span>.
                </>
              }
              lede="O sistema não substitui o julgamento profissional nem certifica acessibilidade. Ele adapta a interação à tarefa e deixa o contexto à vista."
            >
              <Requirements />
            </Section>

            {/* 04 */}
            <Section
              id="framework"
              eyebrow="Arquitetura"
              title={
                <>
                  Mesmo modelo, <span className="serif">procedimento</span> diferente.
                </>
              }
              lede="Cada etapa do fluxo é uma skill com seu próprio contrato de saída. Escolha uma etapa para ver o que o agente lê e o que escreve."
            >
              <Architecture />

              <RevealGroup className="mt-8 grid gap-3 md:grid-cols-2" stagger={0.1}>
                <RevealItem className="rounded-[24px] border border-line bg-card p-6">
                  <p className="text-[16px] font-semibold text-ink">A separação é proposital.</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                    Numa conversa solta, &quot;analise a acessibilidade&quot; logo vira &quot;corrija tudo&quot;. Aqui,
                    cada passagem entre planejar, analisar, validar e corrigir fica explícita nos artefatos.
                  </p>
                </RevealItem>
                <RevealItem className="rounded-[24px] border border-line bg-card p-6">
                  <p className="text-[16px] font-semibold text-ink">Uma memória fora do modelo.</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                    O contexto do modelo é temporário. Planos com decisões e relatórios com evidência ficam versionados e
                    podem ser reabertos e revisados.
                  </p>
                </RevealItem>
              </RevealGroup>

              <SubHeading>Cinco camadas de contexto</SubHeading>
              <Reveal delay={0.1} y={12}>
                <p className="mt-4 max-w-[56ch] text-[16.5px] leading-relaxed text-ink-2">
                  Contexto, aqui, não é localização nem perfil. É a etapa da tarefa, o código em análise, as diretrizes e as
                  decisões que ainda dependem de alguém.
                </p>
              </Reveal>
              <ContextLayers />

              <SubHeading>Por que skills, e não um app</SubHeading>
              <Evolution />
            </Section>

            {/* 05 */}
            <Section
              id="clausulas"
              eyebrow="Cláusulas"
              title={
                <>
                  Como uma diretriz vira <span className="serif">cláusula</span>.
                </>
              }
              lede={
                <>
                  O corpus saiu direto das fontes primárias: o HIG, a documentação de acessibilidade e VoiceOver da Apple e os
                  critérios da WCAG 2.2 que valem para apps nativos <Cite n={[1, 2, 3]} />.
                </>
              }
            >
              <ClauseAnatomy />
              <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <Reveal>
                  <DomainBars />
                </Reveal>
                <RevealGroup className="grid content-start gap-3" stagger={0.1}>
                  <RevealItem className="rounded-[24px] border border-line bg-card p-5">
                    <p className="text-[15.5px] font-semibold text-ink">IDs que não mudam</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">
                      Quando a Apple atualiza uma página do HIG, a cláusula é revisada no histórico. O ID fica, e os achados
                      antigos continuam rastreáveis.
                    </p>
                  </RevealItem>
                  <RevealItem className="rounded-[24px] border border-line bg-card p-5">
                    <p className="text-[15.5px] font-semibold text-ink">Limiares preservados</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">
                      Quando a fonte define um número, como o tamanho mínimo de toque ou a razão de contraste, a cláusula
                      guarda o número.
                    </p>
                  </RevealItem>
                  <RevealItem>
                    <ButtonLink href="/#corpus" variant="secondary" className="w-full">
                      Explorar as 49 cláusulas
                    </ButtonLink>
                  </RevealItem>
                </RevealGroup>
              </div>
            </Section>

            {/* 06 */}
            <Section
              id="relatorio"
              eyebrow="Relatório"
              title={
                <>
                  O relatório é o <span className="serif">artefato</span> central.
                </>
              }
              lede="Em vez de um veredito fechado, quem desenvolve recebe evidência para conferir. Este é o relatório que os participantes leram no estudo."
            >
              <ReportFigure />
              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                <Reveal className="rounded-[28px] border border-line bg-card p-6 sm:p-7">
                  <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Todo achado traz</p>
                  <div className="mt-5">
                    <FindingParts />
                  </div>
                  <p className="mt-5 text-[14px] leading-relaxed text-ink-2">
                    Cada achado precisa citar uma fonte oficial da plataforma. O que não dá para confirmar é descartado em
                    vez de ir para o relatório.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <SeverityMap />
                </Reveal>
              </div>
            </Section>

            {/* 07 */}
            <Section
              id="metodo"
              eyebrow="Método"
              title={
                <>
                  Como <span className="serif">avaliamos</span>.
                </>
              }
              lede={
                <>
                  Seguimos a Design Science Research <Cite n={[16, 17]} />. A avaliação foi exploratória e formativa: olhou
                  para o fluxo entre pessoa e agente e para os artefatos, não para a precisão do modelo.
                </>
              }
            >
              <DsrSteps />
              <div className="mt-12 grid gap-4 xl:grid-cols-2">
                <Reveal>
                  <Participants />
                </Reveal>
                <Reveal delay={0.1}>
                  <SessionStrip />
                </Reveal>
              </div>
              <Reveal className="mt-4">
                <p className="rounded-[24px] border border-dashed border-line-2 p-5 text-[14.5px] leading-relaxed text-ink-2">
                  <strong className="font-semibold text-ink">Análise.</strong> As sessões juntaram observação, pensar em voz
                  alta <Cite n={18} /> e o SUS <Cite n={19} />. As notas do SUS foram descritas por média, mediana, desvio
                  padrão, mínimo e máximo. O resto passou por análise temática <Cite n={22} /> em quatro dimensões:
                  usabilidade, compreensão, dificuldades e utilidade percebida.
                </p>
              </Reveal>
            </Section>

            {/* 08 */}
            <Section
              id="resultados"
              eyebrow="Resultados"
              title={
                <>
                  Usabilidade em <span className="serif">79,5</span> e um relatório que todos leram.
                </>
              }
              lede="Os dez participantes responderam ao SUS depois das tarefas guiadas. Mais abaixo está o que aconteceu em cada etapa da sessão."
            >
              <SusResults />
              <Journey />
              <Qualitative />
            </Section>

            {/* 09 */}
            <Section
              id="implicacoes"
              eyebrow="Implicações"
              title={
                <>
                  Quatro lições para quem cria <span className="serif">ferramentas</span> com agentes.
                </>
              }
            >
              <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2" stagger={0.1}>
                {IMPLICATIONS.map((m, i) => (
                  <RevealItem key={m.t} className="rounded-[26px] border border-line bg-card p-6 sm:p-7">
                    <span className="grid size-9 place-items-center rounded-full bg-mint font-mono text-[13px] font-semibold text-brand-ink">
                      {i + 1}
                    </span>
                    <p className="mt-4 text-[18px] leading-snug font-semibold tracking-[-0.01em] text-ink">{m.t}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{m.d}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Section>

            {/* 10 */}
            <Section
              id="limites"
              eyebrow="Limites"
              title={
                <>
                  O que o estudo <span className="serif">não</span> mostra.
                </>
              }
              lede="Os resultados não medem a precisão das auditorias. Mostram que skills curadas conseguem estruturar a interação e manter o julgamento humano visível."
            >
              <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
                <RevealGroup className="grid content-start gap-2.5" stagger={0.07}>
                  {THREATS.map((t) => (
                    <RevealItem key={t.k} y={14} className="rounded-2xl border border-line bg-card p-4">
                      <p className="font-mono text-[11.5px] font-semibold tracking-[0.1em] text-high uppercase">{t.k}</p>
                      <p className="mt-1.5 text-[15px] leading-snug text-ink">{t.d}</p>
                    </RevealItem>
                  ))}
                </RevealGroup>
                <Reveal>
                  <div className="rounded-[28px] bg-night p-6 text-on-night sm:p-7">
                    <p className="font-mono text-[11.5px] tracking-[0.14em] text-glow uppercase">Próximos passos</p>
                    <ol className="relative mt-5 grid gap-5 border-l border-white/12 pl-6">
                      {NEXT.map((n, i) => (
                        <li key={n.text} className="relative">
                          <span className="absolute top-0.5 -left-[35px] grid size-[22px] place-items-center rounded-full bg-glow font-mono text-[11px] font-semibold text-night">
                            {['i', 'ii', 'iii', 'iv'][i]}
                          </span>
                          <p className="text-[15px] leading-relaxed text-on-night">
                            {n.text} {n.cite && <Cite n={n.cite} className="text-on-night-3" />}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              </div>
            </Section>

            {/* 11 */}
            <Section
              id="etica"
              eyebrow="Ética e código"
              title={
                <>
                  Aprovado, aberto e <span className="serif">declarado</span>.
                </>
              }
            >
              <RevealGroup className="mt-12 grid gap-3 md:grid-cols-3" stagger={0.1}>
                <RevealItem className="rounded-[24px] border border-line bg-card p-6">
                  <p className="text-[16px] font-semibold text-ink">Aprovação ética</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                    Comitê de Ética em Pesquisa da Universidade Presbiteriana Mackenzie. Pesquisa de risco mínimo.
                  </p>
                  <dl className="mt-4 grid gap-1 font-mono text-[12.5px] text-ink-2">
                    <div>
                      <dt className="inline text-ink-3">CAAE </dt>
                      <dd className="inline">96317526.0.0000.0084</dd>
                    </div>
                    <div>
                      <dt className="inline text-ink-3">Parecer </dt>
                      <dd className="inline">8.376.386</dd>
                    </div>
                  </dl>
                </RevealItem>
                <RevealItem className="flex flex-col rounded-[24px] border border-line bg-card p-6">
                  <p className="text-[16px] font-semibold text-ink">Código aberto</p>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-2">
                    Os plugins, as skills e o corpus de 49 cláusulas estão públicos no GitHub.
                  </p>
                  <a
                    href={PAPER.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link mt-4 inline-flex w-fit items-center gap-1 text-[14px] font-medium"
                  >
                    MelloBirkan/EvenBetterFramework <ArrowUpRight size={14} />
                  </a>
                </RevealItem>
                <RevealItem className="rounded-[24px] border border-line bg-card p-6">
                  <p className="text-[16px] font-semibold text-ink">Uso de IA generativa</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                    Ferramentas de IA generativa ajudaram na redação, na revisão e na organização do texto. Os autores
                    definiram o problema, o método, as fontes e a leitura dos dados, e respondem pelo texto final.
                  </p>
                </RevealItem>
              </RevealGroup>
            </Section>

            {/* 12 */}
            <Section
              id="citar"
              eyebrow="Como citar"
              title={
                <>
                  Use o EvenBetter na sua <span className="serif">pesquisa</span>.
                </>
              }
              lede={
                <>
                  O artigo foi aceito no 8° Workshop en Sistemas Interactivos Inteligentes, parte das 12° Jornadas
                  Iberoamericanas de Interacción Humano-Computadora, em Talca, no Chile.
                </>
              }
            >
              <Citation />
              <Reveal className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <a href={PAPER.slides} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-medium">
                  Slides da apresentação <ArrowUpRight size={14} />
                </a>
                <a href={PAPER.program} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-medium">
                  Programa do evento <ArrowUpRight size={14} />
                </a>
              </Reveal>
            </Section>

            {/* 13 */}
            <Section
              id="referencias"
              eyebrow="Referências"
              title={
                <>
                  As 25 <span className="serif">referências</span> do artigo.
                </>
              }
            >
              <ol className="mt-10 grid gap-1">
                {REFERENCES.map((r) => (
                  <li
                    key={r.n}
                    id={`ref-${r.n}`}
                    className="ref-item grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-xl px-3 py-2.5 text-[14px] leading-relaxed text-ink-2"
                  >
                    <span className="font-mono text-[12.5px] text-ink-3">[{r.n}]</span>
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      <span lang="en">{r.text}</span>
                      {r.url && (
                        <>
                          {' '}
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="link font-mono text-[12.5px]">
                            {r.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          </div>
        </div>

        <section aria-labelledby="pesquisa-cta" className="wrap pt-8">
          <div className="on-night night-glow relative isolate overflow-hidden rounded-[36px] px-6 py-14 text-center sm:px-12 md:py-20">
            <SplitHeading id="pesquisa-cta" className="h2 mx-auto max-w-[20ch] text-on-night">
              Experimente o que o artigo <span className="serif">descreve</span>.
            </SplitHeading>
            <Reveal delay={0.15} y={12}>
              <p className="lede mx-auto mt-5 max-w-[40rem]">Instale o plugin no Claude Code ou no Codex e rode a primeira auditoria.</p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/#comecar" variant="mint" size="lg">
                  Instalar o plugin
                </ButtonLink>
                <Link
                  href="/tutorial/plugins/ios"
                  className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 px-6 font-medium text-on-night transition-colors hover:bg-white/8"
                >
                  Guia do plugin iOS <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
