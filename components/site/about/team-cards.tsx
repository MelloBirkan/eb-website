import Image from 'next/image'
import { Mail, Orcid } from '../icons'
import { RevealGroup, RevealItem } from '../reveal'
import { TEAM } from './team-data'

/** One card per person: photo, role, a short bio, e-mail and ORCID. */
export function TeamCards() {
  return (
    <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
      {TEAM.map((m) => (
        <RevealItem key={m.name} className="h-full">
          <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-card shadow-[0_24px_60px_-48px_rgba(15,37,35,.5)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-[0_34px_70px_-44px_rgba(15,37,35,.55)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 md:aspect-[4/5]">
              <Image
                src={m.photo}
                alt={`Foto de ${m.name}`}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                style={{ objectPosition: m.focus }}
              />
              <span className="absolute top-4 left-4 rounded-full bg-card/90 px-3 py-1 font-mono text-[11.5px] font-semibold text-ink backdrop-blur">
                {m.role}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-[19px] leading-snug font-semibold tracking-[-0.015em] text-ink">{m.name}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-2">{m.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${m.email}`}
                  aria-label={`E-mail de ${m.name}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-[14px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-paper-2"
                >
                  <Mail size={15} />
                  E-mail
                </a>
                <a
                  href={`https://orcid.org/${m.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ORCID de ${m.name}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-[14px] font-medium text-ink transition-colors hover:border-ink/40 hover:bg-paper-2"
                >
                  <Orcid size={15} />
                  ORCID
                </a>
              </div>
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
