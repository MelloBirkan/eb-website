'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CodeBlock, Callout, Icon, SegmentedControl } from '../../_components/tutorial-primitives'
import { SiteNav } from '../../_components/site-nav'
import { SiteFooter } from '../../_components/site-footer'

type Mode = 'cli' | 'desktop'
type CliStepId = 'marketplace' | 'instalar' | 'chamar' | 'atualizar' | 'desinstalar'
type DesktopStepId = 'customize' | 'diretorio' | 'chamar' | 'atualizar' | 'desinstalar'

const STEPS_CLI: { id: CliStepId; title: string }[] = [
  { id: 'marketplace', title: 'Adicionar marketplace' },
  { id: 'instalar',    title: 'Instalar o plugin' },
  { id: 'chamar',      title: 'Recarregar e usar' },
  { id: 'atualizar',   title: 'Atualizar e auto-update' },
  { id: 'desinstalar', title: 'Desinstalar o plugin' },
]

const STEPS_DESKTOP: { id: DesktopStepId; title: string }[] = [
  { id: 'customize',   title: 'Adicionar pelo Customize' },
  { id: 'diretorio',   title: 'Instalar pelo Diretório' },
  { id: 'chamar',      title: 'Recarregar e usar' },
  { id: 'atualizar',   title: 'Atualizar e auto-update' },
  { id: 'desinstalar', title: 'Desinstalar o plugin' },
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
        É um repositório GitHub com um catálogo de plugins. Adicionar o marketplace não instala nada ainda,
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
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios:evenbetter-swiftui-ui-patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Callout kind="note" title="Sintaxe nome@marketplace">
        O sufixo <code>@evenbetter</code> identifica o marketplace de origem. Sem ele, o Claude Code não sabe
        de onde puxar o plugin.
      </Callout>

      <h2 style={{ marginTop: '2rem' }}>Bônus: plugin <code>evenbetter-general</code></h2>
      <p>
        O mesmo marketplace também publica o <code>evenbetter-general</code>, com 2 skills agnósticas de
        plataforma para planejamento de feature e épico (<code>evenbetter-general-feature</code> e{' '}
        <code>evenbetter-general-epic</code>). Útil para projetos não-iOS, ou para combinar com o plugin iOS.
      </p>
      <CodeBlock lang="bash" code="/plugin install evenbetter-general@evenbetter" />
      <Callout kind="tip" title="Pode instalar os dois">
        Os dois plugins convivem sem conflito. As skills aparecem com namespaces diferentes:{' '}
        <code>/evenbetter-ios:…</code> e <code>/evenbetter-general:…</code>.
      </Callout>
    </>
  )
}

/* ─── Desktop mode ─── */

