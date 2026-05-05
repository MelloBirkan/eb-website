'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'

type Violation = {
  id: string
  num: string
  title: string
  desc: string
  /** Highlight rectangle on the phone canvas (x, y, w, h in viewBox units 0..360 x 0..720). */
  hl: { x: number; y: number; w: number; h: number }
  /** Severity tint for the caption chip. */
  level: 'high' | 'medium' | 'info'
}

const VIOLATIONS: Violation[] = [
  {
    id: 'touch',
    num: '01',
    title: 'Alvo de toque < 44pt',
    desc: 'O ícone "favoritar" tem 32×32pt. WCAG 2.5.5 e a HIG recomendam ao menos 44×44pt para toque confortável.',
    hl: { x: 286, y: 92, w: 40, h: 40 },
    level: 'high',
  },
  {
    id: 'label',
    num: '02',
    title: 'Botão sem accessibilityLabel',
    desc: 'O botão de coração não tem rótulo. VoiceOver lê "botão" sem contexto. Adicione .accessibilityLabel("Favoritar").',
    hl: { x: 286, y: 92, w: 40, h: 40 },
    level: 'high',
  },
  {
    id: 'contrast',
    num: '03',
    title: 'Contraste insuficiente',
    desc: 'O texto secundário oklch(0.65) sobre fundo claro fica em 3.1:1. WCAG AA pede 4.5:1 para texto normal.',
    hl: { x: 32, y: 268, w: 220, h: 20 },
    level: 'high',
  },
  {
    id: 'dynamic',
    num: '04',
    title: 'Sem suporte a Dynamic Type',
    desc: 'O título usa .font(.system(size: 28)). Use .font(.title) para escalar com a preferência do usuário.',
    hl: { x: 32, y: 152, w: 220, h: 36 },
    level: 'medium',
  },
  {
    id: 'order',
    num: '05',
    title: 'Ordem de leitura quebrada',
    desc: 'O preço aparece antes do título visualmente, mas o VoiceOver lê o título primeiro. Use .accessibilitySortPriority.',
    hl: { x: 32, y: 200, w: 296, h: 56 },
    level: 'medium',
  },
  {
    id: 'hang',
    num: '06',
    title: 'Hang de scroll detectado',
    desc: 'A lista re-renderiza a célula inteira a cada update. Estabilize a árvore com .id() e Observation correto.',
    hl: { x: 16, y: 312, w: 328, h: 320 },
    level: 'info',
  },
]

const STEP = 1 / VIOLATIONS.length // each violation owns 1/N of total scroll

function ViolationHighlight({
  v,
  index,
  progress,
}: {
  v: Violation
  index: number
  progress: MotionValue<number>
}) {
  // Each violation fades in around its own step, lingers, fades out into the next.
  const start = index * STEP
  const peak = start + STEP * 0.15
  const fadeOut = start + STEP * 0.85
  const end = (index + 1) * STEP
  const opacity = useTransform(
    progress,
    [start, peak, fadeOut, end],
    index === VIOLATIONS.length - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )
  return (
    <motion.rect
      x={v.hl.x}
      y={v.hl.y}
      width={v.hl.w}
      height={v.hl.h}
      rx={6}
      fill="rgba(38,107,101,0.12)"
      stroke="#266b65"
      strokeWidth={2}
      strokeDasharray="2 4"
      style={{ opacity }}
    />
  )
}

function ViolationCaption({
  v,
  index,
  progress,
}: {
  v: Violation
  index: number
  progress: MotionValue<number>
}) {
  const start = index * STEP
  const peak = start + STEP * 0.15
  const fadeOut = start + STEP * 0.85
  const end = (index + 1) * STEP
  const opacity = useTransform(
    progress,
    [start, peak, fadeOut, end],
    index === VIOLATIONS.length - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )
  const y = useTransform(
    progress,
    [start, peak, fadeOut, end],
    index === VIOLATIONS.length - 1 ? [12, 0, 0, 0] : [12, 0, 0, -12]
  )
  return (
    <motion.div
      style={{ opacity, y }}
      className="eb-theater-caption"
      aria-hidden={index === 0 ? undefined : true}
    >
      <span className={`eb-theater-caption-chip eb-theater-caption-chip--${v.level}`}>
        {v.num} · {v.level === 'high' ? 'alta' : v.level === 'medium' ? 'média' : 'info'}
      </span>
      <h4>{v.title}</h4>
      <p>{v.desc}</p>
    </motion.div>
  )
}

