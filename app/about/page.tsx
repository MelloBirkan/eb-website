import type { Metadata } from 'next'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { SiteNav } from '../_components/site-nav'
import { SiteFooter } from '../_components/site-footer'
import { ButtonLink } from '../../components/site/button'
import { ArrowRight, ArrowUpRight, Book, GitHub, Quote, Slides } from '../../components/site/icons'
import { Reveal, RevealGroup, RevealItem } from '../../components/site/reveal'
import { SectionHeader } from '../../components/site/section-header'
import { SplitHeading } from '../../components/site/split-heading'
import { Story } from '../../components/site/about/story'
import { TeamCards } from '../../components/site/about/team-cards'
import { TeamFan } from '../../components/site/about/team-fan'
import { PAPER } from '../../components/site/research/paper'

const DESCRIPTION =
  'O EvenBetter nasceu como TCC na FCI/Mackenzie. Conheça quem fez, como o projeto saiu da linha de comando e virou skills, e onde ler o artigo da JIIHC 2026.'

export const metadata: Metadata = {
  title: 'Sobre',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: 'Sobre o EvenBetter', description: DESCRIPTION, url: '/about' },
  twitter: { card: 'summary_large_image', title: 'Sobre o EvenBetter', description: DESCRIPTION },
}

type IconType = ComponentType<{ size?: number; className?: string }>

const READ_MORE: { title: string; text: string; href: string; external?: boolean; icon: IconType }[] = [
  {
    title: 'A pesquisa, seção por seção',
    text: 'Contexto, arquitetura, método, resultados e limites do artigo.',
    href: '/pesquisa',
    icon: Book,
  },
  {
    title: 'As 25 referências',
    text: 'Do HIG e da WCAG 2.2 ao SkillsBench, com link para cada fonte.',
    href: '/pesquisa#referencias',
    icon: Quote,
  },
  {
    title: 'Slides da apresentação',
    text: 'O deck que vai para a JIIHC 2026, em inglês.',
    href: PAPER.slides,
    external: true,
    icon: Slides,
  },
  {
    title: 'Código, skills e corpus',
    text: 'Os plugins e as 49 cláusulas estão abertos no GitHub.',
    href: PAPER.code,
    external: true,
    icon: GitHub,
  },
]

export default function AboutPage() {
  return (
    <div className="site">
      <SiteNav />
      <main id="main">
        <header className="relative isolate overflow-hidden pt-14 pb-20 md:pt-20 md:pb-24">
          <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 -z-10" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-48 left-[-12%] -z-10 size-[620px] rounded-full bg-[radial-gradient(closest-side,var(--s-mint),transparent)] opacity-70 blur-2xl"
          />
          <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-10">
            <div>
              <Reveal y={10} blur={false}>
                <p className="flex flex-wrap items-center gap-2 font-mono text-[12px] font-semibold">
                  <span className="rounded-full bg-brand px-3 py-1 text-on-brand">TCC</span>
                  <span className="rounded-full border border-line-2 bg-card px-3 py-1 text-ink-2">FCI · Mackenzie</span>
                  <span className="rounded-full border border-line-2 bg-card px-3 py-1 text-ink-2">Artigo na JIIHC 2026</span>
                </p>
              </Reveal>
              <SplitHeading
                as="h1"
                immediate
                delay={0.1}
                className="mt-8 max-w-[14ch] text-[clamp(2.5rem,1.4rem+4vw,5rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance"
              >
                Um TCC que virou <span className="serif">ferramenta</span> e artigo.
              </SplitHeading>
              <Reveal delay={0.35} y={14}>
                <p className="lede mt-7 max-w-[38rem] text-ink">
                  O EvenBetter é o trabalho de conclusão de curso de Marcello Birkan e Daniela Flauto na Faculdade de
                  Computação e Informática do Mackenzie, com orientação da Prof.ª Dr.ª Valéria Farinazzo Martins. O código
                  é aberto, e o artigo foi aceito na JIIHC 2026.
                </p>
              </Reveal>
              <Reveal delay={0.5} y={12} blur={false}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink href="/pesquisa" size="lg">
                    Ler a pesquisa
                  </ButtonLink>
                  <ButtonLink href={PAPER.code} external icon="external" variant="secondary" size="lg">
                    Código no GitHub
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <TeamFan />
          </div>
        </header>

        <section id="historia" aria-labelledby="historia-title" className="wrap border-t border-line py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="self-start lg:sticky lg:top-28">
              <SectionHeader
                id="historia-title"
                eyebrow="História"
                title={
                  <>
                    Da linha de comando ao <span className="serif">plugin</span>.
                  </>
                }
                lede="Antes das skills, o EvenBetter teve outras duas formas. As duas pesavam na hora de adotar, e isso definiu a terceira."
              />
            </div>
            <Story />
          </div>
        </section>

        <section id="equipe" aria-labelledby="equipe-title" className="wrap border-t border-line py-20 md:py-28">
          <SectionHeader
            id="equipe-title"
            eyebrow="Equipe"
            title={
              <>
                Quem fez o <span className="serif">EvenBetter</span>.
              </>
            }
            lede="Três pessoas e um recorte: UX e acessibilidade no desenvolvimento iOS com agentes de IA."
          />
          <TeamCards />
        </section>

        <section id="referencias" aria-labelledby="referencias-title" className="wrap border-t border-line py-20 md:py-28">
          <SectionHeader
            id="referencias-title"
            eyebrow="Para ler mais"
            title={
              <>
                O artigo, as fontes e o <span className="serif">código</span>.
              </>
            }
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
            {READ_MORE.map((item) => {
              const Icon = item.icon
              const Arrow = item.external ? ArrowUpRight : ArrowRight
              const body = (
                <>
                  <span className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-mint text-brand-ink">
                      <Icon size={19} />
                    </span>
                    <Arrow
                      size={18}
                      className="text-ink-3 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                    />
                  </span>
                  <span className="mt-8 block text-[17px] leading-snug font-semibold text-ink">{item.title}</span>
                  <span className="mt-1.5 block text-[14.5px] leading-relaxed text-ink-2">{item.text}</span>
                </>
              )
              const cls =
                'group flex h-full flex-col rounded-[26px] border border-line bg-card p-6 transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_24px_50px_-36px_rgba(15,37,35,.5)]'
              return (
                <RevealItem key={item.title} className="h-full">
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {body}
                    </a>
                  ) : (
                    <Link href={item.href} className={cls}>
                      {body}
                    </Link>
                  )}
                </RevealItem>
              )
            })}
          </RevealGroup>
        </section>

        <section aria-labelledby="sobre-cta" className="wrap pt-4">
          <div className="on-night night-glow relative isolate overflow-hidden rounded-[36px] px-6 py-14 text-center sm:px-12 md:py-20">
            <SplitHeading id="sobre-cta" className="h2 mx-auto max-w-[20ch] text-on-night">
              Veja o fluxo no seu <span className="serif">projeto</span>.
            </SplitHeading>
            <Reveal delay={0.15} y={12}>
              <p className="lede mx-auto mt-5 max-w-[40rem]">Instale o plugin, planeje uma feature e rode a primeira auditoria.</p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/#comecar" variant="mint" size="lg">
                  Instalar o plugin
                </ButtonLink>
                <Link
                  href="/#como-funciona"
                  className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 px-6 font-medium text-on-night transition-colors hover:bg-white/8"
                >
                  Ver como funciona <ArrowRight size={16} />
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
