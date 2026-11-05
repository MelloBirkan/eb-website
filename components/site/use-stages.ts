'use client'

import { useEffect, useState } from 'react'

/**
 * Steps through `delays.length` stages, waiting delays[i] ms before stage i+1.
 * Holds while `paused`. Pass a module-level array: a new array on every render
 * restarts the current stage's timer. Remount (change the `key`) to start over.
 */
export function useStages(delays: number[], paused = false) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    if (paused || stage >= delays.length) return
    const t = setTimeout(() => setStage((s) => s + 1), delays[stage])
    return () => clearTimeout(t)
  }, [stage, paused, delays])
  return stage
}
