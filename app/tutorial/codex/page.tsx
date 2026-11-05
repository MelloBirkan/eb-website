'use client'

import { Callout, CodeBlock, MenuPath, Terminal } from '../../../components/site/guide/blocks'
import { GuideShell, StepHead, type GuideStep } from '../../../components/site/guide/guide-shell'
import { useGuideStep } from '../../../components/site/guide/use-guide-step'

type StepId = 'marketplace' | 'instalar' | 'chamar' | 'desinstalar'

const STEPS: GuideStep<StepId>[] = [
  { id: 'marketplace', title: 'Adicionar marketplace' },
  { id: 'instalar', title: 'Instalar o plugin' },
  { id: 'chamar', title: 'Chamar com @' },
  { id: 'desinstalar', title: 'Desinstalar o plugin' },
]

const IDS = STEPS.map((s) => s.id)

function StepMarketplace() {
  return (
    <>
      <StepHead
        title={
          <>
            Adicione o <span className="serif">marketplace</span>
          </>
        }
      >
        No terminal, adicione o repositório do EvenBetter como fonte de plugins do Codex.
      </StepHead>
      <CodeBlock code="codex plugin marketplace add MelloBirkan/EvenBetterFramework" />
      <Terminal
        label="Terminal"
        prompt="$"
        log={[
          { cmd: 'codex plugin marketplace add MelloBirkan/EvenBetterFramework' },
          {
            title: 'Marketplace adicionado',
            lines: ['Catálogo sincronizado: evenbetter', 'Plugins disponíveis: evenbetter-ios, evenbetter-general'],
          },
        ]}
      />
      <Callout kind="tip" title="O que é um marketplace?">
        É um repositório GitHub com um catálogo de plugins. Adicionar o marketplace não instala nada ainda, ele apenas
        registra o catálogo para que você possa descobrir e instalar plugins.
      </Callout>
    </>
  )
}

