'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'

/* ── types ── */
type ProviderId = 'openai' | 'anthropic'
type SectionId = 'setup' | 'first' | 'errors'
type PageView = 'home' | 'tutorial'

interface Provider {
  id: ProviderId
  name: string
  tag: string
  description: string
  models: string[]
  keyEnv: string
  keyPrefix: string
  defaultModel: string
}

/* ── data ── */
const PROVIDERS: Record<ProviderId, Provider> = {
  openai: {
    id: 'openai', name: 'OpenAI', tag: 'GPT',
    description: 'GPT-4o, mini e o-series. Ecossistema maduro com função calling robusta.',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    keyEnv: 'OPENAI_API_KEY', keyPrefix: 'sk-...',
    defaultModel: 'gpt-4o-mini',
  },
  anthropic: {
    id: 'anthropic', name: 'Anthropic', tag: 'Claude',
    description: 'Claude Sonnet, Haiku e Opus. Contexto longo e raciocínio cuidadoso.',
    models: ['claude-sonnet-4-5', 'claude-haiku-4-5', 'claude-opus-4-1'],
    keyEnv: 'ANTHROPIC_API_KEY', keyPrefix: 'sk-ant-...',
    defaultModel: 'claude-haiku-4-5',
  },
}

const SECTIONS = [
  { id: 'setup' as SectionId, title: 'Configurar a chave' },
  { id: 'first' as SectionId, title: 'Primeira chamada' },
  { id: 'errors' as SectionId, title: 'Quando dá erro' },
]

/* ── syntax highlight ── */
function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function tokenize(src: string, rules: { re: RegExp; cls: string }[]) {
  let i = 0, out = ''
  while (i < src.length) {
    let bestIdx = -1, bestLen = 0, bestCls = ''
    for (const r of rules) {
      r.re.lastIndex = i
      const m = r.re.exec(src)
      if (m && (bestIdx === -1 || m.index < bestIdx)) { bestIdx = m.index; bestLen = m[0].length; bestCls = r.cls }
    }
    if (bestIdx === -1) { out += escHtml(src.slice(i)); break }
    if (bestIdx > i) out += escHtml(src.slice(i, bestIdx))
    out += `<span class="${bestCls}">${escHtml(src.slice(bestIdx, bestIdx + bestLen))}</span>`
    i = bestIdx + bestLen
  }
  return out
}
const hlBash = (s: string) => tokenize(s, [
  { re: /#[^\n]*/g, cls: 'eb-tk-cmt' },
  { re: /"[^"\n]*"/g, cls: 'eb-tk-str' },
  { re: /\$[A-Z_][A-Z0-9_]*/g, cls: 'eb-tk-var' },
  { re: /\bcurl\b/g, cls: 'eb-tk-cmd' },
  { re: /--?[A-Za-z][\w-]*/g, cls: 'eb-tk-flag' },
  { re: /\b\d+\b/g, cls: 'eb-tk-num' },
])
const hlJson = (s: string) => tokenize(s, [
  { re: /"(?:[^"\\]|\\.)*"(?=\s*:)/g, cls: 'eb-tk-key' },
  { re: /"(?:[^"\\]|\\.)*"/g, cls: 'eb-tk-str' },
  { re: /\b(?:true|false|null)\b/g, cls: 'eb-tk-num' },
  { re: /-?\d+(?:\.\d+)?/g, cls: 'eb-tk-num' },
])

/* ── icons ── */
function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
    case 'arrow': return <svg {...p}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>
    case 'chevron': return <svg {...p}><path d="m6 9 6 6 6-6" /></svg>
    case 'copy': return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    case 'check': return <svg {...p}><path d="M20 6 9 17l-5-5" /></svg>
    case 'play': return <svg {...p} fill="currentColor" stroke="none"><path d="M5 3v18l15-9z" /></svg>
    case 'tip': return <svg {...p}><path d="M12 2 L13.4 8.6 L20 10 L13.4 11.4 L12 18 L10.6 11.4 L4 10 L10.6 8.6 Z" /></svg>
    case 'warn': return <svg {...p}><path d="M12 2 2 20h20z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    case 'note': return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    default: return null
  }
}

