'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, type CSSProperties } from 'react'
import { useClipTab } from '../use-clip-tab'

export const GUIDES = [
  { href: '/tutorial/plugins/ios', label: 'Plugin iOS', sub: 'usar as skills' },
  { href: '/tutorial/anthropic', label: 'Claude Code', sub: 'instalar' },
  { href: '/tutorial/codex', label: 'Codex', sub: 'instalar' },
] as const

const COLORS = { '--clip-bg': 'var(--s-pick)', '--clip-fg': 'var(--s-on-pick)' } as CSSProperties

const item =
  'flex min-h-12 flex-col items-center justify-center rounded-full px-2 py-1.5 text-center leading-tight min-[390px]:px-3 sm:px-5'

/**
 * Switches between the three guides. It lives in the guides' layout, so it
 * stays mounted and the pill slides to the next guide (see useClipTab).
 */
export function GuideTabs() {
  const pathname = usePathname() ?? ''
  const active = GUIDES.findIndex((g) => pathname.startsWith(g.href))
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  useClipTab(wrapRef, listRef, topRef, active, 'a')

  return (
    <nav aria-label="Guias" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <p className="eyebrow">Guias</p>
      <div
        ref={wrapRef}
        style={COLORS}
        className="clip-row relative w-full rounded-full border border-line bg-card p-1 shadow-[0_1px_2px_rgba(15,37,35,.04)] sm:w-fit"
      >
        <ul ref={listRef} role="list" className="relative flex gap-1">
          {GUIDES.map((g, i) => (
            <li key={g.href} className="flex-1 sm:flex-none">
              <Link
                href={g.href}
                data-active={i === active}
                aria-current={i === active ? 'page' : undefined}
                className={`${item} text-ink-2 transition-colors duration-200 hover:text-ink`}
              >
                <span className="text-[14px] font-medium whitespace-nowrap">{g.label}</span>
                <span className="mt-0.5 font-mono text-[11px] whitespace-nowrap text-ink-3 max-[359px]:hidden">{g.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div ref={topRef} aria-hidden className="clip-on pointer-events-none absolute inset-1 flex gap-1">
          {GUIDES.map((g) => (
            <span key={g.href} className="flex flex-1 sm:flex-none">
              <span className={`${item} w-full text-on-pick`}>
                <span className="text-[14px] font-medium whitespace-nowrap">{g.label}</span>
                <span className="mt-0.5 font-mono text-[11px] whitespace-nowrap text-on-pick-2 max-[359px]:hidden">{g.sub}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </nav>
  )
}
