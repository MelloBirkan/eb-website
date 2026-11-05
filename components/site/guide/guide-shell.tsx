'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { HeroHeading, HeroRise } from '../hero-heading'
import { ArrowLeft, ArrowRight, ChevronDown } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { useReducedMotion } from '../use-reduced-motion'
import { GUIDES } from './guide-tabs'
import { readHash, takeQuiet } from './use-guide-step'

export type GuideStep<T extends string = string> = { id: T; title: string }

const pad = (n: number) => String(n).padStart(2, '0')

/* ───── Step heading ───── */

type StepInfo = {
  id: string
  index: number
  total: number
  ids: readonly string[]
  takeFocus: () => boolean
  go: (id: string) => void
}

const StepContext = createContext<StepInfo>({
  id: '',
  index: 0,
  total: 1,
  ids: [],
  takeFocus: () => false,
  go: () => {},
})

/**
 * The top of a step: "Etapa 03 de 07", the title and the lede. Its id is the
 * step's, so links and the search palette can land on it.
 */
export function StepHead({ title, children }: { title: ReactNode; children?: ReactNode }) {
  const { id, index, total, ids, takeFocus } = useContext(StepContext)
  const headRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // A link straight to a step hides the steps until the right one is on the page (see the guides' layout).
    const boot = document.getElementById('guide-boot')
    if (boot) {
      const want = readHash()
      if (ids.includes(want) && want !== id) return
      boot.remove()
      if (want === id) headRef.current?.scrollIntoView({ block: 'start' })
      return
    }
    // After a move from the step list or the pager, screen readers start at the new title.
    if (takeFocus()) titleRef.current?.focus({ preventScroll: true })
  }, [id, ids, takeFocus])

  return (
    <header ref={headRef} id={id}>
      <p className="eyebrow">
        Etapa {pad(index + 1)} de {pad(total)}
      </p>
      <h2 ref={titleRef} tabIndex={-1} className="guide-h2 mt-4 focus:outline-none">
        {title}
      </h2>
      {children && <p className="guide-lede mt-4 max-w-[62ch]">{children}</p>}
    </header>
  )
}

/** A link from inside a step to another step of the same guide. It moves the way the step list does. */
export function StepLink({ to, children, className = 'link' }: { to: string; children: ReactNode; className?: string }) {
  const { go } = useContext(StepContext)
  return (
    <a href={`#${to}`} className={className} onClick={(e) => onLink(e, to, go)}>
      {children}
    </a>
  )
}

/** A labelled control for the hero, like the choice between the terminal and the app. */
export function HeroField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="lg:pb-1.5">
      <p className="font-mono text-[11.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  )
}

/* ───── Shell ───── */

type ShellProps<T extends string> = {
  eyebrow: string
  title: ReactNode
  lede: ReactNode
  facts?: string[]
  /** A control beside the title on wide screens, under it on phones. */
  toolbar?: ReactNode
  steps: readonly GuideStep<T>[]
  /** Every step id the page answers to, when it has more than one list of steps. */
  ids?: readonly string[]
  step: T
  onStep: (id: T) => void
  done: { title: string; body: ReactNode }
  children: ReactNode
}

