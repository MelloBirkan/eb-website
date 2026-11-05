'use client'

import { Ticker } from 'motion-plus/react'
import { useState } from 'react'
import { useReducedMotion } from './use-reduced-motion'

const ITEMS = ['Apple HIG', 'WCAG 2.2', 'VoiceOver', 'Dynamic Type', 'SwiftUI', 'SKILL.md', 'Claude Code', 'Codex', 'Liquid Glass']

export function StandardsTicker() {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const still = paused || !!reduce

  return (
    <section aria-label="Fontes e agentes" className="relative mt-20 border-y border-line bg-paper-2/60 py-5 md:mt-28">
      <div className="wrap flex items-center gap-6">
        <p className="hidden shrink-0 font-mono text-[12.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase lg:block">
          Feito sobre
        </p>
        <div className="min-w-0 flex-1">
          <Ticker
            items={ITEMS.map((item) => (
              <span key={item} className="flex items-center gap-6 pr-6 text-[17px] font-medium tracking-[-0.01em] whitespace-nowrap text-ink-2">
                {item}
                <span aria-hidden className="size-1.5 rounded-full bg-brand/50" />
              </span>
            ))}
            velocity={still ? 0 : 42}
            hoverFactor={0.25}
            gap={0}
            fade="10%"
          />
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Continuar a faixa' : 'Pausar a faixa'}
            className="hit relative grid size-9 shrink-0 place-items-center rounded-full border border-line-2 text-ink-2 transition-[background-color,color,scale] hover:bg-card hover:text-ink active:scale-95"
          >
            {paused ? (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M2 1.2v7.6a.6.6 0 0 0 .9.5l6-3.8a.6.6 0 0 0 0-1L2.9.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <rect x="1.5" y="1" width="2.4" height="8" rx="0.8" fill="currentColor" />
                <rect x="6.1" y="1" width="2.4" height="8" rx="0.8" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
