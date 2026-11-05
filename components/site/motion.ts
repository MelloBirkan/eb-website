import type { Transition } from 'motion/react'

/**
 * Motion tokens for the site, tuned on Motion UI's theme springs.
 * ui: menus, pills, small UI. gentle: cards and panels. lively: pops and
 * badges. ambient: slow drifts. snap: instant-feeling state changes.
 */
export const SPRING = {
  snap: { type: 'spring', stiffness: 1218, damping: 70 },
  ui: { type: 'spring', stiffness: 305, damping: 33 },
  gentle: { type: 'spring', stiffness: 110, damping: 20 },
  lively: { type: 'spring', stiffness: 622, damping: 17 },
  ambient: { type: 'spring', stiffness: 43, damping: 13 },
} satisfies Record<string, Transition>

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const STAGGER = { fast: 0.04, base: 0.08, slow: 0.15 } as const
