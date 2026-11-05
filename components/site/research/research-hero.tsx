import { ButtonLink } from '../button'
import { Count } from '../count'
import { Orcid } from '../icons'
import { HeroHeading, HeroRise } from '../hero-heading'
import { RevealGroup, RevealItem } from '../reveal'
import { AUTHORS, INSTITUTIONS, PAPER } from './paper'

const NUMBERS = [
  { value: 17, label: 'skills instaláveis', note: 'na versão do artigo' },
  { value: 49, label: 'cláusulas para iOS' },
  { value: 7, label: 'domínios de diretrizes' },
  { value: 10, label: 'devs iOS no estudo' },
  { value: 79.5, decimals: 1, label: 'de SUS médio', note: 'escala de 0 a 100' },
  { value: 55, label: 'achados que todos leram no relatório' },
]

/** Title block of the research page: venue, paper title, authors and the numbers that matter. */
export function ResearchHero() {
  return (
    <header id="pesquisa-topo" className="relative isolate overflow-hidden pt-14 pb-16 md:pt-20 md:pb-20">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[620px] rounded-full bg-[radial-gradient(closest-side,var(--s-mint),transparent)] opacity-70 blur-2xl"
      />
      <div className="wrap">
        <HeroRise y={10}>
          <p className="flex flex-wrap items-center gap-2 font-mono text-[12px] font-semibold">
            <span className="rounded-full bg-brand px-3 py-1 text-on-brand">Artigo aceito</span>
            <span className="rounded-full border border-line-2 bg-card px-3 py-1 text-ink-2">{PAPER.venue}</span>
            <span className="rounded-full border border-line-2 bg-card px-3 py-1 text-ink-2">
              {PAPER.place} · 10 nov. 2026
            </span>
          </p>
        </HeroRise>

        <div lang="en">
          <HeroHeading className="mt-8 max-w-[24ch] text-[clamp(2.25rem,1.15rem+3.6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
            <span className="serif">Curated Agent Skills</span> for Context-Aware Intelligent Support in iOS UX and
            Accessibility
          </HeroHeading>
        </div>

        <HeroRise delay={350} y={14} blur>
          <p className="mt-6 max-w-[46rem] text-[1.1rem] leading-snug text-ink-2 md:text-[1.2rem]">{PAPER.titlePt}.</p>
        </HeroRise>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <HeroRise delay={450} y={14} blur>
            <p className="lede max-w-[40rem] text-ink">
              O EvenBetter transforma o HIG, a documentação de acessibilidade da Apple e a WCAG 2.2 em skills que o
              agente de IA segue passo a passo. Num estudo com dez devs iOS, a usabilidade percebida ficou em 79,5.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[15.5px] text-ink">
              {AUTHORS.map((a) => (
                <li key={a.orcid} className="inline-flex items-center gap-1.5">
                  <span className="font-medium">{a.name}</span>
                  <sup className="font-mono text-[11px] text-ink-3">{a.inst}</sup>
                  <a
                    href={`https://orcid.org/${a.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit relative grid size-7 place-items-center rounded-full transition-colors hover:bg-paper-2"
                    aria-label={`ORCID de ${a.name}`}
                  >
                    <Orcid size={15} />
                  </a>
                </li>
              ))}
            </ul>
            <ol className="mt-3 space-y-1 text-[13.5px] leading-snug text-ink-3">
              {INSTITUTIONS.map((inst, i) => (
                <li key={inst}>
                  <sup className="mr-1 font-mono">{i + 1}</sup>
                  {inst}
                </li>
              ))}
            </ol>
          </HeroRise>

          <HeroRise delay={550} y={12}>
            <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
              <ButtonLink href="#citar" size="lg">
                Como citar
              </ButtonLink>
              <ButtonLink href={PAPER.slides} external icon="external" variant="secondary" size="lg">
                Slides da apresentação
              </ButtonLink>
              <ButtonLink href={PAPER.code} external icon="external" variant="secondary" size="lg">
                Código no GitHub
              </ButtonLink>
            </div>
          </HeroRise>
        </div>

        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-6"
          stagger={0.06}
          delay={0.2}
        >
          {NUMBERS.map((n, i) => (
            <div key={n.label} className="bg-card p-5 md:p-6">
              <RevealItem y={14}>
                <Count
                  value={n.value}
                  decimals={n.decimals ?? 0}
                  delay={0.2 + i * 0.08}
                  className="text-[2.1rem] leading-none font-semibold tracking-[-0.04em] text-ink md:text-[2.4rem]"
                />
                <p className="mt-2 text-[14px] leading-snug text-ink-2">{n.label}</p>
                {n.note && <p className="mt-1 font-mono text-[11px] text-ink-3">{n.note}</p>}
              </RevealItem>
            </div>
          ))}
        </RevealGroup>
      </div>
    </header>
  )
}
