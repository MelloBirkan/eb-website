'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CodeBlock, Callout, Icon } from '../../../_components/tutorial-primitives'
import { SiteNav } from '../../../_components/site-nav'
import { SiteFooter } from '../../../_components/site-footer'
import { AgentChat } from '../../../_components/agent-chat'

type StepId =
  | 'visao-geral'
  | 'planejamento-ux'
  | 'swiftui'
  | 'auditoria'
  | 'performance'
  | 'xcode-mcp'
  | 'sistema'

const STEPS: { id: StepId; title: string }[] = [
  { id: 'visao-geral',     title: 'Visão geral' },
  { id: 'planejamento-ux', title: 'Planejamento de UX' },
  { id: 'swiftui',         title: 'Padrões SwiftUI' },
  { id: 'auditoria',       title: 'Auditoria HIG/WCAG' },
  { id: 'performance',     title: 'Performance e A11y' },
  { id: 'xcode-mcp',       title: 'Xcode MCP' },
  { id: 'sistema',         title: 'Integração com sistema' },
]

/* ─── Invocation: only thing that actually differs between agents,
       so this is the only place we show both. Everything else stays single. ─── */

function Invocation({ skill, args }: { skill: string; args?: string }) {
  const tail = args ? ' ' + args : ''
  return (
    <CodeBlock
      lang="bash"
      code={`# Claude Code\n/evenbetter-ios:${skill}${tail}\n\n# Codex\n@${skill}${tail}`}
    />
  )
}

/* ─── Chat mock: a single illustrative example. We use the Claude Code syntax;
       readers in Codex mentally swap /evenbetter-ios:<skill> for @<skill>. ─── */