export function GuideShell<T extends string>({
  eyebrow,
  title,
  lede,
  facts,
  toolbar,
  steps,
  ids,
  step,
  onStep,
  done,
  children,
}: ShellProps<T>) {
  const reduce = useReducedMotion()
  const found = steps.findIndex((s) => s.id === step)
  const index = Math.max(0, found)
  const total = steps.length
  const prev = index > 0 ? steps[index - 1] : null
  const next = index < total - 1 ? steps[index + 1] : null
  const allIds = useMemo(() => ids ?? steps.map((s) => s.id), [ids, steps])

  // Which way the last move went, so the steps slide the right way. 0 is a switch to another list of steps.
  const [move, setMove] = useState({ step, index, dir: 0 })
  if (move.step !== step) setMove({ step, index, dir: index === move.index ? 0 : index > move.index ? 1 : -1 })

  const stageRef = useRef<HTMLDivElement>(null)

  // A link from another page (a card on the home page, the search palette) mounts the guide before
  // the address has the step, so the first step would show and then swap. As on a fresh load, hide
  // the steps until the linked one is on the page, and open the page at the steps.
  useLayoutEffect(() => {
    const want = readHash()
    if (want === step || !allIds.includes(want) || document.getElementById('guide-boot')) return
    const boot = document.createElement('style')
    boot.id = 'guide-boot'
    boot.textContent = '.guide-stage{visibility:hidden}'
    document.head.appendChild(boot)
    // After the router's own scroll and before the first paint.
    const frame = requestAnimationFrame(() => stageRef.current?.scrollIntoView({ block: 'start' }))
    const timer = window.setTimeout(() => boot.remove(), 4000)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      boot.remove()
    }
    // Only when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusNext = useRef(false)
  const takeFocus = useCallback(() => {
    const f = focusNext.current
    focusNext.current = false
    return f
  }, [])

  const go = useCallback(
    (id: T) => {
      if (id === step) return
      focusNext.current = true
      onStep(id)
    },
    [onStep, step],
  )

  // Bring the new step into view when it starts above the screen or far below it.
  const shown = useRef(step)
  useEffect(() => {
    if (shown.current === step) return
    shown.current = step
    if (takeQuiet() || document.getElementById('guide-boot')) return
    const el = stageRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < 80 || top > window.innerHeight * 0.7) {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
  }, [step, reduce])

  const panel: Variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 36, y: d === 0 ? 14 : 0 }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { x: SPRING.ui, y: SPRING.ui, opacity: { duration: 0.3, ease: EASE_OUT } },
    },
    exit: (d: number) =>
      reduce
        ? { opacity: 0, transition: { duration: 0.12 } }
        : { opacity: 0, x: d * -22, y: d === 0 ? -8 : 0, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
  }

  const info: StepInfo = { id: step, index, total, ids: allIds, takeFocus, go: go as (id: string) => void }

  return (
    <>
      <section className="wrap pt-10 pb-10 sm:pt-14 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <HeroRise y={10}>
              <p className="eyebrow">{eyebrow}</p>
            </HeroRise>
            <HeroHeading
              delay={140}
              className="mt-5 max-w-[17ch] text-[clamp(2.4rem,1.3rem+4.2vw,4.6rem)] leading-[0.98] font-semibold tracking-[-0.046em] text-balance"
            >
              {title}
            </HeroHeading>
            <HeroRise delay={380} y={14}>
              <p className="lede mt-6 max-w-[56ch]">{lede}</p>
            </HeroRise>
            {facts && facts.length > 0 && (
              <HeroRise delay={480} y={12}>
                <ul className="mt-6 flex flex-wrap gap-2" role="list">
                  {facts.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-line-2 bg-card px-3 py-1 font-mono text-[12px] font-semibold text-ink-2"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </HeroRise>
            )}
          </div>
          {toolbar && (
            <HeroRise delay={540} y={12} className="min-w-0">
              {toolbar}
            </HeroRise>
          )}
        </div>
      </section>

      <div className="wrap pb-24 lg:pb-32">
        <div className="lg:grid lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <aside className="hidden lg:block">
            <Rail steps={steps} index={index} go={go} />
          </aside>

          <div className="min-w-0">
            <Chips steps={steps} index={index} go={go} reduce={reduce} />

            <div ref={stageRef} className="guide-stage relative max-w-[760px]">
              <AnimatePresence mode="wait" initial={false} custom={move.dir}>
                <motion.div
                  key={step}
                  custom={move.dir}
                  variants={panel}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <StepContext.Provider value={info}>
                    <div className="guide-prose">{children}</div>
                  </StepContext.Provider>
                  {!next && <DoneCard title={done.title} body={done.body} />}
                  <Pager index={index} total={total} prev={prev} next={next} go={go} />
                </motion.div>
              </AnimatePresence>
            </div>
            <End steps={steps} index={index} next={next} go={go} />
          </div>
        </div>
      </div>
    </>
  )
}

