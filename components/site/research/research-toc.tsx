'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ArrowRight } from '../icons'
import { SPRING } from '../motion'
import { SECTIONS, type SectionId } from './paper'

function jump(e: MouseEvent<HTMLAnchorElement>, id: string, after?: () => void) {
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  after?.()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  // Move focus to the section heading so keyboard and screen reader users land there too.
  const heading = el.querySelector<HTMLElement>('h2, h3')
  if (heading) {
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }
}

/** Tracks which section sits under the reading line, a band at about 38% of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id)
  const [pastHero, setPastHero] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as SectionId)
      },
      { rootMargin: '-38% 0px -60% 0px' },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) spy.observe(el)
    }

    const hero = document.getElementById('pesquisa-topo')
    const heroWatch = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 })
    if (hero) heroWatch.observe(hero)

    // From the closing call to action down to the footer, the pill would cover buttons and links.
    const end = document.querySelector('[aria-labelledby="pesquisa-cta"]')
    const endWatch = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    if (end) endWatch.observe(end)

    return () => {
      spy.disconnect()
      heroWatch.disconnect()
      endWatch.disconnect()
    }
  }, [])

  // Back at the top, the hero is on screen and no section is under the reading line.
  return { active: pastHero ? active : SECTIONS[0].id, pastHero, atEnd }
}

/** "Nesta página": a sticky rail on wide screens and a floating pill with a sheet on phones. */
export function ResearchToc() {
  const { active, pastHero, atEnd } = useActiveSection()
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const index = SECTIONS.findIndex((s) => s.id === active)
  const current = SECTIONS[index]

  useEffect(() => {
    if (!open) return
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onDown(e: PointerEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <>
      <aside className="sticky top-28 hidden self-start py-16 lg:block">
        <nav aria-label="Nesta página">
          <p className="eyebrow">Nesta página</p>
          <ol className="relative mt-5 border-l border-line">
            {SECTIONS.map((s, i) => {
              const on = s.id === active
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => jump(e, s.id)}
                    aria-current={on ? 'location' : undefined}
                    className={`relative flex items-baseline gap-2.5 py-[7px] pl-4 text-[14px] leading-snug transition-colors duration-200 ${
                      on ? 'font-medium text-ink' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="toc-bar"
                        className="absolute top-1 bottom-1 -left-px w-[2px] rounded-full bg-brand"
                        transition={SPRING.ui}
                        aria-hidden
                      />
                    )}
                    <span className={`font-mono text-[11px] ${on ? 'text-brand' : 'text-ink-3/70'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.label}
                  </a>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
            <motion.div className="h-full origin-left rounded-full bg-brand" style={{ scaleX: progress }} />
          </div>
        </nav>
      </aside>

      <AnimatePresence>
        {pastHero && !atEnd && (
          <motion.div
            ref={sheetRef}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={SPRING.gentle}
            className="fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 mx-auto w-fit max-w-[calc(100vw-32px)] lg:hidden"
          >
            <AnimatePresence>
              {open && (
                <motion.nav
                  id="toc-sheet"
                  aria-label="Nesta página"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={SPRING.ui}
                  className="absolute right-0 bottom-[calc(100%+10px)] left-0 mx-auto max-h-[60vh] w-[min(320px,calc(100vw-32px))] origin-bottom overflow-y-auto rounded-[26px] border border-white/10 bg-night/95 p-2 text-on-night shadow-[0_30px_60px_-20px_rgba(5,14,13,.7)] backdrop-blur-xl"
                >
                  <ol>
                    {SECTIONS.map((s, i) => {
                      const on = s.id === active
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={(e) => jump(e, s.id, () => setOpen(false))}
                            aria-current={on ? 'location' : undefined}
                            className={`flex items-center gap-3 rounded-[18px] px-3.5 py-2.5 text-[15.5px] ${
                              on ? 'bg-glow/12 font-medium text-glow' : 'text-on-night hover:bg-white/6'
                            }`}
                          >
                            <span className="font-mono text-[11.5px] text-on-night-3">{String(i + 1).padStart(2, '0')}</span>
                            {s.label}
                          </a>
                        </li>
                      )
                    })}
                  </ol>
                </motion.nav>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="toc-sheet"
              className="flex h-12 max-w-full items-center gap-3 rounded-full border border-white/10 bg-night/90 py-1 pr-4 pl-1.5 text-on-night shadow-[0_18px_40px_-16px_rgba(5,14,13,.7)] backdrop-blur-xl"
            >
              <span className="relative grid size-9 shrink-0 place-items-center">
                <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2.5" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="var(--s-glow)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ pathLength: progress }}
                  />
                </svg>
                <span className="font-mono text-[11px] text-glow">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="sr-only">Nesta página: </span>
              <span className="relative min-w-0 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.id}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={SPRING.ui}
                    className="block truncate text-[14.5px] font-medium"
                  >
                    {current.label}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.span animate={{ rotate: open ? 90 : -90 }} transition={SPRING.ui} className="text-on-night-2">
                <ArrowRight size={15} />
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
