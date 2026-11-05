'use client'

import { motion, type HTMLMotionProps } from 'motion/react'
import { EASE_OUT } from './motion'

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  /** Distance in px the element rises from. */
  y?: number
  blur?: boolean
  amount?: number
}

/** Fades, rises and unblurs its children the first time they scroll into view. */
export function Reveal({ delay = 0, y = 28, blur = true, amount = 0.25, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Staggers its direct `RevealItem` children as the group scrolls into view. */
export function RevealGroup({
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
  children,
  ...props
}: HTMLMotionProps<'div'> & { stagger?: number; delay?: number; amount?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ y = 24, children, ...props }: HTMLMotionProps<'div'> & { y?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: 'blur(6px)' },
        shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_OUT } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
