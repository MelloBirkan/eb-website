'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Whether a media query matches. Reads `false` on the server and during
 * hydration, so the first client render matches the server HTML, then updates
 * to the real value.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
