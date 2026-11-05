import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from './icons'

type Variant = 'primary' | 'secondary' | 'ghost' | 'mint'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[translate,scale,background-color,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand'

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-paper shadow-[0_1px_0_rgba(255,255,255,.12)_inset,0_10px_30px_-12px_rgba(11,26,24,.55)] hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,.12)_inset,0_18px_40px_-14px_rgba(11,26,24,.6)]',
  secondary:
    'border border-line-2 bg-card/70 text-ink backdrop-blur hover:-translate-y-0.5 hover:border-ink/40 hover:bg-card',
  ghost: 'text-ink hover:text-brand',
  mint: 'bg-glow text-[#0b1a18] hover:-translate-y-0.5 hover:bg-white',
}

const sizes = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-6 text-base',
}

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: keyof typeof sizes
  external?: boolean
  icon?: 'arrow' | 'external' | 'none'
  className?: string
}

/** A link styled as a button. The arrow slides forward on hover. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  external = false,
  icon = 'arrow',
  className = '',
}: Props) {
  const Arrow = icon === 'external' ? ArrowUpRight : ArrowRight
  const content = (
    <>
      <span>{children}</span>
      {icon !== 'none' && (
        <Arrow
          size={16}
          className="transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
        />
      )}
    </>
  )
  const cls = `${base} ${variants[variant]} ${variant === 'ghost' ? 'h-auto px-0' : sizes[size]} ${className}`
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  )
}
