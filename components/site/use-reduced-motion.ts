'use client'

import { useMediaQuery } from './use-media-query'

/**
 * The OS reduced-motion setting. Unlike motion's `useReducedMotion`, it reads
 * `false` on the server and during hydration, so the first client render
 * matches the server HTML, then updates to the real value.
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
