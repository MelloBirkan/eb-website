'use client'

import { useInView } from 'motion/react'
import { AnimateNumber } from 'motion-plus/react'
import { useRef } from 'react'

type Props = {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
  /** Seconds to wait after the number scrolls into view. */
  delay?: number
}

/** A number that rolls up from zero, digit by digit, when it scrolls into view. */
export function Count({ value, decimals = 0, suffix, prefix, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const label = `${prefix ?? ''}${value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix ?? ''}`

  return (
    <span ref={ref} className={`num inline-flex ${className}`}>
      <span className="sr-only">{label}</span>
      <AnimateNumber
        aria-hidden
        locales="pt-BR"
        format={{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
        suffix={suffix}
        prefix={prefix}
        transition={{ type: 'spring', visualDuration: 1.1, bounce: 0.12, delay }}
      >
        {inView ? value : 0}
      </AnimateNumber>
    </span>
  )
}
