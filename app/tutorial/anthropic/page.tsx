'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { TutorialNav, CodeBlock, Callout, Icon, SegmentedControl } from '../../_components/tutorial-primitives'

type Mode = 'cli' | 'desktop'
type CliStepId = 'marketplace' | 'instalar' | 'chamar'
type DesktopStepId = 'customize' | 'diretorio' | 'chamar'

const STEPS_CLI: { id: CliStepId; title: string }[] = [
  { id: 'marketplace', title: 'Adicionar marketplace' },
  { id: 'instalar',    title: 'Instalar o plugin' },
  { id: 'chamar',      title: 'Recarregar e usar' },
]

const STEPS_DESKTOP: { id: DesktopStepId; title: string }[] = [
  { id: 'customize', title: 'Adicionar pelo Customize' },
  { id: 'diretorio', title: 'Instalar pelo Diretório' },
  { id: 'chamar',    title: 'Recarregar e usar' },
]

function Crumbs({ last }: { last: string }) {
  return (
    <div className="eb-crumbs">
      <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>GUIA</Link>
      <span className="eb-sep">/</span>
      <span>CLAUDE CODE</span>
      <span className="eb-sep">/</span>
      <span>{last}</span>
    </div>
  )
}

/* ─── CLI mode ─── */

function StepCliMarketplace() {
  return (
    <>
      <Crumbs last="MARKETPLACE" />
      <h1>Adicione o <span className="eb-accent">marketplace</span></h1>
      <p className="eb-lede">
        Em uma conversa com o Claude Code, registre o repositório do EvenBetter como fonte de plugins.
      </p>
      <CodeBlock lang="bash" code="/plugin marketplace add MelloBirkan/EvenBetterFramework" />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin marketplace add MelloBirkan/EvenBetterFramework</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Marketplace adicionado</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Catálogo sincronizado: evenbetter</div>
                <div><span className="eb-chat-ok">✓</span> Plugins disponíveis: evenbetter-ios</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Callout kind="tip" title="O que é um marketplace?">
        É um repositório GitHub com um catálogo de plugins. Adicionar o marketplace não instala nada ainda —
        ele apenas registra o catálogo para que você possa descobrir e instalar plugins.
      </Callout>
    </>
  )
}

function StepCliInstalar() {
  return (
    <>
      <Crumbs last="INSTALAR" />
      <h1>Instale o <span className="eb-accent">plugin</span></h1>
      <p className="eb-lede">
        Com o marketplace registrado, instale o plugin EvenBetter iOS pelo nome.
      </p>
      <CodeBlock lang="bash" code="/plugin install evenbetter-ios@evenbetter" />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin install evenbetter-ios@evenbetter</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin instalado: evenbetter-ios</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios:evenbetter-ios-feature</div>
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios:swiftui-ui-patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Callout kind="note" title="Sintaxe nome@marketplace">
        O sufixo <code>@evenbetter</code> identifica o marketplace de origem. Sem ele, o Claude Code não sabe
        de onde puxar o plugin.
      </Callout>
    </>
  )
}

/* ─── Desktop mode ─── */

