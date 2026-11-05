'use client'

import Link from 'next/link'
import {
  Callout,
  CodeBlock,
  Shot,
  ShotGrid,
  Step,
  Steps,
  Terminal,
} from '../../../components/site/guide/blocks'
import { GuideShell, HeroField, StepHead, type GuideStep } from '../../../components/site/guide/guide-shell'
import { useGuideStep } from '../../../components/site/guide/use-guide-step'
import { Segmented } from '../../../components/site/research/segmented'

type Mode = 'cli' | 'desktop'
type CliStepId = 'marketplace' | 'instalar' | 'chamar' | 'atualizar' | 'desinstalar'
type DesktopStepId = 'app-customize' | 'app-diretorio' | 'app-chamar' | 'app-atualizar' | 'app-desinstalar'
type StepId = CliStepId | DesktopStepId

const STEPS_CLI: GuideStep<CliStepId>[] = [
  { id: 'marketplace', title: 'Adicionar marketplace' },
  { id: 'instalar', title: 'Instalar o plugin' },
  { id: 'chamar', title: 'Recarregar e usar' },
  { id: 'atualizar', title: 'Atualizar e auto-update' },
  { id: 'desinstalar', title: 'Desinstalar o plugin' },
]

const STEPS_DESKTOP: GuideStep<DesktopStepId>[] = [
  { id: 'app-customize', title: 'Adicionar pelo Customize' },
  { id: 'app-diretorio', title: 'Instalar pelo Diretório' },
  { id: 'app-chamar', title: 'Recarregar e usar' },
  { id: 'app-atualizar', title: 'Atualizar e auto-update' },
  { id: 'app-desinstalar', title: 'Desinstalar o plugin' },
]

const IDS: StepId[] = [...STEPS_CLI.map((s) => s.id), ...STEPS_DESKTOP.map((s) => s.id)]

const UPDATE_CODE =
  '# 1. Atualizar o catálogo do marketplace\n/plugin marketplace update evenbetter\n\n' +
  '# 2. Atualizar os plugins instalados\n/plugin update evenbetter-ios@evenbetter\n/plugin update evenbetter-general@evenbetter\n\n' +
  '# 3. Recarregar na sessão atual\n/reload-plugins'

/* ───── Terminal (CLI) ───── */

function StepCliMarketplace() {
  return (
    <>
      <StepHead
        title={
          <>
            Adicione o <span className="serif">marketplace</span>
          </>
        }
      >
        Em uma conversa com o Claude Code, registre o repositório do EvenBetter como fonte de plugins.
      </StepHead>
      <CodeBlock code="/plugin marketplace add MelloBirkan/EvenBetterFramework" />
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/plugin marketplace add MelloBirkan/EvenBetterFramework' },
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

function StepCliInstalar() {
  return (
    <>
      <StepHead
        title={
          <>
            Instale o <span className="serif">plugin</span>
          </>
        }
      >
        Com o marketplace registrado, instale o plugin EvenBetter iOS pelo nome.
      </StepHead>
      <CodeBlock code="/plugin install evenbetter-ios@evenbetter" />
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/plugin install evenbetter-ios@evenbetter' },
          {
            title: 'Plugin instalado: evenbetter-ios',
            lines: ['evenbetter-ios:evenbetter-ios-feature', 'evenbetter-ios:evenbetter-swiftui-ui-patterns'],
          },
        ]}
      />
      <Callout kind="note" title="Sintaxe nome@marketplace">
        O sufixo <code>@evenbetter</code> identifica o marketplace de origem. Sem ele, o Claude Code não sabe de onde
        puxar o plugin.
      </Callout>

      <h3>
        Bônus: plugin <code>evenbetter-general</code>
      </h3>
      <p>
        O mesmo marketplace também publica o <code>evenbetter-general</code>, com 2 skills agnósticas de plataforma para
        planejamento de feature e épico (<code>evenbetter-general-feature</code> e <code>evenbetter-general-epic</code>).
        Útil para projetos não-iOS, ou para combinar com o plugin iOS.
      </p>
      <CodeBlock code="/plugin install evenbetter-general@evenbetter" />
      <Callout kind="tip" title="Pode instalar os dois">
        Os dois plugins convivem sem conflito. As skills aparecem com namespaces diferentes:{' '}
        <code>/evenbetter-ios:…</code> e <code>/evenbetter-general:…</code>.
      </Callout>
    </>
  )
}

