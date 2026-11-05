'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AgentChat } from '../../../../components/site/guide/agent-chat'
import { setAgent, useAgent, type Agent } from '../../../../components/site/guide/agent-choice'
import {
  AgentCode,
  Callout,
  CardGrid,
  CodeBlock,
  Invocation,
  MenuPath,
  PromptList,
  SkillSession,
  Step,
  Steps,
  TagList,
  Terminal,
  type CardItem,
} from '../../../../components/site/guide/blocks'
import {
  GuideShell,
  HeroField,
  StepHead,
  StepLink,
  type GuideStep,
} from '../../../../components/site/guide/guide-shell'
import { useGuideStep } from '../../../../components/site/guide/use-guide-step'
import { ArrowRight } from '../../../../components/site/icons'
import { EASE_OUT, SPRING } from '../../../../components/site/motion'
import { Segmented, type SegmentOption } from '../../../../components/site/research/segmented'

type StepId = 'visao-geral' | 'planejamento-ux' | 'swiftui' | 'auditoria' | 'performance' | 'xcode-mcp' | 'sistema'

const STEPS: GuideStep<StepId>[] = [
  { id: 'visao-geral', title: 'Visão geral' },
  { id: 'planejamento-ux', title: 'Planejamento de UX' },
  { id: 'swiftui', title: 'Padrões SwiftUI' },
  { id: 'auditoria', title: 'Auditoria HIG/WCAG' },
  { id: 'performance', title: 'Performance e A11y' },
  { id: 'xcode-mcp', title: 'Xcode MCP' },
  { id: 'sistema', title: 'Integração com sistema' },
]

const IDS = STEPS.map((s) => s.id)

const AGENT_OPTIONS: SegmentOption<Agent>[] = [
  { id: 'claude', label: 'Claude Code', sub: '/evenbetter-ios:skill' },
  { id: 'codex', label: 'Codex', sub: '@skill' },
]

const pad = (n: number) => String(n).padStart(2, '0')

/* ───── 01 · Visão geral ───── */

const PHASES: { to: StepId; verb: string; skills: string }[] = [
  { to: 'planejamento-ux', verb: 'Planejar', skills: 'feature, épico, pesquisa e lançamento' },
  { to: 'swiftui', verb: 'Construir', skills: 'design e padrões SwiftUI' },
  { to: 'auditoria', verb: 'Auditar', skills: 'analyze, validate e repair' },
  { to: 'performance', verb: 'Otimizar', skills: 'performance, acessibilidade e haptics' },
  { to: 'sistema', verb: 'Integrar', skills: 'App Intents e simulador' },
]

/** The five phases the skills follow, each a way into its step. */
function PhaseMap() {
  return (
    <motion.ol
      aria-label="As fases do plugin"
      className="guide-block grid gap-2.5 sm:grid-cols-5 sm:gap-2"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.08 } } }}
    >
      {PHASES.map((p, i) => (
        <motion.li
          key={p.to}
          className="relative"
          variants={{
            hidden: { opacity: 0, y: 12 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
          }}
        >
          <StepLink
            to={p.to}
            className="group flex h-full items-center gap-4 rounded-[18px] border border-line bg-card p-3.5 pr-4 transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-28px_rgba(15,37,35,.35)] sm:flex-col sm:items-start sm:gap-3 sm:p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-2 bg-paper font-mono text-[12px] font-semibold text-brand transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand">
              {pad(i + 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] leading-tight font-semibold text-ink">{p.verb}</span>
              <span className="mt-1 block text-[13.5px] leading-snug text-ink-2">{p.skills}</span>
            </span>
            <ArrowRight
              size={16}
              className="shrink-0 text-ink-3 transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:text-brand sm:hidden"
            />
          </StepLink>
          {i < PHASES.length - 1 && (
            <motion.span
              aria-hidden
              className="absolute -bottom-[14px] left-[23px] z-10 grid size-[18px] place-items-center rounded-full border border-line-2 bg-paper text-ink-3 sm:top-[25px] sm:-right-[13px] sm:bottom-auto sm:left-auto"
              variants={{
                hidden: { opacity: 0, scale: 0.4 },
                shown: { opacity: 1, scale: 1, transition: { ...SPRING.lively, delay: 0.25 } },
              }}
            >
              <ArrowRight size={10} className="rotate-90 sm:rotate-0" />
            </motion.span>
          )}
        </motion.li>
      ))}
    </motion.ol>
  )
}

type Phase = 'plan' | 'build' | 'audit' | 'tune' | 'integrate'

