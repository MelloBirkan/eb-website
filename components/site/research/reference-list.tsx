'use client'

import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { REFERENCES } from './paper'

/** References shown on phones before the visitor asks for the rest. */
const PREVIEW = 6

const isRef = (hash: string | null) => !!hash && /^#ref-\d+$/.test(hash)

/**
 * The paper's reference list. On phones it starts with the first six so the
 * page does not end in four screens of citations. A citation marker, or an
 * address that ends in #ref-N, opens the whole list before the browser looks
 * for the reference.
 */
export function ReferenceList() {
  const [all, setAll] = useState(false)

  useEffect(() => {
    if (all) return

    function open(hash: string, scroll: boolean) {
      const target = document.getElementById(hash.slice(1))
      const wasHidden = !!target && target.getClientRects().length === 0
      flushSync(() => setAll(true))
      if (scroll && wasHidden) target?.scrollIntoView({ block: 'center' })
    }
    // Capture runs before the link's default jump, so the reference is visible by then.
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href^="#ref-"]')
      const hash = link?.getAttribute('href') ?? null
      if (isRef(hash)) open(hash!, false)
    }
    function onHash() {
      if (isRef(window.location.hash)) open(window.location.hash, true)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('hashchange', onHash)
    // An address that already points at a reference.
    const frame = requestAnimationFrame(onHash)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('hashchange', onHash)
      cancelAnimationFrame(frame)
    }
  }, [all])

  function showAll() {
    flushSync(() => setAll(true))
    // The button goes away, so focus moves to the first reference it revealed.
    document.getElementById(`ref-${PREVIEW + 1}`)?.focus({ preventScroll: true })
  }

  return (
    <>
      <ol
        className={`mt-10 grid gap-1 ${
          all ? '' : 'max-md:[mask-image:linear-gradient(to_bottom,#000_calc(100%-96px),transparent)]'
        }`}
      >
        {REFERENCES.map((r, i) => {
          const extra = i >= PREVIEW
          return (
            <li
              key={r.n}
              id={`ref-${r.n}`}
              tabIndex={-1}
              style={extra && all ? { animationDelay: `${Math.min(i - PREVIEW, 12) * 25}ms` } : undefined}
              className={`ref-item grid grid-cols-[34px_minmax(0,1fr)] gap-2 rounded-xl px-3 py-2.5 text-[14px] leading-relaxed text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                extra ? (all ? 'ref-reveal' : 'max-md:hidden') : ''
              }`}
            >
              <span className="font-mono text-[12.5px] text-ink-3">[{r.n}]</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                <span lang="en">{r.text}</span>
                {r.url && (
                  <>
                    {' '}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="link font-mono text-[12.5px]">
                      {r.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </>
                )}
              </span>
            </li>
          )
        })}
      </ol>
      {!all && (
        <button
          type="button"
          onClick={showAll}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-card px-5 text-[15px] font-medium text-ink transition-[border-color,scale] duration-200 hover:border-ink/40 active:scale-[0.97] md:hidden"
        >
          Ver as {REFERENCES.length} referências
          <span className="font-mono text-[12.5px] text-ink-3">+{REFERENCES.length - PREVIEW}</span>
        </button>
      )}
    </>
  )
}