/* ── SVG illustrations ── */
const Logo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 19 L11 13 L13 15 L19 7" stroke="#1f4e4a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7 L19 7 L19 12" stroke="#1f4e4a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HeroIllo = () => (
  <svg viewBox="0 0 460 360" fill="none">
    <ellipse cx="230" cy="180" rx="200" ry="130" fill="#a9d4c4" opacity="0.18" />
    <g>
      <rect x="120" y="80" width="240" height="200" rx="22" fill="white" opacity="0.88" />
      <rect x="120" y="80" width="240" height="200" rx="22" stroke="#a9d4c4" strokeWidth="1" opacity="0.5" />
      <rect x="138" y="100" width="60" height="10" rx="5" fill="#1f4e4a" />
      <rect x="138" y="118" width="180" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="130" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.16" />
      <rect x="138" y="150" width="180" height="62" rx="14" fill="#a9d4c4" opacity="0.45" />
      <rect x="152" y="164" width="120" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="178" width="140" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="152" y="192" width="80" height="6" rx="3" fill="#1f4e4a" opacity="0.7" />
      <rect x="138" y="226" width="92" height="32" rx="16" fill="#1f4e4a" />
      <rect x="156" y="238" width="42" height="6" rx="3" fill="#b6efd9" />
      <circle cx="216" cy="242" r="3" fill="#b6efd9" />
    </g>
    <g transform="translate(40 100)">
      <rect width="92" height="40" rx="14" fill="#0f2825" stroke="#a9d4c4" strokeOpacity="0.2" />
      <text x="14" y="25" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#b6efd9" fontWeight="600">curl</text>
      <rect x="52" y="16" width="28" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.7" />
      <rect x="52" y="23" width="18" height="3.5" rx="1.5" fill="#a9d4c4" opacity="0.4" />
    </g>
    <g transform="translate(330 240)">
      <rect width="96" height="36" rx="18" fill="#b6efd9" stroke="white" />
      <circle cx="18" cy="18" r="5" fill="#1f4e4a" />
      <text x="30" y="23" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#1f4e4a" fontWeight="700">200 OK</text>
    </g>
    <circle cx="230" cy="180" r="160" stroke="#a9d4c4" strokeWidth="1.5" strokeDasharray="2 7" opacity="0.4" />
    <circle cx="60" cy="200" r="8" fill="#1f4e4a" opacity="0.3" />
    <circle cx="60" cy="200" r="3" fill="#1f4e4a" />
    <circle cx="410" cy="100" r="4" fill="#1f4e4a" opacity="0.5" />
    <circle cx="380" cy="320" r="3" fill="#1f4e4a" opacity="0.5" />
    <circle cx="100" cy="60" r="2" fill="#1f4e4a" opacity="0.6" />
  </svg>
)

const ProviderIllo = ({ kind, dark }: { kind: string; dark?: boolean }) => {
  const stroke = dark ? '#a9d4c4' : '#266b65'
  const fill = dark ? '#a9d4c4' : '#266b65'
  const centerFill = dark ? '#1f4e4a' : 'white'
  if (kind === 'openai') return (
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 30 L162 42 L162 66 L140 78 L118 66 L118 42 Z" fill={fill} />
      <path d="M140 30 L162 42 L140 54 L118 42 Z" fill={fill} opacity="0.7" />
      <circle cx="140" cy="54" r="5" fill={centerFill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 56 L142 60 L140 64 L138 60 Z" fill={fill} />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
  return (
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="140" cy="60" r="76" fill={fill} opacity="0.1" />
      <circle cx="140" cy="60" r="56" fill={dark ? 'rgba(255,255,255,0.06)' : 'white'} stroke={stroke} strokeOpacity="0.3" />
      <path d="M140 28 L148 52 L172 60 L148 68 L140 92 L132 68 L108 60 L132 52 Z" fill={fill} />
      <circle cx="140" cy="60" r="8" fill={fill} opacity="0.3" />
      <path d="M140 52 L144 58 L140 64 L136 58 Z" fill={fill} opacity="0.8" />
      <circle cx="140" cy="60" r="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />
    </svg>
  )
}

/* ── CodeBlock ── */
function CodeBlock({ lang = 'bash', code }: { lang?: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(code) } catch {
      const ta = document.createElement('textarea')
      ta.value = code; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 1400)
  }, [code])
  const html = lang.toLowerCase().includes('json') ? hlJson(code) : hlBash(code)
  return (
    <div className="eb-code">
      <div className="eb-code-head">
        <span className="eb-code-lang">{lang}</span>
        <button className={`eb-copy${copied ? ' copied' : ''}`} onClick={onCopy}>
          <Icon name={copied ? 'check' : 'copy'} size={11} />
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  )
}