const SKILL_GROUPS: { phase: Phase; verb: string; title: string; skills: { name: string; desc: string }[] }[] = [
  {
    phase: 'plan',
    verb: 'Planejar',
    title: 'Planejamento e produto',
    skills: [
      {
        name: 'evenbetter-ios-feature',
        desc: 'Fluxo em estágios para uma única tela: brief, plano, validação, tickets, execução e revisão.',
      },
      {
        name: 'evenbetter-ios-epic',
        desc: 'Fluxo para apps ou épicos com várias telas: brief, fluxos, plano técnico pelo HIG e validação da arquitetura.',
      },
      {
        name: 'evenbetter-app-opportunity-research',
        desc: 'Pesquisa a oportunidade de um app com análise de mercado, concorrentes e hipóteses priorizadas.',
      },
      {
        name: 'evenbetter-app-launcher',
        desc: 'Conduz o ciclo de vida inteiro: ideia, desenvolvimento, App Store, monetização e pós-lançamento.',
      },
    ],
  },
  {
    phase: 'build',
    verb: 'Construir',
    title: 'Design e SwiftUI',
    skills: [
      {
        name: 'evenbetter-design',
        desc: 'Orienta interfaces SwiftUI com acabamento de produto e decisões de design que fogem do genérico.',
      },
      {
        name: 'evenbetter-swiftui-ui-patterns',
        desc: 'Boas práticas para views, navegação, sheets, formulários, controles, Dynamic Type e composição.',
      },
      {
        name: 'evenbetter-swiftui-view-refactor',
        desc: 'Quebra views grandes em subviews dedicadas, com MV primeiro, árvore estável e Observation correto.',
      },
      {
        name: 'evenbetter-swiftui-liquid-glass',
        desc: 'Implementa e revisa o Liquid Glass do iOS 26 com containers, formas consistentes e fallbacks.',
      },
    ],
  },
  {
    phase: 'audit',
    verb: 'Auditar',
    title: 'Auditoria HIG e WCAG',
    skills: [
      {
        name: 'evenbetter-analyze',
        desc: 'Audita o projeto SwiftUI contra o HIG e a WCAG 2.2 e grava um relatório HTML em .evenbetter/, com arquivo, linha e duas formas de corrigir.',
      },
      {
        name: 'evenbetter-validate',
        desc: 'Relê cada achado contra o código, o corpus e a documentação da Apple, corrige o relatório e tira os falsos positivos.',
      },
      {
        name: 'evenbetter-repair',
        desc: 'Aplica as correções técnicas de um relatório validado e devolve para você as decisões de produto, texto e design.',
      },
    ],
  },
  {
    phase: 'tune',
    verb: 'Otimizar',
    title: 'Performance e acessibilidade',
    skills: [
      {
        name: 'evenbetter-swiftui-performance-audit',
        desc: 'Diagnostica rolagem travada, hangs, picos de CPU e re-renderizações demais em SwiftUI.',
      },
      {
        name: 'evenbetter-swiftui-accessibility',
        desc: 'Skill de referência: carrega as cláusulas de acessibilidade do corpus, vindas do HIG da Apple e da WCAG.',
      },
      {
        name: 'evenbetter-ios-haptics',
        desc: 'Projeta feedback tátil com .sensoryFeedback e Core Haptics, com fallback e critérios de acessibilidade.',
      },
    ],
  },
  {
    phase: 'integrate',
    verb: 'Integrar',
    title: 'Integração com o sistema',
    skills: [
      {
        name: 'evenbetter-ios-app-intents',
        desc: 'Desenha e implementa App Intents, AppEntity e App Shortcuts para Siri, Spotlight, widgets e controles.',
      },
      {
        name: 'evenbetter-ios-debugger-agent',
        desc: 'Usa o XcodeBuildMCP para compilar, rodar e inspecionar o app em um simulador iOS.',
      },
    ],
  },
]

const SKILL_COUNT = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0)

const SKILL_FILTERS: SegmentOption<Phase | 'all'>[] = [
  { id: 'all', label: <Count label="Todas" n={SKILL_COUNT} /> },
  ...SKILL_GROUPS.map((g) => ({ id: g.phase, label: <Count label={g.verb} n={g.skills.length} /> })),
]

function Count({ label, n }: { label: string; n: number }) {
  return (
    <>
      {label} <span className="font-mono text-[0.86em] font-normal opacity-55">{n}</span>
    </>
  )
}

/** All the skills, with a filter by phase so the sixteen cards stay easy to scan. */
function SkillBrowser() {
  const [phase, setPhase] = useState<Phase | 'all'>('all')
  const items = useMemo<CardItem[]>(
    () =>
      SKILL_GROUPS.filter((g) => phase === 'all' || g.phase === phase).flatMap((g) =>
        g.skills.map((s) => ({ title: s.name, meta: g.title, body: s.desc })),
      ),
    [phase],
  )
  return (
    <div className="guide-block">
      <Segmented<Phase | 'all'> label="Filtrar as skills por fase" options={SKILL_FILTERS} value={phase} onChange={setPhase} />
      <div className="mt-4">
        <CardGrid label="As skills do plugin" items={items} />
      </div>
    </div>
  )
}