/* ───── Desktop: the step rail ───── */

type NavProps<T extends string> = { steps: readonly GuideStep<T>[]; index: number; go: (id: T) => void }

function onLink<T extends string>(e: MouseEvent<HTMLAnchorElement>, id: T, go: (id: T) => void, after?: () => void) {
  // Let a modified click open the step in a new tab.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  after?.()
  go(id)
}

/** A tick that draws itself when a step is done. */
function Tick({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.path
        d="M5 12.5 9.5 17 19 7.5"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.36, ease: EASE_OUT, delay: 0.12 }}
      />
    </svg>
  )
}

function Rail<T extends string>({ steps, index, go }: NavProps<T>) {
  const last = steps.length - 1
  return (
    <nav aria-label="Etapas do guia" className="sticky top-28 py-1">
      <p className="eyebrow">Etapas</p>
      <ol className="relative mt-5" role="list">
        {/* The track between the dots, and how much of it is behind you. */}
        <span aria-hidden className="absolute top-6 bottom-6 left-[15.5px] w-px bg-line-2" />
        <motion.span
          aria-hidden
          className="absolute top-6 bottom-6 left-[15.5px] w-px origin-top bg-brand"
          initial={false}
          animate={{ scaleY: last > 0 ? index / last : 0 }}
          transition={SPRING.gentle}
        />
        {steps.map((s, i) => {
          const state = i < index ? 'done' : i === index ? 'now' : 'next'
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => onLink(e, s.id, go)}
                aria-current={state === 'now' ? 'step' : undefined}
                className="group relative flex items-center gap-3.5 rounded-xl py-2 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  className={`relative grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[11.5px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-300 ${
                    state === 'done'
                      ? 'border-brand bg-brand text-on-brand'
                      : state === 'now'
                        ? 'border-brand bg-card text-brand shadow-[0_0_0_4px_color-mix(in_oklab,var(--s-brand)_16%,transparent)]'
                        : 'border-line-2 bg-paper text-ink-3 group-hover:border-ink/30 group-hover:text-ink-2'
                  }`}
                >
                  {state === 'done' ? <Tick /> : pad(i + 1)}
                </span>
                <span
                  className={`text-[14.5px] leading-snug transition-colors duration-200 ${
                    state === 'now' ? 'font-semibold text-ink' : state === 'done' ? 'text-ink-2 group-hover:text-ink' : 'text-ink-3 group-hover:text-ink'
                  }`}
                >
                  {s.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ───── Phones: a row of step chips ───── */

function Chips<T extends string>({ steps, index, go, reduce }: NavProps<T> & { reduce: boolean }) {
  const rowRef = useRef<HTMLOListElement>(null)

  // Keep the current chip in the middle of the row.
  useEffect(() => {
    const row = rowRef.current
    const chip = row?.children[index] as HTMLElement | undefined
    if (!row || !chip) return
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2
    row.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' })
  }, [index, reduce])

  return (
    <nav aria-label="Etapas do guia" data-guide-chips className="-mx-6 mb-10 lg:hidden">
      <ol
        ref={rowRef}
        role="list"
        className="flex gap-2 overflow-x-auto overscroll-x-contain px-6 py-1 no-scrollbar [mask-image:linear-gradient(90deg,transparent,#000_20px,#000_calc(100%-20px),transparent)]"
      >
        {steps.map((s, i) => {
          const state = i < index ? 'done' : i === index ? 'now' : 'next'
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => onLink(e, s.id, go)}
                aria-current={state === 'now' ? 'step' : undefined}
                className={`flex h-11 items-center gap-2 rounded-full border pr-4 pl-2 text-[14px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-300 ${
                  state === 'now' ? 'border-pick bg-pick text-on-pick' : 'border-line bg-card text-ink-2'
                }`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-full font-mono text-[11px] font-semibold transition-colors duration-300 ${
                    state === 'now'
                      ? 'bg-white/14 text-on-pick'
                      : state === 'done'
                        ? 'bg-brand text-on-brand'
                        : 'bg-paper-2 text-ink-3'
                  }`}
                >
                  {state === 'done' ? <Tick size={13} /> : pad(i + 1)}
                </span>
                {s.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ───── Under each step ───── */

function DoneCard({ title, body }: { title: string; body: ReactNode }) {
  const pathname = usePathname() ?? ''
  const others = GUIDES.filter((g) => !pathname.startsWith(g.href))
  return (
    <motion.section
      aria-label="Fim do guia"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="mt-14 rounded-[28px] border border-[color-mix(in_oklab,var(--s-brand)_24%,transparent)] bg-[color-mix(in_oklab,var(--s-mint)_55%,var(--s-card))] p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
            <motion.path
              d="M5 12.5 9.5 17 19 7.5"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 }}
            />
          </svg>
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-brand"
            initial={{ opacity: 0.6, scale: 1 }}
            whileInView={{ opacity: 0, scale: 1.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.5 }}
          />
        </span>
        <div className="min-w-0 pt-1">
          <h3 className="text-[1.3rem] leading-tight font-semibold tracking-[-0.02em] text-ink">{title}</h3>
          <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{body}</p>
        </div>
      </div>
      <ul role="list" className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {others.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="group flex min-h-14 items-center justify-between gap-3 rounded-[18px] border border-line bg-card px-4 py-3 transition-[border-color,box-shadow,translate] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_16px_34px_-24px_rgba(15,37,35,.4)]"
            >
              <span>
                <span className="block text-[15px] font-semibold text-ink">Guia: {g.label}</span>
                <span className="font-mono text-[11.5px] text-ink-3">{g.sub}</span>
              </span>
              <ArrowRight size={16} className="text-ink-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

function Pager<T extends string>({
  index,
  total,
  prev,
  next,
  go,
}: {
  index: number
  total: number
  prev: GuideStep<T> | null
  next: GuideStep<T> | null
  go: (id: T) => void
}) {
  return (
    <nav aria-label="Outras etapas" className="mt-14 border-t border-line pt-8">
      <div className="flex items-center justify-between font-mono text-[12px] text-ink-3">
        <span>
          Etapa {pad(index + 1)} de {pad(total)}
        </span>
        <span>{Math.round(((index + 1) / total) * 100)}% do guia</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <motion.div
          className="h-full origin-left rounded-full bg-brand"
          initial={{ scaleX: index / total }}
          whileInView={{ scaleX: (index + 1) / total }}
          viewport={{ once: true }}
          transition={{ ...SPRING.gentle, delay: 0.15 }}
        />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <a
            href={`#${prev.id}`}
            onClick={(e) => onLink(e, prev.id, go)}
            className="group rounded-[22px] border border-line bg-card p-5 transition-[border-color,box-shadow,translate] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_16px_34px_-24px_rgba(15,37,35,.4)]"
          >
            <span className="flex items-center gap-2 font-mono text-[11.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              Anterior
            </span>
            <span className="mt-2 block text-[17px] leading-snug font-semibold text-ink">{prev.title}</span>
          </a>
        ) : (
          <span aria-hidden className="hidden sm:block" />
        )}
        {next && (
          <a
            href={`#${next.id}`}
            onClick={(e) => onLink(e, next.id, go)}
            className="group order-first rounded-[22px] bg-pick p-5 text-on-pick shadow-[0_18px_40px_-22px_rgba(11,26,24,.6)] transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 sm:order-none sm:text-right"
          >
            <span className="flex items-center gap-2 font-mono text-[11.5px] font-semibold tracking-[0.12em] text-on-pick-2 uppercase sm:justify-end">
              Próxima etapa
              <ArrowRight size={14} className="text-pick-accent transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
            <span className="mt-2 block text-[17px] leading-snug font-semibold">{next.title}</span>
          </a>
        )}
      </div>
    </nav>
  )
}

/* ───── Phones: the floating step pill ───── */

/**
 * After the chips scroll away, a pill at the bottom names the current step,
 * opens the list of steps and moves to the next one. It leaves before the
 * pager, so it never covers the buttons at the end.
 */
function End<T extends string>({ steps, index, next, go }: NavProps<T> & { next: GuideStep<T> | null }) {
  const endRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [pastChips, setPastChips] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [open, setOpen] = useState(false)
  const current = steps[index]

  useEffect(() => {
    const chips = document.querySelector('[data-guide-chips]')
    const end = endRef.current
    const top = new IntersectionObserver(([e]) => setPastChips(!e.isIntersecting && e.boundingClientRect.top < 0))
    // The pill goes as the pager comes up, a little before the end of the step.
    const bottom = new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting || e.boundingClientRect.top < 0), {
      rootMargin: '0px 0px 260px 0px',
    })
    if (chips) top.observe(chips)
    if (end) bottom.observe(end)
    return () => {
      top.disconnect()
      bottom.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const visible = pastChips && !atEnd
  // A closed sheet stays closed when the pill comes back.
  const [wasVisible, setWasVisible] = useState(visible)
  if (wasVisible !== visible) {
    setWasVisible(visible)
    if (!visible) setOpen(false)
  }

  return (
    <>
      <div ref={endRef} aria-hidden />
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={sheetRef}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={SPRING.gentle}
            className="fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100vw-32px)] items-center gap-2 lg:hidden"
          >
            <AnimatePresence>
              {open && (
                <motion.nav
                  id="guide-sheet"
                  aria-label="Etapas do guia"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={SPRING.ui}
                  className="absolute right-0 bottom-[calc(100%+10px)] left-0 mx-auto max-h-[62vh] w-[min(340px,calc(100vw-32px))] origin-bottom overflow-y-auto rounded-[26px] border border-white/10 bg-night/95 p-2 text-on-night shadow-[0_30px_60px_-20px_rgba(5,14,13,.7)] backdrop-blur-xl"
                >
                  <ol role="list">
                    {steps.map((s, i) => {
                      const on = i === index
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={(e) => onLink(e, s.id, go, () => setOpen(false))}
                            aria-current={on ? 'step' : undefined}
                            className={`flex min-h-12 items-center gap-3 rounded-[18px] px-3.5 py-2.5 text-[15.5px] ${
                              on ? 'bg-glow/12 font-medium text-glow' : 'text-on-night hover:bg-white/6'
                            }`}
                          >
                            <span className={`font-mono text-[11.5px] ${i < index ? 'text-glow' : 'text-on-night-3'}`}>
                              {i < index ? <Tick size={13} /> : pad(i + 1)}
                            </span>
                            {s.title}
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
              aria-controls="guide-sheet"
              className="flex h-12 min-w-0 items-center gap-3 rounded-full border border-white/10 bg-night/90 py-1 pr-4 pl-1.5 text-on-night shadow-[0_18px_40px_-16px_rgba(5,14,13,.7)] backdrop-blur-xl"
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
                    initial={false}
                    animate={{ pathLength: (index + 1) / steps.length }}
                    transition={SPRING.gentle}
                  />
                </svg>
                <span className="font-mono text-[11px] text-glow">{pad(index + 1)}</span>
              </span>
              <span className="sr-only">Etapa atual: </span>
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
                    {current.title}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING.ui} className="text-on-night-2">
                <ChevronDown size={15} />
              </motion.span>
            </button>

            {next && (
              <a
                href={`#${next.id}`}
                onClick={(e) => onLink(e, next.id, go, () => setOpen(false))}
                aria-label={`Próxima etapa: ${next.title}`}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-glow text-[#0b1a18] shadow-[0_18px_40px_-16px_rgba(5,14,13,.7)] transition-transform active:scale-95"
              >
                <ArrowRight size={17} />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
