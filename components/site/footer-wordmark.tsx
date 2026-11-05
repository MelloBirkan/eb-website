'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/** Oversized wordmark that slides up out of the footer as the page ends. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none mx-auto w-full max-w-[1240px] select-none overflow-hidden px-6 lg:px-10">
      <motion.p
        style={{ y, opacity }}
        className="footer-wordmark text-center leading-[0.8] font-semibold tracking-[-0.06em]"
      >
        Even<span className="font-serif font-normal italic tracking-[-0.03em]">Better</span>
      </motion.p>
    </div>
  )
}
