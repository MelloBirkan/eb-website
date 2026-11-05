'use client'

import { useEffect, useState } from 'react'

/**
 * Steps through `delays.length` stages, waiting delays[i] ms before stage i+1.
 * Holds while `paused`, and starts over from 0 when `resetKey` changes.
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