function StepVisaoGeral() {
  return (
    <>
      <StepHead
        title={
          <>
            Comece pela <span className="serif">visão geral</span>
          </>
        }
      >
        As skills seguem o caminho de um app, do plano à integração com o sistema. Escolha uma fase para ir direto à
        etapa dela.
      </StepHead>

      <PhaseMap />

      <h3>Não sabe qual usar? Pergunte ao agente</h3>
      <p>
        Este chat fala com um Claude Managed Agent que conhece as skills do plugin. Conte o que você quer fazer e ele
        indica por onde começar.
      </p>
      <AgentChat />

      <h3>As 16 skills</h3>
      <SkillBrowser />

      <h3>Como chamar uma skill</h3>
      <p>
        Entre os agentes, só muda o jeito de chamar. No Claude Code, a skill vem depois de uma barra e do nome do plugin.
        No Codex, basta um <code>@</code> antes do nome. Escolha o seu agente no topo da página ou em qualquer bloco de
        código, e os exemplos do guia mudam junto.
      </p>
      <Invocation skill="<nome-da-skill>" />

      <Callout kind="note" title="Os números do artigo">
        Na versão estudada no TCC, o framework tinha <strong>2 plugins</strong> e <strong>17 skills</strong> ao todo
        (contando o <code>evenbetter-general</code>), <strong>49 cláusulas iOS</strong> e uma avaliação com 10
        desenvolvedores, que deu <strong>SUS 79,5</strong>. Depois do estudo, a <code>evenbetter-repair</code> entrou
        como quarta etapa do fluxo e o plugin <code>evenbetter-ios</code> chegou a 16 skills. Este guia mostra o uso no
        dia a dia.
      </Callout>

      <Callout kind="note" title="Ainda não instalou?">
        As skills só aparecem depois que o plugin está instalado. Veja como instalar no{' '}
        <Link href="/tutorial/anthropic" className="link">
          Claude Code
        </Link>{' '}
        ou no{' '}
        <Link href="/tutorial/codex" className="link">
          Codex
        </Link>
        .
      </Callout>

      <Callout kind="tip" title="Existe também o evenbetter-general">
        O mesmo marketplace publica um segundo plugin, com 2 skills que servem para qualquer plataforma:{' '}
        <code>evenbetter-general-feature</code> e <code>evenbetter-general-epic</code>. Ele ajuda quando o trabalho não
        é só iOS, ou para complementar o planejamento daqui. Os dois plugins convivem sem conflito. Para instalar, use{' '}
        <code>/plugin install evenbetter-general@evenbetter</code> no Claude Code ou o browser de plugins do Codex.
      </Callout>
    </>
  )
}

/* ───── 02 · Planejamento de UX ───── */

function StepPlanejamentoUX() {
  return (
    <>
      <StepHead
        title={
          <>
            Planejamento de <span className="serif">UX</span>
          </>
        }
      >
        Antes de escrever uma linha de SwiftUI, defina o problema. Estas quatro skills vão da descoberta ao plano
        executável e guardam tudo em <code>.evenbetter/&lt;nome&gt;/</code>, dentro do seu projeto.
      </StepHead>

      <h3>
        <code>evenbetter-ios-feature</code>
      </h3>
      <p>
        Para uma tela ou uma feature pequena. São oito estágios numerados, do <code>0-trigger-workflow</code> ao{' '}
        <code>7-cross-artifact-validation</code>: plano de UX, validação, tickets, execução e uma revisão feita contra
        capturas de tela e o código real.
      </p>
      <Invocation skill="evenbetter-ios-feature" />
      <SkillSession
        skill="evenbetter-ios-feature"
        args="quero adicionar uma tela de filtros à minha lista"
        title="Skill carregada · Estágio 0 (Trigger Workflow)"
        lines={[
          'Detectei projeto SwiftUI em ./MyApp',
          'Vou fazer 4 perguntas de múltipla escolha para clarear o escopo',
          'Pasta sugerida: .evenbetter/filtros-lista/',
        ]}
      />

      <h3>
        <code>evenbetter-ios-epic</code>
      </h3>
      <p>
        Para apps inteiros ou épicos com várias telas. São onze estágios, que passam por brief de UX, fluxos entre
        telas, validação do PRD, plano técnico pelo HIG, validação da arquitetura, tickets e revisão. Os artefatos
        principais são <code>ios-ux-brief.md</code>, <code>screen-flows.md</code> e <code>ios-hig-tech-plan.md</code>.
      </p>
      <Invocation skill="evenbetter-ios-epic" />

      <h3>
        <code>evenbetter-app-opportunity-research</code>
      </h3>
      <p>
        Para descobrir se um app vale a pena antes de construir. A skill organiza a pesquisa de nicho, mapeia os
        concorrentes, separa sinais reportados, estimados e inferidos e entrega um recorte priorizado para você decidir
        se investe na ideia.
      </p>
      <Invocation skill="evenbetter-app-opportunity-research" args="analisar oportunidade para app de hábitos" />

      <h3>
        <code>evenbetter-app-launcher</code>
      </h3>
      <p>
        Cobre o ciclo inteiro de um app iOS: ideia, planejamento, desenvolvimento, preparação para a App Store,
        monetização, marketing e o que vem depois do lançamento. Serve de roteiro quando o trabalho deixa de ser uma
        feature e vira a operação do produto.
      </p>
      <Invocation skill="evenbetter-app-launcher" args="lançar app de finanças pessoais" />

      <Callout kind="tip" title="Estágios são opcionais">
        A skill deduz o estágio pelo seu pedido, mas você pode escolher um passando <code>stage: 3-ticket-breakdown</code>{' '}
        (ou outro) junto com a chamada.
      </Callout>

      <Callout kind="note" title="Artefatos versionáveis">
        Tudo o que as skills geram fica em <code>.evenbetter/&lt;feature&gt;/</code>: o plano, os tickets em{' '}
        <code>tickets/UX-TICKET-NNN.md</code> e a revisão final. Faça commit dessa pasta para manter o histórico das
        decisões junto do código.
      </Callout>
    </>
  )
}

