'use client'

import { Children, isValidElement, useMemo, useRef, type ReactElement, type ReactNode } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useInView, type Variants } from 'motion/react'
import { CopyButton } from '../copy-button'
import { ArrowRight, Info, Sparkle, Warn } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { Segmented } from '../research/segmented'
import { useReducedMotion } from '../use-reduced-motion'
import { AGENTS, invocation, setAgent, useAgent, type Agent } from './agent-choice'
import { highlight } from './highlight'

const pad = (n: number) => String(n).padStart(2, '0')

const VIEW = { once: true, amount: 0.35 } as const

/* ───── Code ───── */

const codeShell =
  'guide-block overflow-hidden rounded-[22px] border border-white/8 bg-night text-on-night shadow-[0_1px_0_rgba(255,255,255,.05)_inset,0_24px_60px_-34px_rgba(5,14,13,.55)]'

/** A dark code block with highlighting and a copy button. */
export function CodeBlock({ lang = 'bash', code }: { lang?: string; code: string }) {
  const html = useMemo(() => highlight(code, lang), [code, lang])
  return (
    <figure className={codeShell}>
      <figcaption className="flex min-h-12 items-center gap-3 border-b border-white/8 py-1.5 pr-2 pl-4">
        <span className="font-mono text-[11.5px] font-semibold tracking-[0.14em] text-on-night-3 uppercase">{lang}</span>
        <CopyButton
          text={code}
          label={code.includes('\n') ? 'o código' : 'o comando'}
          tone="night"
          className="ml-auto"
        />
      </figcaption>
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}

/** The agent switch that heads every invocation block. All of them move together. */
function AgentSwitch() {
  const agent = useAgent()
  return (
    <Segmented<Agent>
      label="Sintaxe do agente"
      tone="night"
      options={AGENTS.map((a) => ({ id: a.id, label: a.label }))}
      value={agent}
      onChange={setAgent}
      size="sm"
    />
  )
}

/** Code that differs between the agents. It follows the reader's choice, like every invocation. */
export function AgentCode({ code, lang = 'bash' }: { code: Record<Agent, string>; lang?: string }) {
  const agent = useAgent()
  const text = code[agent]
  const html = useMemo(() => highlight(text, lang), [text, lang])
  return (
    <figure className={codeShell}>
      <figcaption className="flex min-h-12 items-center gap-3 border-b border-white/8 py-1.5 pr-2 pl-1.5">
        <AgentSwitch />
        <CopyButton
          text={text}
          label={text.includes('\n') ? 'o código' : 'o comando'}
          tone="night"
          className="ml-auto"
        />
      </figcaption>
      <pre className="code-pre relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.code
            key={agent}
            className="block"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </AnimatePresence>
      </pre>
    </figure>
  )
}

/** How to call a skill, in the syntax of the agent the reader picked. */
export function Invocation({ skill, args }: { skill: string; args?: string }) {
  return (
    <AgentCode code={{ claude: invocation('claude', skill, args), codex: invocation('codex', skill, args) }} />
  )
}

/* ───── Menu paths ───── */

/** A way through menus, like Plugins → evenbetter → Add to Codex. The stops come in one after another. */
export function MenuPath({ items, label }: { items: string[]; label: string }) {
  return (
    <motion.ol
      aria-label={label}
      className="guide-block flex flex-wrap items-center gap-x-1.5 gap-y-2"
      initial="hidden"
      whileInView="shown"
      viewport={VIEW}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.12 } } }}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <motion.li
            key={item}
            className="flex items-center gap-1.5"
            variants={{
              hidden: { opacity: 0, x: -6 },
              shown: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
            }}
          >
            {i > 0 && <ArrowRight size={14} className="shrink-0 text-ink-3" />}
            <span
              className={
                last
                  ? 'rounded-full bg-pick px-3.5 py-1.5 text-[14px] font-semibold text-on-pick'
                  : 'rounded-full border border-line-2 bg-card px-3.5 py-1.5 font-mono text-[13px] text-ink'
              }
            >
              {item}
            </span>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}

/* ───── Tags and prompts ───── */