function StepDesktopCustomize() {
  const steps: { img: string; alt: string; caption: React.ReactNode; hl: { x: string; y: string; w: string; h: string } }[] = [
    {
      img: '/tutorial/claude-code/cc-customize-1-sidebar.png',
      alt: 'Barra lateral do Claude Code com opção Customize',
      caption: <>Clique em <strong>Customize</strong> na barra lateral do Claude Code</>,
      hl: { x: '7%', y: '72%', w: '80%', h: '11%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-2-home.png',
      alt: 'Tela Personalizar o Claude',
      caption: <>A tela <em>Personalizar o Claude</em> aparece — clique no <strong>+</strong> ao lado de Plugins pessoais</>,
      hl: { x: '15%', y: '26%', w: '6%', h: '6%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-3-menu.png',
      alt: 'Menu com Navegar por plugins e Criar plugin',
      caption: <>Clique em <strong>+ Criar plugin</strong></>,
      hl: { x: '8%', y: '54%', w: '87%', h: '26%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-4-submenu.png',
      alt: 'Submenu com opção Adicionar marketplace',
      caption: <>No submenu, selecione <strong>Adicionar marketplace</strong></>,
      hl: { x: '51%', y: '31%', w: '46%', h: '24%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-5-dialog.png',
      alt: 'Dialog Adicionar marketplace com campo URL',
      caption: <>Cole a URL no campo e clique <strong>Sincronizar</strong></>,
      hl: { x: '4%', y: '56%', w: '92%', h: '27%' },
    },
  ]

  return (
    <>
      <Crumbs last="CUSTOMIZE" />
      <h1>Adicione pelo <span className="eb-accent">Customize</span></h1>
      <p className="eb-lede">
        No app do Claude, abra o menu <strong>Customize</strong> para registrar o marketplace pela interface gráfica.
      </p>
      <div className="eb-step-img-grid eb-step-img-grid--sm">
        {steps.map((s, i) => (
          <div key={i} className="eb-step-img-item">
            <div className="eb-step-img-wrap">
              <img src={s.img} alt={s.alt} />
              <div className="eb-step-img-hl" style={{ left: s.hl.x, top: s.hl.y, width: s.hl.w, height: s.hl.h }} />
            </div>
            <div className="eb-step-img-caption">
              <span className="eb-step-img-num">{String(i + 1).padStart(2, '0')}</span>
              <span>{s.caption}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="eb-step-img-item">
        <div className="eb-step-img-caption">
          <span className="eb-step-img-num">URL</span>
          <span>Use essa URL no campo Sincronizar</span>
        </div>
        <CodeBlock lang="url" code="https://github.com/MelloBirkan/EvenBetterFramework" />
      </div>
    </>
  )
}

function StepDesktopDiretorio() {
  return (
    <>
      <Crumbs last="DIRETÓRIO" />
      <h1>Instale pelo <span className="eb-accent">Diretório</span></h1>
      <p className="eb-lede">
        Após sincronizar, o Diretório abre. Vá até a aba <strong>Código</strong>,
        localize o card <code>evenbetter-ios</code> e clique no <strong>+</strong> para instalar.
      </p>
      <div className="eb-step-img-item">
        <div className="eb-step-img-wrap">
          <img src="/tutorial/claude-code/cc-diretorio-install.gif" alt="Instalando evenbetter-ios pelo Diretório do Claude Code" style={{ borderRadius: '12px' }} />
        </div>
      </div>
      <Callout kind="note" title="Feche e reabra o Claude Code">
        Após instalar, feche o Claude Code completamente e abra novamente — as skills só aparecem depois de reiniciar o app.
      </Callout>
      <Callout kind="tip" title="Não achou na aba Código?">
        Use o campo <em>Pesquisar plugins</em> no topo do Diretório e digite <code>evenbetter</code>.
      </Callout>
    </>
  )
}

function StepDesktopChamar() {
  return (
    <>
      <Crumbs last="USAR" />
      <h1>Abra o projeto e <span className="eb-accent">use</span></h1>
      <p className="eb-lede">
        Com o Claude Code reaberto, abra o projeto iOS desejado. Digite <code>/</code> no chat e escolha a skill do EvenBetter.
      </p>
      <div className="eb-step-img-item">
        <div className="eb-step-img-caption">
          <span className="eb-step-img-num">01</span>
          <span>Digite <strong>/</strong> no chat — as skills EvenBetter aparecem no autocomplete</span>
        </div>
        <div className="eb-step-img-wrap">
          <img src="/tutorial/claude-code/cc-diretorio-skills.png" alt="Skills evenbetter disponíveis no autocomplete do Claude Code" />
        </div>
      </div>
      <div className="eb-step-img-item">
        <div className="eb-step-img-caption">
          <span className="eb-step-img-num">02</span>
          <span>Selecione a skill desejada — o EvenBetter lê os arquivos do projeto automaticamente</span>
        </div>
      </div>
      <Callout kind="tip" title="Qual skill escolher?">
        Explore o que cada uma oferece.{' '}
        <Link href="/#skills" style={{ color: 'var(--eb-teal)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Ver todas →
        </Link>
      </Callout>
      <Callout kind="note" title="Sem necessidade de copiar código">
        A skill lê os arquivos do projeto automaticamente. Basta selecionar e aguardar o relatório.
      </Callout>
    </>
  )
}

/* ─── Shared step (CLI) ─── */

function StepChamar() {
  return (
    <>
      <Crumbs last="USAR" />
      <h1>Recarregue e <span className="eb-accent">use</span></h1>
      <p className="eb-lede">
        Recarregue os plugins na sessão atual e invoque a skill desejada.
      </p>
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/reload-plugins</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugins recarregados</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios carregado com 2 skills</div>
              </div>
            </div>
          </div>
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/evenbetter-ios:evenbetter-ios-feature</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Skill carregada: EvenBetter iOS Feature</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Projeto iOS detectado</div>
                <div><span className="eb-chat-ok">✓</span> Iniciando análise de acessibilidade…</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CodeBlock lang="bash" code={'# Recarregar plugins na sessão atual\n/reload-plugins\n\n# Invocar a skill\n/evenbetter-ios:evenbetter-ios-feature'} />
      <Callout kind="tip" title="Autocompletar com namespace">
        Use <kbd>Tab</kbd> após <code>/evenbetter-ios:</code> para ver todas as skills do plugin disponíveis.
      </Callout>
      <Callout kind="note" title="Sem necessidade de copiar código">
        A skill lê os arquivos do projeto automaticamente. Basta invocar e aguardar o relatório de acessibilidade.
      </Callout>
    </>
  )
}

export default function TutorialAnthropicPage() {
  const [mode, setMode] = useState<Mode>('cli')
  const [cliStep, setCliStep] = useState<CliStepId>('marketplace')
  const [desktopStep, setDesktopStep] = useState<DesktopStepId>('customize')

  const steps = mode === 'cli' ? STEPS_CLI : STEPS_DESKTOP
  const step = mode === 'cli' ? cliStep : desktopStep
  const setStep = (id: string) => {
    if (mode === 'cli') setCliStep(id as CliStepId)
    else setDesktopStep(id as DesktopStepId)
  }
  const stepIdx = steps.findIndex(s => s.id === step)
  const prev = stepIdx > 0 ? steps[stepIdx - 1] : null
  const next = stepIdx < steps.length - 1 ? steps[stepIdx + 1] : null
  const isDone = !next

  useEffect(() => { window.scrollTo(0, 0) }, [step, mode])

  const renderStep = () => {
    if (mode === 'cli') {
      if (cliStep === 'marketplace') return <StepCliMarketplace />
      if (cliStep === 'instalar')    return <StepCliInstalar />
      if (cliStep === 'chamar')      return <StepChamar />
    } else {
      if (desktopStep === 'customize') return <StepDesktopCustomize />
      if (desktopStep === 'diretorio') return <StepDesktopDiretorio />
      if (desktopStep === 'chamar')    return <StepDesktopChamar />
    }
    return null
  }

  return (
    <div className="eb-root">
      <TutorialNav />
      <div className="eb-tut">
        <aside className="eb-sidebar">
          <Link href="/" className="eb-sidebar-back">
            <Icon name="chevron" size={12} />
            Início
          </Link>
          <div className="eb-sidebar-agent">
            <div>
              <div className="eb-sidebar-agent-name">Claude Code</div>
              <div className="eb-sidebar-agent-sub">Anthropic Claude Code</div>
            </div>
          </div>
          <SegmentedControl<Mode>
            value={mode}
            onChange={setMode}
            options={[
              { value: 'cli', label: 'CLI' },
              { value: 'desktop', label: 'Desktop' },
            ]}
          />
          <div className="eb-side-title">Etapas</div>
          {steps.map((s, idx) => {
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
        <main className="eb-content eb-fade-page" key={`${mode}-${step}`}>
          {renderStep()}
          {isDone && (
            <div className="eb-pager-done">
              <div className="eb-pager-done-icon"><Icon name="check" size={14} /></div>
              <div>
                <h4>Tudo pronto!</h4>
                <p>Seu projeto já pode ser analisado com o EvenBetter.</p>
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
    </div>
  )
}
