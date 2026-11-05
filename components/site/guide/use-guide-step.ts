'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

/* The current step of a guide lives in the address hash (#auditoria), so a
   step can be linked, survives a reload and works with the search palette. */

const EVENT = 'guide-step'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

function decode(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    // A malformed escape in the address. Treat it as no step.
    return ''
  }
}

export function readHash() {
  return decode(window.location.hash)
}

const readAddress = () => window.location.pathname + window.location.hash

/** Set when a change of step should not move the page (a switch next to the steps, not a jump to one). */
let quiet = false

/** Whether the last change of step asked to keep the page still. Reading it clears it. */
export function takeQuiet() {
  const q = quiet
  quiet = false
  return q
}

export function useGuideStep<T extends string>(ids: readonly T[], fallback: T) {
  const pathname = usePathname()
  const address = useSyncExternalStore(subscribe, readAddress, () => '')
  // Coming from another page, the guide renders once before the router updates the address,
  // so the hash there still belongs to that page. Ignore it until the address is this page's.
  const at = address.indexOf('#')
  const hash = at >= 0 && (pathname === null || address.slice(0, at) === pathname) ? decode(address.slice(at)) : ''
  const step = (ids as readonly string[]).includes(hash) ? (hash as T) : fallback

  const go = useCallback((id: T, opts?: { quiet?: boolean }) => {
    if (readHash() === id) return
    quiet = Boolean(opts?.quiet)
    // Keep the router's own history state, and swap the entry instead of adding one.
    window.history.replaceState(window.history.state, '', `#${id}`)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return [step, go] as const
}