/* ───── 03 · Padrões SwiftUI ───── */

function StepSwiftUI() {
  return (
    <>
      <StepHead
        title={
          <>
            Padrões e refatoração <span className="serif">SwiftUI</span>
          </>
        }
      >
        Quatro skills para a hora de implementar: na primeira versão da tela, quando uma view cresce demais ou quando
        você quer adotar as APIs novas do iOS 26.
      </StepHead>

      <h3>
        <code>evenbetter-design</code>
      </h3>
      <p>
        Ajuda a tomar decisões de interface que fogem do genérico. Use para transformar wireframes ou requisitos em uma
        tela SwiftUI com hierarquia, contraste e ritmo de um produto pronto para lançar.
      </p>
      <Invocation skill="evenbetter-design" args="redesenhar tela de onboarding com foco em clareza" />

      <h3>
        <code>evenbetter-swiftui-ui-patterns</code>
      </h3>
      <p>
        Um catálogo com mais de 35 referências de componentes. Cobre <code>NavigationStack</code>, sheets guiadas por
        enum, async/await com <code>.task</code>, <code>TabView</code>, formulários, deep links, Dynamic Type, temas e
        um resumo de quando usar cada wrapper de estado (<code>@State</code>, <code>@Binding</code>,{' '}
        <code>@Environment</code>, <code>@Observable</code>).
      </p>
      <Invocation skill="evenbetter-swiftui-ui-patterns" />

      <h3>
        <code>evenbetter-swiftui-view-refactor</code>
      </h3>
      <p>
        Quebra views grandes em subviews dedicadas, em vez de vários <code>private var ...: some View</code>. Mantém a
        árvore estável (sem trocar a raiz com <code>if/else</code>), tira as ações de dentro do <code>body</code>,
        prefere MV a MVVM e ordena o arquivo sempre do mesmo jeito. Quando uma view passa de umas 300 linhas, é hora de
        chamar esta skill.
      </p>
      <Invocation skill="evenbetter-swiftui-view-refactor" />
      <SkillSession
        skill="evenbetter-swiftui-view-refactor"
        args="refatore SettingsView.swift"
        title="Plano de refatoração"
        lines={[
          '4 subviews extraídas: HeaderSection, FilterSection, ResultsSection, FooterSection',
          '3 ações inline viraram métodos privados',
          'A troca condicional da raiz saiu, e a condição foi para a .toolbar',
          'O body caiu de 312 para 47 linhas',
        ]}
      />

      <h3>
        <code>evenbetter-swiftui-liquid-glass</code>
      </h3>
      <p>
        Implementa e revisa o Liquid Glass do iOS 26 com as APIs nativas: <code>.glassEffect()</code>,{' '}
        <code>GlassEffectContainer</code>, <code>.buttonStyle(.glass)</code> e <code>.buttonStyle(.glassProminent)</code>.
        A skill acerta a ordem dos modificadores, agrupa os elementos no container, define o <code>glassEffectID</code>{' '}
        para o morphing e coloca o <code>#available(iOS 26, *)</code> com um fallback para as versões anteriores.
      </p>
      <Invocation skill="evenbetter-swiftui-liquid-glass" />

      <Callout kind="warn" title="Requer iOS 26 ou superior">
        O Liquid Glass só existe a partir do iOS 26. A skill sempre adiciona o <code>#available(iOS 26, *)</code> com um
        fallback, quase sempre <code>.ultraThinMaterial</code>. Se o seu deployment target ainda inclui do iOS 16 ao 25,
        os dois caminhos precisam funcionar.
      </Callout>
    </>
  )
}

/* ───── 04 · Auditoria HIG/WCAG ───── */

