import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react'

type Counter = { i: number }

/** Plain text of a node, for the heading's accessible name. */
function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/** Wraps every word in a .hero-word span. Inline markup, like the serif italics, keeps its words inside. */
function split(node: ReactNode, n: Counter): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === 'string') {
      return child.split(/(\s+)/).map((part, k) =>
        !part || /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={k} className="hero-word" style={{ '--i': n.i++ } as CSSProperties}>
            {part}
          </span>
        ),
      )
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(child, undefined, split(child.props.children, n))
    }
    return child
  })
}

/** Counts the words split() will make, so long headings can use a shorter stagger. */
function countWords(node: ReactNode): number {
  return textOf(node).trim().split(/\s+/).filter(Boolean).length
}

type Props = {
  as?: 'h1' | 'h2'
  id?: string
  className?: string
  /** Milliseconds before the first word starts. */
  delay?: number
  children: ReactNode
}

/**
 * A page headline whose words rise one after another in CSS (see .hero-word),
 * so it plays with the first paint instead of waiting for JavaScript. Screen
 * readers get the sentence whole from the label.
 */
export function HeroHeading({ as: Tag = 'h1', id, className, delay = 100, children }: Props) {
  const words = countWords(children)
  const step = Math.round(Math.min(60, 600 / Math.max(words, 1)))
  const style = { '--d0': `${delay}ms`, '--step': `${step}ms` } as CSSProperties
  return (
    <Tag id={id} aria-label={textOf(children).replace(/\s+/g, ' ').trim()} className={className} style={style}>
      <span aria-hidden>{split(children, { i: 0 })}</span>
    </Tag>
  )
}

/** Delay, rise and blur for one block of a hero entrance (see .hero-rise in site.css). */
export function HeroRise({
  delay = 0,
  y = 16,
  blur = false,
  className,
  children,
}: {
  delay?: number
  y?: number
  blur?: boolean
  className?: string
  children: ReactNode
}) {
  const style = { '--d': `${delay}ms`, '--y': `${y}px`, '--b': blur ? '8px' : '0px' } as CSSProperties
  return (
    <div className={className ? `hero-rise ${className}` : 'hero-rise'} style={style}>
      {children}
    </div>
  )
}