function StepCliChamar() {
  return (
    <>
      <StepHead
        title={
          <>
            Recarregue e <span className="serif">use</span>
          </>
        }
      >
        Recarregue os plugins na sessão atual e invoque a skill desejada.
      </StepHead>
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/reload-plugins' },
          { title: 'Plugins recarregados', lines: ['evenbetter-ios carregado com 16 skills'] },
          { cmd: '/evenbetter-ios:evenbetter-analyze' },
          {
            title: 'Skill carregada: evenbetter-analyze',
            lines: ['Projeto iOS detectado', 'Iniciando análise de acessibilidade…'],
          },
        ]}
      />
      <CodeBlock
        code={'# Recarregar plugins na sessão atual\n/reload-plugins\n\n# Invocar a skill\n/evenbetter-ios:evenbetter-analyze'}
      />
      <Callout kind="tip" title="Autocompletar com namespace">
        Use <kbd>Tab</kbd> após <code>/evenbetter-ios:</code> para ver todas as skills do plugin disponíveis.
      </Callout>
      <Callout kind="note" title="Sem necessidade de copiar código">
        A skill lê os arquivos do projeto automaticamente. Basta invocar e aguardar o relatório de acessibilidade.
      </Callout>
    </>
  )
}

function StepCliAtualizar() {
  return (
    <>
      <StepHead
        title={
          <>
            Atualize e ligue o <span className="serif">auto-update</span>
          </>
        }
      >
        Quando o EvenBetter ganha skills novas ou correções, você pode buscar a versão mais recente sem reinstalar. Faça
        manualmente quando quiser, ou deixe o Claude Code atualizar sozinho ao iniciar.
      </StepHead>

      <h3>Atualizar manualmente</h3>
      <p>
        Três passos: <code>/plugin marketplace update</code> baixa o catálogo mais novo, <code>/plugin update</code>{' '}
        aplica a nova versão de cada plugin instalado e <code>/reload-plugins</code> recarrega na sessão atual.
      </p>
      <CodeBlock code={UPDATE_CODE} />
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/plugin marketplace update evenbetter' },
          {
            title: 'Marketplace atualizado',
            lines: ['Catálogo sincronizado: evenbetter', 'Novas versões disponíveis para 2 plugins'],
          },
          { cmd: '/plugin update evenbetter-ios@evenbetter' },
          { title: 'Plugin atualizado', lines: ['evenbetter-ios atualizado para a versão mais recente'] },
          { cmd: '/reload-plugins' },
          { title: 'Plugins recarregados', lines: ['evenbetter-ios carregado com as skills atualizadas'] },
        ]}
      />
      <Callout kind="tip" title="Atalho">
        <code>/plugin market update evenbetter</code> também funciona. Se omitir o nome,{' '}
        <code>/plugin marketplace update</code> atualiza todos os marketplaces de uma vez. E o{' '}
        <code>/plugin update</code> só é necessário para plugins que você realmente instalou, rode apenas para os que
        aparecem no <code>/plugin list</code>.
      </Callout>

      <h3>Ligar auto-update</h3>
      <p>
        Marketplaces de terceiros (como o do EvenBetter) vêm com auto-update <strong>desligado</strong> por padrão. Ligue
        manualmente para que o Claude Code busque novas versões ao iniciar.
      </p>
      <Steps>
        <Step title="Abra o gerenciador">
          Digite <code>/plugin</code> em qualquer sessão do Claude Code.
        </Step>
        <Step title="Vá para a aba Marketplaces">
          Use <kbd>Tab</kbd> para alternar entre as abas e selecione <strong>evenbetter</strong> na lista.
        </Step>
        <Step title="Selecione Enable auto-update">
          A partir daí, o Claude Code atualiza o marketplace e reaplica as novas versões a cada início de sessão.
        </Step>
      </Steps>
      <Callout kind="note" title="Notificação ao atualizar">
        Quando algum plugin é atualizado em segundo plano, o Claude Code mostra um aviso pedindo para você rodar{' '}
        <code>/reload-plugins</code> e aplicar as mudanças sem reiniciar.
      </Callout>

      <h3>Variáveis de ambiente</h3>
      <p>Se você prefere controlar tudo pelo shell, duas variáveis cobrem a maioria dos casos:</p>
      <CodeBlock
        code={
          '# Desliga auto-update do CLI E dos plugins\nexport DISABLE_AUTOUPDATER=1\n\n' +
          '# Mantém só os plugins se atualizando, mesmo com o CLI travado\nexport DISABLE_AUTOUPDATER=1\nexport FORCE_AUTOUPDATE_PLUGINS=1'
        }
      />
      <Callout kind="warn" title="Não funciona no Codex">
        O auto-update por marketplace é específico do Claude Code. No Codex, atualize manualmente com{' '}
        <code>codex plugin marketplace upgrade evenbetter</code> sempre que quiser puxar novidades.
      </Callout>
    </>
  )
}

