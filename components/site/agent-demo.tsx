'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { AnimateNumber, Typewriter } from 'motion-plus/react'
import { useEffect, useRef, useState } from 'react'
import { Check } from './icons'
import { SPRING } from './motion'

type Phase = 'prompt' | 'scan' | 'report' | 'validate' | 'done'

const LOGS = [
  'Lendo o projeto SwiftUI',
  'Carregando o corpus: 49 cláusulas, 7 domínios',
  'Conferindo cada achado no HIG e na WCAG 2.2',
  'Relatório salvo em .evenbetter/',
]

// The two findings shown in Fig. 2 of the paper (Aroma Care report).
const FINDINGS = [
  {
    clause: 'TYPO-UI-001',
    title: 'Fonte com tamanho fixo. Use os estilos de texto do sistema.',
    file: 'OnboardingView.swift:287',
  },
  {
    clause: 'CLR-UI-002',
    title: 'Color.black e Color.white no texto principal. Use cores semânticas.',
    file: 'OnboardingView.swift:411',
  },
]

const SEVERITIES = [
  { label: 'Crítico', value: 15, tone: 'text-crit-n', bar: 'bg-crit-n' },
  { label: 'Alto', value: 40, tone: 'text-high-n', bar: 'bg-high-n' },
  { label: 'Médio', value: 0, tone: 'text-med-n', bar: 'bg-med-n' },
  { label: 'Baixo', value: 0, tone: 'text-low-n', bar: 'bg-low-n' },
]