/* ── Callout ── */
function Callout({ kind = 'tip', title, children }: { kind?: string; title?: string; children: React.ReactNode }) {
  return (
    <div className={`eb-callout ${kind}`}>
      <div className="eb-callout-icon"><Icon name={kind} size={14} /></div>
      <div className="eb-callout-body">
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  )
}

/* ── TryIt ── */
function TryIt({ provider }: { provider: Provider }) {
  const [model, setModel] = useState(provider.defaultModel)
  const [prompt, setPrompt] = useState('Escreva um haiku sobre código limpo.')
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [response, setResponse] = useState<object | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => { setModel(provider.defaultModel); setResponse(null); setStatus('idle') }, [provider.id])

  const run = () => {
    setStatus('loading'); setResponse(null); setElapsed(0)
    const start = performance.now()
    const tick = setInterval(() => setElapsed((performance.now() - start) / 1000), 60)
    setTimeout(() => {
      clearInterval(tick)
      setElapsed((performance.now() - start) / 1000)
      const haiku = 'Linhas se alinham,\nfunção pura ao amanhecer —\nbug que nunca foi.'
      const mock = provider.id === 'openai'
        ? { id: `chatcmpl-9X${Math.random().toString(36).slice(2, 8)}`, model, choices: [{ message: { role: 'assistant', content: haiku }, finish_reason: 'stop' }], usage: { prompt_tokens: 18, completion_tokens: 24 } }
        : { id: `msg_01${Math.random().toString(36).slice(2, 10)}`, model, role: 'assistant', content: [{ type: 'text', text: haiku }], stop_reason: 'end_turn', usage: { input_tokens: 18, output_tokens: 24 } }
      setResponse(mock); setStatus('done')
    }, 1100)
  }

  const stat = {
    idle: <span className="eb-stat idle">● pronto</span>,
    loading: <span className="eb-stat loading">● rodando…</span>,
    done: <span className="eb-stat">● 200 OK · {elapsed.toFixed(2)}s</span>,
  }[status]

  return (
    <div className="eb-tryit">
      <div className="eb-tryit-head">
        <Icon name="play" size={13} />
        <h4>Testar agora</h4>
        <span className="eb-badge">SANDBOX</span>
      </div>
      <div className="eb-tryit-body">
        <div className="eb-tryit-form">
          <div className="eb-field">
            <label>Modelo</label>
            <select value={model} onChange={e => setModel(e.target.value)}>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="eb-field">
            <label>{provider.keyEnv}</label>
            <input type="password" placeholder={provider.keyPrefix} value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </div>
          <div className="eb-field">
            <label>Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
          </div>
          <button className="eb-run" onClick={run} disabled={status === 'loading'}>
            <Icon name="play" size={11} />
            {status === 'loading' ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
        <div className="eb-tryit-out">
          <div className="eb-tryit-out-head">
            <span className="eb-lab">Resposta</span>{stat}
          </div>
          <pre>
            {status === 'idle' && <span className="eb-empty">{'// envie uma requisição'}</span>}
            {status === 'loading' && <span className="eb-empty">{'// aguardando…'}</span>}
            {response && <code dangerouslySetInnerHTML={{ __html: hlJson(JSON.stringify(response, null, 2)) }} />}
          </pre>
        </div>
      </div>
    </div>
  )
}

/* ── tutorial content ── */
function curlBasic(p: Provider) {
  if (p.id === 'openai') return `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Olá!"}]
  }'`
  return `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-haiku-4-5",
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Olá!"}]
  }'`
}