function ChatMock({
  skill,
  args,
  responseTitle,
  responseLines,
}: {
  skill: string
  args?: string
  responseTitle: string
  responseLines: string[]
}) {
  const cmd = `/evenbetter-ios:${skill}${args ? ' ' + args : ''}`
  return (
    <div className="eb-chat-mock">
      <div className="eb-chat-bar">
        <span className="eb-chat-tag">CLAUDE CODE</span>
      </div>
      <div className="eb-chat-body">
        <div className="eb-chat-user">
          <span className="eb-chat-prompt">›</span>
          <span className="eb-chat-cmd">{cmd}</span>
        </div>
        <div className="eb-chat-response">
          <div className="eb-chat-hex">⬡</div>
          <div>
            <div className="eb-chat-title">{responseTitle}</div>
            <div className="eb-chat-lines">
              {responseLines.map((line, i) => (
                <div key={i}><span className="eb-chat-ok">✓</span> {line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Crumbs({ last }: { last: string }) {
  return (
    <div className="eb-crumbs">
      <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>GUIA</Link>
      <span className="eb-sep">/</span>
      <span>PLUGIN iOS</span>
      <span className="eb-sep">/</span>
      <span>{last}</span>
    </div>
  )
}

/* ─── Step 01 ─── */

const SKILL_GROUPS: { title: string; skills: { name: string; desc: string }[] }[] = [
  {
    title: 'Planejamento',
    skills: [
      { name: 'evenbetter-ios-feature', desc: 'Workflow em estágios para uma única tela: brief, plano, validação, tickets, execução e revisão.' },
      { name: 'evenbetter-ios-epic',    desc: 'Workflow para apps ou épicos multi-tela com brief, fluxos, plano técnico HIG e validação de arquitetura.' },
    ],
  },
  {
    title: 'Padrões SwiftUI',
    skills: [
      { name: 'evenbetter-swiftui-ui-patterns',   desc: 'Boas práticas para views, navegação, sheets, formulários, controles, Dynamic Type e composição.' },
      { name: 'evenbetter-swiftui-view-refactor', desc: 'Refatora views grandes em subviews dedicadas, MV-first, com árvore estável e Observation correto.' },
      { name: 'evenbetter-swiftui-liquid-glass',  desc: 'Implementa e revisa o Liquid Glass do iOS 26+ com containers, shapes consistentes e fallbacks.' },
    ],
  },
  {
    title: 'Auditoria HIG e WCAG',
    skills: [
      { name: 'evenbetter-ios-analyze', desc: 'Analisa um projeto SwiftUI contra HIG e WCAG 2.2 e grava um relatório JSON em .evenbetter/.' },
      { name: 'evenbetter-validate',    desc: 'Faz uma segunda passada nas violações de severidade alta para filtrar falsos positivos.' },
      { name: 'evenbetter-fix',         desc: 'Orquestra a remediação a partir dos relatórios, prioriza correções e atualiza o estado do manifesto.' },
    ],
  },
  {
    title: 'Performance e acessibilidade',
    skills: [
      { name: 'evenbetter-swiftui-performance-audit', desc: 'Diagnostica scrolling travado, hangs, picos de CPU e re-renderizações excessivas em SwiftUI.' },
      { name: 'evenbetter-swiftui-accessibility',     desc: 'Skill de referência: carrega cláusulas canônicas de acessibilidade do corpus Apple HIG e WCAG.' },
    ],
  },
  {
    title: 'Integração com sistema',
    skills: [
      { name: 'evenbetter-ios-app-intents',    desc: 'Desenha e implementa App Intents, AppEntity e App Shortcuts para Siri, Spotlight, widgets e controles.' },
      { name: 'evenbetter-ios-debugger-agent', desc: 'Usa o XcodeBuildMCP para compilar, rodar e inspecionar o app em um simulador iOS conectado.' },
    ],
  },
]

function StepVisaoGeral() {
  return (
    <>
      <Crumbs last="VISÃO GERAL" />
      <h1 id="visao-geral">O plugin <span className="eb-accent">EvenBetter iOS</span></h1>
      <p className="eb-lede">
        Doze skills coordenadas para planejar, implementar, auditar e remediar produtos iOS em SwiftUI,
        com Apple HIG, WCAG 2.2 e o ecossistema da Apple sempre como fonte de verdade. Cada skill é uma fase
        do trabalho. Você invoca uma de cada vez, na ordem que faz sentido para o que está fazendo.
      </p>

      <div className="eb-agent-chat-highlight">
        <div className="eb-agent-chat-highlight-head">
          <span className="eb-agent-chat-highlight-eyebrow">Agente · ao vivo</span>
          <h2 className="eb-agent-chat-highlight-title">
            Não sabe qual skill usar? <span className="eb-accent">Pergunte ao agente.</span>
          </h2>
          <p className="eb-agent-chat-highlight-sub">
            Um Claude Managed Agent treinado nas 12 skills deste plugin. Descreva seu cenário
            e ele recomenda o caminho — você responde no chat exatamente como faria no seu terminal.
          </p>
        </div>
        <AgentChat />
      </div>

      <div className="eb-skills-grid" style={{ marginTop: '1.5rem' }}>
        {SKILL_GROUPS.flatMap((group) =>
          group.skills.map((skill) => (
            <div key={skill.name} className="eb-skill-card">
              <h4>{skill.name}</h4>
              <p>{skill.desc}</p>
            </div>
          ))
        )}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Como invocar uma skill</h2>
      <p>
        A única coisa que muda entre agentes é a sintaxe da invocação. Onde isso importa, mostramos os dois
        exemplos no mesmo bloco. No restante do guia, exemplos seguem a forma do Claude Code, basta trocar{' '}
        <code>/evenbetter-ios:&lt;skill&gt;</code> por <code>@&lt;skill&gt;</code> se você estiver no Codex.
      </p>
      <CodeBlock
        lang="bash"
        code={'# Claude Code\n/evenbetter-ios:<nome-da-skill>\n\n# Codex\n@<nome-da-skill>'}
      />

      <Callout kind="note" title="Ainda não instalou?">
        As skills só ficam disponíveis depois que o plugin estiver instalado.
        Veja {' '}
        <Link href="/tutorial/anthropic" style={{ color: 'inherit' }}><strong>como instalar no Claude Code</strong></Link>
        {' '}ou{' '}
        <Link href="/tutorial/codex" style={{ color: 'inherit' }}><strong>como instalar no Codex</strong></Link>.
      </Callout>

      <Callout kind="tip" title="Existe também o plugin evenbetter-general">
        O mesmo marketplace publica um segundo plugin, o <code>evenbetter-general</code>, com 2 skills
        agnósticas de plataforma: <code>evenbetter-general-feature</code> e{' '}
        <code>evenbetter-general-epic</code>. Útil quando o trabalho não é exclusivamente iOS, ou para
        complementar os fluxos de planejamento daqui. Os dois plugins convivem sem conflito, basta instalar
        com <code>/plugin install evenbetter-general@evenbetter</code> (ou pelo browser do Codex).
      </Callout>

      <Callout kind="tip" title="Atalho mental">
        Pense no fluxo como um funil: <strong>planeja</strong> (feature/epic), <strong>constrói</strong> (padrões SwiftUI),
        <strong> audita</strong> (analyze → validate → fix), <strong>otimiza</strong> (performance/a11y),
        <strong> integra</strong> (App Intents/Debugger).
      </Callout>
    </>
  )
}

/* ─── Step 02 — Planejamento de UX ─── */

function StepPlanejamentoUX() {
  return (
    <>
      <Crumbs last="PLANEJAMENTO" />
      <h1 id="planejamento-ux">Planejamento de <span className="eb-accent">UX</span></h1>
      <p className="eb-lede">
        Antes de escrever uma linha de SwiftUI, defina o problema. Estas duas skills conduzem entrevistas
        de múltipla escolha em estágios, do brief inicial até os tickets executáveis, e gravam tudo
        dentro de <code>.evenbetter/&lt;nome&gt;/</code> no seu projeto.
      </p>

      <h2>evenbetter-ios-feature</h2>
      <p>
        Workflow para uma única tela ou feature pequena. Oito estágios numerados, do <code>0-trigger-workflow</code>
        ao <code>7-cross-artifact-validation</code>, cobrindo plano de UX, validação, tickets, execução e revisão
        contra capturas de tela e código real.
      </p>
      <Invocation skill="evenbetter-ios-feature" />

      <ChatMock
        skill="evenbetter-ios-feature"
        args="quero adicionar uma tela de filtros à minha lista"
        responseTitle="Skill carregada · Estágio 0 (Trigger Workflow)"
        responseLines={[
          'Detectei projeto SwiftUI em ./MyApp',
          'Vou fazer 4 perguntas de múltipla escolha para clarear o escopo',
          'Pasta sugerida: .evenbetter/filtros-lista/',
        ]}
      />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-ios-epic</h2>
      <p>
        Workflow para apps inteiros ou épicos multi-tela. Onze estágios cobrindo brief de UX, fluxos entre telas,
        validação de PRD, plano técnico HIG, validação de arquitetura, tickets e revisão. Os artefatos chave
        são <code>ios-ux-brief.md</code>, <code>screen-flows.md</code> e <code>ios-hig-tech-plan.md</code>.
      </p>
      <Invocation skill="evenbetter-ios-epic" />

      <Callout kind="tip" title="Estágios são opcionais">
        A skill infere o estágio pelo seu pedido, mas você pode forçar passando{' '}
        <code>stage: 3-ticket-breakdown</code> (ou qualquer outro) junto com a invocação.
      </Callout>

      <Callout kind="note" title="Artefatos versionáveis">
        Tudo que as skills geram fica em <code>.evenbetter/&lt;feature&gt;/</code>, incluindo o plano,
        os tickets em <code>tickets/UX-TICKET-NNN.md</code> e a revisão final. Comite essa pasta
        para manter o histórico de decisões junto do código.
      </Callout>
    </>
  )
}

/* ─── Step 03 — Padrões SwiftUI ─── */

function StepSwiftUI() {
  return (
    <>
      <Crumbs last="SWIFTUI" />
      <h1 id="swiftui">Padrões e refatoração <span className="eb-accent">SwiftUI</span></h1>
      <p className="eb-lede">
        Três skills para a fase de implementação. Use durante a escrita inicial, na hora de domar
        uma view que ficou grande, ou para adotar APIs novas do iOS 26+.
      </p>

      <h2>evenbetter-swiftui-ui-patterns</h2>
      <p>
        Catálogo de padrões com mais de 35 referências de componentes. Cobre <code>NavigationStack</code>,
        sheets enum-driven, async/await com <code>.task</code>, <code>TabView</code>, formulários, deep links,
        Dynamic Type, theming e o resumo de quando usar cada wrapper de estado
        (<code>@State</code>, <code>@Binding</code>, <code>@Environment</code>, <code>@Observable</code>).
      </p>
      <Invocation skill="evenbetter-swiftui-ui-patterns" />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-swiftui-view-refactor</h2>
      <p>
        Refatora views grandes para subviews dedicadas (em vez de muitos <code>private var ...: some View</code>),
        com a árvore estável (sem swap de root via <code>if/else</code>), ações tiradas do <code>body</code>,
        <strong> MV-first</strong> em vez de MVVM e ordenação consistente do arquivo. Quando uma view passa de
        ~300 linhas, é o momento de chamar essa skill.
      </p>
      <Invocation skill="evenbetter-swiftui-view-refactor" />

      <ChatMock
        skill="evenbetter-swiftui-view-refactor"
        args="refatore SettingsView.swift"
        responseTitle="Plano de refatoração"
        responseLines={[
          'Extraídas 4 subviews dedicadas: HeaderSection, FilterSection, ResultsSection, FooterSection',
          'Movidas 3 ações inline para métodos privados',
          'Removido swap de root condicional, condição movida para .toolbar',
          'Body reduzido de 312 para 47 linhas',
        ]}
      />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-swiftui-liquid-glass</h2>
      <p>
        Implementa e revisa o Liquid Glass do iOS 26+ usando as APIs nativas: <code>.glassEffect()</code>,
        <code> GlassEffectContainer</code>, <code>.buttonStyle(.glass)</code> e <code>.buttonStyle(.glassProminent)</code>.
        A skill cuida da ordem dos modificadores, agrupa elementos no container, define <code>glassEffectID</code>
        para morphing e adiciona o <code>#available(iOS 26, *)</code> com fallback para versões anteriores.
      </p>
      <Invocation skill="evenbetter-swiftui-liquid-glass" />

      <Callout kind="warn" title="Requer iOS 26 ou superior">
        Liquid Glass é exclusivo do iOS 26+. A skill sempre adiciona o gate{' '}
        <code>#available(iOS 26, *)</code> com um fallback (geralmente <code>.ultraThinMaterial</code>).
        Se seu deployment target ainda inclui iOS 16-25, ambos os branches precisam funcionar.
      </Callout>
    </>
  )
}

/* ─── Step 04 — Auditoria HIG/WCAG ─── */

function StepAuditoria() {
  return (
    <>
      <Crumbs last="AUDITORIA" />
      <h1 id="auditoria">Auditoria <span className="eb-accent">HIG e WCAG</span></h1>
      <p className="eb-lede">
        Três skills que rodam em sequência: <strong>analyze</strong> propõe, <strong>validate</strong> filtra,
        <strong> fix</strong> remedia. É o padrão <em>orchestrator-workers-with-validators</em> aplicado a
        guidelines da Apple e WCAG 2.2.
      </p>

      <div className="eb-steps-frame" style={{ marginTop: '1.5rem' }}>
        <div className="eb-step">
          <div className="eb-step-num">01</div>
          <div className="eb-step-body">
            <h4>analyze · gera relatório</h4>
            <p>Lê o projeto sem modificar e grava <code>.evenbetter/analyze-{'{N}'}.json</code>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">02</div>
          <div className="eb-step-body">
            <h4>validate · checa evidências</h4>
            <p>Re-checa cada violação severa e grava <code>.evenbetter/evenbetter-validate-{'{N}'}.json</code>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">03</div>
          <div className="eb-step-body">
            <h4>fix · aplica correções</h4>
            <p>Prioriza, agrupa por arquivo e remedia, atualizando o estado em <code>manifest.json</code>.</p>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem' }}>evenbetter-ios-analyze</h2>
      <p>
        Recebe o caminho absoluto do projeto e roda seis analisadores de domínio em paralelo: tipografia,
        cor e theming, componentes, layout e interação, navegação, e acessibilidade. Cada domínio só consulta
        seu próprio corpus markdown. O relatório final tem severidade por violação, escore por arquivo
        e <code>overall_score</code> agregado.
      </p>
      <Invocation skill="evenbetter-ios-analyze" args="projectPath: /caminho/absoluto/do/projeto" />

      <ChatMock
        skill="evenbetter-ios-analyze"
        args="projectPath: /Users/me/MyApp"
        responseTitle="Análise completa"
        responseLines={[
          'Wrote: .evenbetter/analyze-1.json',
          'Findings: 47 total (12 error, 23 warning, 12 info)',
          'overall_score: 72/100 · ui_score: 78 · a11y_score: 64',
        ]}
      />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-validate</h2>
      <p>
        Pega <code>analyze-{'{N}'}.json</code> e re-julga apenas as violações <code>severity: error</code>:
        re-lê o trecho de código, resolve a cláusula no corpus pelo <code>rule_id</code>, verifica a URL
        do guideline e atribui um <code>confidence</code>. Tudo abaixo do threshold (default 0.7) cai pra{' '}
        <code>dropped</code>.
      </p>
      <Invocation skill="evenbetter-validate" args="projectPath: /caminho/absoluto/do/projeto" />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-fix</h2>
      <p>
        Lê o <code>manifest.json</code>, mescla violações abertas de todas as runs, faz uma rodada curta de
        perguntas de escopo (severidade, prioridade, modo de execução), agrupa edições por arquivo e aplica
        as correções. Pode rodar localmente, em sub-agentes paralelos ou apenas gerar prompts estáticos.
      </p>
      <Invocation skill="evenbetter-fix" args="projectPath: /caminho/absoluto/do/projeto" />

      <Callout kind="warn" title="O analyzer nunca modifica seu código">
        As três skills só escrevem dentro de <code>.evenbetter/</code>. O <code>analyze</code> e o{' '}
        <code>validate</code> são totalmente read-only no seu source. Apenas o <code>fix</code> edita arquivos
        do projeto, e mesmo assim só depois da rodada de escopo confirmada.
      </Callout>

      <Callout kind="tip" title="Re-rodar a análise é grátis">
        Cada execução do <code>analyze</code> gera um número novo (<code>analyze-2.json</code>,{' '}
        <code>analyze-3.json</code>...) e o <code>manifest.json</code> mantém o histórico.
        O <code>fix</code> sabe quais violações já foram resolvidas, deferidas ou rejeitadas.
      </Callout>
    </>
  )
}

/* ─── Step 05 — Performance & A11y ─── */

const PERF_SYMPTOMS = [
  'Renderização lenta',
  'Scroll travado',
  'CPU alta ou bateria',
  'Crescimento de memória',
  'Hangs ou interações travadas',
  'Atualizações de view excessivas',
]

function StepPerformance() {
  return (
    <>
      <Crumbs last="PERFORMANCE" />
      <h1 id="performance">Performance e <span className="eb-accent">acessibilidade</span></h1>
      <p className="eb-lede">
        Duas skills focadas em qualidade. Uma é uma sessão guiada de diagnóstico,
        a outra é uma referência de regras canônicas que você consulta sob demanda.
      </p>

      <h2>evenbetter-swiftui-performance-audit</h2>
      <p>
        Começa pelo sintoma e classifica em uma destas seis categorias antes de pedir código ou trace
        de Instruments:
      </p>
      <ul>
        {PERF_SYMPTOMS.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <p>
        A revisão usa o catálogo <code>code-smells.md</code> para identificar coisas como tempestades
        de invalidação, identidade instável em <code>ForEach</code>, trabalho pesado dentro do{' '}
        <code>body</code>, layout thrash com <code>GeometryReader</code> e decode de imagem na main thread.
        Quando o código sozinho não basta, ela orienta a captura no Instruments.
      </p>
      <Invocation skill="evenbetter-swiftui-performance-audit" />

      <ChatMock
        skill="evenbetter-swiftui-performance-audit"
        args="ProductListView trava ao rolar com 200 itens"
        responseTitle="Diagnóstico inicial"
        responseLines={[
          'Sintoma classificado: Scroll travado',
          'Suspeitas no código: identidade instável em ForEach (id: \\.self com modelo mutável)',
          'Suspeitas: imagem decodificada inline com .resizable() sem downsample',
          'Próximo passo: capturar trace de Time Profiler na rolagem',
        ]}
      />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-swiftui-accessibility</h2>
      <p>
        Skill de <em>referência</em>: não roda análise nem refatora, ela carrega as cláusulas canônicas
        de acessibilidade do corpus EvenBetter (HIG da Apple + WCAG 2.2). Use quando precisar saber se um
        comportamento específico é exigido, ou para conferir o conteúdo exato de regras como{' '}
        <code>A11Y-UI-001</code> ou <code>A11Y-UX-001</code>.
      </p>
      <Invocation skill="evenbetter-swiftui-accessibility" args="qual o tamanho mínimo de toque pelo HIG?" />

      <Callout kind="note" title="A skill empresta regras pro analyzer">
        O <code>evenbetter-ios-analyze</code> usa o mesmo corpus. Se você quer entender por que uma violação
        existe, perguntar pra <code>evenbetter-swiftui-accessibility</code> é o caminho mais curto pra cláusula original.
      </Callout>
    </>
  )
}

/* ─── Step 06 — Xcode MCP ─── */

const XCODE_MCP_TOOLS: { title: string; tools: string; desc: string }[] = [
  {
    title: 'Arquivos no projeto Xcode',
    tools: 'XcodeRead · XcodeWrite · XcodeUpdate · XcodeGlob · XcodeGrep',
    desc: 'Lê, escreve e busca dentro do projeto aberto no Xcode, respeitando a estrutura real de targets e grupos, não só o sistema de arquivos.',
  },
  {
    title: 'Build e testes',
    tools: 'BuildProject · GetBuildLog · RunAllTests · RunSomeTests',
    desc: 'Compila no scheme e destination atuais e roda a suíte de testes, devolvendo o log estruturado para o agente debugar erros reais.',
  },
  {
    title: 'Diagnóstico ao vivo',
    tools: 'XcodeListNavigatorIssues · XcodeRefreshCodeIssuesInFile',
    desc: 'Acessa os erros e warnings do Issue Navigator do Xcode, com informação semântica que o compilador sozinho via terminal não dá.',
  },
  {
    title: 'Código, docs e previews',
    tools: 'ExecuteSnippet · DocumentationSearch · RenderPreview',
    desc: 'Roda código Swift no REPL, busca a documentação oficial da Apple (incluindo sessões da WWDC) e renderiza previews SwiftUI sem abrir o canvas.',
  },
  {
    title: 'Estrutura do projeto',
    tools: 'GetProjectStructure · GetSchemes',
    desc: 'Descreve targets, grupos e schemes disponíveis, para o agente decidir o que tocar antes de começar a editar.',
  },
]

function StepXcodeMCP() {
  return (
    <>
      <Crumbs last="XCODE MCP" />
      <h1 id="xcode-mcp">Ponte para o <span className="eb-accent">Xcode MCP</span></h1>
      <p className="eb-lede">
        O EvenBetter iOS já configura o MCP oficial do Xcode no seu agente. Ao instalar e ativar o plugin,
        o Claude Code e o Codex passam a ter um servidor MCP chamado <code>xcode</code> rodando{' '}
        <code>xcrun mcpbridge</code>, a ponte oficial da Apple que permite que agentes externos conversem
        com o Xcode aberto.
      </p>

      <Callout kind="note" title="O plugin não instala o Xcode">
        Ele apenas configura o agente para usar o MCP que já vem com o Xcode 26.3+. Você precisa ter
        o Xcode instalado, autorizado e com o projeto aberto para o MCP funcionar de verdade.
      </Callout>

      <h2>O que o Xcode MCP pode fazer</h2>
      <p>
        O <code>xcrun mcpbridge</code> conecta o agente diretamente ao processo do Xcode aberto via XPC,
        e expõe cerca de 20 ferramentas nativas. Elas se dividem em cinco grupos:
      </p>
      <div className="eb-skills-grid" style={{ marginTop: '1rem' }}>
        {XCODE_MCP_TOOLS.map((g) => (
          <div key={g.title} className="eb-skill-card">
            <h4>{g.title}</h4>
            <p style={{ fontFamily: 'var(--eb-font-mono)', fontSize: 12, color: '#1f4e4a', marginBottom: 8 }}>
              {g.tools}
            </p>
            <p>{g.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Por que isso é bom</h2>
      <ul>
        <li>
          <strong>Vê o que o Xcode vê.</strong> Como a ponte é XPC, o agente lê o estado real do projeto
          aberto: scheme selecionado, destination, diagnósticos do Issue Navigator, símbolos resolvidos.
          Coisa que rodar <code>xcodebuild</code> direto no terminal não consegue.
        </li>
        <li>
          <strong>Build e teste com retorno estruturado.</strong> O agente compila e testa pelo MCP e recebe
          erros e warnings num formato que ele entende, em vez de raspar logs gigantes.
        </li>
        <li>
          <strong>Documentação Apple sem sair do agente.</strong> <code>DocumentationSearch</code> consulta
          a doc oficial e até sessões da WWDC, sem precisar abrir o navegador.
        </li>
        <li>
          <strong>Previews SwiftUI sem o canvas.</strong> <code>RenderPreview</code> renderiza headless e
          devolve a imagem, ótimo para o agente ver o resultado visual da própria mudança.
        </li>
        <li>
          <strong>Configuração zero.</strong> Como o plugin já registra o servidor, o usuário não precisa
          rodar comando nenhum. Se o usuário não quisesse o EvenBetter, teria que adicionar manualmente.
        </li>
      </ul>

      <h2>1. Pré-requisitos</h2>
      <p>Antes de usar o Xcode MCP, confirme que você tem:</p>
      <ul>
        <li>macOS com <strong>Xcode 26.3 ou superior</strong> instalado.</li>
        <li>Claude Code ou Codex instalado.</li>
        <li>Plugin EvenBetter iOS instalado e ativado.</li>
        <li>O projeto iOS aberto no Xcode, com o scheme correto selecionado.</li>
        <li>A permissão de agentes externos ativada no Xcode.</li>
      </ul>

      <Callout kind="warn" title="Bridge não encontrado?">
        Se <code>xcrun --find mcpbridge</code> retornar erro, o sistema está apontando para os Command Line
        Tools em vez do Xcode completo. Rode <code>sudo xcode-select -s /Applications/Xcode.app/Contents/Developer</code>
        {' '}e depois <code>sudo xcodebuild -runFirstLaunch</code>.
      </Callout>

      <h2>2. Ativar o MCP no Xcode</h2>
      <p>Sem essa permissão, o agente até tenta iniciar o MCP, mas o Xcode bloqueia o acesso às ferramentas.</p>
      <ul>
        <li>Abra o Xcode.</li>
        <li>Vá em <strong>Xcode &gt; Settings</strong>.</li>
        <li>Abra a aba <strong>Intelligence</strong>.</li>
        <li>Procure a seção <strong>Model Context Protocol</strong>.</li>
        <li>Ative <strong>Allow external agents to use Xcode tools</strong>.</li>
      </ul>

      <h2>3. Abrir o projeto no Xcode</h2>
      <p>Antes de pedir para o agente trabalhar:</p>
      <ul>
        <li>Abra o arquivo <code>.xcodeproj</code> ou <code>.xcworkspace</code> no Xcode.</li>
        <li>Selecione o scheme correto.</li>
        <li>Confirme que o projeto compila normalmente.</li>
        <li>Deixe o Xcode aberto enquanto o agente estiver rodando.</li>
      </ul>
      <p>
        O MCP funciona conectado ao Xcode aberto. Se o Xcode estiver fechado, ou se o projeto certo não
        estiver carregado, o agente pode até listar ferramentas, mas elas não terão contexto.
      </p>

      <h2>4. Verificar a configuração</h2>
      <p>
        Depois que o plugin está ativo, confirme no terminal que o servidor <code>xcode</code> aparece
        registrado no agente:
      </p>
      <CodeBlock
        lang="bash"
        code={'# Claude Code\nclaude mcp list\n\n# Codex\ncodex mcp list'}
      />

      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">TERMINAL</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">$</span>
            <span className="eb-chat-cmd">claude mcp list</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Servidores MCP conectados</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> xcode · xcrun mcpbridge · Connected</div>
                <div><span className="eb-chat-ok">✓</span> 20 ferramentas disponíveis (BuildProject, RenderPreview, …)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p>
        Se o usuário não estivesse usando o nosso plugin, a configuração equivalente teria que ser feita
        à mão. Para referência, é só isso:
      </p>
      <CodeBlock
        lang="bash"
        code={
          '# Claude Code\nclaude mcp add --transport stdio xcode -- xcrun mcpbridge\n\n' +
          '# Codex\ncodex mcp add xcode -- xcrun mcpbridge'
        }
      />
      <p>Com o EvenBetter iOS, isso já vem empacotado.</p>

      <h2>5. Como usar bem o Xcode MCP</h2>
      <p>
        Quando estiver usando o EvenBetter iOS, peça explicitamente para o agente usar o contexto do Xcode
        sempre que fizer sentido. Bons prompts:
      </p>
      <ul>
        <li>
          Use o Xcode MCP para inspecionar o projeto aberto, entender os schemes disponíveis e rodar o
          build antes de sugerir mudanças.
        </li>
        <li>
          Use as ferramentas do Xcode para compilar o app, identificar erros de build e corrigir a
          implementação SwiftUI.
        </li>
        <li>
          Antes de editar, verifique no Xcode quais targets, schemes e arquivos principais existem neste
          projeto.
        </li>
        <li>
          Depois de implementar, rode build e testes pelo Xcode MCP e me diga exatamente o que passou
          ou falhou.
        </li>
        <li>
          Use o <code>DocumentationSearch</code> para consultar a doc oficial da Apple antes de implementar
          essa feature em SwiftUI.
        </li>
      </ul>

      <h2>6. Boas práticas</h2>
      <p>Para extrair o máximo do MCP do Xcode:</p>
      <ul>
        <li>Mantenha o Xcode aberto durante toda a sessão do agente.</li>
        <li>Abra o projeto correto antes de iniciar o trabalho.</li>
        <li>Use o <code>.xcworkspace</code> quando o projeto tem Swift Package Manager, CocoaPods ou múltiplos módulos.</li>
        <li>Confirme que o scheme correto está selecionado.</li>
        <li>Peça para o agente compilar com frequência, não apenas no final.</li>
        <li>Para bugs de UI, peça validação com build, <code>RenderPreview</code>, simulator ou testes.</li>
        <li>Se trocar de projeto no Xcode, recarregue a sessão do agente para evitar contexto antigo.</li>
        <li>Se o MCP parar de responder, confira se o Xcode ainda está aberto e se a permissão segue ativa.</li>
      </ul>

      <h2>7. Limitações</h2>
      <p>
        O Xcode MCP é local. Ele depende do Xcode rodando na máquina do usuário. Por isso:
      </p>
      <ul>
        <li>Funciona melhor em sessões locais no macOS.</li>
        <li>Não funciona em ambientes cloud ou Linux sem Xcode.</li>
        <li>Não substitui a instalação do Xcode.</li>
        <li>Não dispensa as permissões do Xcode.</li>
        <li>Não garante que o agente consiga agir se o projeto não estiver aberto.</li>
      </ul>

      <Callout kind="tip" title="Combine com a skill de debugger">
        O Xcode MCP cuida do projeto aberto e do Xcode. Para subir o app no simulador, capturar screenshots
        e simular taps, use também o <code>evenbetter-ios-debugger-agent</code> (próxima etapa), que fala com
        o <code>XcodeBuildMCP</code>. Os dois MCPs se complementam: um para o IDE, outro para o simulador.
      </Callout>

      <Callout kind="note" title="Em resumo">
        Com o EvenBetter iOS instalado, o agente já tem a ponte configurada. O usuário só precisa garantir
        que o Xcode esteja instalado, autorizado, aberto e com o projeto certo carregado.
      </Callout>
    </>
  )
}

/* ─── Step 07 — Integração com sistema ─── */

function StepSistema() {
  return (
    <>
      <Crumbs last="SISTEMA" />
      <h1 id="sistema">Integração com <span className="eb-accent">o sistema</span></h1>
      <p className="eb-lede">
        Por último, duas skills que conectam seu app com o resto do iOS: Siri, Spotlight, widgets, controles
        e o simulador.
      </p>

      <h2>evenbetter-ios-app-intents</h2>
      <p>
        Desenha e implementa App Intents, <code>AppEntity</code>, <code>EntityQuery</code> e App Shortcuts.
        A skill começa pelos verbos de maior valor (compor, abrir, encontrar, filtrar, continuar...) e mantém
        a superfície enxuta, não espelha a árvore inteira de telas como intents. Decide caso a caso se
        a ação completa <em>inline</em> ou abre o app via <code>openAppWhenRun</code>, e gera o{' '}
        <code>AppShortcutsProvider</code> para descoberta no Shortcuts e no Spotlight.
      </p>
      <Invocation skill="evenbetter-ios-app-intents" />

      <ChatMock
        skill="evenbetter-ios-app-intents"
        args="quero expor 'criar tarefa' pra Siri e Shortcuts"
        responseTitle="Plano de intents"
        responseLines={[
          'Intent inline: CreateTaskIntent (parâmetro: title, dueDate?)',
          'Entity: TaskEntity (id, title, dueDate, isCompleted)',
          'Query: TaskQuery, sugere últimas 10 tarefas',
          'AppShortcutsProvider: frase "Criar tarefa <title>"',
        ]}
      />

      <h2 style={{ marginTop: '2.25rem' }}>evenbetter-ios-debugger-agent</h2>
      <p>
        Controla o simulador via <strong>XcodeBuildMCP</strong>: descobre o simulador <em>booted</em>, configura
        defaults da sessão (projeto, scheme, simulatorId), buildea, lança o app, captura screenshots, descreve
        a hierarquia de UI, simula taps e gestos e captura logs com <code>start_sim_log_cap</code>. É a skill
        que fecha o ciclo entre código e comportamento real.
      </p>
      <Invocation skill="evenbetter-ios-debugger-agent" args="rode o app no simulador booted e tire screenshot" />

      <Callout kind="note" title="Requer XcodeBuildMCP (≠ Xcode MCP)">
        Esta skill usa o servidor MCP <code>XcodeBuildMCP</code>, que é diferente do{' '}
        <strong>Xcode MCP</strong> oficial da Apple coberto na{' '}
        <a href="#xcode-mcp" style={{ color: 'var(--eb-teal)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>etapa anterior</a>.
        O <code>XcodeBuildMCP</code> controla o simulador via <code>xcodebuild</code> e <code>simctl</code>,
        enquanto o Xcode MCP fala diretamente com o IDE aberto. Os dois se complementam: o IDE para
        contexto e diagnósticos, o XcodeBuildMCP para automação do simulador. Sem ele instalado, a
        skill avisa e para, não tenta usar fallbacks.
      </Callout>

      <Callout kind="tip" title="Combine com outras skills">
        Depois de uma feature pronta, encadear <code>evenbetter-ios-debugger-agent</code> →{' '}
        <code>evenbetter-ios-feature</code> no estágio <code>5-ux-implementation-review</code> dá uma revisão
        com screenshots reais do simulador comparados ao plano original.
      </Callout>
    </>
  )
}

/* ─── Page ─── */

export default function TutorialPluginIosPage() {
  const [step, setStep] = useState<StepId>('visao-geral')

  // Sync the active step with the URL hash so home-page deep links work.
  useEffect(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash.slice(1) : '') as StepId
    if (hash && STEPS.some(s => s.id === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(hash)
    }
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  const stepIdx = STEPS.findIndex(s => s.id === step)
  const prev = stepIdx > 0 ? STEPS[stepIdx - 1] : null
  const next = stepIdx < STEPS.length - 1 ? STEPS[stepIdx + 1] : null
  const isDone = !next

  const renderStep = () => {
    switch (step) {
      case 'visao-geral':     return <StepVisaoGeral />
      case 'planejamento-ux': return <StepPlanejamentoUX />
      case 'swiftui':         return <StepSwiftUI />
      case 'auditoria':       return <StepAuditoria />
      case 'performance':     return <StepPerformance />
      case 'xcode-mcp':       return <StepXcodeMCP />
      case 'sistema':         return <StepSistema />
    }
  }

  return (
    <div className="eb-root">
      <SiteNav />
      <div className="eb-tut" id="main">
        <aside className="eb-sidebar">
          <Link href="/" className="eb-sidebar-back">
            <Icon name="chevron" size={12} />
            Início
          </Link>
          <div className="eb-sidebar-agent">
            <div>
              <div className="eb-sidebar-agent-name">EvenBetter iOS</div>
              <div className="eb-sidebar-agent-sub">Plugin · 12 skills</div>
            </div>
          </div>
          <div className="eb-side-title">Etapas</div>
          {STEPS.map((s, idx) => {
            const isActive = s.id === step
            const isSectionDone = idx < stepIdx
            return (
              <div
                key={s.id}
                className={`eb-side-item${isActive ? ' active' : ''}${isSectionDone ? ' done' : ''}`}
                onClick={() => setStep(s.id)}
              >
                <span className="eb-num">{isSectionDone ? '✓' : `0${idx + 1}`}</span>
                <span>{s.title}</span>
              </div>
            )
          })}
        </aside>
        <main className="eb-content eb-fade-page" key={step}>
          {renderStep()}
          {isDone && (
            <div className="eb-pager-done">
              <div className="eb-pager-done-icon"><Icon name="check" size={14} /></div>
              <div>
                <h4>Você conhece todas as 12 skills</h4>
                <p>
                  Use o índice na lateral para revisitar qualquer etapa. Para sugestões e contribuições,
                  acesse o repositório no GitHub.
                </p>
              </div>
            </div>
          )}
          <div className="eb-pager">
            {prev
              ? <div className="eb-pager-card" onClick={() => setStep(prev.id)}>
                  <span className="eb-dir">← Anterior</span>
                  <span className="eb-ttl">{prev.title}</span>
                </div>
              : <div />}
            {next
              ? <div className="eb-pager-card next" onClick={() => setStep(next.id)}>
                  <span className="eb-dir">Próximo →</span>
                  <span className="eb-ttl">{next.title}</span>
                </div>
              : <div />}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
