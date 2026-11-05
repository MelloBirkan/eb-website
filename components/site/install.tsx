'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { CopyButton } from './copy-button'
import { ArrowRight } from './icons'
import { EASE_OUT, SPRING } from './motion'

type Step = { text: string; cmd?: string; where?: string }
type Host = { id: string; label: string; guide: string; steps: Step[] }

const HOSTS: Host[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    guide: '/tutorial/anthropic',
    steps: [
      { text: 'Adicione o marketplace do EvenBetter.', cmd: '/plugin marketplace add MelloBirkan/EvenBetterFramework' },
      { text: 'Instale o plugin iOS.', cmd: '/plugin install evenbetter-ios@evenbetter' },
      { text: 'Recarregue os plugins na sessão atual.', cmd: '/reload-plugins' },
      { text: 'Rode a primeira auditoria no seu projeto SwiftUI.', cmd: '/evenbetter-ios:evenbetter-analyze' },
    ],
  },
  {
    id: 'codex',
    label: 'Codex',
    guide: '/tutorial/codex',
    steps: [
      {
        text: 'No terminal, adicione o marketplace do EvenBetter.',
        cmd: 'codex plugin marketplace add MelloBirkan/EvenBetterFramework',
      },
      { text: 'Abra o Codex e o navegador de plugins.', cmd: '/plugins' },
      { text: 'Escolha o marketplace evenbetter, abra o evenbetter-ios e selecione Install plugin.' },
      { text: 'Em uma conversa nova, chame o plugin com @ e peça a auditoria.', cmd: '@evenbetter-ios audite este projeto' },
    ],
  },
]

export function Install() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const host = HOSTS[active]

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? HOSTS.length - 1 : active === 0 ? 1 : 0
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="mx-auto mt-12 max-w-[860px] md:mt-14">
      <LayoutGroup id={`${uid}-hosts`}>
        <div
          role="tablist"
          aria-label="Escolha o agente"
          onKeyDown={onKey}
          className="mx-auto flex w-fit gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5"
        >
          {HOSTS.map((h, i) => {
            const on = i === active
            return (
              <button
                key={h.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative h-11 rounded-full px-6 text-[15px] font-medium transition-colors ${
                  on ? 'text-night' : 'text-on-night-2 hover:text-on-night'
                }`}
              >
                {on && (
                  <motion.span layoutId="host-pill" className="absolute inset-0 rounded-full bg-glow" transition={SPRING.ui} aria-hidden />
                )}
                <span className="relative">{h.label}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-night-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,.6)]"
      >
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
          <span className="size-3 rounded-full bg-white/15" />
          <span className="size-3 rounded-full bg-white/15" />
          <span className="size-3 rounded-full bg-white/15" />
          <span className="ml-3 font-mono text-[12.5px] text-on-night-3">{host.label}</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={host.id}
            className="divide-y divide-white/6"
            initial="hidden"
            animate="shown"
            exit="gone"
            variants={{
              hidden: {},
              shown: { transition: { staggerChildren: 0.07 } },
              gone: { opacity: 0, transition: { duration: 0.15 } },
            }}
          >
            {host.steps.map((s, i) => (
              <motion.li
                key={s.text}
                className="flex gap-4 px-5 py-5 sm:px-6"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  shown: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
                }}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-glow/40 font-mono text-[12.5px] font-semibold text-glow">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] leading-snug text-on-night">{s.text}</p>
                  {s.cmd && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/8 bg-black/30 py-2 pr-2 pl-4">
                      <code className="min-w-0 flex-1 font-mono text-[13px] [overflow-wrap:anywhere] text-glow sm:text-[13.5px]">
                        {s.cmd}
                      </code>
                      <CopyButton text={s.cmd} label={`o comando: ${s.cmd}`} tone="night" />
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[15px]">
        <Link href={host.guide} className="inline-flex items-center gap-1.5 font-medium text-on-night underline decoration-white/25 underline-offset-4 hover:decoration-glow">
          Guia completo do {host.label} <ArrowRight size={15} />
        </Link>
        <Link
          href="/tutorial/plugins/ios"
          className="inline-flex items-center gap-1.5 font-medium text-on-night underline decoration-white/25 underline-offset-4 hover:decoration-glow"
        >
          Guia do plugin iOS <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
