/* SVG illustrations — pure server components (no JS, no state). */

export const HeroIllo = () => (
  <svg viewBox="0 0 460 360" fill="none" aria-hidden>
    <ellipse cx="230" cy="180" rx="200" ry="130" fill="#a9d4c4" opacity="0.18" />
    <g>
      <rect x="120" y="80" width="240" height="200" rx="22" fill="white" opacity="0.92" />
      <rect x="120" y="80" width="240" height="200" rx="22" stroke="#a9d4c4" strokeWidth="1" opacity="0.5" />
      <rect x="138" y="100" width="60" height="10" rx="5" fill="#1f4e4a" />
      <rect x="138" y="118" width="180" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="130" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="150" width="180" height="62" rx="14" fill="#a9d4c4" opacity="0.45" />
      <rect x="152" y="164" width="120" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="178" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="192" width="80" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="138" y="226" width="92" height="32" rx="16" fill="#1f4e4a" />
      <rect x="156" y="238" width="42" height="6" rx="3" fill="#b6efd9" />
      <circle cx="216" cy="242" r="3" fill="#b6efd9" />
    </g>
    <g transform="translate(40 100)">
      <rect width="92" height="40" rx="14" fill="#0f2825" stroke="#a9d4c4" strokeOpacity="0.2" />
      <text x="14" y="25" fontFamily="ui-monospace, monospace" fontSize="13" fill="#b6efd9" fontWeight="600">@eb</text>
      <rect x="52" y="16" width="28" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.7" />
      <rect x="52" y="23" width="18" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.4" />
    </g>
    <g transform="translate(330 240)">
      <rect width="96" height="36" rx="18" fill="#b6efd9" stroke="white" />
      <circle cx="18" cy="18" r="5" fill="#1f4e4a" />
      <text x="30" y="23" fontFamily="ui-monospace, monospace" fontSize="12" fill="#1f4e4a" fontWeight="700">✓ pronto</text>
    </g>
    <circle cx="230" cy="180" r="160" stroke="#a9d4c4" strokeWidth="1.5" strokeDasharray="2 7" opacity="0.4" />
    <circle cx="60" cy="200" r="8" fill="#1f4e4a" opacity="0.3" />
    <circle cx="60" cy="200" r="3" fill="#1f4e4a" />
    <circle cx="410" cy="100" r="4" fill="#1f4e4a" opacity="0.5" />
    <circle cx="380" cy="320" r="3" fill="#1f4e4a" opacity="0.5" />
    <circle cx="100" cy="60" r="2" fill="#1f4e4a" opacity="0.6" />
  </svg>
)

export const AgentIllo = ({ kind, dark }: { kind: string; dark?: boolean }) => {
  const stroke = dark ? '#a9d4c4' : '#266b65'
  const fill = dark ? '#a9d4c4' : '#266b65'
  const centerFill = dark ? '#1f4e4a' : 'white'
  if (kind === 'codex') return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 30 L162 42 L162 66 L140 78 L118 66 L118 42 Z" fill={fill} />
      <path d="M140 30 L162 42 L140 54 L118 42 Z" fill={fill} opacity="0.7" />
      <circle cx="140" cy="54" r="5" fill={centerFill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 56 L142 60 L140 64 L138 60 Z" fill={fill} />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
  if (kind === 'ios') return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <rect x="116" y="36" width="44" height="44" rx="10" fill={fill} opacity="0.3" />
      <rect x="122" y="44" width="44" height="44" rx="10" fill={fill} opacity="0.6" />
      <rect x="128" y="52" width="44" height="44" rx="10" fill={fill} />
      <path d="M142 72 L149 79 L162 64" stroke={centerFill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden>
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 28 L148 52 L172 60 L148 68 L140 92 L132 68 L108 60 L132 52 Z" fill={fill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 52 L144 58 L140 64 L136 58 Z" fill={fill} opacity="0.8" />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
}