function StepAuditoria() {
  return (
    <>
      <StepHead
        title={
          <>
            Auditoria <span className="serif">HIG e WCAG</span>
          </>
        }
      >
        Três skills que trabalham sobre o mesmo relatório: o <strong>analyze</strong> encontra os problemas, o{' '}
        <strong>validate</strong> confere e o <strong>repair</strong> corrige. Cada uma é uma chamada separada, e você
        decide quando passar para a próxima.
      </StepHead>

      <Steps>
        <Step title="O analyze gera o relatório">
          Lê o projeto sem mudar o código e grava{' '}
          <code>.evenbetter/&lt;projeto&gt;/evenbetter-analyze-report.html</code>.
        </Step>
        <Step title="O validate confere o relatório">
          Relê cada achado contra o código e o corpus, tira os falsos positivos e ajusta as severidades no mesmo arquivo.
        </Step>
        <Step title="O repair aplica as correções">
          Só roda sobre um relatório validado. Corrige o que é técnico e pergunta a você o que depende do produto.
        </Step>
      </Steps>

      <h3>
        <code>evenbetter-analyze</code>
      </h3>
      <p>
        Recebe o caminho do projeto e compara o código SwiftUI com as 49 cláusulas do corpus, em sete domínios. Cada
        achado traz arquivo e linha, a cláusula de origem, a severidade, uma correção mínima, uma recomendada e um prompt
        de correção. Uma nova análise substitui o relatório anterior do projeto.
      </p>
      <Invocation skill="evenbetter-analyze" args="projectPath: /caminho/absoluto/do/projeto" />
      <SkillSession
        skill="evenbetter-analyze"
        args="projectPath: /Users/me/MyApp"
        title="Análise completa"
        lines={[
          'Wrote: .evenbetter/MyApp/evenbetter-analyze-report.html',
          'Findings: 47 (12 critical, 23 high, 9 medium, 3 low)',
          'Next: run evenbetter-validate on this report',
        ]}
      />

      <h3>
        <code>evenbetter-validate</code>
      </h3>
      <p>
        Relê cada achado contra o código atual, o corpus e a documentação da Apple. Tira os falsos positivos, corrige
        severidades e reescreve as correções erradas dentro do próprio relatório. Quando não há nada para mudar, responde
        só <code>OK</code>.
      </p>
      <Invocation skill="evenbetter-validate" args="projectPath: /caminho/absoluto/do/projeto" />

      <h3>
        <code>evenbetter-repair</code>
      </h3>
      <p>
        Percorre os achados do relatório validado, do mais grave ao mais leve. Quando a mudança é técnica, aplica a
        correção mínima ou a recomendada nos arquivos Swift e confere o resultado contra a cláusula. Quando a correção
        mexe em texto, navegação, comportamento ou design visual, pergunta com opções fechadas ou deixa a decisão anotada
        para você. No fim, cada achado fica marcado como aplicado, adiado, pulado ou com falha.
      </p>
      <Invocation skill="evenbetter-repair" args="projectPath: /caminho/absoluto/do/projeto" />

      <Callout kind="warn" title="Só o repair altera o seu código">
        O <code>analyze</code> e o <code>validate</code> só escrevem em <code>.evenbetter/</code>. O{' '}
        <code>repair</code> é a única etapa que edita arquivos Swift, e ele se recusa a rodar sobre um relatório que o{' '}
        <code>validate</code> ainda não conferiu.
      </Callout>

      <Callout kind="tip" title="Feche o ciclo com outro validate">
        Depois do <code>repair</code>, rode o <code>validate</code> de novo. Ele tira do relatório o que foi resolvido e
        marca como falha o que ainda viola a cláusula, para a próxima rodada.
      </Callout>

      <Callout kind="note" title="49 cláusulas não quer dizer 49 achados">
        No estudo com o app Aroma Care, um único relatório trouxe 55 achados (15 críticos e 40 altos), com 49 cláusulas
        no corpus. A mesma cláusula pode aparecer várias vezes, em arquivos, telas e estados diferentes.
      </Callout>
    </>
  )
}

/* ───── 05 · Performance e A11y ───── */

const PERF_SYMPTOMS = [
  'Renderização lenta',
  'Rolagem travada',
  'CPU alta ou bateria',
  'Memória crescendo',
  'Hangs ou interações travadas',
  'Atualizações de view demais',
]

function StepPerformance() {
  return (
    <>
      <StepHead
        title={
          <>
            Performance e <span className="serif">acessibilidade</span>
          </>
        }
      >
        Três skills sobre qualidade. A primeira conduz um diagnóstico, a segunda é uma referência de regras e a terceira
        cuida do feedback tátil acessível.
      </StepHead>

      <h3>
        <code>evenbetter-swiftui-performance-audit</code>
      </h3>
      <p>
        Começa pelo sintoma e o encaixa em uma destas seis categorias antes de pedir código ou um trace do Instruments:
      </p>
      <TagList label="Categorias de sintoma" items={PERF_SYMPTOMS} />
      <p>
        Na revisão, ela usa o catálogo <code>code-smells.md</code> para achar problemas como tempestades de invalidação,
        identidade instável em <code>ForEach</code>, trabalho pesado dentro do <code>body</code>, layout thrash com{' '}
        <code>GeometryReader</code> e imagem decodificada na main thread. Quando o código não basta, ela explica como
        capturar o trace no Instruments.
      </p>
      <Invocation skill="evenbetter-swiftui-performance-audit" />
      <SkillSession
        skill="evenbetter-swiftui-performance-audit"
        args="ProductListView trava ao rolar com 200 itens"
        title="Diagnóstico inicial"
        lines={[
          'Sintoma classificado: rolagem travada',
          'Suspeita no código: identidade instável em ForEach (id: \\.self com modelo mutável)',
          'Suspeita: imagem decodificada inline com .resizable() sem downsample',
          'Próximo passo: capturar um trace do Time Profiler durante a rolagem',
        ]}
      />

      <h3>
        <code>evenbetter-swiftui-accessibility</code>
      </h3>
      <p>
        É uma skill de <em>referência</em>: não roda análise nem refatora. Ela carrega as cláusulas de acessibilidade do
        corpus EvenBetter, vindas do HIG da Apple e da WCAG 2.2. Use quando quiser saber se um comportamento é exigido ou
        para ler o texto exato de regras como <code>A11Y-UI-001</code> e <code>A11Y-UX-001</code>.
      </p>
      <Invocation skill="evenbetter-swiftui-accessibility" args="qual o tamanho mínimo de toque pelo HIG?" />

      <h3>
        <code>evenbetter-ios-haptics</code>
      </h3>
      <p>
        Cuida do feedback tátil com o significado certo para cada evento da interface. Mostra quando usar{' '}
        <code>.sensoryFeedback</code>, quando descer para o Core Haptics e como manter um retorno visual e sonoro, para
        que a vibração nunca seja o único sinal.
      </p>
      <Invocation skill="evenbetter-ios-haptics" args="mapear haptics para fluxo de pagamento" />

      <Callout kind="note" title="A skill empresta regras para o analyze">
        O <code>evenbetter-analyze</code> usa o mesmo corpus. Para entender por que uma violação apareceu, perguntar à{' '}
        <code>evenbetter-swiftui-accessibility</code> é o caminho mais curto até a cláusula original.
      </Callout>
    </>
  )
}

