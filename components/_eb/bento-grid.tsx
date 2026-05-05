import type { CSSProperties, ReactNode } from 'react'

type BentoGridProps = {
  children: ReactNode
  /** A grid-template-areas string (lines separated by `|` or array). */
  areas: string | string[]
  /** Column template, e.g. "1.6fr 1fr". */
  columns?: string
  /** Row template, e.g. "auto auto". */
  rows?: string
  className?: string
  style?: CSSProperties
}

/**
 * BentoGrid — small wrapper around grid-template-areas.
 * Children declare their cell via `style={{ gridArea: 'X' }}` or pass `area` to BentoCell.
 * Collapses to 1-col under 940px (handled by .eb-bento media query).
 */
export function BentoGrid({
  children,
  areas,
  columns = '1fr',
  rows = 'auto',
  className = '',
  style,
}: BentoGridProps) {
  const templateAreas =
    typeof areas === 'string'
      ? areas
      : areas.map((a) => `"${a}"`).join(' ')
  const finalAreas =
    typeof areas === 'string' && !areas.includes('"')
      ? `"${areas}"`
      : templateAreas
  return (
    <div
      className={`eb-bento ${className}`.trim()}
      style={{
        gridTemplateAreas: finalAreas,
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

type BentoCellProps = {
  area: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function BentoCell({ area, children, className = '', style }: BentoCellProps) {
  return (
    <div className={className} style={{ gridArea: area, ...style }}>
      {children}
    </div>
  )
}
