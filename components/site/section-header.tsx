import type { ReactNode } from 'react'
import { Reveal } from './reveal'
import { SplitHeading } from './split-heading'

type Props = {
  id: string
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  night?: boolean
  className?: string
}

/** Eyebrow, split headline and a short lede. */
export function SectionHeader({ id, eyebrow, title, lede, align = 'left', night = false, className = '' }: Props) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-[54rem] ${className}`}>
      <Reveal y={10} blur={false}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <SplitHeading id={id} className={`h2 mt-5 ${center ? 'mx-auto' : ''}`}>
        {title}
      </SplitHeading>
      {lede && (
        <Reveal delay={0.15} y={14}>
          <p className={`lede mt-6 ${center ? 'mx-auto' : ''} max-w-[44rem] ${night ? 'text-on-night-2' : ''}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  )
}