/* ───── 06 · Xcode MCP ───── */

const XCODE_MCP_TOOLS: CardItem[] = [
  {
    title: 'Arquivos no projeto Xcode',
    meta: 'XcodeRead · XcodeWrite · XcodeUpdate · XcodeGlob · XcodeGrep',
    body: 'Lê, escreve e busca dentro do projeto aberto, seguindo a estrutura real de targets e grupos, e não só as pastas do disco.',
  },
  {
    title: 'Build e testes',
    meta: 'BuildProject · GetBuildLog · RunAllTests · RunSomeTests',
    body: 'Compila no scheme e no destination atuais e roda os testes. O log volta estruturado, então o agente depura erros reais.',
  },
  {
    title: 'Diagnóstico ao vivo',
    meta: 'XcodeListNavigatorIssues · XcodeRefreshCodeIssuesInFile',
    body: 'Lê os erros e avisos do Issue Navigator, com informação semântica que o compilador no terminal não dá.',
  },
  {
    title: 'Código, docs e previews',
    meta: 'ExecuteSnippet · DocumentationSearch · RenderPreview',
    body: 'Roda código Swift no REPL, busca na documentação da Apple (inclusive sessões da WWDC) e renderiza previews SwiftUI sem abrir o canvas.',
  },
  {
    title: 'Estrutura do projeto',
    meta: 'GetProjectStructure · GetSchemes',
    body: 'Descreve targets, grupos e schemes, para o agente decidir o que mexer antes de editar.',
  },
]

const XCODE_PROMPTS = [
  'Use o Xcode MCP para inspecionar o projeto aberto, entender os schemes disponíveis e rodar o build antes de sugerir mudanças.',
  'Use as ferramentas do Xcode para compilar o app, encontrar os erros de build e corrigir a implementação SwiftUI.',
  'Antes de editar, veja no Xcode quais targets, schemes e arquivos principais existem neste projeto.',
  'Depois de implementar, rode o build e os testes pelo Xcode MCP e me diga exatamente o que passou ou falhou.',
  'Use o DocumentationSearch para consultar a documentação da Apple antes de implementar esta feature em SwiftUI.',
]

/** The check that the xcode server is registered, typed in the reader's agent. */
function McpListSession() {
  const agent = useAgent()
  return (
    <Terminal
      key={agent}
      label="Terminal"
      prompt="$"
      log={[
        { cmd: `${agent === 'codex' ? 'codex' : 'claude'} mcp list` },
        {
          title: 'Servidores MCP conectados',
          lines: ['xcode · xcrun mcpbridge · Connected', '20 ferramentas disponíveis (BuildProject, RenderPreview, …)'],
        },
      ]}
    />
  )
}

