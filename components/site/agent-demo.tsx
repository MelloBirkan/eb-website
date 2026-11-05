'use client'

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import { AnimateNumber, Typewriter } from 'motion-plus/react'
import { useEffect, useRef, useState } from 'react'
import { Check, PauseGlyph, PlayGlyph } from './icons'
import { SPRING } from './motion'
import { useReducedMotion } from './use-reduced-motion'

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

  // Phones show one pane at a time, side by side in a row you can swipe.
  // The row follows the agent: the terminal while it types, the report once there is one.
  const paneRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: paneRef })
  const pillX = useTransform(scrollXProgress, [0, 1], ['0%', '100%'])
  const [shownPane, setShownPane] = useState(0)
  useMotionValueEvent(scrollXProgress, 'change', (p) => setShownPane(p > 0.5 ? 1 : 0))

  const wantPane = still
    ? 1
    : view.phase === 'report' || (view.phase === 'validate' && view.typedValidate)
      ? 1
      : 0

  function showPane(i: number, smooth = true) {
    const el = paneRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth && !still ? 'smooth' : 'auto' })
  }

  useEffect(() => {
    if (!running && !still) return
    showPane(wantPane)
    // showPane only reads the ref; the pane to show is all that matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantPane, running, still])

  return (
    <div ref={ref} className="relative">
      <figure
        className="relative overflow-hidden rounded-[26px] border border-white/10 bg-night text-on-night shadow-[0_1px_0_rgba(255,255,255,.08)_inset,0_50px_120px_-40px_rgba(5,14,13,.75),0_0_0_1px_rgba(5,14,13,.4)]"
        aria-label="Demonstração: o agente roda evenbetter-analyze no app Aroma Care e gera um relatório com 55 achados, 15 críticos e 40 altos. Depois, evenbetter-validate confirma os achados."
        role="img"
      >
        <div aria-hidden>
          {/* Phones: one window bar, with the two panes as tabs. */}
          <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-white/8 px-4 md:hidden">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </span>
            <div className="relative grid grid-cols-2 rounded-full bg-white/[0.06] p-1 font-mono text-[12px]">
              <motion.span
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white/12"
                style={{ x: pillX }}
              />
              {['Terminal', 'Relatório'].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  tabIndex={-1}
                  onClick={() => showPane(i)}
                  className={`hit relative h-8 rounded-full px-3.5 transition-colors duration-200 ${
                    shownPane === i ? 'text-on-night' : 'text-on-night-3'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span />
          </div>
          <div
            ref={paneRef}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:grid md:snap-none md:grid-cols-[0.92fr_1.08fr] md:overflow-visible"
          >
            {/* Terminal pane */}
            <div className="flex min-h-[476px] w-full shrink-0 snap-start flex-col md:min-h-[440px] md:w-auto md:border-r md:border-white/8">
              <div className="hidden items-center gap-2 border-b border-white/8 px-4 py-3 md:flex">
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
            <div className="relative flex min-h-[476px] w-full shrink-0 snap-start flex-col bg-night-2/60 md:min-h-[440px] md:w-auto">
              <div className="hidden items-center gap-2 border-b border-white/8 px-4 py-3 md:flex">
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
                          <p className="font-mono text-[12px] tracking-[0.1em] whitespace-nowrap text-on-night-3 uppercase sm:text-[11.5px] sm:tracking-[0.14em]">
                            Total de achados
                          </p>
                          <AnimateNumber
                            className="num mt-1 block text-[44px] leading-none font-semibold tracking-[-0.04em] sm:text-[52px]"
                            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                          >
                            {55}
                          </AnimateNumber>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                          <span className="hidden font-mono text-[12px] text-on-night-3 sm:inline">Aroma Care · SwiftUI</span>
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
                            <span className={`block font-mono text-[11px] tracking-[0.08em] uppercase ${s.tone}`}>{s.label}</span>
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
                          animate={running ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.4 }}
                          transition={running ? { duration: 1.6, repeat: Infinity, delay: i * 0.15 } : { duration: 0.3 }}
                        />
                      ))}
                      <p className="mt-2 font-mono text-[12px] text-on-night-3">O relatório aparece aqui.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </figure>

      {!still && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pausar a demonstração' : 'Continuar a demonstração'}
          className="hit absolute top-2.5 right-3 z-10 inline-flex size-9 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/8 font-mono text-[12px] text-on-night-2 backdrop-blur transition-[background-color,color,scale] hover:bg-white/14 hover:text-on-night focus-visible:outline-glow active:scale-95 md:h-8 md:w-auto md:px-3"
        >
          {playing ? <PauseGlyph size={10} /> : <PlayGlyph size={10} />}
          <span aria-hidden className="hidden md:inline">
            {playing ? 'Pausar' : 'Continuar'}
          </span>
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