function StepCliDesinstalar() {
  return (
    <>
      <StepHead
        title={
          <>
            Desinstale o <span className="serif">plugin</span>
          </>
        }
      >
        Quer pausar as skills sem perder a configuração, ou remover de vez? O Claude Code separa as duas coisas:{' '}
        <strong>desabilitar</strong> esconde as skills mas mantém o plugin no disco; <strong>desinstalar</strong> apaga
        tudo.
      </StepHead>

      <h3>Pausar sem desinstalar</h3>
      <p>
        Útil quando você quer testar como o agente se comporta sem as skills, ou liberar espaço de contexto em uma sessão
        específica. Reativar é instantâneo.
      </p>
      <CodeBlock
        code={
          '# Desabilitar (mantém instalado)\n/plugin disable evenbetter-ios@evenbetter\n\n' +
          '# Reabilitar quando quiser\n/plugin enable evenbetter-ios@evenbetter\n\n' +
          '# Aplicar a mudança na sessão atual\n/reload-plugins'
        }
      />
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/plugin disable evenbetter-ios@evenbetter' },
          {
            title: 'Plugin desabilitado',
            lines: [
              'evenbetter-ios marcado como inativo',
              <>
                Rode <code>/reload-plugins</code> para aplicar agora
              </>,
            ],
          },
        ]}
      />

      <h3>Desinstalar de vez</h3>
      <p>
        Remove o plugin da configuração e do cache. Você ainda mantém o marketplace registrado, então dá pra reinstalar
        com um único comando se mudar de ideia.
      </p>
      <CodeBlock
        code={'# Desinstalar o plugin\n/plugin uninstall evenbetter-ios@evenbetter\n\n# Aplicar na sessão atual\n/reload-plugins'}
      />
      <Terminal
        label="Claude Code"
        log={[
          { cmd: '/plugin uninstall evenbetter-ios@evenbetter' },
          {
            title: 'Plugin removido',
            lines: ['evenbetter-ios desinstalado', 'Marketplace evenbetter continua registrado'],
          },
        ]}
      />
      <Callout kind="tip" title="Escopo certo">
        Se você instalou em múltiplos escopos (user, project, local), use <code>--scope</code> para mirar o certo:{' '}
        <code>claude plugin uninstall evenbetter-ios@evenbetter --scope project</code>.
      </Callout>

      <h3>Remover o marketplace inteiro</h3>
      <p>
        Quando você não pretende voltar, dá para apagar também o registro do marketplace. Isso{' '}
        <strong>desinstala automaticamente todos os plugins</strong> instalados a partir dele.
      </p>
      <CodeBlock
        code={'# Remove o marketplace E todos os plugins instalados a partir dele\n/plugin marketplace remove evenbetter'}
      />
      <Callout kind="warn" title="Skills ainda aparecem no autocomplete?">
        Em casos raros o cache local fica desatualizado. Limpe com <code>rm -rf ~/.claude/plugins/cache</code>, reinicie
        o Claude Code e o autocomplete volta ao normal.
      </Callout>
      <Callout kind="note" title="Equivalente no Codex">
        No Codex, abra <code>codex</code>, rode <code>/plugins</code>, escolha o evenbetter-ios e selecione{' '}
        <strong>Uninstall plugin</strong>. Para uma pausa rápida, edite <code>~/.codex/config.toml</code> e marque{' '}
        <code>enabled = false</code>.
      </Callout>
    </>
  )
}

/* ───── App (Desktop) ───── */

