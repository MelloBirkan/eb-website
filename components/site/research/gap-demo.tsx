'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { AnimateNumber } from 'motion-plus/react'
import { Person, Sparkle } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { Segmented } from './segmented'

type Mode = 'sem' | 'com'

// The four decisions the paper says a plain agent inferred: product, navigation, persistence, accessibility.
const ROWS = [
  {
    k: 'Produto',
    guess: 'Uma lista de tarefas para uma pessoa só.',
    ask: 'Quem vai usar o app no dia a dia?',
    options: ['Só eu', 'A casa toda', 'Uma diarista'],
  },
  {
    k: 'Navegação',
    guess: 'Duas abas, Tarefas e Cômodos.',
    ask: 'Por onde a pessoa começa?',
    options: ['Pelos cômodos', 'Pela agenda do dia'],
  },
  {
    k: 'Persistência',
    guess: 'Tudo salvo só no aparelho.',
    ask: 'As tarefas sincronizam entre pessoas?',
    options: ['Sim, pelo iCloud', 'Não, só neste aparelho'],
  },
  {
    k: 'Acessibilidade',
    guess: 'Não entrou na conversa.',
    ask: 'O que entra nos critérios de aceite?',
    options: ['Dynamic Type', 'Rótulos de VoiceOver', 'Contraste'],
  },
]

/**
 * The paper's internal planning example: the same short request, answered by an agent
 * without skills and by the planning skill. Flips by itself once, then follows the toggle.
 */
export function GapDemo() {
  const [mode, setMode] = useState<Mode>('sem')
  const [touched, setTouched] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView || touched) return
    const t = setTimeout(() => setMode('com'), 3200)
    return () => clearTimeout(t)
  }, [inView, touched])

  const com = mode === 'com'

  return (
    <div ref={ref} className="mt-12 rounded-[32px] border border-line bg-card p-4 shadow-[0_30px_90px_-50px_rgba(15,37,35,.4)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[30rem] rounded-[20px] rounded-bl-md bg-night px-4 py-3 text-[15px] leading-snug text-on-night">
          <span className="mb-1 block font-mono text-[11px] tracking-[0.12em] text-on-night-3 uppercase">O pedido</span>
          Planeje um app para organizar a limpeza da casa.
        </p>
        <Segmented<Mode>
          label="Comparar respostas do agente"
          value={mode}
          onChange={(m) => {
            setTouched(true)
            setMode(m)
          }}
          options={[
            { id: 'sem', label: 'Sem skills' },
            { id: 'com', label: 'Com EvenBetter' },
          ]}
        />
      </div>

      <div aria-live="polite" className="mt-6">
        <p className="sr-only">
          {com
            ? 'Com EvenBetter, o agente pergunta antes de decidir: quatro perguntas fechadas antes do plano.'
            : 'Sem skills, o agente decide sozinho: quatro decisões implícitas e nenhuma pergunta.'}
        </p>
        <ul className="grid gap-2.5">
          {ROWS.map((r, i) => (
            <li key={r.k} className="grid items-stretch gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
              <p className="pt-1 font-mono text-[12px] font-semibold tracking-[0.1em] text-ink-3 uppercase sm:pt-4">{r.k}</p>
              <div className="[perspective:900px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    initial={{ rotateX: -80, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1, transition: { ...SPRING.gentle, delay: i * 0.08 } }}
                    exit={{ rotateX: 80, opacity: 0, transition: { duration: 0.18, ease: EASE_OUT, delay: i * 0.04 } }}
                    style={{ transformOrigin: '50% 50%' }}
                    className={`flex min-h-[92px] flex-col justify-center gap-2.5 rounded-2xl border px-4 py-3 ${
                      com ? 'border-brand/25 bg-mint/45' : 'border-high/30 bg-high/[0.07]'
                    }`}
                  >
                    <p className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
                      <span
                        className={`mt-px grid size-6 shrink-0 place-items-center rounded-full ${
                          com ? 'bg-brand text-on-brand' : 'bg-high/15 text-high'
                        }`}
                        aria-hidden
                      >
                        {com ? <Person size={13} /> : <Sparkle size={13} />}
                      </span>
                      <span>
                        <span className="mr-1.5 font-mono text-[11.5px] font-semibold tracking-[0.06em] text-ink-3 uppercase">
                          {com ? 'Perguntou' : 'Supôs'}
                        </span>
                        {com ? r.ask : r.guess}
                      </span>
                    </p>
                    {com && (
                      <span className="flex flex-wrap gap-1.5 pl-8">
                        {r.options.map((o) => (
                          <span key={o} className="rounded-full border border-brand/25 bg-card px-2.5 py-1 text-[12.5px] text-ink-2">
                            {o}
                          </span>
                        ))}
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid items-center gap-4 border-t border-line pt-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
        <p className="flex items-baseline gap-2">
          <span className="num text-[2.6rem] leading-none font-semibold tracking-[-0.04em] text-ink">
            <AnimateNumber transition={SPRING.gentle}>{com ? 4 : 0}</AnimateNumber>
          </span>
          <span className="text-[14px] leading-tight text-ink-2">
            perguntas
            <br />
            antes do código
          </span>
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="text-[15px] leading-relaxed text-ink-2"
          >
            {com
              ? 'A skill de planejamento transforma o mesmo pedido numa entrevista e num plano com decisões explícitas e tarefas.'
              : 'O agente parte direto para a implementação. As quatro decisões ficam escondidas no código.'}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-[12.5px] text-ink-3">
        Exemplo ilustrativo do caso interno descrito no artigo. As perguntas reais variam com o pedido.
      </p>
    </div>
  )
}
