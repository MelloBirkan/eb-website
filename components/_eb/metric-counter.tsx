'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

type MetricCounterProps = {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  /** Format function for display. */
  format?: (n: number) => string
}

/**
 * MetricCounter — counts from 0 to `value` when scrolled into view.
 * Honors prefers-reduced-motion (jumps straight to value).
 */
export function MetricCounter({
  value,
  duration = 1400,
  suffix = '',
  prefix = '',
  className,
  format,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // Single jump to final value when reduced motion is on; not a cascade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const elapsed = t - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 5) // ease-out-quint
      setN(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  const display = format ? format(n) : `${n}`
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