function StepXcodeMCP() {
  return (
    <>
      <StepHead
        title={
          <>
            Ponte para o <span className="serif">Xcode MCP</span>
          </>
        }
      >
        O EvenBetter iOS já configura o MCP oficial do Xcode no seu agente. Com o plugin ativo, o Claude Code e o Codex
        ganham um servidor MCP chamado <code>xcode</code>, que roda o <code>xcrun mcpbridge</code>: a ponte da Apple que
        deixa agentes externos conversarem com o Xcode aberto.
      </StepHead>

      <Callout kind="note" title="O plugin não instala o Xcode">
        Ele só configura o agente para usar o MCP que vem com o Xcode 26.3 ou mais novo. O Xcode precisa estar
        instalado, autorizado e com o projeto aberto.
      </Callout>

      <h3>O que o Xcode MCP faz</h3>
      <p>
        O <code>xcrun mcpbridge</code> liga o agente ao processo do Xcode por XPC e expõe cerca de 20 ferramentas
        nativas, em cinco grupos:
      </p>
      <CardGrid label="Grupos de ferramentas do Xcode MCP" items={XCODE_MCP_TOOLS} />

      <h3>Por que isso ajuda</h3>
      <ul>
        <li>
          O agente vê o que o Xcode vê. A ponte usa XPC, então ele lê o estado real do projeto aberto: o scheme
          selecionado, o destination, os diagnósticos do Issue Navigator e os símbolos resolvidos. O{' '}
          <code>xcodebuild</code> no terminal não chega nisso.
        </li>
        <li>
          Build e testes voltam com erros e avisos em um formato que o agente entende, em vez de logs enormes para
          garimpar.
        </li>
        <li>
          O <code>DocumentationSearch</code> consulta a documentação da Apple e até sessões da WWDC sem sair do agente.
        </li>
        <li>
          O <code>RenderPreview</code> renderiza previews SwiftUI sem o canvas e devolve a imagem, então o agente vê o
          resultado da própria mudança.
        </li>
        <li>
          Você não precisa configurar nada. O plugin já registra o servidor; sem o EvenBetter, seria preciso adicionar o
          servidor à mão.
        </li>
      </ul>

      <h3>Antes de começar</h3>
      <p>Confira se você tem:</p>
      <ul>
        <li>
          macOS com o <strong>Xcode 26.3 ou mais novo</strong>.
        </li>
        <li>Claude Code ou Codex instalado.</li>
        <li>O plugin EvenBetter iOS instalado e ativo.</li>
        <li>O projeto iOS aberto no Xcode, com o scheme certo selecionado.</li>
        <li>A permissão para agentes externos ligada no Xcode, como mostra o passo seguinte.</li>
      </ul>
      <Callout kind="warn" title="O bridge não aparece?">
        Se <code>xcrun --find mcpbridge</code> der erro, o sistema está usando as Command Line Tools em vez do Xcode
        completo. Rode estes dois comandos e tente de novo:
      </Callout>
      <CodeBlock code={'sudo xcode-select -s /Applications/Xcode.app/Contents/Developer\nsudo xcodebuild -runFirstLaunch'} />

      <h3>Ative o MCP no Xcode</h3>
      <p>
        Sem essa permissão, o agente até tenta iniciar o MCP, mas o Xcode bloqueia as ferramentas. No Xcode, siga este
        caminho e ligue a opção:
      </p>
      <MenuPath
        label="Caminho no Xcode"
        items={['Xcode', 'Settings', 'Intelligence', 'Model Context Protocol', 'Allow external agents to use Xcode tools']}
      />

      <h3>Abra o projeto no Xcode</h3>
      <p>Antes de pedir qualquer coisa ao agente:</p>
      <Steps>
        <Step
          title={
            <>
              Abra o <code>.xcodeproj</code> ou o <code>.xcworkspace</code>
            </>
          }
        />
        <Step title="Selecione o scheme certo" />
        <Step title="Confirme que o projeto compila" />
        <Step title="Deixe o Xcode aberto enquanto o agente trabalha" />
      </Steps>
      <p>
        O MCP depende do Xcode aberto. Se ele estiver fechado, ou com outro projeto carregado, o agente até lista as
        ferramentas, mas elas ficam sem contexto.
      </p>

      <h3>Confira a configuração</h3>
      <p>
        Com o plugin ativo, veja no terminal se o servidor <code>xcode</code> aparece registrado:
      </p>
      <AgentCode code={{ claude: 'claude mcp list', codex: 'codex mcp list' }} />
      <McpListSession />
      <p>Sem o plugin, a mesma configuração seria feita à mão. Para referência, é este comando:</p>
      <AgentCode
        code={{
          claude: 'claude mcp add --transport stdio xcode -- xcrun mcpbridge',
          codex: 'codex mcp add xcode -- xcrun mcpbridge',
        }}
      />
      <p>Com o EvenBetter iOS, isso já vem pronto.</p>

      <h3>Peça do jeito certo</h3>
      <p>Diga ao agente quando usar o contexto do Xcode. Alguns pedidos que funcionam bem:</p>
      <PromptList label="Pedidos para o agente" items={XCODE_PROMPTS} />

      <h3>Boas práticas</h3>
      <ul>
        <li>Deixe o Xcode aberto durante toda a sessão do agente.</li>
        <li>Abra o projeto certo antes de começar.</li>
        <li>
          Use o <code>.xcworkspace</code> quando o projeto tiver Swift Package Manager, CocoaPods ou vários módulos.
        </li>
        <li>Confira se o scheme certo está selecionado.</li>
        <li>Peça para o agente compilar com frequência, e não só no final.</li>
        <li>
          Para bugs de interface, peça validação com build, <code>RenderPreview</code>, simulador ou testes.
        </li>
        <li>Se trocar de projeto no Xcode, reinicie a sessão do agente para não ficar com contexto antigo.</li>
        <li>Se o MCP parar de responder, confira se o Xcode continua aberto e se a permissão segue ligada.</li>
      </ul>

      <h3>Limitações</h3>
      <p>O Xcode MCP é local e depende do Xcode rodando na sua máquina. Por isso ele:</p>
      <ul>
        <li>funciona melhor em sessões locais no macOS;</li>
        <li>não funciona na nuvem nem no Linux, onde não há Xcode;</li>
        <li>não substitui a instalação do Xcode nem as permissões dele;</li>
        <li>não consegue agir se o projeto não estiver aberto.</li>
      </ul>

      <Callout kind="tip" title="Combine com a skill de debugger">
        O Xcode MCP trabalha dentro do IDE, com o projeto aberto. Para subir o app no simulador, tirar screenshots e
        simular toques, use também a <code>evenbetter-ios-debugger-agent</code> (
        <StepLink to="sistema">próxima etapa</StepLink>), que conversa com o <code>XcodeBuildMCP</code>.
      </Callout>

      <Callout kind="note" title="Em resumo">
        Com o EvenBetter iOS instalado, o agente já tem a ponte configurada. Falta só o Xcode instalado, autorizado e
        aberto no projeto certo.
      </Callout>
    </>
  )
}

