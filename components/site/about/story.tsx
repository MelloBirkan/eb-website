'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Check, Close } from '../icons'
import { EASE_OUT, SPRING } from '../motion'

type Step = { tag: string; title: string; text: string; dropped?: boolean; now?: boolean }

const STEPS: Step[] = [
  {
    tag: 'Versão 1',
    title: 'Linha de comando',
    text: 'A análise rodava no terminal, mas cada auditoria completa dependia de uma execução cara de LLM, do começo ao fim.',
    dropped: true,
  },
  {
    tag: 'Versão 2',
    title: 'App para macOS',
    text: 'Uma interface própria mostrava melhor os resultados. Ainda assim, era mais um app para instalar e aprender.',
    dropped: true,
  },
  {
    tag: 'Versão 3',
    title: 'Skills no agente',
    text: 'O conhecimento virou skills que rodam no Claude Code e no Codex, com o login, as permissões e as ferramentas que a pessoa já usa.',
  },
  {
    tag: 'Maio de 2026',
    title: 'Dez devs iOS testam o fluxo',
    text: 'Sessões de cerca de 30 minutos, do site à auditoria. A usabilidade percebida ficou em 79,5 de 100.',
  },
  {
    tag: 'Artigo',
    title: 'Aceito no 8WoSI²',
    text: "O workshop de sistemas interativos inteligentes da 12JIHC'26, as Jornadas Iberoamericanas de Interacción Humano-Computadora.",
  },
  {
    tag: 'Setembro de 2026',
    title: 'A correção vira etapa',
    text: 'A skill evenbetter-repair entrou como quarta etapa do fluxo. Hoje são 16 skills para iOS e 2 gerais.',
    now: true,
  },
  {
    tag: '10 de novembro de 2026',
    title: 'Apresentação em Talca, no Chile',
    text: 'Marcello e Daniela apresentam o artigo na Universidad de Talca. Os slides ficam abertos para quem quiser rever.',
  },
]

/** The project's path as a timeline. The line fills as you scroll and each step lights up when it arrives. */
export function Story() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  return (
    <div className="relative">
      <span aria-hidden className="absolute top-4 bottom-4 left-[17px] w-[2px] rounded-full bg-line" />
      <motion.span
        aria-hidden
        className="absolute top-4 bottom-4 left-[17px] w-[2px] origin-top rounded-full bg-brand"
        style={{ scaleY: fill }}
      />
      <ol ref={ref} className="relative grid gap-3">
        {STEPS.map((s) => (
          <motion.li
            key={s.title}
            initial="off"
            whileInView="on"
            viewport={{ once: true, margin: '0px 0px -35% 0px' }}
            className="grid grid-cols-[36px_minmax(0,1fr)] gap-4 sm:gap-5"
          >
            <motion.span
              variants={{ off: { scale: 0.6, opacity: 0.4 }, on: { scale: 1, opacity: 1, transition: SPRING.lively } }}
              className={`relative z-10 mt-5 grid size-9 place-items-center rounded-full border-2 ${
                s.dropped ? 'border-line-2 bg-paper text-ink-3' : 'border-brand bg-brand text-on-brand'
              }`}
            >
              {s.dropped ? <Close size={14} /> : <Check size={15} />}
            </motion.span>
            <motion.div
              variants={{
                off: { opacity: 0, x: 18, filter: 'blur(6px)' },
                on: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } },
              }}
              className={`rounded-[22px] border p-5 sm:p-6 ${
                s.now ? 'border-brand/30 bg-mint/45' : s.dropped ? 'border-dashed border-line-2 bg-transparent' : 'border-line bg-card'
              }`}
            >
              <p className="font-mono text-[11.5px] tracking-[0.12em] text-ink-3 uppercase">
                {s.tag}
                {s.dropped && <span className="ml-2 normal-case tracking-normal">· ficou pelo caminho</span>}
              </p>
              <h3
                className={`mt-2 text-[18px] leading-snug font-semibold tracking-[-0.015em] ${
                  s.dropped ? 'text-ink-2 line-through decoration-ink-3/60 decoration-[1.5px]' : 'text-ink'
                }`}
              >
                {s.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
