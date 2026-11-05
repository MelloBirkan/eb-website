'use client'

import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Check, Close, FileCode, Person } from './icons'
import { SPRING } from './motion'
import { useStages } from './use-stages'

const card = 'rounded-[24px] border border-white/10 bg-night p-5 text-on-night shadow-[0_1px_0_rgba(255,255,255,.06)_inset] md:p-6'

/* ───── 01 Plan ───── */

const PLAN_DELAYS = [700, 1100, 900, 1100, 900, 500, 500, 500]

function Options({ group, items, picked }: { group: string; items: string[]; picked: number | null }) {
  // The id scopes the shared "plan-pick" pill to this question.
  return (
    <LayoutGroup id={group}>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((o, i) => (
          <span
            key={o}
            className={`relative rounded-full border px-3 py-1.5 text-[13.5px] transition-colors duration-300 ${
              picked === i ? 'border-glow text-night' : 'border-white/14 text-on-night-2'
            }`}
          >
            {picked === i && (
              <motion.span layoutId="plan-pick" className="absolute inset-0 rounded-full bg-glow" transition={SPRING.lively} />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {picked === i && <Check size={13} />}
              {o}
            </span>
          </span>
        ))}
      </div>
    </LayoutGroup>
  )
}

export function PlanVisual({ paused }: { paused: boolean }) {
  const s = useStages(PLAN_DELAYS, paused)
  const plan = ['Dynamic Type em todas as telas', 'Rótulo de VoiceOver nos botões de ícone', 'Confirmar antes de excluir uma tarefa']
  return (
    <div className={`${card} flex min-h-[420px] flex-col gap-3`}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING.ui}
        className="ml-auto max-w-[85%] rounded-[18px] rounded-br-md bg-glow px-4 py-2.5 text-[14.5px] leading-snug text-night"
      >
        Planeje um app para organizar a limpeza da casa.
      </motion.p>
      <AnimatePresence>
        {s >= 1 && (
          <motion.div
            key="q1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING.gentle}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <p className="font-mono text-[11.5px] tracking-[0.12em] text-on-night-3 uppercase">Pergunta · público</p>
            <p className="mt-1 text-[15px] font-medium">Quem vai usar o app no dia a dia?</p>
            <Options group="q1" items={['Só eu', 'A casa toda', 'Uma diarista']} picked={s >= 2 ? 1 : null} />
          </motion.div>
        )}
        {s >= 3 && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING.gentle}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <p className="font-mono text-[11.5px] tracking-[0.12em] text-on-night-3 uppercase">Pergunta · estado vazio</p>
            <p className="mt-1 text-[15px] font-medium">O que a lista mostra sem tarefas?</p>
            <Options group="q2" items={['Mensagem e botão de criar', 'Lista em branco']} picked={s >= 4 ? 0 : null} />
          </motion.div>
        )}
        {s >= 5 && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING.gentle}
            className="rounded-2xl border border-glow/30 bg-glow/[0.06] p-4"
          >
            <p className="font-mono text-[11.5px] tracking-[0.12em] text-glow uppercase">Plano · critérios de aceite</p>
            <ul className="mt-2 space-y-1.5">
              {plan.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={s >= 5 + i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={SPRING.ui}
                  className="flex items-center gap-2 text-[14px] text-on-night"
                >
                  <Check size={14} className="text-glow" /> {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───── 02 Analyze ───── */

const CODE = [
  { n: 12, code: 'struct FavoriteRow: View {', indent: 0 },
  { n: 13, code: 'var body: some View {', indent: 1 },
  { n: 14, code: 'HStack {', indent: 2 },
  { n: 15, code: 'Text("Lavanda")', indent: 3 },
  { n: 16, code: '.font(.system(size: 13))', indent: 4, flag: { id: 'TYPO-UI-001', text: 'Use os estilos de texto do sistema', sev: 'high' } },
  { n: 17, code: 'Image(systemName: "heart")', indent: 3, flag: { id: 'A11Y-UI-001', text: 'Botão de ícone sem rótulo', sev: 'crit' } },
  { n: 18, code: '.onTapGesture { favoritar() }', indent: 4, flag: { id: 'COMP-UI-001', text: 'Use Button, não onTapGesture', sev: 'med' } },
  { n: 19, code: '}', indent: 2 },
]

const SEV_TONE: Record<string, string> = {
  crit: 'border-crit-n/50 text-crit-n',
  high: 'border-high-n/50 text-high-n',
  med: 'border-med-n/50 text-med-n',
}

export function AnalyzeVisual({ paused }: { paused: boolean }) {
  const s = useStages([500, 500, 500, 500, 650, 650, 650, 500], paused)
  // The scan line sits on CODE[s - 1] while it moves.
  const scanned = Math.min(s, CODE.length)
  return (
    <div className={`${card} min-h-[420px]`}>
      <div className="flex items-center gap-2 text-on-night-3">
        <FileCode size={15} />
        <span className="font-mono text-[12.5px]">Views/FavoriteRow.swift</span>
      </div>
      <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/8 bg-black/25 py-3 font-mono text-[11.5px] leading-[2] [--ind:9px] sm:text-[13px] sm:[--ind:14px]">
        <motion.span
          aria-hidden
          className="absolute inset-x-0 h-[26px] bg-glow/10 shadow-[inset_2px_0_0_var(--s-glow)]"
          animate={{ top: 12 + Math.max(0, scanned - 1) * 26, opacity: s >= CODE.length + 1 ? 0 : 1 }}
          transition={SPRING.ui}
        />
        {CODE.map((l, i) => (
          <div key={l.n} className="relative flex items-center gap-3 px-3 whitespace-nowrap" style={{ height: 26 }}>
            <span className="w-5 shrink-0 text-right text-on-night-3/70">{l.n}</span>
            <span className={i < scanned ? 'text-on-night' : 'text-on-night-3'} style={{ paddingLeft: `calc(var(--ind) * ${l.indent})` }}>
              {l.code}
            </span>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        <AnimatePresence>
          {CODE.filter((l, i) => l.flag && i < scanned).map((l) => (
            <motion.li
              key={l.flag!.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SPRING.lively}
              className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[13.5px]"
            >
              <span className={`rounded-md border px-1.5 py-px font-mono text-[11px] font-semibold ${SEV_TONE[l.flag!.sev]}`}>
                {l.flag!.id}
              </span>
              <span className="truncate text-on-night">{l.flag!.text}</span>
              <span className="ml-auto shrink-0 font-mono text-[11.5px] text-on-night-3">linha {l.n}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

/* ───── 03 Validate ───── */

type Row = { id: string; text: string; sev: 'Crítico' | 'Alto' | 'Médio'; tone: string }

const ROWS: Row[] = [
  { id: 'A11Y-UI-001', text: 'Botão de ícone sem rótulo', sev: 'Crítico', tone: 'text-crit-n border-crit-n/50' },
  { id: 'TYPO-UI-001', text: 'Fonte com tamanho fixo', sev: 'Alto', tone: 'text-high-n border-high-n/50' },
  { id: 'COMP-UI-001', text: 'Ação em onTapGesture', sev: 'Médio', tone: 'text-med-n border-med-n/50' },
  { id: 'CLR-UI-001', text: 'Cor fixa no texto', sev: 'Médio', tone: 'text-med-n border-med-n/50' },
]

export function ValidateVisual({ paused }: { paused: boolean }) {
  const s = useStages([700, 650, 650, 900, 900, 900], paused)
  const dropped = s >= 5
  return (
    <div className={`${card} min-h-[420px]`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[12.5px] text-on-night-3">evenbetter-analyze-report.html</p>
        <motion.span
          animate={{ opacity: s >= 6 ? 1 : 0.35 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-glow/40 px-2.5 py-1 font-mono text-[11.5px] text-glow"
        >
          <Check size={12} /> {s >= 6 ? 'validado' : 'validando'}
        </motion.span>
      </div>
      <LayoutGroup>
        <ul className="mt-5 space-y-2.5">
          <AnimatePresence initial={false}>
            {ROWS.filter((r) => !(dropped && r.id === 'CLR-UI-001')).map((r, i) => {
              const confirmed = s > i && i < 3
              const realigned = r.id === 'COMP-UI-001' && s >= 4
              const rejected = r.id === 'CLR-UI-001' && s >= 4
              return (
                <motion.li
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
                  transition={SPRING.gentle}
                  className={`rounded-2xl border px-4 py-3 ${rejected ? 'border-crit-n/40 bg-crit-n/[0.06]' : 'border-white/8 bg-white/[0.04]'}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11.5px] text-on-night-2">{r.id}</span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={realigned ? 'Alto' : r.sev}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={SPRING.lively}
                        className={`rounded-md border px-1.5 py-px font-mono text-[11px] font-semibold uppercase ${
                          realigned ? 'text-high-n border-high-n/50' : r.tone
                        }`}
                      >
                        {realigned ? 'Alto' : r.sev}
                      </motion.span>
                    </AnimatePresence>
                    <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11.5px]">
                      {rejected ? (
                        <span className="inline-flex items-center gap-1 text-crit-n">
                          <Close size={12} /> sem evidência
                        </span>
                      ) : realigned ? (
                        <span className="text-high-n">severidade ajustada</span>
                      ) : confirmed ? (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={SPRING.lively}
                          className="inline-flex items-center gap-1 text-glow"
                        >
                          <Check size={12} /> confirmado
                        </motion.span>
                      ) : (
                        <span className="text-on-night-3">relendo…</span>
                      )}
                    </span>
                  </div>
                  <p className={`mt-1 text-[14.5px] ${rejected ? 'text-on-night-3 line-through' : 'text-on-night'}`}>{r.text}</p>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
  )
}

/* ───── 04 Repair ───── */

const DIFF = [
  { t: '-', code: '.font(.system(size: 13))' },
  { t: '+', code: '.font(.footnote)' },
  { t: '-', code: 'Image(systemName: "heart")' },
  { t: '-', code: '  .onTapGesture { favoritar() }' },
  { t: '+', code: 'Button(action: favoritar) {' },
  { t: '+', code: '  Image(systemName: "heart")' },
  { t: '+', code: '}' },
]

export function RepairVisual({ paused }: { paused: boolean }) {
  const s = useStages([400, 260, 260, 260, 260, 260, 260, 700, 600], paused)
  return (
    <div className={`${card} min-h-[420px]`}>
      <div className="flex items-center gap-2 text-on-night-3">
        <FileCode size={15} />
        <span className="font-mono text-[12.5px]">Views/FavoriteRow.swift</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-black/25 py-2 font-mono text-[11.5px] leading-[1.9] sm:text-[13px]">
        {DIFF.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={s > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={SPRING.ui}
            className={`flex gap-3 px-3 ${d.t === '+' ? 'bg-low-n/10 text-low-n' : 'bg-crit-n/10 text-crit-n/90'}`}
          >
            <span className="w-3 shrink-0">{d.t}</span>
            <span className="whitespace-pre">{d.code}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {s >= 8 && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={SPRING.gentle}
            className="mt-4 rounded-2xl border border-glow/40 bg-glow/[0.07] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-glow text-night">
                <Person size={15} />
              </span>
              <p className="font-mono text-[11.5px] font-semibold tracking-[0.12em] text-glow uppercase">Decisão sua</p>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11.5px] text-on-night-2">
                <motion.span
                  className="size-2 rounded-full bg-glow"
                  animate={paused ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                aguardando você
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-snug">O texto do botão depende do produto. O que o VoiceOver deve ler?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['"Favoritar"', '"Salvar nos favoritos"', 'Outro texto'].map((o) => (
                <span key={o} className="rounded-full border border-white/14 px-3 py-1.5 text-[13.5px] text-on-night-2">
                  {o}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