/* ───── 07 · Integração com sistema ───── */

function StepSistema() {
  return (
    <>
      <StepHead
        title={
          <>
            Integração com <span className="serif">o sistema</span>
          </>
        }
      >
        Por último, duas skills que ligam o seu app ao resto do iOS: Siri, Spotlight, widgets, controles e o simulador.
      </StepHead>

      <h3>
        <code>evenbetter-ios-app-intents</code>
      </h3>
      <p>
        Desenha e implementa App Intents, <code>AppEntity</code>, <code>EntityQuery</code> e App Shortcuts. Começa
        pelos verbos que mais valem (compor, abrir, encontrar, filtrar, continuar) e mantém a lista curta, sem
        transformar cada tela em uma intent. Decide caso a caso se a ação termina <em>inline</em> ou abre o app com{' '}
        <code>openAppWhenRun</code>, e gera o <code>AppShortcutsProvider</code> para a ação aparecer nos Atalhos e no
        Spotlight.
      </p>
      <Invocation skill="evenbetter-ios-app-intents" />
      <SkillSession
        skill="evenbetter-ios-app-intents"
        args="quero expor 'criar tarefa' pra Siri e Shortcuts"
        title="Plano de intents"
        lines={[
          'Intent inline: CreateTaskIntent (parâmetros: title, dueDate?)',
          'Entity: TaskEntity (id, title, dueDate, isCompleted)',
          'Query: TaskQuery, sugere as últimas 10 tarefas',
          'AppShortcutsProvider: frase "Criar tarefa <title>"',
        ]}
      />

      <h3>
        <code>evenbetter-ios-debugger-agent</code>
      </h3>
      <p>
        Controla o simulador pelo <strong>XcodeBuildMCP</strong>: encontra o simulador ligado, define os padrões da
        sessão (projeto, scheme, simulatorId), compila, abre o app, tira screenshots, descreve a hierarquia da
        interface, simula toques e gestos e captura logs com <code>start_sim_log_cap</code>. É a skill que liga o código
        ao comportamento real do app.
      </p>
      <Invocation skill="evenbetter-ios-debugger-agent" args="rode o app no simulador ligado e tire uma screenshot" />

      <Callout kind="note" title="Requer o XcodeBuildMCP, que não é o Xcode MCP">
        Esta skill usa o servidor <code>XcodeBuildMCP</code>, diferente do <strong>Xcode MCP</strong> da Apple que
        aparece na <StepLink to="xcode-mcp">etapa anterior</StepLink>. O <code>XcodeBuildMCP</code> controla o
        simulador com <code>xcodebuild</code> e <code>simctl</code>, enquanto o Xcode MCP fala direto com o IDE aberto.
        Um traz o contexto e os diagnósticos do IDE, o outro automatiza o simulador. Se o XcodeBuildMCP não estiver
        instalado, a skill avisa e para, sem tentar outro caminho.
      </Callout>

      <Callout kind="tip" title="Combine com outras skills">
        Com uma feature pronta, rode a <code>evenbetter-ios-debugger-agent</code> e depois a{' '}
        <code>evenbetter-ios-feature</code> no estágio <code>5-ux-implementation-review</code>. A revisão compara
        screenshots reais do simulador com o plano original.
      </Callout>
    </>
  )
}

/* ───── Page ───── */

const CONTENT: Record<StepId, () => React.JSX.Element> = {
  'visao-geral': StepVisaoGeral,
  'planejamento-ux': StepPlanejamentoUX,
  swiftui: StepSwiftUI,
  auditoria: StepAuditoria,
  performance: StepPerformance,
  'xcode-mcp': StepXcodeMCP,
  sistema: StepSistema,
}

export default function TutorialPluginIosPage() {
  const [step, go] = useGuideStep(IDS, 'visao-geral')
  const agent = useAgent()
  const Content = CONTENT[step]
  return (
    <GuideShell
      eyebrow="Guia do plugin"
      title={
        <>
          As skills do <span className="serif">EvenBetter iOS</span>
        </>
      }
      lede="São 16 skills para planejar, construir, auditar e integrar apps em SwiftUI, com o HIG da Apple e a WCAG 2.2 como referência. Cada uma cuida de uma fase do trabalho, e você chama uma de cada vez."
      facts={['16 skills', '7 etapas', 'Claude Code ou Codex']}
      toolbar={
        <HeroField label="Exemplos no formato do">
          <Segmented<Agent>
            label="Agente dos exemplos"
            size="lg"
            options={AGENT_OPTIONS}
            value={agent}
            onChange={setAgent}
          />
        </HeroField>
      }
      steps={STEPS}
      step={step}
      onStep={go}
      done={{
        title: 'Você conhece as 16 skills',
        body: (
          <>
            Volte a qualquer etapa pela lista. Sugestões e contribuições são bem-vindas no{' '}
            <a className="link" href="https://github.com/MelloBirkan/EvenBetterFramework">
              repositório do GitHub
            </a>
            .
          </>
        ),
      }}
    >
      <Content />
    </GuideShell>
  )
}