const CUSTOMIZE_SHOTS = [
  {
    src: '/tutorial/claude-code/cc-customize-1-sidebar.png',
    alt: 'Barra lateral do Claude Code com opção Customize',
    width: 510,
    height: 466,
    caption: (
      <>
        Clique em <strong>Customize</strong> na barra lateral do Claude Code.
      </>
    ),
    spot: { x: '7%', y: '72%', w: '80%', h: '11%' },
  },
  {
    src: '/tutorial/claude-code/cc-customize-2-home.png',
    alt: 'Tela Personalizar o Claude',
    width: 2916,
    height: 1674,
    caption: (
      <>
        A tela <em>Personalizar o Claude</em> aparece. Clique no <strong>+</strong> ao lado de Plugins pessoais.
      </>
    ),
    spot: { x: '15%', y: '26%', w: '6%', h: '6%' },
  },
  {
    src: '/tutorial/claude-code/cc-customize-3-menu.png',
    alt: 'Menu com Navegar por plugins e Criar plugin',
    width: 518,
    height: 234,
    caption: (
      <>
        Clique em <strong>+ Criar plugin</strong>.
      </>
    ),
    spot: { x: '8%', y: '54%', w: '87%', h: '26%' },
  },
  {
    src: '/tutorial/claude-code/cc-customize-4-submenu.png',
    alt: 'Submenu com opção Adicionar marketplace',
    width: 984,
    height: 366,
    caption: (
      <>
        No submenu, selecione <strong>Adicionar marketplace</strong>.
      </>
    ),
    spot: { x: '51%', y: '31%', w: '46%', h: '24%' },
  },
  {
    src: '/tutorial/claude-code/cc-customize-5-dialog.png',
    alt: 'Dialog Adicionar marketplace com campo URL',
    width: 1450,
    height: 968,
    caption: (
      <>
        Cole a URL no campo e clique em <strong>Sincronizar</strong>.
      </>
    ),
    spot: { x: '4%', y: '56%', w: '92%', h: '27%' },
  },
]

function StepAppCustomize() {
  return (
    <>
      <StepHead
        title={
          <>
            Adicione pelo <span className="serif">Customize</span>
          </>
        }
      >
        No app do Claude, abra o menu <strong>Customize</strong> para registrar o marketplace pela interface gráfica.
      </StepHead>
      <ShotGrid>
        {CUSTOMIZE_SHOTS.map((s, i) => (
          <Shot key={s.src} {...s} n={String(i + 1).padStart(2, '0')} sizes="(max-width: 640px) 90vw, 360px" />
        ))}
      </ShotGrid>
      <p>Use esta URL no campo do passo 05:</p>
      <CodeBlock lang="url" code="https://github.com/MelloBirkan/EvenBetterFramework" />
    </>
  )
}

function StepAppDiretorio() {
  return (
    <>
      <StepHead
        title={
          <>
            Instale pelo <span className="serif">Diretório</span>
          </>
        }
      >
        Após sincronizar, o Diretório abre. Vá até a aba <strong>Código</strong>, localize o card{' '}
        <code>evenbetter-ios</code> e clique no <strong>+</strong> para instalar.
      </StepHead>
      <Shot
        src="/tutorial/claude-code/cc-diretorio-install.gif"
        alt="Instalando evenbetter-ios pelo Diretório do Claude Code"
        width={1200}
        height={720}
        unoptimized
        sizes="(max-width: 640px) 90vw, 720px"
      />
      <Callout kind="note" title="Feche e reabra o Claude Code">
        Depois de instalar, feche o Claude Code por completo e abra de novo. As skills só aparecem depois que o app
        reinicia.
      </Callout>
      <Callout kind="tip" title="Não achou na aba Código?">
        Use o campo <em>Pesquisar plugins</em> no topo do Diretório e digite <code>evenbetter</code>.
      </Callout>
    </>
  )
}