/** A short set of labels, like the symptoms a skill sorts a problem into. */
export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <motion.ul
      aria-label={label}
      className="guide-block flex flex-wrap gap-2"
      initial="hidden"
      whileInView="shown"
      viewport={VIEW}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
    >
      {items.map((t) => (
        <motion.li
          key={t}
          className="rounded-full border border-line-2 bg-card px-3.5 py-1.5 text-[14.5px] leading-snug text-ink"
          variants={{ hidden: { opacity: 0, scale: 0.9 }, shown: { opacity: 1, scale: 1, transition: SPRING.lively } }}
        >
          {t}
        </motion.li>
      ))}
    </motion.ul>
  )
}

/** Requests to paste into the agent, each with its own copy button. */
export function PromptList({ items, label }: { items: string[]; label: string }) {
  return (
    <motion.ul
      aria-label={label}
      className="guide-block space-y-2.5"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.07 } } }}
    >
      {items.map((p) => (
        <motion.li
          key={p}
          className="flex items-start gap-3 rounded-[18px] border border-line bg-card py-2 pr-2 pl-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
          }}
        >
          <span aria-hidden className="pt-[9px] font-mono text-[14px] leading-none font-semibold text-brand">
            ›
          </span>
          <p className="min-w-0 flex-1 py-1 text-[15px] leading-relaxed text-ink">{p}</p>
          <CopyButton text={p} label="o pedido" className="shrink-0" />
        </motion.li>
      ))}
    </motion.ul>
  )
}

/* ───── Callouts ───── */

const TONES = {
  tip: {
    Icon: Sparkle,
    box: 'border-[color-mix(in_oklab,var(--s-brand)_22%,transparent)] bg-[color-mix(in_oklab,var(--s-mint)_55%,var(--s-card))]',
    chip: 'bg-brand text-on-brand',
  },
  note: {
    Icon: Info,
    box: 'border-line bg-card',
    chip: 'border border-line-2 bg-paper-2 text-ink-2',
  },
  warn: {
    Icon: Warn,
    box: 'border-[color-mix(in_oklab,var(--s-high)_32%,transparent)] bg-[color-mix(in_oklab,var(--s-high)_7%,var(--s-card))]',
    chip: 'bg-high text-white',
  },
} as const

