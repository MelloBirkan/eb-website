import Link from 'next/link'
import { BrandMark, GitHub } from '../../components/site/icons'
import { FooterWordmark } from '../../components/site/footer-wordmark'
import { PAPER } from '../../components/site/research/paper'

const GITHUB = PAPER.code

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Instalar o plugin', href: '/#comecar' },
      { label: 'Guia do Claude Code', href: '/tutorial/anthropic' },
      { label: 'Guia do Codex', href: '/tutorial/codex' },
      { label: 'Guia do plugin iOS', href: '/tutorial/plugins/ios' },
    ],
  },
  {
    title: 'Pesquisa',
    links: [
      { label: 'O artigo', href: '/pesquisa' },
      { label: 'Resultados do estudo', href: '/pesquisa#resultados' },
      { label: 'Corpus de cláusulas', href: '/#corpus' },
      { label: 'Como citar', href: '/pesquisa#citar' },
    ],
  },
  {
    title: 'Projeto',
    links: [
      { label: 'Sobre e equipe', href: '/about' },
      { label: 'História do projeto', href: '/about#historia' },
      { label: 'Referências', href: '/pesquisa#referencias' },
      { label: 'Código no GitHub', href: GITHUB, external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative z-[1] mt-24 overflow-hidden border-t border-line bg-paper-2 text-ink">
      <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-6 pt-16 pb-10 md:grid-cols-[1.3fr_2fr] lg:px-10">
        <div className="max-w-sm">
          <Link href="/" className="hit relative inline-flex items-center gap-3 font-semibold tracking-[-0.02em]">
            <BrandMark size={34} className="grid place-items-center rounded-[10px] bg-ink text-glow" />
            <span className="text-lg">
              Even<span className="font-serif text-[1.2em] font-normal italic">Better</span>
            </span>
          </Link>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
            Skills curadas para UX e acessibilidade em iOS. Nasceu como TCC na FCI/Mackenzie e virou artigo
            na JIIHC 2026.
          </p>
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-sm font-medium transition-colors hover:border-ink/40 hover:bg-card"
          >
            <GitHub size={16} /> MelloBirkan/EvenBetterFramework
          </a>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">{col.title}</h2>
              <ul role="list" className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hit relative text-[15px] text-ink-2 transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hit relative text-[15px] text-ink-2 transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <FooterWordmark />

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 border-t border-line px-6 py-6 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>Faculdade de Computação e Informática · Universidade Presbiteriana Mackenzie · 2026</p>
        <p>
          Composto em Geist e <span className="font-serif text-[1.15em] italic">Instrument Serif</span>.
        </p>
      </div>
    </footer>
  )
}
