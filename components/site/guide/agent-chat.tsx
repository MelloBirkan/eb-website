'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUp, Sparkle } from '../icons'
import { EASE_OUT, SPRING } from '../motion'
import { useReducedMotion } from '../use-reduced-motion'

/**
 * Chat ao vivo com o Claude Managed Agent configurado para o plugin
 * EvenBetter iOS. Faz proxy via /api/agent/* para manter a API key no
 * servidor e segue o protocolo de eventos da SDK Anthropic Beta:
 * cria sessão, abre SSE de eventos, envia mensagens, reage a
 * `session.status_idle` e libera a próxima pergunta da fila.
 */

type TextBlock = { type: 'text'; text: string }

type StreamEvent =
  | { type: 'agent.message'; id: string; content: TextBlock[] }
  | { type: 'agent.thinking'; id: string }
  | { type: 'agent.tool_use'; id: string; name: string }
  | { type: 'agent.tool_result'; id: string }
  | { type: 'session.status_running'; id: string }
  | { type: 'session.status_idle'; id: string }
  | { type: 'session.status_terminated'; id: string }
  | { type: 'session.error'; id: string; message?: string }
  | { type: string; [key: string]: unknown }

type Turn =
  | { kind: 'user'; id: string; text: string }
  | { kind: 'agent'; id: string; text: string; tools: string[] }

type Phase = 'connecting' | 'ready' | 'thinking' | 'error' | 'terminated'

/**
 * Inline pass: **bold** and `code` within a single line of text.
 * Bold that looks like a kebab-case identifier (skill/command name) gets
 * the code look so it's always visually consistent.
 */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = []
  const regex = /(\*\*[^*\n]+\*\*|`[^`\n]+`)/g
  let lastIndex = 0
  let k = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const token = match[0]
    if (token.startsWith('**')) {
      const inner = token.slice(2, -2)
      // **`skill-name`** → agent wrapped a code ref in bold; strip outer backticks
      const backtickWrapped = /^`([^`]+)`$/.exec(inner)
      if (backtickWrapped) {
        parts.push(<code key={`${keyBase}-${k++}`}>{backtickWrapped[1]}</code>)
      } else if (/^[a-z][a-z0-9-]*$/.test(inner)) {
        // plain kebab-case identifier in bold → code
        parts.push(<code key={`${keyBase}-${k++}`}>{inner}</code>)
      } else {
        parts.push(<strong key={`${keyBase}-${k++}`}>{inner}</strong>)
      }
    } else {
      parts.push(<code key={`${keyBase}-${k++}`}>{token.slice(1, -1)}</code>)
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

const LIST = 'my-2 space-y-1 pl-5 marker:text-on-night-3'

/**
 * Block-level renderer: detects ordered lists (1. …), unordered lists (- …),
 * and plain text lines. Inline formatting is applied within each item/line.
 */
function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n')
  const output: ReactNode[] = []
  let i = 0
  let bk = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      const k = bk++
      output.push(
        <ol key={k} className={`list-decimal ${LIST}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${k}-${idx}`)}</li>
          ))}
        </ol>,
      )
      continue
    }

    if (/^[*-] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[*-] /.test(lines[i])) {
        items.push(lines[i].replace(/^[*-] /, ''))
        i++
      }
      const k = bk++
      output.push(
        <ul key={k} className={`list-disc ${LIST}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${k}-${idx}`)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (line.trim() === '') {
      output.push(<br key={bk++} />)
      i++
      continue
    }

    const k = bk++
    output.push(
      <span key={k} className="block">
        {renderInline(line, `${k}`)}
      </span>,
    )
    i++
  }

  return output
}

const SUGGESTED_QUESTIONS = [
  'Qual é o processo para fazer uma análise completa?',
  'Quero criar um app iOS do zero com várias telas. Qual skill devo usar?',
  'Quero adicionar apenas uma feature pequena, qual skill eu uso?',
  'Qual skill eu uso para adotar o Liquid Glass?',
]

