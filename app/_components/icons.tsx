/* Server-safe icon + logo primitives — no JS, no client boundary. */

export function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'search':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...p}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      )
    case 'arrow-down-right':
      return (
        <svg {...p}>
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...p}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      )
    case 'check':
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg {...p}>
          <path d="M12 3 L13.5 8.5 L19 10 L13.5 11.5 L12 17 L10.5 11.5 L5 10 L10.5 8.5 Z" />
          <path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
        </svg>
      )
    default:
      return null
  }
}

export const Logo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 19 L11 13 L13 15 L19 7"
      stroke="#1f4e4a"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 7 L19 7 L19 12"
      stroke="#1f4e4a"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
