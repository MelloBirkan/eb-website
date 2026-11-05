'use client'

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { SPRING } from '../motion'

export type SegmentOption<T extends string> = { id: T; label: ReactNode; sub?: ReactNode }

type Props<T extends string> = {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  tone?: 'light' | 'night'
  size?: 'md' | 'lg'
  className?: string
  /** Stretch the options to fill the row. */
  stretch?: boolean
  /** Below the sm breakpoint, list the options top to bottom. For options with a sub line. */
  stack?: boolean
}

/**
 * A row of mutually exclusive options with a sliding pill.
 * Radio semantics: one stop in the tab order, arrows move the choice.
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
  const uid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  )

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
  const pill = night ? 'bg-glow' : 'bg-pick'
  const on = night ? 'text-night' : 'text-on-pick'
  const off = night ? 'text-on-night-2 hover:text-on-night' : 'text-ink-2 hover:text-ink'
  // Touch screens get the 44px target of the HIG; a mouse keeps the tighter row.
  const height = size === 'lg' ? 'min-h-12 px-5 text-[15px]' : 'min-h-10 px-4 text-[14px] pointer-coarse:min-h-11'

  return (
    <LayoutGroup id={uid}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKey}
        className={`${stretch || stack ? 'flex w-full' : 'inline-flex max-w-full'} gap-1 overflow-x-auto border p-1 no-scrollbar ${
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
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(o.id)}
              className={`relative flex shrink-0 font-medium transition-colors duration-200 ${height} ${
                stack
                  ? 'flex-row items-center justify-between gap-3 rounded-[19px] py-2 text-left sm:flex-auto sm:flex-col sm:justify-center sm:gap-0 sm:rounded-full sm:py-1.5 sm:text-center'
                  : `flex-col items-center justify-center rounded-full py-1.5 ${stretch ? 'flex-auto' : ''}`
              } ${active ? on : off}`}
            >
              {active && (
                <motion.span
                  layoutId="seg-pill"
                  className={`absolute inset-0 ${stack ? 'rounded-[19px] sm:rounded-full' : 'rounded-full'} ${pill}`}
                  transition={SPRING.ui}
                  aria-hidden
                />
              )}
              <span className="relative leading-tight whitespace-nowrap">{o.label}</span>
              {o.sub && (
                <span
                  className={`relative font-mono text-[11px] leading-tight font-normal whitespace-nowrap ${stack ? 'sm:mt-0.5' : 'mt-0.5'} ${
                    active ? (night ? 'text-night/70' : 'text-on-pick-2') : night ? 'text-on-night-3' : 'text-ink-3'
                  }`}
                >
                  {o.sub}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
