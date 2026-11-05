'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowDown } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { useReducedMotion } from '../use-reduced-motion'
import { Segmented } from './segmented'

type StateId = 'planejar' | 'analisar' | 'validar' | 'corrigir'

const INPUTS = [
  { id: 'intent', label: 'Sua intenção', hint: 'um pedido curto' },
  { id: 'code', label: 'Projeto SwiftUI', hint: 'arquivos, telas e componentes' },
  { id: 'corpus', label: 'Corpus', hint: '49 cláusulas com fonte' },
  { id: 'report', label: 'Relatório', hint: 'salvo em .evenbetter/' },
]

const OUTPUTS = [
  { id: 'questions', label: 'Perguntas para você', hint: 'opções fechadas' },
  { id: 'plan', label: 'Plano e tarefas', hint: 'com critérios de aceite' },
  { id: 'report', label: 'Relatório HTML', hint: 'achados com evidência' },
  { id: 'code', label: 'Correções no código', hint: 'só os ajustes técnicos' },
]

const STATES: {
  id: StateId
  label: string
  skill: string
  reads: string[]
  writes: string[]
  does: string
  report?: string
  later?: boolean
}[] = [
  {
    id: 'planejar',
    label: 'Planejar',
    skill: 'evenbetter-ios-feature · epic',
    reads: ['intent'],
    writes: ['questions', 'plan'],
    does: 'Transforma o pedido numa entrevista com opções fechadas e num plano com as decisões registradas.',
  },
  {
    id: 'analisar',
    label: 'Analisar',
    skill: 'evenbetter-analyze',
    reads: ['code', 'corpus'],
    writes: ['report'],
    does: 'Liga cada problema a um arquivo, uma linha e uma cláusula. Achado que não se confirma na fonte oficial sai.',
    report: 'cria a lista de achados',
  },
  {
    id: 'validar',
    label: 'Validar',
    skill: 'evenbetter-validate',
    reads: ['report', 'code', 'corpus'],
    writes: ['report'],
    does: 'Reabre o relatório e confere três coisas: a evidência, a severidade e a cláusula de cada achado.',
    report: 'confirma, ajusta ou remove achados',
  },
  {
    id: 'corrigir',
    label: 'Corrigir',
    skill: 'evenbetter-repair',
    reads: ['report', 'code', 'corpus'],
    writes: ['code', 'questions', 'report'],
    does: 'Só roda sobre um relatório validado. Aplica os ajustes técnicos e devolve como pergunta o que depende da intenção do produto.',
    report: 'marca o que foi aplicado e o que ficou com você',
    later: true,
  },
]

// Rows are 64px tall with 12px gaps, so connector ends can be computed instead of measured.
const ROW = 64
const GAP = 12
const H = ROW * 4 + GAP * 3
const MID = H / 2
const yOf = (i: number) => i * (ROW + GAP) + ROW / 2
const W = 56

// SMIL counts `begin="0.3s"` from page load, so a dot mounted later (on
// scroll or on a state change) would already be over. Each dot starts its own
// animations when it mounts, and stays hidden until then.
const startDot = (delay: number) => (el: SVGCircleElement | null) => {
  el?.querySelectorAll<SVGAnimationElement>('set, animateMotion').forEach((a) => a.beginElementAt(delay))
}
const startIn = startDot(0.3)
const startOut = startDot(0.7)

