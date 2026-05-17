'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
 * the green code box so it's always visually consistent.
 */
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
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
        // plain kebab-case identifier in bold → code box
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

/**
 * Block-level renderer: detects ordered lists (1. …), unordered lists (- …),
 * and plain text lines. Inline formatting is applied within each item/line.
 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const output: React.ReactNode[] = []
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
        <ol key={k} className="eb-agent-chat-list">
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
        <ul key={k} className="eb-agent-chat-list">
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
      <span key={k} className="eb-agent-chat-line">
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
          events: [
            { type: 'user.message', content: [{ type: 'text', text }] },
          ],
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

  const handleEvent = useCallback((event: StreamEvent) => {
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
          return [
            ...prev,
            { kind: 'agent', id: nextTurnId(), text: chunk, tools: [] },
          ]
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
          return [
            ...prev,
            { kind: 'agent', id: nextTurnId(), text: '', tools: [name] },
          ]
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
  }, [drainQueue])

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
          setPhase((prev) =>
            prev === 'connecting' || prev === 'error' ? 'ready' : prev,
          )
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
          // readyState CONNECTING means EventSource will auto-retry — don't
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

    void bootstrap()

    return () => {
      cancelled = true
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [handleEvent])

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(draft)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(draft)
    }
  }

  const statusLabel = useMemo(() => {
    switch (phase) {
      case 'connecting': return 'conectando'
      case 'thinking':   return 'pensando'
      case 'ready':      return 'pronto'
      case 'error':      return 'erro'
      case 'terminated': return 'sessão encerrada'
    }
  }, [phase])

  const isBusy = phase === 'thinking'
  const canSend = phase === 'ready' || phase === 'thinking'
  const canType = phase !== 'connecting' && phase !== 'terminated' && phase !== 'error'

  return (
    <div className="eb-agent-chat-frame">
      <div className="eb-chat-bar">
        <span className="eb-chat-tag">EVENBETTER iOS AGENT · POWERED BY CLAUDE</span>
        <span className={`eb-agent-chat-status ${phase}`}>
          <span className="eb-agent-chat-dot" />
          {statusLabel}
          {queue.length > 0 && (
            <span className="eb-agent-chat-queue">+{queue.length} na fila</span>
          )}
        </span>
      </div>

      <div className="eb-chat-body eb-agent-chat-body" ref={scrollRef}>
        {turns.length === 0 && phase !== 'error' && (
          <div className="eb-agent-chat-empty">
            <div className="eb-agent-chat-empty-title">
              Não sabe qual skill usar? Pergunte.
            </div>
            <div className="eb-agent-chat-empty-sub">
              O agente conhece as 15 skills do plugin e ajuda a escolher o caminho certo.
            </div>
            <div className="eb-agent-chat-suggestions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="eb-agent-chat-suggestion"
                  disabled={!canType}
                  onClick={() => submit(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn) =>
          turn.kind === 'user' ? (
            <div key={turn.id} className="eb-chat-user">
              <span className="eb-chat-prompt">›</span>
              <span className="eb-chat-cmd">{turn.text}</span>
            </div>
          ) : (
            <div key={turn.id} className="eb-chat-response">
              <div className="eb-chat-hex">⬡</div>
              <div className="eb-agent-chat-agent">
                {turn.tools.length > 0 && (
                  <div className="eb-agent-chat-tools">
                    {turn.tools.map((name, i) => (
                      <span key={i} className="eb-agent-chat-tool">
                        usando {name}
                      </span>
                    ))}
                  </div>
                )}
                {turn.text && (
                  <div className="eb-agent-chat-text">{renderMarkdown(turn.text)}</div>
                )}
                {!turn.text && turn.tools.length === 0 && (
                  <div className="eb-agent-chat-typing">
                    <span /><span /><span />
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {isBusy && turns.length > 0 && turns[turns.length - 1].kind === 'user' && (
          <div className="eb-chat-response">
            <div className="eb-chat-hex">⬡</div>
            <div className="eb-agent-chat-agent">
              <div className="eb-agent-chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {phase === 'error' && errorMessage && (
          <div className="eb-agent-chat-error">
            {errorMessage}
            {errorMessage.toLowerCase().includes('api_key') ||
            errorMessage.toLowerCase().includes('api key') ? null : (
              <span className="eb-agent-chat-error-hint">
                Verifique se <code>ANTHROPIC_API_KEY</code> está configurada no servidor.
              </span>
            )}
          </div>
        )}
      </div>

      <form className="eb-agent-chat-input-row" onSubmit={onSubmit}>
        <textarea
          className="eb-agent-chat-input"
          placeholder={
            sessionId
              ? 'Pergunte qual skill usar, descreva um bug, peça um plano…'
              : 'Conectando ao agente…'
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!canType}
          rows={1}
        />
        {isBusy ? (
          <button
            type="button"
            className="eb-agent-chat-send eb-agent-chat-stop"
            onClick={interrupt}
          >
            Parar
          </button>
        ) : (
          <button
            type="submit"
            className="eb-agent-chat-send"
            disabled={!canSend || draft.trim().length === 0}
          >
            Enviar
          </button>
        )}
      </form>
    </div>
  )
}