function jsonResp(p: Provider) {
  if (p.id === 'openai') return `{
  "id": "chatcmpl-9X3",
  "model": "gpt-4o-mini",
  "choices": [{
    "message": { "role": "assistant", "content": "Olá! Como posso ajudar?" },
    "finish_reason": "stop"
  }],
  "usage": { "prompt_tokens": 8, "completion_tokens": 7 }
}`
  return `{
  "id": "msg_01ABc",
  "role": "assistant",
  "model": "claude-haiku-4-5",
  "content": [{ "type": "text", "text": "Olá! Como posso ajudar?" }],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 8, "output_tokens": 7 }
}`
}

function SectionSetup({ p }: { p: Provider }) {
  return (
    <>
      <div className="eb-crumbs"><span>GUIA</span><span className="eb-sep">/</span><span>{p.name.toUpperCase()}</span><span className="eb-sep">/</span><span>CONFIGURAR</span></div>
      <h1>Configure sua <span className="eb-accent">chave</span></h1>
      <p className="eb-lede">Pegue uma chave no painel da {p.name} e exporte como variável de ambiente.</p>
      <CodeBlock lang="bash" code={`# 1. Cole sua chave (começa com ${p.keyPrefix})\nexport ${p.keyEnv}="${p.keyPrefix}sua-chave-aqui"\n\n# 2. Confirme que carregou\necho $${p.keyEnv}`} />
      <Callout kind="warn" title="Trate como senha">
        Nunca coloque a chave em commit, log ou JS de navegador. Quem tem a chave gasta seus créditos.
      </Callout>
    </>
  )
}

function SectionFirst({ p }: { p: Provider }) {
  return (
    <>
      <div className="eb-crumbs"><span>GUIA</span><span className="eb-sep">/</span><span>{p.name.toUpperCase()}</span><span className="eb-sep">/</span><span>PRIMEIRA CHAMADA</span></div>
      <h1>Sua <span className="eb-accent">primeira chamada</span></h1>
      <p className="eb-lede">Modelo + mensagens + cabeçalhos. É só isso.</p>
      <CodeBlock lang="bash" code={curlBasic(p)} />
      <Callout kind="note" title={`Específico da ${p.name}`}>
        {p.id === 'openai'
          ? <>Use <code>Authorization: Bearer</code> e o endpoint <code>/v1/chat/completions</code>.</>
          : <>Use <code>x-api-key</code> e sempre defina <code>max_tokens</code>.</>}
      </Callout>
      <h2>A resposta</h2>
      <CodeBlock lang="json" code={jsonResp(p)} />
      <TryIt provider={p} />
    </>
  )
}

function SectionErrors({ p }: { p: Provider }) {
  const errs = p.id === 'openai'
    ? [
        { code: '401', name: 'Chave inválida', fix: 'Verifique se começa com sk- e não foi revogada.' },
        { code: '429', name: 'Limite excedido', fix: 'Backoff exponencial e respeite Retry-After.' },
        { code: '400', name: 'Requisição inválida', fix: 'Leia o campo message — geralmente modelo errado.' },
      ]
    : [
        { code: '401', name: 'x-api-key inválido', fix: 'Confirme que está em x-api-key, não em Authorization.' },
        { code: '400', name: 'max_tokens faltando', fix: 'Sempre obrigatório. Use 1024 como ponto de partida.' },
        { code: '429', name: 'overloaded_error', fix: 'Backoff e considere modelo menor (Haiku).' },
      ]
  return (
    <>
      <div className="eb-crumbs"><span>GUIA</span><span className="eb-sep">/</span><span>{p.name.toUpperCase()}</span><span className="eb-sep">/</span><span>ERROS</span></div>
      <h1>Quando <span className="eb-accent">dá erro</span></h1>
      <p className="eb-lede">Os códigos que você vai encontrar e como sair de cada um.</p>
      {errs.map((e, i) => (
        <div key={i} className="eb-callout" style={{ alignItems: 'flex-start' }}>
          <div className="eb-callout-icon" style={{ background: 'var(--eb-teal-deep)', color: 'var(--eb-mint-bright)', fontFamily: 'var(--eb-font-mono)', fontSize: 11, fontWeight: 700, width: 44, height: 26, borderRadius: 999 }}>{e.code}</div>
          <div className="eb-callout-body"><strong>{e.name}</strong><div>{e.fix}</div></div>
        </div>
      ))}
      <Callout kind="warn" title="Não tente de novo em 401 ou 400">
        Erros de autenticação ou validação não se resolvem sozinhos.
      </Callout>
    </>
  )
}

