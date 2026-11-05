'use client'

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { useClipTab } from '../use-clip-tab'

export type SegmentOption<T extends string> = { id: T; label: ReactNode; sub?: ReactNode }

type Props<T extends string> = {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  tone?: 'light' | 'night'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Stretch the options to fill the row. */
  stretch?: boolean
  /** Below the sm breakpoint, list the options top to bottom. For options with a sub line. */
  stack?: boolean
}

// Touch screens get the 44px target of the HIG; a mouse keeps the tighter row.
const HEIGHT = {
  sm: 'min-h-8 px-3 text-[12.5px] pointer-coarse:min-h-10',
  md: 'min-h-10 px-4 text-[14px] pointer-coarse:min-h-11',
  lg: 'min-h-12 px-5 text-[15px]',
}

/**
 * A row of mutually exclusive options with a sliding pill.
 * Radio semantics: one stop in the tab order, arrows move the choice.
 *
 * The row is drawn twice (see useClipTab): the buttons, and on top of them a
 * copy in the chosen colors, clipped to the chosen option. The clip slides, so
 * each label changes color exactly as the pill passes under it.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = 'light',
  size = 'md',
  className = '',
  stretch = false,
  stack = false,
}: Props<T>) {
  const listRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  )
  useClipTab(listRef, listRef, topRef, index, ':scope > [role="radio"]')

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = options.length - 1
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    onChange(options[next].id)
    refs.current[next]?.focus()
  }

  const night = tone === 'night'
  const shell = night ? 'border-white/10 bg-white/[0.05]' : 'border-line bg-card shadow-[0_1px_2px_rgba(15,37,35,.04)]'
  const colors = (
    night
      ? { '--clip-bg': 'var(--s-glow)', '--clip-fg': 'var(--s-night)' }
      : { '--clip-bg': 'var(--s-pick)', '--clip-fg': 'var(--s-on-pick)' }
  ) as CSSProperties
  const on = night ? 'text-night' : 'text-on-pick'
  const onSub = night ? 'text-night/70' : 'text-on-pick-2'
  const off = night ? 'text-on-night-2 hover:text-on-night' : 'text-ink-2 hover:text-ink'
  const offSub = night ? 'text-on-night-3' : 'text-ink-3'
  // Both copies share every class that sets size and position.
  const item = `relative flex shrink-0 font-medium ${HEIGHT[size]} ${
    stack
      ? 'flex-row items-center justify-between gap-3 rounded-[19px] py-2 text-left sm:flex-auto sm:flex-col sm:justify-center sm:gap-0 sm:rounded-full sm:py-1.5 sm:text-center'
      : `flex-col items-center justify-center rounded-full py-1.5 ${stretch ? 'flex-auto' : ''}`
  }`
  const body = (o: SegmentOption<T>, chosen: boolean) => (
    <>
      <span className="relative leading-tight whitespace-nowrap">{o.label}</span>
      {o.sub && (
        <span
          className={`relative font-mono text-[11px] leading-tight font-normal whitespace-nowrap ${stack ? 'sm:mt-0.5' : 'mt-0.5'} ${
            chosen ? onSub : offSub
          }`}
        >
          {o.sub}
        </span>
      )}
    </>
  )

  return (
    <div
      ref={listRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      style={colors}
      className={`clip-row relative ${stretch || stack ? 'flex w-full' : 'inline-flex max-w-full'} gap-1 overflow-x-auto border p-1 no-scrollbar ${
        stack ? 'flex-col rounded-[24px] sm:flex-row sm:rounded-full' : 'rounded-full'
      } ${shell} ${className}`}
    >
      {options.map((o, i) => {
        const active = i === index
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`${item} transition-colors duration-200 ${off}`}
          >
            {body(o, false)}
          </button>
        )
      })}
      <div
        ref={topRef}
        aria-hidden
        className={`clip-on pointer-events-none absolute inset-y-0 left-0 flex w-max min-w-full gap-1 p-1 ${
          stack ? 'flex-col sm:flex-row' : ''
        }`}
      >
        {options.map((o) => (
          <span key={o.id} className={`${item} ${on}`}>
            {body(o, true)}
          </span>
        ))}
      </div>
    </div>
  )
}
