'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/**
 * Lays its child back in 3D and stands it up as it scrolls toward the
 * middle of the screen, like a laptop lid opening.
 */
export function TiltOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.6 })
  const rotateX = useTransform(progress, [0, 1], [reduce ? 0 : 22, 0])
  const scale = useTransform(progress, [0, 1], [reduce ? 1 : 0.92, 1])

  return (
    <div ref={ref} className={className} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateX, scale, transformOrigin: '50% 100%' }}>{children}</motion.div>
    </div>
  )
}
