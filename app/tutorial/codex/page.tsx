'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TutorialNav, CodeBlock, Callout, Icon } from '../../_components/tutorial-primitives'

type StepId = 'marketplace' | 'instalar' | 'chamar' | 'desinstalar'

const STEPS = [
  { id: 'marketplace' as StepId, title: 'Adicionar marketplace' },
  { id: 'instalar'    as StepId, title: 'Instalar o plugin' },
  { id: 'chamar'      as StepId, title: 'Chamar com @' },
  { id: 'desinstalar' as StepId, title: 'Desinstalar o plugin' },
]

function Crumbs({ last }: { last: string }) {
  return (
    <div className="eb-crumbs">
      <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>GUIA</Link>
      <span className="eb-sep">/</span>
      <span>CODEX</span>
      <span className="eb-sep">/</span>
      <span>{last}</span>
    </div>
  )
}

function StepMarketplace() {
  return (
    <>
      <Crumbs last="MARKETPLACE" />
      <h1>Adicione o <span className="eb-accent">marketplace</span></h1>
      <p className="eb-lede">
        No terminal, adicione o repositório do EvenBetter como fonte de plugins do Codex.
      </p>
      <CodeBlock lang="bash" code="codex plugin marketplace add MelloBirkan/EvenBetterFramework" />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CODEX</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">$</span>
            <span className="eb-chat-cmd">codex plugin marketplace add MelloBirkan/EvenBetterFramework</span>
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
        É um repositório GitHub com um catálogo de plugins. Adicionar o marketplace não instala nada ainda,
        ele apenas registra o catálogo para que você possa descobrir e instalar plugins.
      </Callout>
    </>
  )
}

function StepInstalar() {
  return (
    <>
      <Crumbs last="INSTALAR" />
      <h1>Instale o <span className="eb-accent">plugin</span></h1>
      <p className="eb-lede">
        Instale o plugin pelo Codex Desktop ou pela CLI interativa.
      </p>

      <div className="eb-callout tip" style={{ marginBottom: '1rem' }}>
        <div className="eb-callout-icon"><Icon name="tip" size={14} /></div>
        <div className="eb-callout-body">
          <strong>Via Codex Desktop</strong>
          <div>
            Abra o Codex Desktop e navegue até{' '}
            <code>Plugins → evenbetter → evenbetter-ios → Add to Codex</code>
          </div>
        </div>
      </div>

      <p className="eb-lede" style={{ marginTop: '1.5rem' }}>
        Ou pela CLI interativa:
      </p>
      <CodeBlock lang="bash" code={'# Abra o Codex e entre no browser de plugins\ncodex\n/plugins'} />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CODEX CLI</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugins</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin browser</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">→</span> Marketplace: evenbetter</div>
                <div><span className="eb-chat-ok">→</span> evenbetter-ios, <em>Install plugin</em></div>
              </div>
            </div>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin instalado: evenbetter-ios</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Pronto para usar com @evenbetter-ios</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Callout kind="note" title="Navegue pelo browser de plugins">
        No browser de plugins, escolha o marketplace <code>evenbetter</code>, abra <code>evenbetter-ios</code>
        e selecione <strong>Install plugin</strong>.
      </Callout>

      <h2 style={{ marginTop: '2rem' }}>Bônus: plugin <code>evenbetter-general</code></h2>
      <p>
        O mesmo marketplace também publica o <code>evenbetter-general</code>, com 2 skills agnósticas de
        plataforma para planejamento de feature e épico (<code>evenbetter-general-feature</code> e{' '}
        <code>evenbetter-general-epic</code>). Repita o fluxo, mas escolhendo <code>evenbetter-general</code>{' '}
        no browser:
      </p>
      <CodeBlock
        lang="bash"
        code={'codex\n/plugins\n# escolher marketplace evenbetter -> evenbetter-general -> Install plugin'}
      />
      <Callout kind="tip" title="Pode instalar os dois">
        Os dois plugins convivem sem conflito. Invoque com <code>@evenbetter-ios</code> ou{' '}
        <code>@evenbetter-general</code>.
      </Callout>
    </>
  )
}