/* ── SearchModal ── */
function SearchModal({ open, onClose, onJump, currentProvider }: {
  open: boolean
  onClose: () => void
  onJump: (pid: ProviderId, sid: SectionId) => void
  currentProvider: ProviderId
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const corpus = useMemo(() => {
    const out: { kind: string; title: string; section: string; providerId: ProviderId; sectionId: SectionId }[] = []
    ;(Object.values(PROVIDERS) as Provider[]).forEach(p => {
      SECTIONS.forEach(s => out.push({ kind: 'GUIA', title: s.title, section: p.name, providerId: p.id, sectionId: s.id }))
    })
    out.push({ kind: 'ERRO', title: '401 Não autorizado', section: 'Geral', providerId: currentProvider, sectionId: 'errors' })
    out.push({ kind: 'ERRO', title: 'max_tokens faltando', section: 'Anthropic', providerId: 'anthropic', sectionId: 'errors' })
    return out
  }, [currentProvider])

  const results = useMemo(() => {
    if (!query.trim()) return corpus.filter(r => r.providerId === currentProvider).slice(0, 8)
    const q = query.toLowerCase()
    return corpus.filter(r => (r.title + ' ' + r.section).toLowerCase().includes(q)).slice(0, 12)
  }, [query, corpus, currentProvider])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
    if (!open) { setQuery(''); setActive(0) }
  }, [open])
  useEffect(() => { setActive(0) }, [query])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { const r = results[active]; if (r) { onJump(r.providerId, r.sectionId); onClose() } }
  }

  if (!open) return null
  return (
    <div className="eb-overlay" onClick={onClose}>
      <div className="eb-modal" onClick={e => e.stopPropagation()} onKeyDown={onKey}>
        <div className="eb-modal-input">
          <Icon name="search" size={16} />
          <input ref={inputRef} placeholder="Buscar guias e erros…" value={query} onChange={e => setQuery(e.target.value)} />
          <span className="eb-kbd">esc</span>
        </div>
        <div className="eb-results">
          {results.length === 0 && <div className="eb-empty-results">Nada encontrado para &ldquo;{query}&rdquo;</div>}
          {results.map((r, i) => (
            <div key={i} className={`eb-result${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => { onJump(r.providerId, r.sectionId); onClose() }}>
              <span className="eb-result-kind">{r.kind}</span>
              <span className="eb-result-title">{r.title}</span>
              <span className="eb-result-section">{r.section}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Nav ── */
function Nav({ page, onHome, onSearch }: { page: PageView; onHome: () => void; onSearch: () => void }) {
  return (
    <div className="eb-nav-wrap">
      <nav className="eb-nav">
        <button className="eb-brand" onClick={onHome}>
          <span className="eb-brand-mark"><Logo /></span>
          EVENBETTER
        </button>
        <div className="eb-nav-links">
          <span className={`eb-nav-link${page === 'home' ? ' active' : ''}`} onClick={onHome}>Início</span>
          <span className={`eb-nav-link${page === 'tutorial' ? ' active' : ''}`}>Guias</span>
          <span className="eb-nav-link">Modelos</span>
          <span className="eb-nav-link">Sobre</span>
        </div>
        <div className="eb-nav-spacer" />
        <div className="eb-search-trigger" onClick={onSearch}>
          <Icon name="search" size={13} />
          <span>Buscar…</span>
          <span className="eb-kbd">⌘K</span>
        </div>
      </nav>
    </div>
  )
}

/* ── Home ── */
function Home({ onPick }: { onPick: (id: ProviderId) => void }) {
  const scrollToProviders = () => {
    document.getElementById('escolha-sua-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="eb-home eb-fade-page">
      <div className="eb-hero-frame">
        <div className="eb-hero">
          <div className="eb-hero-left">
            <div>
              <h1 style={{ fontSize: 'clamp(36px,4.5vw,55px)' }}>
                Use Agentes de <span className="eb-accent">IA</span> para analisar acessibilidade do seu app{' '}
                <span className="eb-stroke">EM</span> <span className="eb-accent">3 PASSOS</span>
              </h1>
              <div className="eb-hero-text-block">
                <div className="eb-rule" />
                <p>EvenBetter fornece skills estruturadas que orientam a leitura de código, boas práticas de UX e a geração de recomendações.</p>
              </div>
            </div>
            <div className="eb-hero-actions">
              <button className="eb-btn eb-btn-primary" onClick={scrollToProviders}>
                Começar agora <Icon name="arrow" size={13} />
              </button>
            </div>
          </div>
          <div className="eb-hero-right">
            <div className="eb-hero-illo-stage"><HeroIllo /></div>
          </div>
        </div>
      </div>

      <div className="eb-steps-frame">
        {[
          { title: 'Escolha o agente de IA', desc: 'Selecione o ambiente onde você já trabalha. EvenBetter é compatível com agentes que suportam instruções estruturadas, como Codex e Claude Code.' },
          { title: 'Instale as skills no seu projeto', desc: 'Copie o comando de instalação correspondente e execute no diretório do seu projeto. Isso adiciona as skills do EvenBetter ao repositório.' },
          { title: 'Execute a análise', desc: 'Use o agente para rodar a análise no projeto. As skills serão carregadas automaticamente e o relatório será gerado com base nas guidelines.' },
        ].map((s, i) => (
          <div key={i} className="eb-step">
            <div className="eb-step-num">{`0${i + 1}`}</div>
            <div className="eb-step-body"><h4>{s.title}</h4><p>{s.desc}</p></div>
          </div>
        ))}
      </div>

      <div id="escolha-sua-ia" style={{ scrollMarginTop: 90 }}>
        <div className="eb-section-head">
          <h2>ESCOLHA SUA IA</h2>
        </div>
        <p className="eb-section-sub">Cada caminho é específico do provedor — chega no mesmo lugar por 3 etapas.</p>
        <div className="eb-providers">
          <div className="eb-provider" onClick={() => onPick('openai')}>
            <div className="eb-provider-illo"><ProviderIllo kind="openai" /></div>
            <div className="eb-provider-tag">{PROVIDERS.openai.name}</div>
            <h3>{PROVIDERS.openai.tag}</h3>
            <p>{PROVIDERS.openai.description}</p>
            <span className="eb-provider-cta">Abrir guia <Icon name="arrow" size={12} /></span>
          </div>
          <div className="eb-provider dark" onClick={() => onPick('anthropic')}>
            <div className="eb-provider-illo"><ProviderIllo kind="anthropic" dark /></div>
            <div className="eb-provider-tag">{PROVIDERS.anthropic.name}</div>
            <h3>{PROVIDERS.anthropic.tag}</h3>
            <p>{PROVIDERS.anthropic.description}</p>
            <span className="eb-provider-cta">Abrir guia <Icon name="arrow" size={12} /></span>
          </div>
        </div>
      </div>

      <div className="eb-skills-section">
        <div className="eb-section-head">
          <h2>CONHEÇA AS SKILLS</h2>
        </div>
        <div className="eb-skills-grid">
          {[
            { title: 'Análise de Contraste', desc: 'Verifica se as cores do projeto respeitam os níveis WCAG AA e AAA de contraste para texto e componentes interativos.' },
            { title: 'Revisão de Semântica HTML', desc: 'Inspeciona a estrutura de marcação do código e aponta elementos com uso incorreto ou ausência de atributos de acessibilidade.' },
            { title: 'Navegação por Teclado', desc: 'Avalia o fluxo de foco em toda a interface e identifica componentes que bloqueiam ou perdem o estado de foco.' },
            { title: 'Textos Alternativos', desc: 'Localiza imagens, ícones e mídia sem descrição textual adequada para leitores de tela.' },
            { title: 'Hierarquia de Títulos', desc: 'Mapeia os headings da página e detecta quebras de hierarquia que dificultam a leitura por tecnologias assistivas.' },
            { title: 'Formulários Acessíveis', desc: 'Checa labels, mensagens de erro e instruções em campos de formulário, garantindo que todos os estados sejam anunciados corretamente.' },
          ].map((skill, i) => (
            <div key={i} className="eb-skill-card">
              <h4>{skill.title}</h4>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Tutorial ── */
function Tutorial({ providerId, sectionId, onSection, onProviderSwitch }: {
  providerId: ProviderId
  sectionId: SectionId
  onSection: (s: SectionId) => void
  onProviderSwitch: (p: ProviderId) => void
}) {
  const provider = PROVIDERS[providerId]
  const sectionIdx = SECTIONS.findIndex(s => s.id === sectionId)
  const otherProvider: ProviderId = providerId === 'openai' ? 'anthropic' : 'openai'
  const prev = sectionIdx > 0 ? SECTIONS[sectionIdx - 1] : null
  const next = sectionIdx < SECTIONS.length - 1 ? SECTIONS[sectionIdx + 1] : null

  useEffect(() => { window.scrollTo(0, 0) }, [providerId, sectionId])

  return (
    <div className="eb-tut">
      <aside className="eb-sidebar">
        <div className="eb-switch" onClick={() => onProviderSwitch(otherProvider)}>
          <div className="eb-switch-illo"><ProviderIllo kind={provider.id} /></div>
          <div>
            <div className="eb-switch-name">{provider.name}</div>
            <div className="eb-switch-sub">Trocar para {PROVIDERS[otherProvider].name}</div>
          </div>
          <div className="eb-switch-arr"><Icon name="chevron" size={14} /></div>
        </div>
        <div className="eb-side-title">Etapas</div>
        {SECTIONS.map((s, idx) => {
          const isActive = s.id === sectionId
          const isDone = idx < sectionIdx
          return (
            <div key={s.id} className={`eb-side-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}`} onClick={() => onSection(s.id)}>
              <span className="eb-num">{isDone ? '✓' : `0${idx + 1}`}</span>
              <span>{s.title}</span>
            </div>
          )
        })}
      </aside>
      <main className="eb-content eb-fade-page" key={`${providerId}:${sectionId}`}>
        {sectionId === 'setup' && <SectionSetup p={provider} />}
        {sectionId === 'first' && <SectionFirst p={provider} />}
        {sectionId === 'errors' && <SectionErrors p={provider} />}
        <div className="eb-pager">
          {prev
            ? <div className="eb-pager-card" onClick={() => onSection(prev.id)}><span className="eb-dir">← Anterior</span><span className="eb-ttl">{prev.title}</span></div>
            : <div />}
          {next
            ? <div className="eb-pager-card next" onClick={() => onSection(next.id)}><span className="eb-dir">Próximo →</span><span className="eb-ttl">{next.title}</span></div>
            : <div />}
        </div>
      </main>
    </div>
  )
}

/* ── App ── */
export default function App() {
  const [page, setPage] = useState<PageView>('home')
  const [providerId, setProviderId] = useState<ProviderId>('openai')
  const [sectionId, setSectionId] = useState<SectionId>('setup')
  const [searchOpen, setSearchOpen] = useState(false)

  const goTutorial = (pid: ProviderId) => { setProviderId(pid); setSectionId('setup'); setPage('tutorial') }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="eb-root">
      <Nav page={page} onHome={() => setPage('home')} onSearch={() => setSearchOpen(true)} />
      {page === 'home' && <Home onPick={goTutorial} />}
      {page === 'tutorial' && (
        <Tutorial
          providerId={providerId}
          sectionId={sectionId}
          onSection={setSectionId}
          onProviderSwitch={p => { setProviderId(p); setSectionId('setup') }}
        />
      )}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        currentProvider={providerId}
        onJump={(pid, sid) => { setProviderId(pid); setSectionId(sid); setPage('tutorial') }}
      />
    </div>
  )
}