function StepAppChamar() {
  return (
    <>
      <StepHead
        title={
          <>
            Abra o projeto e <span className="serif">use</span>
          </>
        }
      >
        Com o Claude Code reaberto, abra o projeto iOS desejado. Digite <code>/</code> no chat e escolha a skill do
        EvenBetter.
      </StepHead>
      <Steps>
        <Step title={<>Digite / no chat</>}>As skills do EvenBetter aparecem no autocomplete.</Step>
        <Step title="Escolha a skill">O EvenBetter lê os arquivos do projeto sozinho.</Step>
      </Steps>
      <Shot
        src="/tutorial/claude-code/cc-diretorio-skills.png"
        alt="Skills evenbetter disponíveis no autocomplete do Claude Code"
        width={1802}
        height={502}
        sizes="(max-width: 640px) 90vw, 720px"
      />
      <Callout kind="tip" title="Qual skill escolher?">
        O{' '}
        <Link href="/tutorial/plugins/ios" className="link">
          guia do plugin iOS
        </Link>{' '}
        explica o que cada uma faz.
      </Callout>
      <Callout kind="note" title="Sem necessidade de copiar código">
        A skill lê os arquivos do projeto automaticamente. Basta selecionar e aguardar o relatório.
      </Callout>
    </>
  )
}

function StepAppAtualizar() {
  return (
    <>
      <StepHead
        title={
          <>
            Atualize e ligue o <span className="serif">auto-update</span>
          </>
        }
      >
        Skills novas e correções chegam ao EvenBetter de tempos em tempos. Atualize quando quiser, ou deixe o Claude Code
        atualizar sozinho ao abrir.
      </StepHead>

      <h3>Atualizar pelo Diretório</h3>
      <p>O Diretório (mesma tela usada para instalar) também mostra quando há uma versão nova do plugin.</p>
      <Steps>
        <Step title="Abra o Diretório">
          Em <strong>Customize → Plugins pessoais</strong>, abra o card do <code>evenbetter-ios</code>.
        </Step>
        <Step title="Procure o badge de update">
          Quando há versão nova, aparece um botão <strong>Atualizar</strong>. Clique e aguarde sincronizar.
        </Step>
        <Step title="Reabra o Claude Code">Feche e abra o app para que as skills atualizadas apareçam no chat.</Step>
      </Steps>

      <h3>Ou pelo terminal</h3>
      <p>
        Se você já estiver no terminal, três comandos resolvem sem abrir a interface gráfica. Eles funcionam exatamente
        igual à versão CLI.
      </p>
      <CodeBlock code={UPDATE_CODE} />

      <h3>Ligar auto-update</h3>
      <p>
        Marketplaces de terceiros (como o do EvenBetter) vêm com auto-update <strong>desligado</strong> por padrão. Ligue
        uma vez e o Claude Code passa a atualizar sozinho ao iniciar.
      </p>
      <Steps>
        <Step title="Abra o gerenciador de plugins">
          Digite <code>/plugin</code> em qualquer sessão e use <kbd>Tab</kbd> para chegar na aba{' '}
          <strong>Marketplaces</strong>.
        </Step>
        <Step title="Selecione evenbetter">
          Confirme com <kbd>Enter</kbd> e veja as opções do marketplace.
        </Step>
        <Step title="Enable auto-update">
          A partir daí, o Claude Code refaz a sincronização e atualiza as skills a cada início de sessão.
        </Step>
      </Steps>
      <Callout kind="note" title="Notificação ao atualizar">
        Quando algum plugin é atualizado em segundo plano, o Claude Code mostra um aviso pedindo para você rodar{' '}
        <code>/reload-plugins</code> e aplicar as novidades sem reiniciar.
      </Callout>
      <Callout kind="tip" title="Auto-update do CLI inteiro">
        Para desligar o auto-update geral (CLI e plugins), exporte <code>DISABLE_AUTOUPDATER=1</code>. Para travar só o
        CLI mas continuar atualizando plugins, combine com <code>FORCE_AUTOUPDATE_PLUGINS=1</code>.
      </Callout>
    </>
  )
}