export function AuditTheater() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={sectionRef} className="eb-theater" aria-label="Auditoria de acessibilidade — demonstração">
      <div className="eb-theater-pin">
        <div className="eb-theater-stage">
          {/* Phone canvas */}
          <div className="eb-theater-phone-wrap">
            <PhoneMock>
              {VIOLATIONS.map((v, i) => (
                <ViolationHighlight key={v.id} v={v} index={i} progress={scrollYProgress} />
              ))}
            </PhoneMock>
          </div>

          {/* Caption rail */}
          <div className="eb-theater-rail">
            <div className="eb-theater-eyebrow">
              <span>Audit Theater</span>
              <span className="eb-theater-divider" />
              <span>{VIOLATIONS.length} achados</span>
            </div>
            <div className="eb-theater-captions">
              {VIOLATIONS.map((v, i) => (
                <ViolationCaption key={v.id} v={v} index={i} progress={scrollYProgress} />
              ))}
            </div>
            <ProgressBar progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ['0%', '100%'])
  return (
    <div className="eb-theater-progress">
      <span className="eb-theater-progress-label">Progresso</span>
      <div className="eb-theater-progress-track">
        <motion.div className="eb-theater-progress-fill" style={{ width }} />
      </div>
    </div>
  )
}

function PhoneMock({ children }: { children: React.ReactNode }) {
  // Stylized iOS app: header, hero card, list rows.
  return (
    <svg viewBox="0 0 360 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mock de tela iOS com violações de acessibilidade destacadas">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f1e6" />
          <stop offset="1" stopColor="#e6ece6" />
        </linearGradient>
        <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3f5f1" />
        </linearGradient>
        <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3a37" />
          <stop offset="1" stopColor="#0f2825" />
        </linearGradient>
      </defs>

      {/* Bezel */}
      <rect x="0" y="0" width="360" height="720" rx="48" fill="url(#bezel)" />
      <rect x="6" y="6" width="348" height="708" rx="42" fill="url(#bg)" />
      {/* Notch */}
      <rect x="140" y="14" width="80" height="22" rx="11" fill="#0f2825" />
      {/* Status bar */}
      <text x="28" y="32" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#1f4e4a">9:41</text>
      <g transform="translate(298 22)">
        <rect width="22" height="11" rx="2" fill="none" stroke="#1f4e4a" strokeWidth="1" />
        <rect x="2" y="2" width="14" height="7" rx="1" fill="#1f4e4a" />
      </g>

      {/* Header */}
      <text x="32" y="84" fontFamily="system-ui" fontSize="13" fontWeight="500" fill="#6b8884">Em destaque</text>
      <text x="32" y="116" fontFamily="system-ui" fontSize="22" fontWeight="700" fill="#1f4e4a">Cafés especiais</text>

      {/* Heart button (touch target / label issues) */}
      <g transform="translate(296 102)">
        <circle cx="15" cy="15" r="14" fill="#a9d4c4" />
        <path d="M15 22 C 8 17 6 11 11 9 C 13 8 15 10 15 12 C 15 10 17 8 19 9 C 24 11 22 17 15 22 Z" fill="#1f4e4a" />
      </g>

      {/* Hero card */}
      <rect x="20" y="148" width="320" height="120" rx="20" fill="url(#card)" stroke="#a9d4c4" strokeOpacity="0.4" />
      <text x="32" y="178" fontFamily="system-ui" fontSize="16" fontWeight="700" fill="#1f4e4a">Espresso da semana</text>
      <text x="32" y="200" fontFamily="system-ui" fontSize="13" fontWeight="500" fill="#266b65">Catuaí Amarelo · Caparaó / ES</text>
      <text x="32" y="224" fontFamily="system-ui" fontSize="14" fontWeight="700" fill="#1f4e4a">R$ 38,00</text>
      <rect x="32" y="240" width="80" height="22" rx="11" fill="#1f4e4a" />
      <text x="46" y="255" fontFamily="system-ui" fontSize="10.5" fontWeight="600" fill="#b6efd9" letterSpacing="0.6">COMPRAR</text>

      {/* Light gray subtitle (contrast issue) */}
      <text x="32" y="284" fontFamily="system-ui" fontSize="12" fontWeight="500" fill="#a8b8b3">Frete grátis acima de R$ 60</text>

      {/* List section */}
      <text x="32" y="328" fontFamily="system-ui" fontSize="13" fontWeight="600" fill="#1f4e4a">Produtores em alta</text>
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(20 ${344 + i * 76})`}>
          <rect width="320" height="68" rx="16" fill="#ffffff" stroke="#a9d4c4" strokeOpacity="0.4" />
          <circle cx="44" cy="34" r="22" fill="#a9d4c4" opacity="0.5" />
          <text x="78" y="32" fontFamily="system-ui" fontSize="13" fontWeight="600" fill="#1f4e4a">Fazenda {['Recreio', 'da Lagoa', 'Boa Sorte', 'Nova Esperança'][i]}</text>
          <text x="78" y="50" fontFamily="system-ui" fontSize="11" fontWeight="500" fill="#6b8884">Mococa, SP · 1 200 m</text>
          <text x="296" y="42" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#266b65" textAnchor="end">SCA 86</text>
        </g>
      ))}

      {/* Tab bar */}
      <rect x="0" y="660" width="360" height="60" fill="#ffffff" />
      <line x1="0" y1="660" x2="360" y2="660" stroke="#a9d4c4" strokeOpacity="0.4" />

      {children}
    </svg>
  )
}
