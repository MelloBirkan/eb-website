/** A citation marker like the paper's: [9] or [23, 25], each number linking to the reference list. */
export function Cite({ n, className = '' }: { n: number | number[]; className?: string }) {
  const list = Array.isArray(n) ? n : [n]
  return (
    <span className={`cite ${className}`}>
      [
      {list.map((k, i) => (
        <span key={k}>
          {i > 0 && ', '}
          <a href={`#ref-${k}`} className="hover:text-brand" aria-label={`Referência ${k}`}>
            {k}
          </a>
        </span>
      ))}
      ]
    </span>
  )
}