function StepAppDesinstalar() {
  return (
    <>
      <StepHead
        title={
          <>
            Desinstale o <span className="serif">plugin</span>
          </>
        }
      >
        O Claude Code separa <strong>desabilitar</strong> (esconde as skills mas mantém o plugin instalado) de{' '}
        <strong>desinstalar</strong> (remove tudo). Faça pelo Diretório quando quiser interface gráfica, ou pelo terminal
        quando quiser ser direto.
      </StepHead>

      <h3>Pelo Diretório</h3>
      <Steps>
        <Step title="Abra Customize → Plugins pessoais">
          Mesma tela usada para instalar. O <code>evenbetter-ios</code> aparece com o status <em>Instalado</em>.
        </Step>
        <Step title="Abra o card do evenbetter-ios">
          Você vê os botões <strong>Desabilitar</strong> e <strong>Desinstalar</strong>.
        </Step>
        <Step title="Escolha a ação certa">
          <strong>Desabilitar</strong> esconde as skills sem apagar o plugin (volta com um clique).{' '}
          <strong>Desinstalar</strong> remove o plugin do disco.
        </Step>
        <Step title="Reabra o Claude Code">Feche e abra o app para que o autocomplete pare de mostrar as skills.</Step>
      </Steps>

      <h3>Ou pelo terminal</h3>
      <p>
        Os mesmos comandos da versão CLI funcionam aqui. Prefira essa via quando quiser scriptar ou quando o app estiver
        fechado.
      </p>
      <CodeBlock
        code={
          '# Pausar sem desinstalar\n/plugin disable evenbetter-ios@evenbetter\n\n' +
          '# Desinstalar de vez\n/plugin uninstall evenbetter-ios@evenbetter\n\n' +
          '# Aplicar na sessão atual\n/reload-plugins'
        }
      />

      <h3>Remover o marketplace</h3>
      <p>
        Se você nem pretende ver mais o EvenBetter na lista, remova o marketplace. Isso{' '}
        <strong>desinstala automaticamente todos os plugins</strong> instalados a partir dele.
      </p>
      <CodeBlock code="/plugin marketplace remove evenbetter" />
      <Callout kind="warn" title="Skills ainda aparecem no autocomplete?">
        Limpe o cache local com <code>rm -rf ~/.claude/plugins/cache</code> e reinicie o Claude Code. O autocomplete volta
        ao normal.
      </Callout>
      <Callout kind="note" title="Reinstalar é fácil">
        Mesmo depois de desinstalar, o catálogo do evenbetter continua disponível enquanto o marketplace estiver
        registrado. Para voltar atrás, basta rodar <code>/plugin install evenbetter-ios@evenbetter</code>.
      </Callout>
    </>
  )
}

const CONTENT: Record<StepId, () => React.JSX.Element> = {
  marketplace: StepCliMarketplace,
  instalar: StepCliInstalar,
  chamar: StepCliChamar,
  atualizar: StepCliAtualizar,
  desinstalar: StepCliDesinstalar,
  'app-customize': StepAppCustomize,
  'app-diretorio': StepAppDiretorio,
  'app-chamar': StepAppChamar,
  'app-atualizar': StepAppAtualizar,
  'app-desinstalar': StepAppDesinstalar,
}

export default function TutorialAnthropicPage() {
  const [step, go] = useGuideStep(IDS, 'marketplace')
  const mode: Mode = step.startsWith('app-') ? 'desktop' : 'cli'
  const steps: readonly GuideStep<StepId>[] = mode === 'cli' ? STEPS_CLI : STEPS_DESKTOP
  const Content = CONTENT[step]

  // Switching between the terminal and the app keeps your place in the list.
  function switchMode(next: Mode) {
    if (next === mode) return
    const index = Math.max(0, steps.findIndex((s) => s.id === step))
    const list = next === 'cli' ? STEPS_CLI : STEPS_DESKTOP
    go(list[index].id, { quiet: true })
  }

  return (
    <GuideShell
      eyebrow="Guia de instalação"
      title={
        <>
          O EvenBetter no <span className="serif">Claude Code</span>
        </>
      }
      lede="Adicione o marketplace, instale o plugin, chame as skills e mantenha tudo atualizado. Os passos mudam um pouco entre o terminal e o app, então escolha onde você usa o Claude Code."
      facts={['5 etapas', 'Terminal ou app']}
      toolbar={
        <HeroField label="Onde você usa">
          <Segmented<Mode>
            label="Onde você usa o Claude Code"
            size="lg"
            value={mode}
            onChange={switchMode}
            options={[
              { id: 'cli', label: 'Terminal', sub: 'CLI' },
              { id: 'desktop', label: 'App', sub: 'Desktop' },
            ]}
          />
        </HeroField>
      }
      steps={steps}
      ids={IDS}
      step={step}
      onStep={go}
      done={{
        title: 'Fim do guia',
        body: 'O plugin está instalado e você sabe atualizar, pausar e remover. O guia do plugin iOS mostra o que cada uma das 16 skills faz.',
      }}
    >
      <Content />
    </GuideShell>
  )
}
