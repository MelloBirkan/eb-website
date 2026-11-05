'use client'

import { useId, useState } from 'react'
import { Icon } from './tutorial-primitives'

type Step<T extends string> = { id: T; title: string }

/**
 * The list of steps in a guide's sidebar. On wide screens it is always open.
 * On phones it folds into one button that names the current step, so the
 * guide starts with its content instead of a long menu.
 */
export function GuideSteps<T extends string>({
  steps,
  current,
  onPick,
}: {
  steps: readonly Step<T>[]
  current: T
  onPick: (id: T) => void
}) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  const index = Math.max(0, steps.findIndex((s) => s.id === current))
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      <button
        type="button"
        className="eb-steps-toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="eb-num" aria-hidden>
          {pad(index + 1)}
        </span>
        <span className="eb-steps-toggle-text">
          <span className="eb-steps-toggle-of">
            Etapa {index + 1} de {steps.length}
          </span>
          <span className="eb-steps-toggle-title">{steps[index]?.title}</span>
        </span>
        <span className="eb-steps-toggle-chev" aria-hidden>
          <Icon name="chevron" size={16} />
        </span>
      </button>
      <div className="eb-side-title">Etapas</div>
      <div id={listId} className="eb-side-list" data-open={open ? 'true' : 'false'}>
        {steps.map((s, idx) => {
          const active = s.id === current
          const done = idx < index
          return (
            <button
              key={s.id}
              type="button"
              className={`eb-side-item${active ? ' active' : ''}${done ? ' done' : ''}`}
              aria-current={active ? 'step' : undefined}
              onClick={() => {
                onPick(s.id)
                setOpen(false)
              }}
            >
              <span className="eb-num" aria-hidden>
                {done ? '✓' : pad(idx + 1)}
              </span>
              <span>{s.title}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/** Previous and next step, at the end of each step. */
export function GuidePager<T extends string>({
  prev,
  next,
  onPick,
}: {
  prev: Step<T> | null
  next: Step<T> | null
  onPick: (id: T) => void
}) {
  return (
    <nav className="eb-pager" aria-label="Etapas do guia">
      {prev ? (
        <button type="button" className="eb-pager-card" onClick={() => onPick(prev.id)}>
          <span className="eb-dir">← Anterior</span>
          <span className="eb-ttl">{prev.title}</span>
        </button>
      ) : (
        <div />
      )}
      {next ? (
        <button type="button" className="eb-pager-card next" onClick={() => onPick(next.id)}>
          <span className="eb-dir">Próximo →</span>
          <span className="eb-ttl">{next.title}</span>
        </button>
      ) : (
        <div />
      )}
    </nav>
  )
}
