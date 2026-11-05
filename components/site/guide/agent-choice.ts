'use client'

import { useSyncExternalStore } from 'react'

/**
 * Which agent the reader uses. Every invocation block and chat example in the
 * guides follows it, and the browser keeps it for the next visit.
 */
export type Agent = 'claude' | 'codex'

export const AGENTS: { id: Agent; label: string }[] = [
  { id: 'claude', label: 'Claude Code' },
  { id: 'codex', label: 'Codex' },
]

const KEY = 'evenbetter-agent'
const listeners = new Set<() => void>()
/** The choice made on this page, which also covers browsers that refuse storage. */
let picked: Agent | null = null

function read(): Agent {
  if (picked) return picked
  try {
    return localStorage.getItem(KEY) === 'codex' ? 'codex' : 'claude'
  } catch {
    return 'claude'
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    picked = null
    onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function setAgent(agent: Agent) {
  picked = agent
  try {
    localStorage.setItem(KEY, agent)
  } catch {
    // Some private modes refuse storage. The choice still holds on this page.
  }
  for (const l of listeners) l()
}

export function useAgent(): Agent {
  return useSyncExternalStore(subscribe, read, () => 'claude')
}

/** How the agent calls a skill of the iOS plugin. */
export function invocation(agent: Agent, skill: string, args?: string) {
  const tail = args ? ` ${args}` : ''
  return agent === 'codex' ? `@${skill}${tail}` : `/evenbetter-ios:${skill}${tail}`
}