function StepChamar() {
  return (
    <>
      <Crumbs last="USAR" />
      <h1>Chame com <span className="eb-accent">@</span></h1>
      <p className="eb-lede">
        Inicie uma nova conversa no Codex e invoque o plugin com <code>@</code>.
      </p>
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CODEX</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">@evenbetter-ios analise a acessibilidade do projeto</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin carregado: EvenBetter iOS</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Projeto iOS detectado</div>
                <div><span className="eb-chat-ok">✓</span> Iniciando análise de acessibilidade…</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CodeBlock lang="bash" code={'# Em uma nova conversa no Codex\n@evenbetter-ios analise a acessibilidade do projeto'} />
      <Callout kind="tip" title="Sempre em uma nova conversa">
        O Codex carrega os plugins ao iniciar o thread. Instalar em uma conversa já aberta exige
        reiniciar o thread para que o plugin fique disponível.
      </Callout>
      <Callout kind="note" title="Sem necessidade de copiar código">
        O plugin lê os arquivos do projeto automaticamente. Basta invocar com <code>@</code> e aguardar o relatório.
      </Callout>
    </>
  )
}

function StepDesinstalar() {
  return (
    <>
      <Crumbs last="DESINSTALAR" />
      <h1>Desinstale o <span className="eb-accent">plugin</span></h1>
      <p className="eb-lede">
        O Codex separa <strong>desabilitar</strong> (mantém o plugin no disco mas inativo) de{' '}
        <strong>desinstalar</strong> (remove de vez). Faça pelo browser interativo, pelo arquivo de
        configuração, ou pelo comando da CLI.
      </p>

      <h2>Pelo browser de plugins</h2>
      <p>
        A forma mais simples: abra o plugin no mesmo browser usado para instalar e selecione{' '}
        <strong>Uninstall plugin</strong>.
      </p>
      <CodeBlock lang="bash" code={'# Abra o Codex e o browser\ncodex\n/plugins'} />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CODEX CLI</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugins</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin browser</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">→</span> Marketplace: evenbetter</div>
                <div><span className="eb-chat-ok">→</span> evenbetter-ios, <em>Uninstall plugin</em></div>
              </div>
            </div>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin removido: evenbetter-ios</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Marketplace evenbetter continua registrado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Callout kind="tip" title="Atalho: pausar sem desinstalar">
        Dentro do browser, aperte <kbd>Space</kbd> em um plugin instalado para alternar entre habilitado
        e desabilitado, sem remover do disco.
      </Callout>

      <h2>Pelo config.toml</h2>
      <p>
        Para desabilitar de forma persistente sem abrir o browser, edite <code>~/.codex/config.toml</code> e
        marque o plugin como inativo. Depois, reinicie o Codex.
      </p>
      <CodeBlock
        lang="toml"
        code={'[plugins."evenbetter-ios@evenbetter"]\nenabled = false'}
      />

      <h2>Remover o marketplace inteiro</h2>
      <p>
        Quando você não pretende voltar, dá para apagar o registro do marketplace. Isso remove também os
        plugins instalados a partir dele.
      </p>
      <CodeBlock lang="bash" code="codex plugin marketplace remove evenbetter" />

      <Callout kind="note" title="Reinstalar é fácil">
        Mesmo depois de desinstalar, enquanto o marketplace estiver registrado o evenbetter-ios continua
        aparecendo no <code>/plugins</code>. Para voltar atrás, abra o browser e selecione{' '}
        <strong>Install plugin</strong> de novo.
      </Callout>

      <Callout kind="warn" title="Apps conectados continuam">
        Se o plugin trouxer integrações com apps externos (Gmail, Drive, etc.), desinstalar remove só o
        plugin do Codex. Os apps em si continuam conectados na sua conta ChatGPT até você gerenciá-los lá.
      </Callout>
    </>
  )
}

export default function TutorialCodexPage() {
  const [step, setStep] = useState<StepId>('marketplace')
  const stepIdx = STEPS.findIndex(s => s.id === step)
  const prev = stepIdx > 0 ? STEPS[stepIdx - 1] : null
  const next = stepIdx < STEPS.length - 1 ? STEPS[stepIdx + 1] : null
  const isDone = !next

  useEffect(() => { window.scrollTo(0, 0) }, [step])

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
              <div className="eb-sidebar-agent-name">Codex</div>
              <div className="eb-sidebar-agent-sub">OpenAI Codex CLI</div>
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
          {step === 'marketplace' && <StepMarketplace />}
          {step === 'instalar'    && <StepInstalar />}
          {step === 'chamar'      && <StepChamar />}
          {step === 'desinstalar' && <StepDesinstalar />}
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