function StepInstalar() {
  return (
    <>
      <StepHead
        title={
          <>
            Instale o <span className="serif">plugin</span>
          </>
        }
      >
        Instale o plugin pelo Codex Desktop ou pela CLI interativa.
      </StepHead>

      <h3>Pelo Codex Desktop</h3>
      <p>Abra o Codex Desktop e siga este caminho:</p>
      <MenuPath label="Caminho no Codex Desktop" items={['Plugins', 'evenbetter', 'evenbetter-ios', 'Add to Codex']} />

      <h3>Pela CLI interativa</h3>
      <CodeBlock code={'# Abra o Codex e entre no browser de plugins\ncodex\n/plugins'} />
      <Terminal
        label="Codex CLI"
        log={[
          { cmd: '/plugins' },
          {
            title: 'Plugin browser',
            arrow: true,
            lines: [
              'Marketplace: evenbetter',
              <>
                evenbetter-ios, <em>Install plugin</em>
              </>,
            ],
          },
          { title: 'Plugin instalado: evenbetter-ios', lines: ['Pronto para usar com @evenbetter-ios'] },
        ]}
      />
      <Callout kind="note" title="Navegue pelo browser de plugins">
        No browser de plugins, escolha o marketplace <code>evenbetter</code>, abra <code>evenbetter-ios</code> e
        selecione <strong>Install plugin</strong>.
      </Callout>

      <h3>
        Bônus: plugin <code>evenbetter-general</code>
      </h3>
      <p>
        O mesmo marketplace também publica o <code>evenbetter-general</code>, com 2 skills agnósticas de plataforma para
        planejamento de feature e épico (<code>evenbetter-general-feature</code> e <code>evenbetter-general-epic</code>).
        Repita o fluxo, mas escolhendo <code>evenbetter-general</code> no browser:
      </p>
      <CodeBlock code={'codex\n/plugins\n# escolher marketplace evenbetter -> evenbetter-general -> Install plugin'} />
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
      <StepHead
        title={
          <>
            Chame com <span className="serif">@</span>
          </>
        }
      >
        Inicie uma nova conversa no Codex e invoque o plugin com <code>@</code>.
      </StepHead>
      <Terminal
        label="Codex"
        log={[
          { cmd: '@evenbetter-ios analise a acessibilidade do projeto' },
          {
            title: 'Plugin carregado: EvenBetter iOS',
            lines: ['Projeto iOS detectado', 'Iniciando análise de acessibilidade…'],
          },
        ]}
      />
      <CodeBlock code={'# Em uma nova conversa no Codex\n@evenbetter-ios analise a acessibilidade do projeto'} />
      <Callout kind="tip" title="Sempre em uma nova conversa">
        O Codex carrega os plugins ao iniciar o thread. Instalar em uma conversa já aberta exige reiniciar o thread para
        que o plugin fique disponível.
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
      <StepHead
        title={
          <>
            Desinstale o <span className="serif">plugin</span>
          </>
        }
      >
        O Codex separa <strong>desabilitar</strong> (mantém o plugin no disco mas inativo) de{' '}
        <strong>desinstalar</strong> (remove de vez). Faça pelo browser interativo, pelo arquivo de configuração, ou pelo
        comando da CLI.
      </StepHead>

      <h3>Pelo browser de plugins</h3>
      <p>
        A forma mais simples: abra o plugin no mesmo browser usado para instalar e selecione{' '}
        <strong>Uninstall plugin</strong>.
      </p>
      <CodeBlock code={'# Abra o Codex e o browser\ncodex\n/plugins'} />
      <Terminal
        label="Codex CLI"
        log={[
          { cmd: '/plugins' },
          {
            title: 'Plugin browser',
            arrow: true,
            lines: [
              'Marketplace: evenbetter',
              <>
                evenbetter-ios, <em>Uninstall plugin</em>
              </>,
            ],
          },
          { title: 'Plugin removido: evenbetter-ios', lines: ['Marketplace evenbetter continua registrado'] },
        ]}
      />
      <Callout kind="tip" title="Atalho: pausar sem desinstalar">
        Dentro do browser, aperte <kbd>Space</kbd> em um plugin instalado para alternar entre habilitado e desabilitado,
        sem remover do disco.
      </Callout>

      <h3>Pelo config.toml</h3>
      <p>
        Para desabilitar de forma persistente sem abrir o browser, edite <code>~/.codex/config.toml</code> e marque o
        plugin como inativo. Depois, reinicie o Codex.
      </p>
      <CodeBlock lang="toml" code={'[plugins."evenbetter-ios@evenbetter"]\nenabled = false'} />

      <h3>Remover o marketplace inteiro</h3>
      <p>
        Quando você não pretende voltar, dá para apagar o registro do marketplace. Isso remove também os plugins
        instalados a partir dele.
      </p>
      <CodeBlock code="codex plugin marketplace remove evenbetter" />

      <Callout kind="note" title="Reinstalar é fácil">
        Mesmo depois de desinstalar, enquanto o marketplace estiver registrado o evenbetter-ios continua aparecendo no{' '}
        <code>/plugins</code>. Para voltar atrás, abra o browser e selecione <strong>Install plugin</strong> de novo.
      </Callout>
      <Callout kind="warn" title="Apps conectados continuam">
        Se o plugin trouxer integrações com apps externos (Gmail, Drive, etc.), desinstalar remove só o plugin do Codex.
        Os apps em si continuam conectados na sua conta ChatGPT até você gerenciá-los lá.
      </Callout>
    </>
  )
}

const CONTENT: Record<StepId, () => React.JSX.Element> = {
  marketplace: StepMarketplace,
  instalar: StepInstalar,
  chamar: StepChamar,
  desinstalar: StepDesinstalar,
}

export default function TutorialCodexPage() {
  const [step, go] = useGuideStep(IDS, 'marketplace')
  const Content = CONTENT[step]
  return (
    <GuideShell
      eyebrow="Guia de instalação"
      title={
        <>
          O EvenBetter no <span className="serif">Codex</span>
        </>
      }
      lede="Adicione o marketplace, instale o plugin e chame as skills com @. A última etapa mostra como pausar ou remover o plugin."
      facts={['4 etapas', 'Codex CLI e Desktop']}
      steps={STEPS}
      step={step}
      onStep={go}
      done={{
        title: 'Fim do guia',
        body: 'Agora você sabe instalar, chamar e remover o plugin no Codex. O guia do plugin iOS mostra o que cada uma das 16 skills faz.',
      }}
    >
      <Content />
    </GuideShell>
  )
}