const ORDER: Phase[] = ['prompt', 'scan', 'report', 'validate', 'done']
const reached = (phase: Phase, target: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(target)

/**
 * The hero demo: an agent runs evenbetter-analyze on the Aroma Care app from
 * the study, the HTML report fills in, then evenbetter-validate confirms it.
 * Loops while visible; the button pauses it.
 */
export function AgentDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState<Phase>('prompt')
  const [logs, setLogs] = useState(0)
  const [typedValidate, setTypedValidate] = useState(false)
  const [validated, setValidated] = useState(0)

  const still = !!reduce
  const running = playing && inView && !still

  // Reduced motion: show the finished state and hold it.
  const view = still
    ? { phase: 'validate' as Phase, logs: LOGS.length, typedValidate: true, validated: FINDINGS.length }
    : { phase, logs, typedValidate, validated }

  useEffect(() => {
    if (!running) return
    let t: ReturnType<typeof setTimeout> | undefined
    if (phase === 'scan') {
      t = logs < LOGS.length ? setTimeout(() => setLogs((n) => n + 1), 620) : setTimeout(() => setPhase('report'), 500)
    } else if (phase === 'report') {
      t = setTimeout(() => setPhase('validate'), 2900)
    } else if (phase === 'validate' && typedValidate) {
      t =
        validated < FINDINGS.length
          ? setTimeout(() => setValidated((n) => n + 1), 520)
          : setTimeout(() => setPhase('done'), 2600)
    } else if (phase === 'done') {
      t = setTimeout(() => {
        setLogs(0)
        setValidated(0)
        setTypedValidate(false)
        setPhase('prompt')
        setCycle((c) => c + 1)
      }, 700)
    }
    return () => clearTimeout(t)
  }, [running, phase, logs, typedValidate, validated])

  const showReport = reached(view.phase, 'report') && view.phase !== 'done'
  const isValidated = view.validated === FINDINGS.length

  return (
    <div ref={ref} className="relative">
      <figure
        className="relative overflow-hidden rounded-[26px] border border-white/10 bg-night text-on-night shadow-[0_1px_0_rgba(255,255,255,.08)_inset,0_50px_120px_-40px_rgba(5,14,13,.75),0_0_0_1px_rgba(5,14,13,.4)]"
        aria-label="Demonstração: o agente roda evenbetter-analyze no app Aroma Care e gera um relatório com 55 achados, 15 críticos e 40 altos. Depois, evenbetter-validate confirma os achados."
        role="img"
      >
        <div aria-hidden className="grid md:grid-cols-[0.92fr_1.08fr]">
          {/* Terminal pane */}
          <div className="flex min-h-[300px] flex-col border-b border-white/8 md:min-h-[440px] md:border-r md:border-b-0">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[12.5px] text-on-night-3">claude · ~/AromaCare</span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 font-mono text-[13.5px] leading-relaxed md:p-6">
              <PromptLine
                key={`a-${cycle}`}
                command="/evenbetter-ios:evenbetter-analyze"
                play={running && view.phase === 'prompt'}
                instant={still}
                onDone={() => setPhase('scan')}
              />
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {LOGS.slice(0, view.logs).map((line, i) => {
                    const done = i < view.logs - 1 || reached(view.phase, 'report')
                    return (
                      <motion.li
                        key={line}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={SPRING.ui}
                        className="flex items-start gap-2.5 text-on-night-2"
                      >
                        <span className="mt-[3px] grid size-4 shrink-0 place-items-center">
                          {done ? (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING.lively}>
                              <Check size={15} className="text-glow" />
                            </motion.span>
                          ) : (
                            <span className="size-3 animate-spin rounded-full border-2 border-on-night-3 border-t-glow" />
                          )}
                        </span>
                        <span>{line}</span>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
              {reached(view.phase, 'validate') && (
                <div className="mt-1">
                  <PromptLine
                    key={`v-${cycle}`}
                    command="/evenbetter-ios:evenbetter-validate"
                    play={running && view.phase === 'validate' && !view.typedValidate}
                    instant={still}
                    onDone={() => setTypedValidate(true)}
                  />
                  <AnimatePresence>
                    {view.typedValidate && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING.ui}
                        className="mt-2 flex items-center gap-2.5 text-on-night-2"
                      >
                        <span className="grid size-4 place-items-center">
                          {isValidated ? (
                            <Check size={15} className="text-glow" />
                          ) : (
                            <span className="size-3 animate-spin rounded-full border-2 border-on-night-3 border-t-glow" />
                          )}
                        </span>
                        {isValidated ? 'Evidência, severidade e cláusula conferidas' : 'Relendo cada achado no código'}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Report pane */}
          <div className="relative flex min-h-[340px] flex-col bg-night-2/60 md:min-h-[440px]">
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
              <span className="truncate rounded-full bg-white/6 px-3 py-1 font-mono text-[12px] text-on-night-3">
                .evenbetter/aroma-care/evenbetter-analyze-report.html
              </span>
            </div>
            <div className="relative flex-1 p-4 md:p-5">
              <AnimatePresence mode="wait">
                {showReport ? (
                  <motion.div
                    key={`report-${cycle}`}
                    initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={SPRING.gentle}
                    className="space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div>
                        <p className="font-mono text-[11.5px] tracking-[0.14em] text-on-night-3 uppercase">Total de achados</p>
                        <AnimateNumber
                          className="num mt-1 block text-[52px] leading-none font-semibold tracking-[-0.04em]"
                          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                        >
                          {55}
                        </AnimateNumber>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className="font-mono text-[12px] text-on-night-3">Aroma Care · SwiftUI</span>
                        <AnimatePresence>
                          {isValidated && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={SPRING.lively}
                              className="inline-flex items-center gap-1.5 rounded-full bg-glow px-3 py-1 text-[12.5px] font-semibold text-night"
                            >
                              <Check size={13} /> Validado
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {SEVERITIES.map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...SPRING.ui, delay: 0.15 + i * 0.07 }}
                          className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                        >
                          <span className={`absolute inset-y-0 left-0 w-[3px] ${s.bar}`} />
                          <AnimateNumber className={`num block text-[22px] leading-tight font-semibold ${s.tone}`}>
                            {s.value}
                          </AnimateNumber>
                          <span className={`font-mono text-[11px] tracking-[0.08em] uppercase ${s.tone}`}>{s.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    <ul className="space-y-2">
                      {FINDINGS.map((f, i) => (
                        <motion.li
                          key={f.clause}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...SPRING.gentle, delay: 0.55 + i * 0.25 }}
                          className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] py-2.5 pr-3 pl-4"
                        >
                          <span className="absolute inset-y-0 left-0 w-[3px] bg-high-n" />
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md border border-high-n/50 px-1.5 py-px font-mono text-[11px] font-semibold text-high-n">
                              ALTO
                            </span>
                            <span className="rounded-md bg-white/6 px-1.5 py-px font-mono text-[11px] text-on-night-2">
                              {f.clause}
                            </span>
                            <AnimatePresence>
                              {view.validated > i && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.6, x: -4 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={SPRING.lively}
                                  className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-glow"
                                >
                                  <Check size={12} /> confirmado
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <p className="mt-1.5 text-[13.5px] leading-snug text-on-night">{f.title}</p>
                          <p className="mt-0.5 font-mono text-[11.5px] text-on-night-3">{f.file}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${cycle}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[280px] flex-col justify-center gap-3"
                  >
                    {[0.9, 0.6, 0.75, 0.45].map((w, i) => (
                      <motion.span
                        key={i}
                        className="h-3 rounded-full bg-white/[0.06]"
                        style={{ width: `${w * 100}%` }}
                        animate={running ? { opacity: [0.4, 0.9, 0.4] } : undefined}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                    <p className="mt-2 font-mono text-[12px] text-on-night-3">O relatório aparece aqui.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </figure>

      {!still && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="absolute top-2.5 right-3 z-10 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 font-mono text-[11.5px] text-on-night-2 backdrop-blur transition-colors hover:bg-white/14 hover:text-on-night focus-visible:outline-glow"
        >
          {playing ? (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <rect x="1.5" y="1" width="2.4" height="8" rx="0.8" fill="currentColor" />
                <rect x="6.1" y="1" width="2.4" height="8" rx="0.8" fill="currentColor" />
              </svg>
              Pausar
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M2 1.2v7.6a.6.6 0 0 0 .9.5l6-3.8a.6.6 0 0 0 0-1L2.9.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
              Continuar
            </>
          )}
        </button>
      )}
    </div>
  )
}

function PromptLine({
  command,
  play,
  instant,
  onDone,
}: {
  command: string
  play: boolean
  instant: boolean
  onDone: () => void
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-on-night">
      <span className="text-glow">›</span>
      {instant ? (
        <span>{command}</span>
      ) : (
        <Typewriter
          as="span"
          speed={38}
          play={play}
          onComplete={onDone}
          cursorStyle={{ background: 'var(--s-glow)', width: 7, opacity: play ? 1 : 0 }}
          cursorBlinkRepeat={2}
        >
          {command}
        </Typewriter>
      )}
    </p>
  )
}
