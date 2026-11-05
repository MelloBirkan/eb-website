import Link from 'next/link'
import { AgentDemo } from './agent-demo'
import { ButtonLink } from './button'
import { ArrowRight } from './icons'
import { Reveal } from './reveal'
import { SplitHeading } from './split-heading'
import { TiltOnScroll } from './tilt-on-scroll'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate pt-14 md:pt-20">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[820px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[420px] left-1/2 -z-10 h-[520px] w-[1100px] max-w-[140vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,var(--s-mint),transparent)] opacity-80 blur-2xl"
      />

      <div className="wrap text-center">
        <Reveal y={12} blur={false}>
          <Link
            href="/pesquisa"
            className="group inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-card/80 py-1.5 pr-3 pl-1.5 text-[14px] text-ink-2 shadow-[0_6px_20px_-12px_rgba(15,37,35,.35)] backdrop-blur transition-colors hover:border-ink/30 hover:text-ink"
          >
            <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[11.5px] font-semibold tracking-[0.08em] text-paper uppercase">
              Novo
            </span>
            Artigo aceito na JIIHC 2026, em Talca, Chile
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <SplitHeading as="h1" id="hero-title" immediate delay={0.1} className="display mx-auto mt-8 max-w-[15ch] md:max-w-[19ch]">
          Skills <span className="serif">curadas</span> para acessibilidade em iOS.
        </SplitHeading>

        <Reveal delay={0.35} y={16}>
          <p className="lede mx-auto mt-7 max-w-[40rem]">
            O EvenBetter ensina o seu agente de IA a planejar, auditar e corrigir apps SwiftUI com o HIG da
            Apple e a WCAG 2.2. Você continua no comando de cada decisão.
          </p>
        </Reveal>

        <Reveal delay={0.5} y={12} blur={false}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#comecar" size="lg">
              Instalar no Claude Code ou Codex
            </ButtonLink>
            <ButtonLink href="/pesquisa" variant="secondary" size="lg">
              Ler a pesquisa
            </ButtonLink>
          </div>
          <p className="mt-6 font-mono text-[13px] text-ink-3">
            Código aberto · 16 skills no plugin iOS · 49 cláusulas com fonte
          </p>
        </Reveal>
      </div>

      <div className="wrap mt-14 md:mt-20">
        <TiltOnScroll className="mx-auto max-w-[1060px]">
          <AgentDemo />
        </TiltOnScroll>
        <p className="mt-4 text-center text-[13.5px] text-ink-3">
          Recriação do relatório real do estudo: app Aroma Care, 55 achados.
        </p>
      </div>
    </section>
  )
}
