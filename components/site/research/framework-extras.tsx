'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Check, Close } from '../icons'
import { EASE_OUT, SPRING } from '../motion'

const LAYERS = [
  { name: 'Tarefa', text: 'Define qual skill entra e qual contrato de saída vale.' },
  { name: 'Projeto', text: 'Ancora a resposta nos arquivos, telas e componentes SwiftUI e nos artefatos gerados.' },
  { name: 'Diretrizes', text: 'Limita o julgamento do agente às cláusulas curadas.' },
  { name: 'Humano', text: 'Guarda as respostas de quem desenvolve e o que continua em aberto.' },
  { name: 'Execução', text: 'Considera o ambiente: terminal, descoberta do plugin e permissões.' },
]

/** The five context layers, stacked from the bottom up as they scroll in. */
export function ContextLayers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  return (
    <div ref={ref} className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:gap-10">
      <ol className="grid gap-2">
        {LAYERS.map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ ...SPRING.lively, delay: (LAYERS.length - 1 - i) * 0.12 }}
            whileHover={{ y: -3 }}
            className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-card px-4 py-3.5 shadow-[0_10px_24px_-20px_rgba(15,37,35,.5)] sm:grid-cols-[32px_130px_minmax(0,1fr)]"
            style={{ marginInline: `${i * 1.2}%` }}
          >
            <span className="grid size-8 place-items-center rounded-full bg-mint font-mono text-[12.5px] font-semibold text-brand-ink">
              {i + 1}
            </span>
            <span className="text-[15.5px] font-semibold text-ink">{l.name}</span>
            <span className="col-start-2 text-[14.5px] leading-snug text-ink-2 sm:col-start-3">{l.text}</span>
          </motion.li>
        ))}
      </ol>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
        className="rounded-[24px] bg-night p-6 text-on-night"
      >
        <p className="font-mono text-[11.5px] tracking-[0.14em] text-glow uppercase">Procedural, não preditivo</p>
        <p className="mt-3 text-[16.5px] leading-snug font-medium">Nenhum perfil escondido.</p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-on-night-2">
          O EvenBetter não personaliza por variáveis opacas. Ele escolhe o procedimento que serve à situação. Quando a
          correção depende da intenção do produto, a dúvida vira uma pergunta para você.
        </p>
      </motion.div>
    </div>
  )
}

const STEPS = [
  { name: 'Linha de comando', kind: 'old' },
  { name: 'App para macOS', kind: 'old' },
  { name: 'Skills no agente', kind: 'now' },
] as const

/** CLI, then a macOS app, then skills inside the agent the developer already uses. */
export function Evolution() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className="mt-10 rounded-[28px] border border-line bg-card p-6 sm:p-8">
      <div className="relative grid gap-6 sm:grid-cols-3 sm:gap-4">
        <motion.span
          aria-hidden
          className="absolute top-[15px] right-[16%] left-[16%] hidden h-[2px] origin-left rounded-full bg-gradient-to-r from-line-2 via-line-2 to-brand sm:block"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
        />
        {STEPS.map((s, i) => {
          const now = s.kind === 'now'
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ ...SPRING.gentle, delay: 0.15 + i * 0.35 }}
              className="relative flex items-center gap-3 sm:flex-col sm:text-center"
            >
              <span
                className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 ${
                  now ? 'border-brand bg-brand text-on-brand' : 'border-line-2 bg-card text-ink-3'
                }`}
              >
                {now ? <Check size={15} /> : <Close size={13} />}
              </span>
              <span>
                <span className={`block text-[16px] font-semibold ${now ? 'text-ink' : 'text-ink-3 line-through decoration-line-2'}`}>
                  {s.name}
                </span>
                <span className="mt-1 block font-mono text-[11.5px] text-ink-3">{now ? 'hoje' : `exploração ${i + 1}`}</span>
              </span>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 1, duration: 0.6 }}
          className="rounded-2xl border border-dashed border-line-2 p-4 text-[14px] leading-snug text-ink-2 sm:col-span-2"
        >
          As duas primeiras versões pesavam para adotar, e cada análise completa dependia de uma execução cara de LLM de
          ponta a ponta.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="rounded-2xl bg-mint/55 p-4 text-[14px] leading-snug text-ink"
        >
          Como skills, o conhecimento roda no Claude Code ou no Codex, com o login, as permissões e as ferramentas que
          você já usa.
        </motion.p>
      </div>
    </div>
  )
}