function Connectors({ side, active, run }: { side: 'in' | 'out'; active: boolean[]; run: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.5 })
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="overflow-visible" aria-hidden>
      {active.map((on, i) => {
        const y = yOf(i)
        const d = side === 'in' ? `M0 ${y} C ${W / 2} ${y}, ${W / 2} ${MID}, ${W} ${MID}` : `M0 ${MID} C ${W / 2} ${MID}, ${W / 2} ${y}, ${W} ${y}`
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="var(--s-line-2)" strokeWidth="1.5" strokeDasharray="3 4" />
            <motion.path
              d={d}
              fill="none"
              stroke="var(--s-brand)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: on ? (side === 'in' ? 0.05 : 0.35) + i * 0.05 : 0 }}
            />
            {on && seen && !reduce && (
              <circle key={run} ref={side === 'in' ? startIn : startOut} r="3" fill="var(--s-brand)" visibility="hidden">
                <set attributeName="visibility" to="visible" begin="indefinite" />
                <animateMotion dur="1.4s" repeatCount="3" begin="indefinite" path={d} fill="freeze" />
              </circle>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Node({ label, hint, on, align }: { label: string; hint: string; on: boolean; align: 'left' | 'right' }) {
  return (
    <motion.div
      animate={{ opacity: on ? 1 : 0.42, scale: on ? 1 : 0.98 }}
      transition={SPRING.ui}
      className={`flex min-h-16 flex-col justify-center rounded-2xl border px-4 py-2.5 transition-colors duration-300 lg:h-16 lg:py-0 ${
        on ? 'border-brand/40 bg-mint/50' : 'border-line bg-card'
      } ${align === 'right' ? 'lg:text-right' : ''}`}
    >
      <p className="text-[14.5px] leading-tight font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3 lg:truncate">{hint}</p>
    </motion.div>
  )
}

/** What each workflow state reads and writes. Same model, different procedure. */
export function Architecture() {
  const [id, setId] = useState<StateId>('analisar')
  const s = STATES.find((x) => x.id === id) ?? STATES[0]
  const ins = INPUTS.map((n) => s.reads.includes(n.id))
  const outs = OUTPUTS.map((n) => s.writes.includes(n.id))

  const center = (
    <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-night p-5 text-on-night shadow-[0_30px_70px_-35px_rgba(5,14,13,.75)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.12em] text-on-night-3 uppercase">Agente de IA</p>
        <p className="font-mono text-[11px] text-on-night-3">Claude Code · Codex</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mt-4 flex flex-1 flex-col"
        >
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-3 py-1 font-mono text-[12.5px] text-glow">
            {s.skill}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-on-night">{s.does}</p>
          <div className="mt-auto pt-4">
            {s.report && (
              <p className="text-[13px] leading-snug text-on-night-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-on-night-3 uppercase">No relatório: </span>
                {s.report}
              </p>
            )}
            {s.later && (
              <p className="mt-2 font-mono text-[11px] text-glow/80">Etapa com skill própria desde setembro de 2026</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  return (
    <div className="mt-12">
      <Segmented<StateId>
        label="Etapa do fluxo"
        value={id}
        onChange={setId}
        options={STATES.map((x) => ({ id: x.id, label: x.label }))}
      />

      {/* Wide screens: inputs, connectors, agent, connectors, outputs. */}
      <div className="mt-8 hidden items-stretch lg:grid lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1.25fr)_56px_minmax(0,1fr)]">
        <div>
          <p className="mb-3 font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Lê</p>
          <div className="grid gap-3">
            {INPUTS.map((n, i) => (
              <Node key={n.id} label={n.label} hint={n.hint} on={ins[i]} align="left" />
            ))}
          </div>
        </div>
        <div className="pt-[30px]">
          <Connectors side="in" active={ins} run={id} />
        </div>
        <div className="pt-[30px]" style={{ height: H + 30 }}>
          {center}
        </div>
        <div className="pt-[30px]">
          <Connectors side="out" active={outs} run={id} />
        </div>
        <div>
          <p className="mb-3 text-right font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Escreve</p>
          <div className="grid gap-3">
            {OUTPUTS.map((n, i) => (
              <Node key={n.id} label={n.label} hint={n.hint} on={outs[i]} align="right" />
            ))}
          </div>
        </div>
      </div>

      {/* Phones and tablets: the same flow, top to bottom. */}
      <div className="mt-7 grid gap-3 lg:hidden">
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Lê</p>
        <div className="grid grid-cols-2 gap-2">
          {INPUTS.map((n, i) => (
            <Node key={n.id} label={n.label} hint={n.hint} on={ins[i]} align="left" />
          ))}
        </div>
        <ArrowDown size={18} className="mx-auto text-brand" />
        <div className="min-h-[230px]">{center}</div>
        <ArrowDown size={18} className="mx-auto text-brand" />
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-ink-3 uppercase">Escreve</p>
        <div className="grid grid-cols-2 gap-2">
          {OUTPUTS.map((n, i) => (
            <Node key={n.id} label={n.label} hint={n.hint} on={outs[i]} align="left" />
          ))}
        </div>
      </div>
    </div>
  )
}
