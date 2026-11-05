import { ButtonLink } from './button'
import { Reveal } from './reveal'
import { SplitHeading } from './split-heading'

export const SLIDES_URL = 'https://evenbetter-slides.mellofattura.com/jiihc'
export const GITHUB_URL = 'https://github.com/MelloBirkan/EvenBetterFramework'

/** Closing band: the JIIHC 2026 paper, with links to the research page, slides and code. */
export function PaperCta() {
  return (
    <section aria-labelledby="artigo-title" className="wrap pt-24 md:pt-32">
      <div className="relative isolate overflow-hidden rounded-[36px] border border-line bg-card px-6 py-14 text-center sm:px-12 md:py-20">
        <div aria-hidden className="dot-paper pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
        <Reveal y={10} blur={false}>
          <p className="eyebrow justify-center">JIIHC 2026 · Talca, Chile</p>
        </Reveal>
        <SplitHeading id="artigo-title" className="h2 mx-auto mt-6 max-w-[22ch]">
          A pesquisa por trás das <span className="serif">skills</span>.
        </SplitHeading>
        <Reveal delay={0.15} y={14}>
          <p lang="en" className="mx-auto mt-7 max-w-[46rem] font-serif text-[1.35rem] leading-snug text-ink italic md:text-[1.6rem]">
            Curated Agent Skills for Context-Aware Intelligent Support in iOS UX and Accessibility
          </p>
          <p className="mx-auto mt-4 max-w-[46rem] text-[15.5px] text-ink-2">
            Marcello Gonzatto Birkan, Daniela Brazolin Flauto e Valéria Farinazzo Martins · Universidade Presbiteriana
            Mackenzie
          </p>
        </Reveal>
        <Reveal delay={0.25} y={12} blur={false}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/pesquisa" size="lg">
              Conhecer a pesquisa
            </ButtonLink>
            <ButtonLink href={SLIDES_URL} external icon="external" variant="secondary" size="lg">
              Slides da apresentação
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
