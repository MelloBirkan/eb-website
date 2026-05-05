'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties, type HTMLAttributes } from 'react'

type Tint = 'light' | 'strong' | 'dark'

type LiquidGlassProps = {
  children: ReactNode
  tint?: Tint
  interactive?: boolean
  specular?: boolean
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'aside' | 'a'
  href?: string
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'>

/**
 * LiquidGlass — Apple-grade frosted surface.
 * Multi-layer translucency, cursor-tracked specular highlight, squircle radius.
 */
export function LiquidGlass({
  children,
  tint = 'light',
  interactive = false,
  specular = false,
  className = '',
  style,
  as = 'div',
  href,
  ...rest
}: LiquidGlassProps) {
  const ref = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!specular) return
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const onMove = (e: MouseEvent) => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 100
        const my = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--mx', `${mx}%`)
        el.style.setProperty('--my', `${my}%`)
        rafRef.current = null
      })
    }
    el.addEventListener('mousemove', onMove)
    return () => {
      el.removeEventListener('mousemove', onMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [specular])

  const classes = [
    'eb-glass',
    tint === 'strong' && 'eb-glass--strong',
    tint === 'dark' && 'eb-glass--dark',
    'eb-glass--inset',
    specular && 'eb-glass--specular',
    interactive && 'eb-glass--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = as as 'div'
  const elementProps = {
    ref: ref as React.RefObject<HTMLDivElement>,
    className: classes,
    style,
    ...(href ? { href } : {}),
    ...rest,
  }

  return <Tag {...elementProps}>{children}</Tag>
}
