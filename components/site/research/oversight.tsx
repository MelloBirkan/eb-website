'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Person, Sparkle } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { Cite } from './cite'
import { Segmented } from './segmented'

type Mode = 'fim' | 'acompanhar' | 'comandar'
type Owner = 'agent' | 'human' | 'split'

const STAGES = ['Direção e critérios', 'Pesquisar', 'Decidir', 'Produzir', 'Revisar']

const MODES: Record<
  Mode,
  { owners: Owner[]; notes: string[]; watch: boolean; text: string; cite: number[]; dot: { x: number; y: number } }
> = {
  fim: {
    owners: ['agent', 'agent', 'agent', 'agent', 'human'],
    notes: ['deduzida de um prompt curto', '', '', '', 'aprova o resultado'],
    watch: false,
    text: 'A IA pesquisa, decide e produz. A pessoa só aprova no fim. Essa revisão é fácil de pular e, mesmo obrigatória, piora com o tempo: quem vigia uma automação que quase sempre acerta passa a notar menos erros.',
    cite: [24],
    dot: { x: 86, y: 80 },
  },
  acompanhar: {
    owners: ['agent', 'agent', 'agent', 'agent', 'human'],
    notes: ['deduzida de um prompt curto', '', '', '', 'aprova o resultado'],
    watch: true,
    text: 'A pessoa acompanha a operação e pode intervir quando algo foge do esperado.',
    cite: [25],
    dot: { x: 86, y: 50 },
  },
  comandar: {
    owners: ['human', 'agent', 'split', 'agent', 'human'],
    notes: ['você define antes de o agente agir', '', 'técnico: agente · produto: você', '', 'confere evidências e escolhe a correção'],
    watch: false,
    text: 'Quem desenvolve define direção, restrições e critérios antes de o agente agir, e decide com evidências durante o trabalho. O EvenBetter segue esse modelo, que junta automação alta e controle humano alto.',
    cite: [23, 25],
    dot: { x: 86, y: 16 },
  },
}

function OwnerChip({ owner }: { owner: Owner }) {
  const human = owner === 'human'
  const split = owner === 'split'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11.5px] font-semibold ${
        human ? 'bg-brand text-on-brand' : split ? 'bg-mint text-brand-ink' : 'bg-night text-on-night'
      }`}
    >
      {split ? (
        <>
          <Sparkle size={12} />+<Person size={12} />
        </>
      ) : human ? (
        <Person size={12} />
      ) : (
        <Sparkle size={12} />
      )}
      {human ? 'você' : split ? 'os dois' : 'agente'}
    </span>
  )
}

/** Three ways to place a person around an AI agent, after the EU HLEG guidelines, with Shneiderman's two axes. */
export function Oversight() {
  const [mode, setMode] = useState<Mode>('fim')
  const m = MODES[mode]

  return (
    <div className="mt-12 rounded-[32px] border border-line bg-card p-4 shadow-[0_30px_90px_-50px_rgba(15,37,35,.4)] sm:p-7">
      <Segmented<Mode>
        label="Onde a pessoa entra"
        value={mode}
        onChange={setMode}
        size="lg"
        stretch
        stack
        options={[
          { id: 'fim', label: 'Aprovar no fim', sub: 'in-the-loop, no uso comum' },
          { id: 'acompanhar', label: 'Acompanhar', sub: 'on-the-loop' },
          { id: 'comandar', label: 'Comandar', sub: 'in-command' },
        ]}
      />

      <div className="mt-7">
          {/* The pipeline. A dashed watch bar spans the agent's work in "Acompanhar". */}
          <div className="relative">
            <AnimatePresence>
              {m.watch && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="mb-3 flex items-center justify-center gap-2 rounded-full border border-dashed border-brand/50 bg-mint/40 px-3 py-1.5 text-[13px] font-medium text-brand-ink md:mx-[20%]"
                  style={{ originX: 0 }}
                >
                  <Person size={13} /> acompanha e pode intervir
                </motion.div>
              )}
            </AnimatePresence>

            <ol className="grid gap-2 md:grid-cols-5 md:gap-2.5">
              {STAGES.map((stage, i) => {
                const owner = m.owners[i]
                const human = owner !== 'agent'
                return (
                  <li key={stage} className="relative">
                    <motion.div
                      layout
                      transition={SPRING.ui}
                      className={`flex h-full flex-row items-center justify-between gap-3 rounded-2xl border p-3.5 transition-colors duration-300 md:min-h-[150px] md:flex-col md:items-start md:justify-start ${
                        human ? 'border-brand/35 bg-mint/50' : 'border-line bg-paper-2/70'
                      }`}
                    >
                      <div>
                        <p className="font-mono text-[11px] text-ink-3">0{i + 1}</p>
                        <p className="mt-0.5 text-[15px] leading-tight font-semibold tracking-[-0.01em] text-ink">{stage}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 md:items-start">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={owner}
                            initial={{ opacity: 0, scale: 0.6, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0, transition: { ...SPRING.lively, delay: i * 0.05 } }}
                            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                          >
                            <OwnerChip owner={owner} />
                          </motion.span>
                        </AnimatePresence>
                        <AnimatePresence mode="wait" initial={false}>
                          {m.notes[i] && (
                            <motion.span
                              key={`${mode}-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="max-w-[16ch] text-right text-[12.5px] leading-snug text-ink-2 md:text-left"
                            >
                              {m.notes[i]}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    {i < STAGES.length - 1 && (
                      <span aria-hidden className="absolute top-1/2 -right-[9px] z-10 hidden h-px w-2.5 bg-line-2 md:block" />
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_230px] md:items-start md:gap-8">
        {/* The live region stays mounted; only its text is swapped, so the change is announced. */}
        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)', transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="max-w-[60ch] text-[16px] leading-relaxed text-ink-2 md:pt-2"
            >
              {m.text} <Cite n={m.cite} />
            </motion.p>
          </AnimatePresence>
        </div>
        {/* Shneiderman's two axes: automation and human control are not one slider. */}
        <figure className="w-full max-w-[280px] rounded-[24px] border border-line bg-paper-2/60 p-4 md:max-w-none">
          <div className="relative ml-6 aspect-square">
            <div className="absolute inset-0 rounded-[10px] border-b-2 border-l-2 border-ink/60" />
            <div className="absolute top-0 right-0 h-1/2 w-1/2 rounded-tr-[10px] bg-mint/70" />
            <p className="absolute top-2 right-2 max-w-[60%] text-right text-[11.5px] leading-tight font-medium text-brand-ink">
              Alta automação e alto controle
            </p>
            <motion.div
              className="absolute"
              animate={{ left: `${m.dot.x}%`, top: `${m.dot.y}%` }}
              transition={SPRING.gentle}
              initial={false}
            >
              <span className="absolute -top-2 -left-2 size-4 rounded-full border-2 border-card bg-brand shadow-[0_0_0_6px_rgba(27,107,96,.18)]" />
            </motion.div>
            <p className="absolute -bottom-6 left-0 font-mono text-[11px] text-ink-3">automação →</p>
            <p className="absolute bottom-0 left-[-10px] origin-bottom-left -rotate-90 font-mono text-[11px] whitespace-nowrap text-ink-3">
              controle humano →
            </p>
          </div>
          <figcaption className="mt-9 text-[12.5px] leading-snug text-ink-3">
            Automação e controle não são os dois lados de uma mesma régua <Cite n={23} />. A posição do ponto é a nossa
            leitura de cada modo.
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