function StepDesktopCustomize() {
  const steps: {
    img: string
    alt: string
    w: number
    h: number
    caption: React.ReactNode
    hl: { x: string; y: string; w: string; h: string }
  }[] = [
    {
      img: '/tutorial/claude-code/cc-customize-1-sidebar.png',
      alt: 'Barra lateral do Claude Code com opção Customize',
      w: 510, h: 466,
      caption: <>Clique em <strong>Customize</strong> na barra lateral do Claude Code</>,
      hl: { x: '7%', y: '72%', w: '80%', h: '11%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-2-home.png',
      alt: 'Tela Personalizar o Claude',
      w: 2916, h: 1674,
      caption: <>A tela <em>Personalizar o Claude</em> aparece, clique no <strong>+</strong> ao lado de Plugins pessoais</>,
      hl: { x: '15%', y: '26%', w: '6%', h: '6%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-3-menu.png',
      alt: 'Menu com Navegar por plugins e Criar plugin',
      w: 518, h: 234,
      caption: <>Clique em <strong>+ Criar plugin</strong></>,
      hl: { x: '8%', y: '54%', w: '87%', h: '26%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-4-submenu.png',
      alt: 'Submenu com opção Adicionar marketplace',
      w: 984, h: 366,
      caption: <>No submenu, selecione <strong>Adicionar marketplace</strong></>,
      hl: { x: '51%', y: '31%', w: '46%', h: '24%' },
    },
    {
      img: '/tutorial/claude-code/cc-customize-5-dialog.png',
      alt: 'Dialog Adicionar marketplace com campo URL',
      w: 1450, h: 968,
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
              <Image
                src={s.img}
                alt={s.alt}
                width={s.w}
                height={s.h}
                sizes="(max-width: 940px) 90vw, 300px"
                style={{ width: '100%', height: 'auto' }}
              />
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
          <Image
            src="/tutorial/claude-code/cc-diretorio-install.gif"
            alt="Instalando evenbetter-ios pelo Diretório do Claude Code"
            width={1200}
            height={720}
            unoptimized
            sizes="(max-width: 940px) 90vw, 480px"
            style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
          />
        </div>
      </div>
      <Callout kind="note" title="Feche e reabra o Claude Code">
        Após instalar, feche o Claude Code completamente e abra novamente, as skills só aparecem depois de reiniciar o app.
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
          <span>Digite <strong>/</strong> no chat, as skills EvenBetter aparecem no autocomplete</span>
        </div>
        <div className="eb-step-img-wrap">
          <Image
            src="/tutorial/claude-code/cc-diretorio-skills.png"
            alt="Skills evenbetter disponíveis no autocomplete do Claude Code"
            width={1802}
            height={502}
            sizes="(max-width: 940px) 90vw, 480px"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
      <div className="eb-step-img-item">
        <div className="eb-step-img-caption">
          <span className="eb-step-img-num">02</span>
          <span>Selecione a skill desejada, o EvenBetter lê os arquivos do projeto automaticamente</span>
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
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios carregado com 15 skills</div>
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

/* ─── Update steps (CLI & Desktop) ─── */

function StepCliAtualizar() {
  return (
    <>
      <Crumbs last="ATUALIZAR" />
      <h1>Atualize e ligue <span className="eb-accent">auto-update</span></h1>
      <p className="eb-lede">
        Quando o EvenBetter ganha skills novas ou correções, você pode buscar a versão mais recente sem
        reinstalar. Faça manualmente quando quiser, ou deixe o Claude Code atualizar sozinho ao iniciar.
      </p>

      <h2>Atualizar manualmente</h2>
      <p>
        Três passos: <code>/plugin marketplace update</code> baixa o catálogo mais novo,{' '}
        <code>/plugin update</code> aplica a nova versão de cada plugin instalado e{' '}
        <code>/reload-plugins</code> recarrega na sessão atual.
      </p>
      <CodeBlock
        lang="bash"
        code={
          '# 1. Atualizar o catálogo do marketplace\n/plugin marketplace update evenbetter\n\n' +
          '# 2. Atualizar os plugins instalados\n/plugin update evenbetter-ios@evenbetter\n/plugin update evenbetter-general@evenbetter\n\n' +
          '# 3. Recarregar na sessão atual\n/reload-plugins'
        }
      />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin marketplace update evenbetter</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Marketplace atualizado</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> Catálogo sincronizado: evenbetter</div>
                <div><span className="eb-chat-ok">✓</span> Novas versões disponíveis para 2 plugins</div>
              </div>
            </div>
          </div>
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin update evenbetter-ios@evenbetter</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin atualizado</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios atualizado para a versão mais recente</div>
              </div>
            </div>
          </div>
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/reload-plugins</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugins recarregados</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios carregado com as skills atualizadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Callout kind="tip" title="Atalho">
        <code>/plugin market update evenbetter</code> também funciona. Se omitir o nome,{' '}
        <code>/plugin marketplace update</code> atualiza todos os marketplaces de uma vez.
        E o <code>/plugin update</code> só é necessário para plugins que você realmente instalou,
        rode apenas para os que aparecem no <code>/plugin list</code>.
      </Callout>

      <h2>Ligar auto-update</h2>
      <p>
        Marketplaces de terceiros (como o do EvenBetter) vêm com auto-update <strong>desligado</strong> por padrão.
        Ligue manualmente para que o Claude Code busque novas versões ao iniciar.
      </p>
      <div className="eb-steps-frame" style={{ marginTop: '1rem' }}>
        <div className="eb-step">
          <div className="eb-step-num">01</div>
          <div className="eb-step-body">
            <h4>Abra o gerenciador</h4>
            <p>Digite <code>/plugin</code> em qualquer sessão do Claude Code.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">02</div>
          <div className="eb-step-body">
            <h4>Vá para a aba Marketplaces</h4>
            <p>Use <kbd>Tab</kbd> para alternar entre as abas e selecione <strong>evenbetter</strong> na lista.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">03</div>
          <div className="eb-step-body">
            <h4>Selecione Enable auto-update</h4>
            <p>A partir daí, o Claude Code atualiza o marketplace e reaplica as novas versões a cada início de sessão.</p>
          </div>
        </div>
      </div>

      <Callout kind="note" title="Notificação ao atualizar">
        Quando algum plugin é atualizado em segundo plano, o Claude Code mostra um aviso pedindo para você
        rodar <code>/reload-plugins</code> e aplicar as mudanças sem reiniciar.
      </Callout>

      <h2>Variáveis de ambiente</h2>
      <p>
        Se você prefere controlar tudo pelo shell, duas variáveis cobrem a maioria dos casos:
      </p>
      <CodeBlock
        lang="bash"
        code={'# Desliga auto-update do CLI E dos plugins\nexport DISABLE_AUTOUPDATER=1\n\n# Mantém só os plugins se atualizando, mesmo com o CLI travado\nexport DISABLE_AUTOUPDATER=1\nexport FORCE_AUTOUPDATE_PLUGINS=1'}
      />

      <Callout kind="warn" title="Não funciona no Codex">
        O auto-update por marketplace é específico do Claude Code. No Codex, atualize manualmente com{' '}
        <code>codex plugin marketplace upgrade evenbetter</code> sempre que quiser puxar novidades.
      </Callout>
    </>
  )
}

function StepDesktopAtualizar() {
  return (
    <>
      <Crumbs last="ATUALIZAR" />
      <h1>Atualize e ligue <span className="eb-accent">auto-update</span></h1>
      <p className="eb-lede">
        Skills novas e correções chegam ao EvenBetter de tempos em tempos. Atualize quando quiser, ou
        deixe o Claude Code atualizar sozinho ao abrir.
      </p>

      <h2>Atualizar pelo Diretório</h2>
      <p>
        O Diretório (mesma tela usada para instalar) também mostra quando há uma versão nova do plugin.
      </p>
      <div className="eb-steps-frame" style={{ marginTop: '1rem' }}>
        <div className="eb-step">
          <div className="eb-step-num">01</div>
          <div className="eb-step-body">
            <h4>Abra o Diretório</h4>
            <p>Em <strong>Customize → Plugins pessoais</strong>, abra o card do <code>evenbetter-ios</code>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">02</div>
          <div className="eb-step-body">
            <h4>Procure o badge de update</h4>
            <p>Quando há versão nova, aparece um botão <strong>Atualizar</strong>. Clique e aguarde sincronizar.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">03</div>
          <div className="eb-step-body">
            <h4>Reabra o Claude Code</h4>
            <p>Feche e abra o app para que as skills atualizadas apareçam no chat.</p>
          </div>
        </div>
      </div>

      <h2>Ou pelo terminal</h2>
      <p>
        Se você já estiver no terminal, três comandos resolvem sem abrir a interface gráfica.
        Eles funcionam exatamente igual à versão CLI.
      </p>
      <CodeBlock
        lang="bash"
        code={
          '# 1. Atualizar o catálogo do marketplace\n/plugin marketplace update evenbetter\n\n' +
          '# 2. Atualizar os plugins instalados\n/plugin update evenbetter-ios@evenbetter\n/plugin update evenbetter-general@evenbetter\n\n' +
          '# 3. Recarregar na sessão atual\n/reload-plugins'
        }
      />

      <h2>Ligar auto-update</h2>
      <p>
        Marketplaces de terceiros (como o do EvenBetter) vêm com auto-update <strong>desligado</strong> por padrão.
        Ligue uma vez e o Claude Code passa a atualizar sozinho ao iniciar.
      </p>
      <div className="eb-steps-frame" style={{ marginTop: '1rem' }}>
        <div className="eb-step">
          <div className="eb-step-num">01</div>
          <div className="eb-step-body">
            <h4>Abra o gerenciador de plugins</h4>
            <p>Digite <code>/plugin</code> em qualquer sessão e use <kbd>Tab</kbd> para chegar na aba <strong>Marketplaces</strong>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">02</div>
          <div className="eb-step-body">
            <h4>Selecione evenbetter</h4>
            <p>Confirme com <kbd>Enter</kbd> e veja as opções do marketplace.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">03</div>
          <div className="eb-step-body">
            <h4>Enable auto-update</h4>
            <p>A partir daí, o Claude Code refaz a sincronização e atualiza as skills a cada início de sessão.</p>
          </div>
        </div>
      </div>

      <Callout kind="note" title="Notificação ao atualizar">
        Quando algum plugin é atualizado em segundo plano, o Claude Code mostra um aviso pedindo para você
        rodar <code>/reload-plugins</code> e aplicar as novidades sem reiniciar.
      </Callout>

      <Callout kind="tip" title="Auto-update do CLI inteiro">
        Para desligar o auto-update geral (CLI e plugins), exporte <code>DISABLE_AUTOUPDATER=1</code>.
        Para travar só o CLI mas continuar atualizando plugins, combine com <code>FORCE_AUTOUPDATE_PLUGINS=1</code>.
      </Callout>
    </>
  )
}

/* ─── Uninstall steps (CLI & Desktop) ─── */

function StepCliDesinstalar() {
  return (
    <>
      <Crumbs last="DESINSTALAR" />
      <h1>Desinstale o <span className="eb-accent">plugin</span></h1>
      <p className="eb-lede">
        Quer pausar as skills sem perder a configuração, ou remover de vez? O Claude Code separa as duas
        coisas: <strong>desabilitar</strong> esconde as skills mas mantém o plugin no disco;{' '}
        <strong>desinstalar</strong> apaga tudo.
      </p>

      <h2>Pausar sem desinstalar</h2>
      <p>
        Útil quando você quer testar como o agente se comporta sem as skills, ou liberar espaço de contexto
        em uma sessão específica. Reativar é instantâneo.
      </p>
      <CodeBlock
        lang="bash"
        code={'# Desabilitar (mantém instalado)\n/plugin disable evenbetter-ios@evenbetter\n\n# Reabilitar quando quiser\n/plugin enable evenbetter-ios@evenbetter\n\n# Aplicar a mudança na sessão atual\n/reload-plugins'}
      />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin disable evenbetter-ios@evenbetter</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin desabilitado</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios marcado como inativo</div>
                <div><span className="eb-chat-ok">✓</span> Rode <code>/reload-plugins</code> para aplicar agora</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Desinstalar de vez</h2>
      <p>
        Remove o plugin da configuração e do cache. Você ainda mantém o marketplace registrado,
        então dá pra reinstalar com um único comando se mudar de ideia.
      </p>
      <CodeBlock
        lang="bash"
        code={'# Desinstalar o plugin\n/plugin uninstall evenbetter-ios@evenbetter\n\n# Aplicar na sessão atual\n/reload-plugins'}
      />
      <div className="eb-chat-mock">
        <div className="eb-chat-bar">
          <span className="eb-chat-tag">CLAUDE CODE</span>
        </div>
        <div className="eb-chat-body">
          <div className="eb-chat-user">
            <span className="eb-chat-prompt">›</span>
            <span className="eb-chat-cmd">/plugin uninstall evenbetter-ios@evenbetter</span>
          </div>
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div>
              <div className="eb-chat-title">Plugin removido</div>
              <div className="eb-chat-lines">
                <div><span className="eb-chat-ok">✓</span> evenbetter-ios desinstalado</div>
                <div><span className="eb-chat-ok">✓</span> Marketplace evenbetter continua registrado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Callout kind="tip" title="Escopo certo">
        Se você instalou em múltiplos escopos (user, project, local), use <code>--scope</code> para
        mirar o certo: <code>claude plugin uninstall evenbetter-ios@evenbetter --scope project</code>.
      </Callout>

      <h2>Remover o marketplace inteiro</h2>
      <p>
        Quando você não pretende voltar, dá para apagar também o registro do marketplace. Isso{' '}
        <strong>desinstala automaticamente todos os plugins</strong> instalados a partir dele.
      </p>
      <CodeBlock
        lang="bash"
        code={'# Remove o marketplace E todos os plugins instalados a partir dele\n/plugin marketplace remove evenbetter'}
      />

      <Callout kind="warn" title="Skills ainda aparecem no autocomplete?">
        Em casos raros o cache local fica desatualizado. Limpe com{' '}
        <code>rm -rf ~/.claude/plugins/cache</code>, reinicie o Claude Code e o autocomplete volta ao normal.
      </Callout>

      <Callout kind="note" title="Equivalente no Codex">
        No Codex, abra <code>codex</code>, rode <code>/plugins</code>, escolha o evenbetter-ios e selecione{' '}
        <strong>Uninstall plugin</strong>. Para uma pausa rápida, edite{' '}
        <code>~/.codex/config.toml</code> e marque <code>enabled = false</code>.
      </Callout>
    </>
  )
}

function StepDesktopDesinstalar() {
  return (
    <>
      <Crumbs last="DESINSTALAR" />
      <h1>Desinstale o <span className="eb-accent">plugin</span></h1>
      <p className="eb-lede">
        O Claude Code separa <strong>desabilitar</strong> (esconde as skills mas mantém o plugin instalado)
        de <strong>desinstalar</strong> (remove tudo). Faça pelo Diretório quando quiser interface gráfica,
        ou pelo terminal quando quiser ser direto.
      </p>

      <h2>Pelo Diretório</h2>
      <div className="eb-steps-frame" style={{ marginTop: '1rem' }}>
        <div className="eb-step">
          <div className="eb-step-num">01</div>
          <div className="eb-step-body">
            <h4>Abra Customize → Plugins pessoais</h4>
            <p>Mesma tela usada para instalar. O <code>evenbetter-ios</code> aparece com o status <em>Instalado</em>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">02</div>
          <div className="eb-step-body">
            <h4>Abra o card do evenbetter-ios</h4>
            <p>Você vê os botões <strong>Desabilitar</strong> e <strong>Desinstalar</strong>.</p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">03</div>
          <div className="eb-step-body">
            <h4>Escolha a ação certa</h4>
            <p>
              <strong>Desabilitar</strong> esconde as skills sem apagar o plugin (volta com um clique).{' '}
              <strong>Desinstalar</strong> remove o plugin do disco.
            </p>
          </div>
        </div>
        <div className="eb-step">
          <div className="eb-step-num">04</div>
          <div className="eb-step-body">
            <h4>Reabra o Claude Code</h4>
            <p>Feche e abra o app para que o autocomplete pare de mostrar as skills.</p>
          </div>
        </div>
      </div>

      <h2>Ou pelo terminal</h2>
      <p>
        Os mesmos comandos da versão CLI funcionam aqui. Prefira essa via quando quiser scriptar
        ou quando o app estiver fechado.
      </p>
      <CodeBlock
        lang="bash"
        code={
          '# Pausar sem desinstalar\n/plugin disable evenbetter-ios@evenbetter\n\n' +
          '# Desinstalar de vez\n/plugin uninstall evenbetter-ios@evenbetter\n\n' +
          '# Aplicar na sessão atual\n/reload-plugins'
        }
      />

      <h2>Remover o marketplace</h2>
      <p>
        Se você nem pretende ver mais o EvenBetter na lista, remova o marketplace. Isso{' '}
        <strong>desinstala automaticamente todos os plugins</strong> instalados a partir dele.
      </p>
      <CodeBlock lang="bash" code="/plugin marketplace remove evenbetter" />

      <Callout kind="warn" title="Skills ainda aparecem no autocomplete?">
        Limpe o cache local com <code>rm -rf ~/.claude/plugins/cache</code> e reinicie o Claude Code.
        O autocomplete volta ao normal.
      </Callout>

      <Callout kind="note" title="Reinstalar é fácil">
        Mesmo depois de desinstalar, o catálogo do evenbetter continua disponível enquanto o marketplace
        estiver registrado. Para voltar atrás, basta rodar <code>/plugin install evenbetter-ios@evenbetter</code>.
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
      if (cliStep === 'atualizar')   return <StepCliAtualizar />
      if (cliStep === 'desinstalar') return <StepCliDesinstalar />
    } else {
      if (desktopStep === 'customize')   return <StepDesktopCustomize />
      if (desktopStep === 'diretorio')   return <StepDesktopDiretorio />
      if (desktopStep === 'chamar')      return <StepDesktopChamar />
      if (desktopStep === 'atualizar')   return <StepDesktopAtualizar />
      if (desktopStep === 'desinstalar') return <StepDesktopDesinstalar />
    }
    return null
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
      <SiteFooter />
    </div>
  )
}