const STATUS: Record<Phase, { label: string; dot: string }> = {
  connecting: { label: 'conectando', dot: 'bg-high-n motion-safe:animate-pulse' },
  ready: { label: 'pronto', dot: 'bg-glow' },
  thinking: { label: 'pensando', dot: 'bg-glow motion-safe:animate-pulse' },
  error: { label: 'erro', dot: 'bg-crit-n' },
  terminated: { label: 'sessão encerrada', dot: 'bg-on-night-3' },
}

/** New turns rise into place. */
const turnIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: EASE_OUT },
} as const

function AgentMark() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-glow"
    >
      <Sparkle size={13} />
    </span>
  )
}

/** Three dots that bounce while the agent writes. With Reduce Motion they only fade. */
function Typing() {
  const reduce = useReducedMotion()
  return (
    <span role="img" aria-label="O agente está escrevendo" className="inline-flex h-7 items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-on-night-2"
          animate={reduce ? { opacity: [0.35, 1, 0.35] } : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

export function AgentChat() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('connecting')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [queue, setQueue] = useState<string[]>([])

  const sessionRef = useRef<string | null>(null)
  const sourceRef = useRef<EventSource | null>(null)
  const turnCounterRef = useRef(0)
  const sendingRef = useRef(false)
  const queueRef = useRef<string[]>([])
  const phaseRef = useRef<Phase>('connecting')
  const scrollRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const near = useInView(rootRef, { once: true, margin: '0px 0px 320px 0px' })

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const nextTurnId = () => {
    turnCounterRef.current += 1
    return `t${turnCounterRef.current}`
  }

  const sendMessage = useCallback(async (text: string) => {
    const id = sessionRef.current
    if (!id) return
    sendingRef.current = true
    setPhase('thinking')
    try {
      const res = await fetch(`/api/agent/sessions/${id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [{ type: 'user.message', content: [{ type: 'text', text }] }],
        }),
      })
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        throw new Error(detail?.message || `Falha ao enviar (HTTP ${res.status}).`)
      }
    } catch (err) {
      sendingRef.current = false
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao enviar mensagem.')
      setPhase('error')
    }
  }, [])

  const drainQueue = useCallback(() => {
    if (sendingRef.current) return
    const [next, ...rest] = queueRef.current
    if (!next) {
      setPhase('ready')
      return
    }
    queueRef.current = rest
    setQueue(rest)
    void sendMessage(next)
  }, [sendMessage])

  const handleEvent = useCallback(
    (event: StreamEvent) => {
      switch (event.type) {
        case 'session.status_running': {
          setPhase('thinking')
          return
        }
        case 'agent.thinking': {
          setPhase('thinking')
          return
        }
        case 'agent.message': {
          const content = (event as { content?: TextBlock[] }).content ?? []
          const chunk = content.map((b) => b.text ?? '').join('')
          if (!chunk) return
          setTurns((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.kind === 'agent') {
              const updated: Turn = { ...last, text: last.text + chunk }
              return [...prev.slice(0, -1), updated]
            }
            return [...prev, { kind: 'agent', id: nextTurnId(), text: chunk, tools: [] }]
          })
          return
        }
        case 'agent.tool_use': {
          const name = (event as { name?: string }).name ?? 'tool'
          setTurns((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.kind === 'agent') {
              const updated: Turn = { ...last, tools: [...last.tools, name] }
              return [...prev.slice(0, -1), updated]
            }
            return [...prev, { kind: 'agent', id: nextTurnId(), text: '', tools: [name] }]
          })
          return
        }
        case 'session.status_idle': {
          sendingRef.current = false
          if (queueRef.current.length > 0) {
            drainQueue()
          } else {
            setPhase('ready')
          }
          return
        }
        case 'session.status_terminated': {
          sendingRef.current = false
          setPhase('terminated')
          return
        }
        case 'session.error': {
          sendingRef.current = false
          const msg = (event as { message?: string }).message ?? 'Erro na sessão.'
          setErrorMessage(msg)
          setPhase('error')
          return
        }
        default:
          return
      }
    },
    [drainQueue],
  )

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        const res = await fetch('/api/agent/sessions', { method: 'POST' })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.message || `Falha HTTP ${res.status}.`)
        }
        const { id } = (await res.json()) as { id: string }
        if (cancelled) return
        sessionRef.current = id
        setSessionId(id)

        const source = new EventSource(`/api/agent/sessions/${id}/events/stream`)
        sourceRef.current = source

        source.onopen = () => {
          // Allow transition from 'connecting' or 'error' (retry succeeded).
          setPhase((prev) => (prev === 'connecting' || prev === 'error' ? 'ready' : prev))
        }
        source.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data) as StreamEvent
            handleEvent(data)
          } catch {
            // ignore malformed event
          }
        }
        source.addEventListener('error', (e) => {
          const detail = (e as MessageEvent).data
          if (typeof detail === 'string') {
            try {
              const parsed = JSON.parse(detail) as { message?: string }
              if (parsed?.message) {
                setErrorMessage(parsed.message)
                setPhase('error')
              }
            } catch {
              // ignore
            }
          }
        })
        source.onerror = () => {
          if (cancelled) return
          // readyState CONNECTING means EventSource will retry by itself, so don't
          // show a permanent error yet. readyState CLOSED means it gave up.
          if (source.readyState === EventSource.CLOSED) {
            setPhase((prev) => (prev !== 'terminated' ? 'error' : prev))
          }
        }
      } catch (err) {
        if (cancelled) return
        setErrorMessage(err instanceof Error ? err.message : 'Falha ao iniciar sessão.')
        setPhase('error')
      }
    }

    // Connect once the chat comes near the screen, and after a beat: a chat that only
    // flashes by (a link straight to another step of the guide) never opens a session.
    if (!near) return
    const timer = window.setTimeout(() => void bootstrap(), 350)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [handleEvent, near])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [turns, phase])

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || !sessionRef.current) return
      setTurns((prev) => [...prev, { kind: 'user', id: nextTurnId(), text: trimmed }])
      setDraft('')

      if (sendingRef.current) {
        const newQueue = [...queueRef.current, trimmed]
        queueRef.current = newQueue
        setQueue(newQueue)
        return
      }
      void sendMessage(trimmed)
    },
    [sendMessage],
  )

  const interrupt = useCallback(async () => {
    const id = sessionRef.current
    if (!id) return
    try {
      await fetch(`/api/agent/sessions/${id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: [{ type: 'user.interrupt' }] }),
      })
    } catch {
      // best effort
    }
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter breaks the line. Enter that confirms an IME composition does neither.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit(draft)
    }
  }

  const status = useMemo(() => STATUS[phase], [phase])

  const isBusy = phase === 'thinking'
  const canSend = phase === 'ready' || phase === 'thinking'
  const canType = phase !== 'connecting' && phase !== 'terminated' && phase !== 'error'
  const waiting = isBusy && turns.length > 0 && turns[turns.length - 1].kind === 'user'

  return (
    <div
      ref={rootRef}
      className="guide-block term overflow-hidden rounded-[22px] border border-white/8 bg-night-2 text-on-night shadow-[0_24px_60px_-34px_rgba(5,14,13,.55)]">
      <div className="flex min-h-12 items-center gap-3 border-b border-white/8 py-2 pr-4 pl-3">
        <AgentMark />
        <span className="min-w-0 truncate font-mono text-[11px] font-semibold tracking-[0.14em] text-on-night-3 uppercase">
          EvenBetter iOS Agent<span className="hidden sm:inline"> · powered by Claude</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11.5px] text-on-night-2">
          <span aria-hidden className={`size-2 rounded-full ${status.dot}`} />
          {status.label}
          {queue.length > 0 && (
            <span className="rounded-full bg-white/8 px-2 py-0.5 text-on-night-3">+{queue.length} na fila</span>
          )}
        </span>
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-label="Conversa com o agente"
        aria-busy={isBusy}
        className="max-h-[460px] min-h-[260px] space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
      >
        {turns.length === 0 && phase !== 'error' && (
          <div>
            <p className="text-[15.5px] font-semibold text-on-night">Por onde começar?</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-on-night-2">Escolha uma pergunta ou escreva a sua.</p>
            <motion.ul
              className="mt-4 grid gap-2 sm:grid-cols-2"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
            >
              {SUGGESTED_QUESTIONS.map((q) => (
                <motion.li
                  key={q}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
                  }}
                >
                  <button
                    type="button"
                    disabled={!canType}
                    onClick={() => submit(q)}
                    className="h-full min-h-11 w-full rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-[14.5px] leading-snug text-on-night transition-[background-color,border-color,opacity,scale] duration-200 hover:border-glow/40 hover:bg-white/[0.07] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04]"
                  >
                    {q}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}

        {turns.map((turn) =>
          turn.kind === 'user' ? (
            <motion.div key={turn.id} className="flex justify-end pl-8" {...turnIn}>
              <p className="max-w-full rounded-[18px] rounded-br-[6px] bg-glow px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap text-night [overflow-wrap:anywhere]">
                {turn.text}
              </p>
            </motion.div>
          ) : (
            <motion.div key={turn.id} className="flex gap-3 pr-2" {...turnIn}>
              <AgentMark />
              <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-on-night-2 [overflow-wrap:anywhere]">
                {turn.tools.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {turn.tools.map((name, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={SPRING.lively}
                        className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11.5px] text-on-night-3"
                      >
                        usando {name}
                      </motion.span>
                    ))}
                  </div>
                )}
                {turn.text && <div>{renderMarkdown(turn.text)}</div>}
                {!turn.text && turn.tools.length === 0 && <Typing />}
              </div>
            </motion.div>
          ),
        )}

        {waiting && (
          <motion.div className="flex gap-3" {...turnIn}>
            <AgentMark />
            <Typing />
          </motion.div>
        )}

        {phase === 'error' && errorMessage && (
          <motion.div
            role="alert"
            className="rounded-[16px] border border-crit-n/35 bg-crit-n/10 px-4 py-3 text-[14.5px] leading-relaxed text-on-night"
            {...turnIn}
          >
            <p className="font-semibold">O agente não respondeu.</p>
            <p className="mt-1 text-on-night-2">
              {errorMessage}
              {errorMessage.toLowerCase().includes('api_key') || errorMessage.toLowerCase().includes('api key') ? null : (
                <span className="mt-1 block text-on-night-3">
                  Verifique se <code>ANTHROPIC_API_KEY</code> está configurada no servidor.
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/8 p-2.5 sm:p-3">
        <textarea
          aria-label="Mensagem para o agente"
          placeholder={
            phase === 'error'
              ? 'O chat está fora do ar agora'
              : sessionId
                ? 'Pergunte qual skill usar, descreva um bug, peça um plano…'
                : 'Conectando ao agente…'
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!canType}
          rows={1}
          enterKeyHint="send"
          className="max-h-40 min-h-11 min-w-0 flex-1 resize-none rounded-[16px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[16px] leading-snug text-on-night transition-colors [field-sizing:content] placeholder:text-on-night-3 focus:border-glow/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={interrupt}
            className="grid h-11 shrink-0 place-items-center rounded-full border border-white/15 px-4 text-[14px] font-semibold text-on-night transition-[background-color,scale] hover:bg-white/10 active:scale-95"
          >
            Parar
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!canSend || draft.trim().length === 0}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-glow text-night transition-[opacity,scale] hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </form>
    </div>
  )
}
