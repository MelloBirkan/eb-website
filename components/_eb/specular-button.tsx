'use client'

import { useEffect, useRef, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

type Common = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}
type AsButton = Common & { as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>
type AsLink = Common & { as: 'link'; href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
type AsExternal = Common & { as: 'a'; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>

type Props = AsButton | AsLink | AsExternal

function useSpecular() {
  const ref = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
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
  }, [])
  return ref
}

/**
 * SpecularButton — pill CTA with cursor-tracked highlight.
 * Honors prefers-reduced-motion (no mouse listener attached).
 */
export function SpecularButton(props: Props) {
  const ref = useSpecular()
  const variant = props.variant ?? 'primary'
  const classes = ['eb-btn', variant === 'primary' ? 'eb-btn-primary' : 'eb-btn-secondary', props.className]
    .filter(Boolean)
    .join(' ')

  if ('as' in props && props.as === 'link') {
    return (
      <Link
        href={props.href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={classes}
      >
        {props.children}
      </Link>
    )
  }
  if ('as' in props && props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={classes}
      >
        {props.children}
      </a>
    )
  }
  // button
  const buttonProps = props as AsButton
  return (
    <button
      type={buttonProps.type ?? 'button'}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
    >
      {props.children}
    </button>
  )
}