export function Callout({
  kind = 'tip',
  title,
  children,
}: {
  kind?: keyof typeof TONES
  title?: ReactNode
  children: ReactNode
}) {
  const { Icon, box, chip } = TONES[kind]
  return (
    <motion.div
      role="note"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className={`guide-block flex gap-3.5 rounded-[20px] border p-4 sm:gap-4 sm:p-5 ${box}`}
    >
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${chip}`}>
        <Icon size={15} />
      </span>
      <div className="callout-body min-w-0 pt-0.5 text-[15.5px] leading-relaxed text-ink-2">
        {title && <p className="font-semibold text-ink">{title}</p>}
        <div className={title ? 'mt-1' : ''}>{children}</div>
      </div>
    </motion.div>
  )
}

/* ───── Terminal ───── */

export type TermEntry =
  | { cmd: string; prompt?: string }
  | { title: ReactNode; lines?: ReactNode[]; arrow?: boolean }

/** Lays the entries on one timeline. Typing time follows the length of the command. */
function timeline(log: TermEntry[]) {
  const out: { entry: TermEntry; start: number; typing: number }[] = []
  let t = 0.15
  for (const entry of log) {
    if ('cmd' in entry) {
      const typing = Math.min(1.1, Math.max(0.35, entry.cmd.length * 0.024))
      out.push({ entry, start: t, typing })
      t += typing + 0.2
    } else {
      out.push({ entry, start: t, typing: 0 })
      t += 0.25 + (entry.lines?.length ?? 0) * 0.11 + 0.15
    }
  }
  return out
}

/**
 * A recorded agent session. When it scrolls into view the command types
 * itself out, then the answer lines come in one by one.
 */
export function Terminal({ label, prompt = '›', log }: { label: string; prompt?: string; log: TermEntry[] }) {
  const reduce = useReducedMotion()

  const timed = timeline(log)
  const at = (delay: number, extra = {}) => (reduce ? { duration: 0 } : { delay, ...extra })

  return (
    <motion.figure
      className="guide-block term overflow-hidden rounded-[22px] border border-white/8 bg-night-2 text-on-night shadow-[0_24px_60px_-34px_rgba(5,14,13,.55)]"
      initial="hidden"
      whileInView="shown"
      viewport={VIEW}
    >
      <figcaption className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-on-night-3 uppercase">{label}</span>
      </figcaption>
      <div className="space-y-3.5 px-4 py-4 sm:px-5 sm:py-5">
        {timed.map(({ entry, start, typing }, i) => {
          if ('cmd' in entry) {
            const steps = Math.min(48, Math.max(8, entry.cmd.length))
            const typeOn: Variants = {
              hidden: { clipPath: 'inset(0 100% 0 0)' },
              shown: {
                clipPath: 'inset(0 0% 0 0)',
                transition: at(start, { duration: typing, ease: (p: number) => Math.round(p * steps) / steps }),
              },
            }
            return (
              <div key={i} className="flex gap-2.5 font-mono text-[13.5px] leading-relaxed">
                <span className="shrink-0 text-glow">{entry.prompt ?? prompt}</span>
                <motion.span variants={typeOn} className="min-w-0 [overflow-wrap:anywhere] text-on-night">
                  {entry.cmd}
                </motion.span>
              </div>
            )
          }
          const rise: Variants = {
            hidden: { opacity: 0, y: 6 },
            shown: { opacity: 1, y: 0, transition: at(start, { duration: 0.4, ease: EASE_OUT }) },
          }
          return (
            <motion.div key={i} variants={rise} className="flex gap-2.5">
              <span aria-hidden className="shrink-0 font-mono text-[13.5px] leading-relaxed text-on-night-3">
                ⬡
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] leading-relaxed font-semibold text-on-night">{entry.title}</p>
                {entry.lines && entry.lines.length > 0 && (
                  <ul className="mt-1 space-y-1 font-mono text-[12.5px] leading-relaxed text-on-night-2">
                    {entry.lines.map((line, j) => (
                      <motion.li
                        key={j}
                        className="flex gap-2"
                        variants={{
                          hidden: { opacity: 0, x: -6 },
                          shown: {
                            opacity: 1,
                            x: 0,
                            transition: at(start + 0.18 + j * 0.11, { duration: 0.35, ease: EASE_OUT }),
                          },
                        }}
                      >
                        <motion.span
                          aria-hidden
                          className="shrink-0 text-glow"
                          variants={{
                            hidden: { scale: 0.4 },
                            shown: { scale: 1, transition: at(start + 0.24 + j * 0.11, SPRING.lively) },
                          }}
                        >
                          {entry.arrow ? '→' : '✓'}
                        </motion.span>
                        <span className="min-w-0 [overflow-wrap:anywhere]">{line}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.figure>
  )
}

/** One call to a skill of the iOS plugin and what the agent answers, in the reader's agent. */
export function SkillSession({
  skill,
  args,
  title,
  lines,
}: {
  skill: string
  args?: string
  title: ReactNode
  lines: ReactNode[]
}) {
  const agent = useAgent()
  return (
    <Terminal
      key={agent}
      label={agent === 'codex' ? 'Codex' : 'Claude Code'}
      log={[{ cmd: invocation(agent, skill, args) }, { title, lines }]}
    />
  )
}

/* ───── Numbered steps ───── */

type StepProps = { title: ReactNode; children?: ReactNode }

/** One row of <Steps>. */
export function Step(props: StepProps) {
  return <>{props.children}</>
}

/** A short numbered sequence. The rail draws down and the rows follow it. */
export function Steps({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter((c): c is ReactElement<StepProps> => isValidElement(c))
  return (
    <motion.ol className="guide-block relative" initial="hidden" whileInView="shown" viewport={VIEW}>
      <motion.span
        aria-hidden
        className="absolute top-6 bottom-6 left-5 w-px origin-top bg-line-2"
        variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { duration: 0.9, ease: EASE_OUT } } }}
      />
      {items.map((item, i) => (
        <motion.li
          key={i}
          className="relative flex gap-4 py-2.5"
          variants={{
            hidden: { opacity: 0, x: -8 },
            shown: { opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.12, duration: 0.5, ease: EASE_OUT } },
          }}
        >
          <motion.span
            className="relative grid size-10 shrink-0 place-items-center rounded-full border border-line-2 bg-card font-mono text-[12.5px] font-semibold text-brand"
            variants={{
              hidden: { scale: 0.6 },
              shown: { scale: 1, transition: { delay: 0.1 + i * 0.12, ...SPRING.lively } },
            }}
          >
            {pad(i + 1)}
          </motion.span>
          <div className="min-w-0 pt-2">
            <p className="text-[16.5px] leading-snug font-semibold text-ink">{item.props.title}</p>
            {item.props.children && (
              <div className="mt-1 text-[15.5px] leading-relaxed text-ink-2">{item.props.children}</div>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

/* ───── Cards ───── */

export type CardItem = { title: string; meta?: string; body: ReactNode }

/**
 * Cards in two columns. On phones they become a row you swipe, so sixteen
 * skills do not turn into a long scroll. When the items change (a filter),
 * the leaving cards fade out and the rest slide into their new places.
 */
export function CardGrid({ items, label }: { items: CardItem[]; label: string }) {
  const reduce = useReducedMotion()
  // A plain animate target, not whileInView, so cards added later by a filter also come in.
  const ref = useRef<HTMLUListElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.ul
      ref={ref}
      aria-label={label}
      layoutScroll
      className="guide-block relative -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto overscroll-x-contain px-6 pb-1 no-scrollbar [mask-image:linear-gradient(90deg,transparent,#000_20px,#000_calc(100%-20px),transparent)] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:[mask-image:none]"
      initial="hidden"
      animate={seen ? 'shown' : 'hidden'}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((it) => (
          <motion.li
            key={it.title}
            layout={reduce ? false : 'position'}
            transition={SPRING.ui}
            className="w-[80%] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none"
            variants={{
              hidden: { opacity: 0, y: 16 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
            }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.16, ease: EASE_OUT } }}
          >
            <div className="h-full rounded-[20px] border border-line bg-card p-5 transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-28px_rgba(15,37,35,.35)]">
              <p className="font-mono text-[13px] leading-snug font-semibold text-ink [overflow-wrap:anywhere]">
                {it.title}
              </p>
              {it.meta && <p className="mt-2 font-mono text-[11.5px] leading-relaxed text-brand">{it.meta}</p>}
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{it.body}</p>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

/* ───── Screenshots ───── */

type Box = { x: string; y: string; w: string; h: string }

/** A screenshot with the spot to click ringed, and its caption below. */
export function Shot({
  src,
  alt,
  width,
  height,
  n,
  caption,
  spot,
  sizes = '(max-width: 640px) 90vw, 360px',
  unoptimized,
}: {
  src: string
  alt: string
  width: number
  height: number
  n?: string
  caption?: ReactNode
  spot?: Box
  sizes?: string
  unoptimized?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <figure className="guide-block">
      <div className="rounded-[18px] border border-line bg-paper-2 p-1.5">
        <div className="relative overflow-hidden rounded-[13px]">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            unoptimized={unoptimized}
            className="h-auto w-full"
          />
          {spot && (
            <motion.span
              aria-hidden
              className="absolute rounded-[10px] border-2 border-brand shadow-[0_0_0_4px_color-mix(in_oklab,var(--s-brand)_22%,transparent)]"
              style={{ left: spot.x, top: spot.y, width: spot.w, height: spot.h }}
              initial={{ opacity: 0, scale: 1.25 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ ...SPRING.lively, delay: 0.2 }}
            >
              {!reduce && (
                <motion.span
                  className="absolute -inset-[2px] rounded-[10px] border-2 border-brand"
                  animate={{ opacity: [0.7, 0], scale: [1, 1.18] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                />
              )}
            </motion.span>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 flex gap-3 px-1 text-[15px] leading-snug text-ink-2">
          {n && <span className="shrink-0 pt-px font-mono text-[12px] font-semibold text-brand">{n}</span>}
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  )
}

/** A responsive grid of screenshots. */
export function ShotGrid({ children }: { children: ReactNode }) {
  return (
    <div className="guide-block grid gap-x-5 gap-y-7 sm:grid-cols-2 [&>.guide-block]:mt-0">
      {children}
    </div>
  )
}
